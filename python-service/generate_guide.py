#!/usr/bin/env python3
"""Tool Guide Generator. Supports --lang zh (default) or --lang en."""
import json
import os
import sys
from datetime import date

from langchain_core.prompts import ChatPromptTemplate

from lib import (
    get_llm, load_tools, retrieve_and_inject, parse_frontmatter,
    update_index, save_markdown, content_exists, rate_limit, validate_content,
)

MAX_ARTICLES_PER_RUN = 100

GUIDE_PROMPT_ZH = ChatPromptTemplate.from_messages([
    ("system", """你是一个专业的 AI 工具使用教程写手。根据提供的工具信息，写一篇详细的工具使用指南。

要求：
1. 标题格式: "{{工具名}} 完整使用指南：从入门到精通"
2. 正文使用 Markdown 格式，必须以 YAML frontmatter 开头
3. YAML frontmatter 包含: title, description, tool (单个工具slug), date (今日日期)
4. 正文结构:
   - ## 工具简介 — 1-2段介绍工具的定位、背景和核心价值
   - ## 核心功能 — 至少1张 Markdown 表格，列出主要功能及说明
   - ## 如何使用 — 分步骤说明使用方法，包含具体操作指导
   - ## 价格说明 — 列出不同套餐和价格
   - ## 适用场景 — 列出最适合的使用场景（至少3个）
   - ## 优缺点 — 分别列出优点和缺点
   - ## 同类替代工具 — 简要介绍2-3个同类替代工具
   - *免责声明*
5. 字数 1500-2500 字，中文
6. 内容详实、实用，侧重于实际操作指导
7. 表格至少要有 4 行数据

输出格式示例：
---
title: "ChatGPT 完整使用指南：从入门到精通"
description: "详细介绍 ChatGPT 的核心功能、使用方法、定价策略及适用场景，帮助你充分发挥这款 AI 对话工具的潜力"
tool: "chatgpt"
date: "{today}"
---

## 工具简介
..."""),
    ("user", "请为以下工具写一篇详细的使用指南：\n\n{tool}"),
]).partial(today=str(date.today()))

GUIDE_PROMPT_EN = ChatPromptTemplate.from_messages([
    ("system", """You are a professional AI tool tutorial writer. Write a detailed usage guide based on the tool info provided.

Requirements:
1. Title format: "{{Tool Name}} Complete Guide: From Beginner to Expert"
2. Use Markdown with YAML frontmatter at the top
3. YAML frontmatter: title, description, tool (slug), date (today)
4. Structure:
   - ## Overview — 1-2 paragraphs introducing the tool
   - ## Core Features — at least 1 Markdown table listing features
   - ## How to Use — step-by-step instructions
   - ## Pricing — plans and costs
   - ## Use Cases — at least 3 ideal scenarios
   - ## Pros & Cons — list both
   - ## Alternatives — 2-3 similar tools
   - *Disclaimer*
5. 1500-2500 words, English
6. Practical, hands-on guidance
7. At least 4 rows in every table

Example output format:
---
title: "ChatGPT Complete Guide: From Beginner to Expert"
description: "A comprehensive guide to ChatGPT's core features, usage, pricing, and use cases"
tool: "chatgpt"
date: "{today}"
---

## Overview
..."""),
    ("user", "Write a detailed usage guide for this tool:\n\n{tool}"),
]).partial(today=str(date.today()))


def sort_tools(tools):
    return sorted(tools, key=lambda t: (not t.get("featured", False)))


def generate_guide(tool, lang):
    prompt = GUIDE_PROMPT_EN if lang == "en" else GUIDE_PROMPT_ZH
    llm = get_llm()
    base_msg = prompt.format_messages(
        tool=json.dumps(tool, ensure_ascii=False, indent=2),
    )
    base_msg[-1].content = retrieve_and_inject(
        base_msg[-1].content, slugs=[tool["slug"]],
        article_type="guide", lang=lang,
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

    content_dir = f"content/guide/{lang}"
    tools = sort_tools(load_tools())

    generated = 0
    for tool in tools:
        if generated >= MAX_ARTICLES_PER_RUN:
            break

        slug = tool["slug"]
        filename = f"{slug}.md"

        if content_exists(content_dir, filename):
            print(f"Skip existing: {filename}")
            continue

        name = tool.get("name_en" if lang == "en" else "name", tool["name"])
        print(f"[{generated + 1}] Generating guide for: {name} ({tool['category']})")

        for attempt in range(2):
            try:
                content = generate_guide(tool, lang)
                ok, err = validate_content(content)
                if not ok:
                    print(f"  Validation failed: {err}, retrying...")
                    continue

                saved_slug = save_markdown(content_dir, filename, content)
                fm = parse_frontmatter(content)
                update_index("guide", saved_slug, {
                    "slug": saved_slug,
                    "title": fm.get("title", ""),
                    "description": fm.get("description", ""),
                    "tool": fm.get("tool", slug),
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

    print(f"Done. Generated {generated} guide articles ({lang}).")


if __name__ == "__main__":
    main()
