#!/usr/bin/env python3
"""Tool Comparison Article Generator. Supports --lang zh (default) or --lang en."""
import json
import os
import sys
from datetime import date

from langchain_core.prompts import ChatPromptTemplate

from lib import (
    get_llm, load_tools, retrieve_and_inject, parse_frontmatter,
    update_index, save_markdown, content_exists, rate_limit, validate_content,
)

MAX_ARTICLES_PER_RUN = 150

COMPARE_PROMPT_ZH = ChatPromptTemplate.from_messages([
    ("system", """你是一个专业的 AI 工具评测写手。根据提供的工具信息，写一篇深度工具对比文章。

要求：
1. 标题格式: "工具A vs 工具B：2026年全面对比评测"
2. 正文使用 Markdown 格式，必须以 YAML frontmatter 开头
3. YAML frontmatter 包含: title, description, tools (slugs数组), date (今日日期)
4. 正文结构:
   - ## 概述 — 2-3段介绍两个工具
   - ## 功能对比 — 至少1张 Markdown 表格
   - ## 价格对比 — 1张表格
   - ## 适用场景 — 分别说明每个工具最适合的场景
   - ## 总结与推荐 — 给出明确的推荐建议
   - *免责声明*
5. 字数 1500-2500 字，中文
6. 客观中立，列出每个工具的优缺点
7. 表格至少要有 4 行数据

输出格式示例：
---
title: "ChatGPT vs Claude：2026年全面对比评测"
description: "详细对比 ChatGPT 和 Claude 的功能、价格、适用场景，帮助你选择最合适的 AI 对话工具"
tools: ["chatgpt", "claude"]
date: "{today}"
---

## 概述
..."""),
    ("user", "请为以下两个工具写对比文章：\n\n工具1：{tool1}\n工具2：{tool2}\n\n分类：{category}"),
]).partial(today=str(date.today()))

COMPARE_PROMPT_EN = ChatPromptTemplate.from_messages([
    ("system", """You are a professional AI tool reviewer. Write an in-depth comparison article based on the tool info provided.

Requirements:
1. Title format: "Tool A vs Tool B: 2026 Comprehensive Comparison"
2. Use Markdown with YAML frontmatter at the top
3. YAML frontmatter: title, description, tools (slug array), date (today)
4. Structure:
   - ## Overview — 2-3 paragraphs introducing both tools
   - ## Feature Comparison — at least 1 Markdown table
   - ## Pricing Comparison — 1 table
   - ## Use Cases — best scenarios for each tool
   - ## Verdict & Recommendation — clear recommendation
   - *Disclaimer*
5. 1500-2500 words, English
6. Objective and balanced, list pros and cons for each
7. At least 4 data rows in every table

Example output format:
---
title: "ChatGPT vs Claude: 2026 Comprehensive Comparison"
description: "A detailed comparison of ChatGPT and Claude covering features, pricing, and use cases"
tools: ["chatgpt", "claude"]
date: "{today}"
---

## Overview
..."""),
    ("user", "Write a comparison article for these two tools:\n\nTool 1: {tool1}\nTool 2: {tool2}\n\nCategory: {category}"),
]).partial(today=str(date.today()))


def build_pair_queue(tools):
    categories = {}
    for t in tools:
        categories.setdefault(t["category"], []).append(t)

    pairs = []
    for cat, cat_tools in categories.items():
        if len(cat_tools) < 2:
            continue
        for i in range(len(cat_tools)):
            for j in range(i + 1, len(cat_tools)):
                score = cat_tools[i].get("featured", False) + cat_tools[j].get("featured", False)
                pairs.append((-score, i, j, cat_tools[i], cat_tools[j], cat))

    pairs.sort(key=lambda x: (x[0], x[1], x[2]))
    return pairs


def generate_compare(t1, t2, category, lang):
    prompt = COMPARE_PROMPT_EN if lang == "en" else COMPARE_PROMPT_ZH
    llm = get_llm()
    base_msg = prompt.format_messages(
        tool1=json.dumps(t1, ensure_ascii=False, indent=2),
        tool2=json.dumps(t2, ensure_ascii=False, indent=2),
        category=category,
    )
    base_msg[-1].content = retrieve_and_inject(
        base_msg[-1].content,
        slugs=[t1["slug"], t2["slug"]],
        article_type="compare",
        lang=lang,
    )
    response = llm.invoke(base_msg)
    return response.content


def main():
    lang = "zh"
    for arg in sys.argv[1:]:
        if arg.startswith("--lang="):
            lang = arg.split("=", 1)[1]

    if not os.getenv("QWEN_API_KEY") and not os.getenv("OPENAI_API_KEY"):
        print("Error: QWEN_API_KEY or OPENAI_API_KEY not set.", file=sys.stderr)
        sys.exit(1)

    content_dir = f"content/compare/{lang}"
    tools = load_tools()
    pairs = build_pair_queue(tools)

    generated = 0
    for _, _, _, t1, t2, cat in pairs:
        if generated >= MAX_ARTICLES_PER_RUN:
            break

        filename = f"{t1['slug']}-vs-{t2['slug']}.md"
        if content_exists(content_dir, filename):
            continue

        n1 = t1.get("name_en" if lang == "en" else "name", t1["name"])
        n2 = t2.get("name_en" if lang == "en" else "name", t2["name"])
        print(f"[{generated + 1}] Generating: {n1} vs {n2} ({cat})")

        for attempt in range(2):
            try:
                content = generate_compare(t1, t2, cat, lang)
                ok, err = validate_content(content)
                if not ok:
                    print(f"  Validation failed: {err}, retrying...")
                    continue

                slug = save_markdown(content_dir, filename, content)
                fm = parse_frontmatter(content)
                update_index("compare", slug, {
                    "slug": slug,
                    "title": fm.get("title", ""),
                    "description": fm.get("description", ""),
                    "tools": fm.get("tools", [t1["slug"], t2["slug"]]),
                    "date": fm.get("date", str(date.today())),
                    "lang": lang,
                })
                generated += 1
                rate_limit()
                break
            except Exception as e:
                print(f"  Attempt {attempt + 1} failed: {e}", file=sys.stderr)
                if attempt == 1:
                    print(f"  Giving up on {filename}")

    print(f"Done. Generated {generated} comparison articles ({lang}).")


if __name__ == "__main__":
    main()
