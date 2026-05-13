#!/usr/bin/env python3
"""Tool Comparison Article Generator — ReAct Agent Edition.
Uses langgraph.create_react_agent with 4 tools to autonomously generate
tool comparison articles via Qwen (阿里千问) and save to ../content/compare/
"""
import json
import os
import sys
from pathlib import Path
from datetime import date
from typing import Optional

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
TOOLS_PATH = BASE_DIR / "data" / "tools.json"
CONTENT_DIR = BASE_DIR / "content" / "compare"
INDEX_PATH = BASE_DIR / "data" / "content-index.json"


# ── Tools ──────────────────────────────────────────────────────────

@tool
def list_tools_by_category(category: str = "") -> str:
    """列出指定分类下的所有 AI 工具名称和 slug。category 为空时列出全部。"""
    with open(TOOLS_PATH, "r", encoding="utf-8") as f:
        tools = json.load(f)

    if category:
        tools = [t for t in tools if t["category"] == category]

    lines = [f"{t['name']} (slug: {t['slug']}, category: {t['category']}, pricing: {t['pricing']})" for t in tools]
    return "\n".join(lines) if lines else "没有找到匹配的工具"


@tool
def get_tool_detail(slug: str) -> str:
    """根据 slug 获取某个 AI 工具的完整信息（JSON 格式），包括名称、描述、URL、标签、价格等。"""
    with open(TOOLS_PATH, "r", encoding="utf-8") as f:
        tools = json.load(f)

    tool_obj = next((t for t in tools if t["slug"] == slug), None)
    if not tool_obj:
        return f"未找到 slug 为 '{slug}' 的工具"
    return json.dumps(tool_obj, ensure_ascii=False, indent=2)


@tool
def check_existing_article(slug1: str, slug2: str) -> str:
    """检查某个工具对是否已经生成过对比文章。返回 'exists' 或 'not_exists'。"""
    filename = f"{slug1}-vs-{slug2}.md"
    alt_filename = f"{slug2}-vs-{slug1}.md"
    if (CONTENT_DIR / filename).exists() or (CONTENT_DIR / alt_filename).exists():
        return f"exists: {slug1} 和 {slug2} 的对比文章已存在"
    return f"not_exists: 可以生成 {slug1} 和 {slug2} 的对比文章"


@tool
def write_compare_article(slug1: str, slug2: str, content: str) -> str:
    """将生成好的 Markdown 对比文章写入 content/compare/ 目录并更新索引。
    content 必须是完整的 Markdown，包含 YAML frontmatter 和正文。
    返回保存的文件路径。"""
    import yaml

    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{slug1}-vs-{slug2}.md"
    filepath = CONTENT_DIR / filename

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved article: {filepath}")

    # Parse frontmatter
    lines = content.split("\n")
    fm = {}
    if lines[0].strip() == "---":
        try:
            end = lines.index("---", 1)
            fm = yaml.safe_load("\n".join(lines[1:end])) or {}
        except (ValueError, yaml.YAMLError):
            pass

    # Update index
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    if INDEX_PATH.exists():
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            index = json.load(f)
    else:
        index = {"compare": [], "list": [], "guide": []}

    entry = {
        "slug": filename.replace(".md", ""),
        "title": fm.get("title", f"{slug1} vs {slug2}"),
        "description": fm.get("description", ""),
        "tools": fm.get("tools", [slug1, slug2]),
        "date": fm.get("date", str(date.today())),
    }
    index["compare"] = [i for i in index["compare"] if i["slug"] != entry["slug"]]
    index["compare"].append(entry)

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    return f"文章已保存到 {filepath}，索引已更新"


# ── Agent setup ────────────────────────────────────────────────────

SYSTEM_PROMPT = """你是一个专业的 AI 工具网站内容运营助手，运行在 ReAct Agent 循环中。

你有 4 个工具可用：
- list_tools_by_category(category) — 列出工具清单
- get_tool_detail(slug) — 获取工具详情
- check_existing_article(slug1, slug2) — 检查是否已有对比文章
- write_compare_article(slug1, slug2, content) — 保存文章

## 任务流程

每轮调用你需要完成以下任务：

1. 调用 list_tools_by_category(category="chat") 获取"对话"分类的工具
2. 从该分类选 2 个工具，调用 check_existing_article 检查是否已有对比文章
3. 如果已存在，换一对工具或换一个分类
4. 调用 get_tool_detail 获取这 2 个工具的详细信息
5. 基于工具详情，写一篇中文对比文章，调用 write_compare_article 保存
6. 重复以上步骤处理下一个分类

分类列表：chat(对话), image(图像), video(视频), code(编程), audio(音频), office(办公), search(搜索)

## 文章要求

- 标题格式: "工具A vs 工具B：2026年全面对比评测"
- 必须以 YAML frontmatter 开头：
  ---
  title: "标题"
  description: "一句话描述"
  tools: ["slug1", "slug2"]
  date: "2026-05-13"
  ---
- 正文结构：## 概述 → ## 功能对比(含表格) → ## 价格对比(含表格) → ## 适用场景 → ## 总结与推荐 → *免责声明*
- 字数 1500-2500 字，中文，客观中立
- 表格至少 4 行数据

重要：每次只处理一个分类中的一对工具，生成并保存后立即停止，无需继续处理下一个分类。"""


def build_agent():
    llm = ChatOpenAI(
        model=os.getenv("QWEN_MODEL", "qwen-plus"),
        base_url=os.getenv("QWEN_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1"),
        api_key=os.getenv("QWEN_API_KEY"),
        temperature=0.7,
    )
    return create_react_agent(
        model=llm,
        tools=[list_tools_by_category, get_tool_detail, check_existing_article, write_compare_article],
        prompt=SYSTEM_PROMPT,
    )


# ── Main ─────────────────────────────────────────────────────────────

def main():
    if not os.getenv("QWEN_API_KEY"):
        print("Error: QWEN_API_KEY not set. Create python-service/.env with your API key.", file=sys.stderr)
        sys.exit(1)

    agent = build_agent()

    categories = ["chat", "image", "video", "code", "audio", "office", "search"]

    for cat in categories:
        print(f"\n{'='*60}")
        print(f"Processing category: {cat}")

        task = f"""处理分类 "{cat}"：

1. 先 list_tools_by_category(category="{cat}") 获取工具
2. 选 2 个合适的工具
3. check_existing_article 确认尚未生成
4. get_tool_detail 获取详情
5. 写对比文章
6. write_compare_article 保存

只处理这一对，完成后立即停止。"""

        try:
            result = agent.invoke({"messages": [("user", task)]})
            last_msg = result["messages"][-1]
            print(f"Agent response: {last_msg.content[:200]}...")
        except Exception as e:
            print(f"Error processing {cat}: {e}", file=sys.stderr)
            continue


if __name__ == "__main__":
    main()
