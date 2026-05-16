#!/usr/bin/env python3
"""Shared utilities for content generation scripts."""
import json
import os
import time
from pathlib import Path
from datetime import date
from functools import lru_cache

import yaml
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv(Path(__file__).resolve().parent / ".env")

BASE_DIR = Path(__file__).resolve().parent.parent
TOOLS_PATH = BASE_DIR / "data" / "tools.json"
INDEX_PATH = BASE_DIR / "data" / "content-index.json"
API_TIMEOUT = 120
API_DELAY = 1.5
MAX_RETRIES = 2

_llm = None


def get_llm():
    global _llm
    if _llm is None:
        _llm = ChatOpenAI(
            model=os.getenv("QWEN_MODEL", os.getenv("MODEL_NAME", "qwen-plus")),
            base_url=os.getenv(
                "QWEN_BASE_URL",
                os.getenv(
                    "OPENAI_API_BASE",
                    "https://dashscope.aliyuncs.com/compatible-mode/v1",
                ),
            ),
            api_key=os.getenv("QWEN_API_KEY", os.getenv("OPENAI_API_KEY")),
            temperature=0.7,
            timeout=API_TIMEOUT,
            max_retries=1,
        )
    return _llm


def load_tools():
    with open(TOOLS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def parse_frontmatter(content):
    lines = content.split("\n")
    if lines[0].strip() == "---":
        try:
            end = lines.index("---", 1)
            fm = yaml.safe_load("\n".join(lines[1:end]))
            return fm or {}
        except (ValueError, yaml.YAMLError):
            return {}
    return {}


def load_index():
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    if INDEX_PATH.exists():
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"compare": [], "guide": []}


def save_index(index):
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"Updated index: {INDEX_PATH}")


def update_index(section, slug, entry):
    index = load_index()
    existing = [i for i in index.get(section, []) if i["slug"] != slug]
    existing.append(entry)
    index[section] = existing
    save_index(index)


def save_markdown(rel_dir, filename, content):
    dir_path = BASE_DIR / rel_dir
    dir_path.mkdir(parents=True, exist_ok=True)
    filepath = dir_path / filename
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved: {filepath}")
    return filename.replace(".md", "")


def content_exists(rel_dir, filename):
    return (BASE_DIR / rel_dir / filename).exists()


def rate_limit():
    time.sleep(API_DELAY)


def validate_content(content, min_chars=500):
    fm = parse_frontmatter(content)
    if not fm:
        return False, "missing or invalid YAML frontmatter"
    if "title" not in fm:
        return False, "frontmatter missing title"
    if len(content) < min_chars:
        return False, f"content too short ({len(content)} < {min_chars})"
    return True, ""


BRIEFS_DIR = Path(__file__).resolve().parent / "data" / "tool-briefs"


@lru_cache(maxsize=64)
def load_tool_brief(slug):
    """Load enrichment data for a tool. Returns dict or None."""
    path = BRIEFS_DIR / f"{slug}.yaml"
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f) or {}
    return None


def format_brief_for_prompt(brief):
    """Convert a brief dict into a prompt-ready string."""
    if not brief:
        return ""
    parts = []

    if brief.get("pricing"):
        p = brief["pricing"]
        parts.append("## 补充价格信息")
        if p.get("free_tier"):
            parts.append(f"- 免费额度: {p['free_tier']}")
        for plan in p.get("paid_plans", []):
            parts.append(f"- {plan['name']}: {plan['price']} — {plan['includes']}")

    if brief.get("features"):
        parts.append("\n## 补充功能特性")
        for f in brief["features"]:
            parts.append(f"- {f}")

    if brief.get("recent_updates"):
        parts.append("\n## 近期更新")
        for u in brief["recent_updates"]:
            parts.append(f"- [{u.get('date', '')}] {u.get('summary', '')}")

    if brief.get("pros"):
        parts.append("\n## 已验证优势")
        for p in brief["pros"]:
            parts.append(f"- {p}")

    if brief.get("cons"):
        parts.append("\n## 已验证劣势")
        for c in brief["cons"]:
            parts.append(f"- {c}")

    if brief.get("vs_competitors"):
        parts.append("\n## 竞品对比要点")
        for v in brief["vs_competitors"]:
            comp = v.get("competitor", "?")
            parts.append(f"- vs {comp}: 优势={v.get('advantage', '')}; 劣势={v.get('weakness', '')}")

    if brief.get("benchmarks") and brief["benchmarks"].get("lmsys_elo"):
        b = brief["benchmarks"]
        parts.append(f"\n## 评测数据\n- LMSYS ELO: {b['lmsys_elo']} (来源: {b.get('source', '未知')})")

    if brief.get("target_users"):
        parts.append("\n## 目标用户")
        for u in brief["target_users"]:
            parts.append(f"- {u}")

    return "\n".join(parts)


def inject_briefs(user_message, briefs):
    """Append enrichment data to the user message."""
    parts = [user_message]
    for brief in briefs:
        text = format_brief_for_prompt(brief)
        if text:
            parts.append(f"\n---\n以下是用户提供的补充参考资料，请结合这些信息撰写文章：\n\n{text}")
    return "\n".join(parts)


def retrieve_and_inject(user_message, slugs, article_type="compare", lang="zh"):
    """Try RAG retrieval, fall back to YAML briefs, then bare prompt.

    Priority: Milvus → Exa → YAML briefs → no enrichment
    """
    # Tier 1+2: Milvus + Exa fallback (both inside retrieve_context)
    try:
        from rag import retrieve_context

        ctx = retrieve_context(slugs, article_type, lang)
        if ctx:
            return user_message + ctx
    except Exception as e:
        print(f"[lib] RAG unavailable, falling back to briefs: {e}")

    # Tier 3: existing YAML briefs
    briefs = [b for b in (load_tool_brief(s) for s in slugs) if b]
    if briefs:
        return inject_briefs(user_message, briefs)

    return user_message
