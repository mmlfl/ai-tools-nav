#!/usr/bin/env python3
"""Ingestion pipeline — scrape docs, chunk, embed, upsert into Milvus.

Sources:
  1. data/sources.yaml  — official doc URLs per tool (auto-scraped)
  2. data/rag-docs/*.yaml — manually curated long-form docs

Usage:
  python ingest.py              # ingest all tools in sources.yaml
  python ingest.py --tool chatgpt  # single tool
  python ingest.py --drop       # drop and recreate collection first
  python ingest.py --manual-only  # only process data/rag-docs/
"""
import os
import sys
from pathlib import Path

import yaml
import trafilatura
from dotenv import load_dotenv

from rag import init_collection, chunk_text, upsert_chunks

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
SOURCES_PATH = BASE_DIR / "data" / "sources.yaml"
RAG_DOCS_DIR = BASE_DIR / "data" / "rag-docs"


def scrape_url(url):
    try:
        import httpx

        resp = httpx.get(
            url, timeout=30, follow_redirects=True,
            headers={"User-Agent": "Mozilla/5.0 (compatible; AIToolsNav/1.0)"},
        )
        if resp.status_code != 200:
            print(f"  HTTP {resp.status_code} for {url}")
            return None
        text = trafilatura.extract(
            resp.text, include_comments=False, include_tables=True,
            favor_precision=True,
        )
        if not text:
            print(f"  No extractable content from {url}")
            return None
        return text
    except Exception as e:
        print(f"  Failed to scrape {url}: {e}")
        return None


def ingest_tool(slug, urls):
    all_chunks = []
    for url in urls:
        print(f"  Scraping: {url}")
        text = scrape_url(url)
        if not text:
            continue
        chunks = chunk_text(text)
        for i, chunk in enumerate(chunks):
            all_chunks.append({
                "tool_slug": slug,
                "source_type": "official_docs",
                "source_url": url,
                "content": chunk,
                "chunk_index": i,
                "language": "zh",
            })
        print(f"    -> {len(chunks)} chunks")
    if all_chunks:
        return upsert_chunks(all_chunks)
    return 0


def ingest_manual_docs():
    if not RAG_DOCS_DIR.exists():
        print("No rag-docs directory, skipping")
        return 0

    total = 0
    for path in RAG_DOCS_DIR.glob("*.yaml"):
        if path.name.startswith("_"):
            continue
        with open(path, "r", encoding="utf-8") as f:
            doc = yaml.safe_load(f) or {}

        slug = doc.get("slug", path.stem)
        sections = doc.get("sections", [])
        if not sections:
            continue

        print(f"  Ingesting manual doc: {slug}")
        all_chunks = []
        for sec in sections:
            text = f"## {sec.get('heading', '')}\n{sec.get('body', '')}"
            for i, chunk in enumerate(chunk_text(text)):
                all_chunks.append({
                    "tool_slug": slug,
                    "source_type": "manual_curation",
                    "source_url": sec.get("source_url", ""),
                    "content": chunk,
                    "chunk_index": i,
                    "language": "zh",
                })
        if all_chunks:
            total += upsert_chunks(all_chunks)
    return total


def load_sources():
    if not SOURCES_PATH.exists():
        return {}
    with open(SOURCES_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def main():
    drop = "--drop" in sys.argv
    manual_only = "--manual-only" in sys.argv
    target = None
    for arg in sys.argv[1:]:
        if arg.startswith("--tool="):
            target = arg.split("=", 1)[1]

    if not os.getenv("MILVUS_URI"):
        print("Error: MILVUS_URI not set.", file=sys.stderr)
        sys.exit(1)

    init_collection(drop=drop)

    if not manual_only:
        sources = load_sources()
        for slug, cfg in sources.items():
            if target and slug != target:
                continue
            urls = cfg.get("docs_urls", [])
            if not urls:
                continue
            print(f"\n[{slug}] {len(urls)} URLs")
            ingest_tool(slug, urls)

    print("\n--- Manual docs ---")
    n = ingest_manual_docs()
    print(f"\nDone. Manual chunks: {n}")


if __name__ == "__main__":
    main()
