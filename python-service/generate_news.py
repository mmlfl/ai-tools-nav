#!/usr/bin/env python3
"""Generate daily AI news briefs using Exa search + Qwen LLM.

Usage:
    python python-service/generate_news.py [--lang=zh|en]

Without --lang, generates for both zh and en.
Writes to content/news/{lang}/{date}.md and updates data/content-index.json.
"""

import os
import sys
import time
from datetime import date
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

from lib import (
    get_llm,
    load_tools,
    save_markdown,
    update_index,
    validate_content,
    rate_limit,
    API_DELAY,
    MAX_RETRIES,
)

MAX_TOOLS = 30
MAX_ARTICLES_PER_RUN = 2  # zh + en
TODAY = date.today().strftime("%Y-%m-%d")
EXA_MAX_RETRIES = 3
EXA_BASE_DELAY = 2.0  # seconds, doubles each retry


def _exa_post(json_payload, timeout=15):
    """POST to Exa API with retry on rate-limit (429) and transient errors."""
    api_key = os.getenv("EXA_API_KEY")
    if not api_key:
        return None

    last_status = None
    for attempt in range(EXA_MAX_RETRIES + 1):
        try:
            resp = httpx.post(
                "https://api.exa.ai/search",
                headers={"x-api-key": api_key, "Content-Type": "application/json"},
                json=json_payload,
                timeout=timeout,
            )
            if resp.status_code == 200:
                return resp
            last_status = resp.status_code
            if resp.status_code == 429:
                delay = EXA_BASE_DELAY * (2 ** attempt)
                print(f"[News] Exa rate-limited (attempt {attempt+1}), sleeping {delay:.0f}s...")
                time.sleep(delay)
                continue
            # Non-retryable error
            print(f"[News] Exa returned {resp.status_code}")
            return None
        except Exception as e:
            if attempt < EXA_MAX_RETRIES:
                delay = EXA_BASE_DELAY * (2 ** attempt)
                print(f"[News] Exa request failed (attempt {attempt+1}): {e}, retrying in {delay:.0f}s...")
                time.sleep(delay)
            else:
                print(f"[News] Exa request failed after {EXA_MAX_RETRIES+1} attempts: {e}")
                return None
    print(f"[News] Exa rate-limited after {EXA_MAX_RETRIES+1} attempts (last status: {last_status})")
    return None


def get_featured_tools():
    """Get up to MAX_TOOLS tools, featured first then by name."""
    tools = load_tools()
    featured = [t for t in tools if t.get("featured")]
    rest = [t for t in tools if not t.get("featured")]
    featured.sort(key=lambda t: t["slug"])
    rest.sort(key=lambda t: t["slug"])
    return (featured + rest)[:MAX_TOOLS]


def search_exa_news(tool_slug, tool_name):
    """Search Exa for latest news about a specific AI tool (with retry)."""
    resp = _exa_post({
        "query": f"{tool_name} AI latest news update {TODAY}",
        "numResults": 3,
        "type": "auto",
    })
    if resp is None:
        return []
    results = []
    for item in resp.json().get("results", []):
        results.append({
            "text": item.get("text", item.get("title", "")),
            "title": item.get("title", ""),
            "url": item.get("url", ""),
        })
    return results


def search_exa_general():
    """Search Exa for general AI industry news, with retry on each query."""
    queries = [
        f"AI artificial intelligence latest news {TODAY}",
        f"AI tools product launch update {TODAY}",
        f"large language model new release {TODAY}",
    ]
    results = []
    for q in queries:
        resp = _exa_post({"query": q, "numResults": 3, "type": "auto"})
        if resp is not None:
            for item in resp.json().get("results", []):
                results.append({
                    "text": item.get("text", item.get("title", "")),
                    "title": item.get("title", ""),
                    "url": item.get("url", ""),
                })
    return results


def build_news_prompt(lang):
    """Build system and user prompts for news generation."""
    tools = get_featured_tools()

    # Gather general AI industry news
    general_news = search_exa_general()

    # Gather news for each tool
    news_items = []
    for tool in tools:
        name = tool.get("name_en", tool["name"]) if lang == "en" else tool["name"]
        results = search_exa_news(tool["slug"], name)
        if results:
            news_items.append({
                "tool_name": name,
                "tool_slug": tool["slug"],
                "articles": results,
            })
        rate_limit()

    if not news_items and not general_news:
        print("[News] No Exa results for any tool, aborting")
        return None, None, []

    # Build news summary for prompt
    news_blocks = []

    if general_news:
        gen_text = "\n".join(
            f"  - [{a['title']}]({a['url']})\n    {a['text'][:400]}"
            for a in general_news[:8]
        )
        news_blocks.append(f"## AI 行业综合动态\n{gen_text}" if lang == "zh" else f"## AI Industry Overview\n{gen_text}")

    mentioned_slugs = []
    for item in news_items:
        mentioned_slugs.append(item["tool_slug"])
        articles_text = "\n".join(
            f"  - [{a['title']}]({a['url']})\n    {a['text'][:400]}"
            for a in item["articles"][:3]
        )
        news_blocks.append(f"## {item['tool_name']}\n{articles_text}")

    news_context = "\n\n".join(news_blocks)

    if lang == "en":
        system_prompt = """You are an AI industry news editor. Your job is to synthesize news about AI tools into a concise daily briefing.

Rules:
1. Write in English
2. Output valid YAML frontmatter with: title, description, date, tools (array of tool slugs mentioned)
3. Title format: "AI News Brief | {date}"
4. Description: 1-2 sentences summarizing the day's key highlights
5. Body: start with a ## AI Industry Overview section (if industry news present), then group by tool with 2-3 sentences each and source links
6. Total length: 1000-2000 words
7. Use markdown formatting: ## for sections, - for bullet points, [text](url) for links
8. Cover as many tools as possible — prioritize important news, skip tools with no news"""
    else:
        system_prompt = """你是 AI 行业快讯编辑。请将多个 AI 工具的最新动态整合成一份简洁的日报。

要求：
1. 使用中文撰写
2. 输出合法的 YAML frontmatter：title, description, date, tools（提及的工具 slug 数组）
3. 标题格式："AI 快讯日报 | {date}"
4. description：1-2 句话总结当天要点
5. 正文：先写 ## AI 行业综合动态（如有行业新闻），再按工具分段，每段 2-3 句话概述关键动态，附来源链接
6. 总长度：1000-2000 字
7. 使用 Markdown 格式：## 用于小节，- 用于列表，[文本](url) 用于链接
8. 尽量覆盖更多工具——优先重要新闻，无新闻的工具可跳过"""

    user_prompt = f"""以下是今天（{TODAY}）各 AI 工具的最新资讯搜索结果，请整合成一份 AI 快讯日报。

{news_context}

---
生成要求：
- frontmatter 中 tools 字段列出提及的 tool slug：{mentioned_slugs}
- date 使用 {TODAY}
- 先写行业综合动态，再按重要程度排列各工具新闻
- 尽量覆盖更多工具，让读者全面了解当日 AI 动态"""

    if lang == "en":
        user_prompt = f"""Here are the latest AI tool news search results for today ({TODAY}). Please synthesize into an AI news daily brief.

{news_context}

---
Requirements:
- In frontmatter, tools field lists mentioned tool slugs: {mentioned_slugs}
- date use {TODAY}
- Start with industry overview, then order tools by importance
- Cover as many tools as possible for a comprehensive daily briefing"""

    return system_prompt, user_prompt, mentioned_slugs


def generate_news(lang):
    """Generate a single news brief for the given locale."""
    system_prompt, user_prompt, mentioned_slugs = build_news_prompt(lang)
    if system_prompt is None:
        return None

    llm = get_llm()
    from langchain_core.messages import SystemMessage, HumanMessage

    messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)]

    for attempt in range(1, MAX_RETRIES + 2):
        try:
            resp = llm.invoke(messages)
            content = resp.content

            is_valid, err_msg = validate_content(content, min_chars=600)
            if not is_valid:
                print(f"[News] Validation failed (attempt {attempt}): {err_msg}")
                if attempt <= MAX_RETRIES:
                    messages.append(HumanMessage(content="Please regenerate with valid YAML frontmatter and sufficient length."))
                    continue
                return None

            filename = f"{TODAY}.md"
            slug = save_markdown(f"content/news/{lang}", filename, content)

            entry = {
                "slug": slug,
                "title": f"AI {'快讯日报' if lang == 'zh' else 'News Brief'} | {TODAY}",
                "date": TODAY,
                "tools": mentioned_slugs,
            }
            update_index("news", slug, entry)
            return slug

        except Exception as e:
            print(f"[News] LLM error (attempt {attempt}): {e}")
            if attempt <= MAX_RETRIES:
                rate_limit()
                continue
            return None

    return None


def main():
    args = sys.argv[1:]
    langs = ["zh", "en"]
    for arg in args:
        if arg.startswith("--lang="):
            langs = [arg.split("=", 1)[1]]

    if not os.getenv("QWEN_API_KEY") and not os.getenv("OPENAI_API_KEY"):
        print("[News] No API key found. Set QWEN_API_KEY or OPENAI_API_KEY.")
        sys.exit(1)

    print(f"[News] Generating daily news brief for {TODAY}, langs={langs}")

    count = 0
    failed = []
    for lang in langs:
        if count >= MAX_ARTICLES_PER_RUN:
            break
        print(f"[News] Generating for lang={lang}...")
        slug = generate_news(lang)
        if slug:
            print(f"[News] Generated: {slug} ({lang})")
            count += 1
        else:
            failed.append(lang)
            print(f"[News] WARNING: No content generated for lang={lang}")
        if len(langs) > 1:
            # Wait longer between languages to stay under Exa rate limits
            delay = 30
            print(f"[News] Cooling down {delay}s before next language...")
            time.sleep(delay)

    print(f"[News] Done. Generated {count} article(s).")
    if failed:
        print(f"[News] ERROR: Failed to generate for: {failed}")
        sys.exit(1)


if __name__ == "__main__":
    main()
