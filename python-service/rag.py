#!/usr/bin/env python3
"""RAG module — Milvus vector search + embedding for article generation.

Three-tier fallback: Milvus → Exa API → (caller falls back to YAML briefs)
"""
import os

from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

COLLECTION_NAME = "tool_documents"
EMBEDDING_DIM = 1024
CHUNK_SIZE = 512
CHUNK_OVERLAP = 50
TOP_K = 5

ZH_SEPARATORS = ["\n\n", "\n", "。", "！", "？", "；", "，", " ", ""]


def _embedding_kwargs():
    return dict(
        model=os.getenv("QWEN_EMBEDDING_MODEL", "text-embedding-v3"),
        base_url=os.getenv(
            "QWEN_BASE_URL",
            os.getenv(
                "OPENAI_API_BASE",
                "https://dashscope.aliyuncs.com/compatible-mode/v1",
            ),
        ),
        api_key=os.getenv("QWEN_API_KEY", os.getenv("OPENAI_API_KEY")),
        dimensions=EMBEDDING_DIM,
    )


def embed_texts(texts):
    model = OpenAIEmbeddings(**_embedding_kwargs())
    return model.embed_documents(texts)


def embed_query(text):
    model = OpenAIEmbeddings(**_embedding_kwargs())
    return model.embed_query(text)


def get_milvus_client():
    from pymilvus import MilvusClient as MC

    uri = os.getenv("MILVUS_URI", "http://localhost:19530")
    token = os.getenv("MILVUS_TOKEN", "")
    kwargs = {"uri": uri}
    if token:
        kwargs["token"] = token
    return MC(**kwargs)


def init_collection(drop=False):
    """Create tool_documents collection if it doesn't exist."""
    from pymilvus import DataType

    client = get_milvus_client()
    if client.has_collection(COLLECTION_NAME):
        if drop:
            client.drop_collection(COLLECTION_NAME)
        else:
            return

    schema = client.create_schema(auto_id=True, enable_dynamic_field=False)
    schema.add_field("id", DataType.INT64, is_primary=True)
    schema.add_field("tool_slug", DataType.VARCHAR, max_length=128)
    schema.add_field("source_type", DataType.VARCHAR, max_length=32)
    schema.add_field("source_url", DataType.VARCHAR, max_length=2048)
    schema.add_field("content", DataType.VARCHAR, max_length=65535)
    schema.add_field("chunk_index", DataType.INT16)
    schema.add_field("language", DataType.VARCHAR, max_length=8)
    schema.add_field("embedding", DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM)

    index_params = client.prepare_index_params()
    index_params.add_index(
        "embedding", index_type="HNSW", metric_type="COSINE",
        params={"M": 16, "efConstruction": 200},
    )

    client.create_collection(COLLECTION_NAME, schema=schema, index_params=index_params)
    print(f"[RAG] Created collection: {COLLECTION_NAME}")


def chunk_text(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP, separators=ZH_SEPARATORS,
    )
    return splitter.split_text(text)


def upsert_chunks(chunks):
    """Embed and upsert. Each chunk: {tool_slug, source_type, source_url, content, chunk_index, language}."""
    if not chunks:
        return 0

    texts = [c["content"] for c in chunks]
    vectors = embed_texts(texts)

    client = get_milvus_client()
    data = []
    for i, c in enumerate(chunks):
        data.append({
            "tool_slug": c["tool_slug"],
            "source_type": c["source_type"],
            "source_url": c.get("source_url", ""),
            "content": texts[i],
            "chunk_index": c.get("chunk_index", 0),
            "language": c.get("language", "zh"),
            "embedding": vectors[i],
        })

    client.insert(COLLECTION_NAME, data)
    count = len(data)
    print(f"[RAG] Upserted {count} chunks")
    return count


def search_tool_context(slugs, queries, top_k=TOP_K):
    """Search Milvus for relevant chunks, dedup across queries."""
    try:
        client = get_milvus_client()
    except Exception as e:
        print(f"[RAG] Milvus unreachable: {e}")
        return []

    if not client.has_collection(COLLECTION_NAME):
        print(f"[RAG] Collection not found — run ingest.py first")
        return []

    slug_filter = ", ".join(f'"{s}"' for s in slugs)
    filter_expr = f"tool_slug in [{slug_filter}]"

    seen = set()
    all_results = []

    for query in queries:
        try:
            vector = embed_query(query)
            results = client.search(
                collection_name=COLLECTION_NAME,
                data=[vector],
                filter=filter_expr,
                limit=top_k,
                output_fields=["tool_slug", "source_type", "source_url", "content"],
            )
            for hit in results[0]:
                key = hash(hit["entity"]["content"][:120])
                if key not in seen:
                    seen.add(key)
                    all_results.append({
                        "content": hit["entity"]["content"],
                        "tool_slug": hit["entity"]["tool_slug"],
                        "source_url": hit["entity"].get("source_url", ""),
                        "source_type": hit["entity"].get("source_type", ""),
                        "score": hit["distance"],
                    })
        except Exception as e:
            print(f"[RAG] Search failed for '{query[:40]}': {e}")
            continue

    all_results.sort(key=lambda x: x["score"], reverse=True)
    return all_results[: top_k * 2]


def search_exa(slugs):
    """Tier-2 fallback: Exa real-time web search."""
    api_key = os.getenv("EXA_API_KEY")
    if not api_key:
        return []

    import httpx

    results = []
    for slug in slugs:
        try:
            resp = httpx.post(
                "https://api.exa.ai/search",
                headers={"x-api-key": api_key, "Content-Type": "application/json"},
                json={
                    "query": f"{slug} AI tool pricing features review 2026",
                    "numResults": 3,
                    "type": "auto",
                },
                timeout=15,
            )
            if resp.status_code == 200:
                for item in resp.json().get("results", []):
                    results.append({
                        "content": item.get("text", item.get("title", "")),
                        "tool_slug": slug,
                        "source_url": item.get("url", ""),
                        "source_type": "exa_search",
                        "score": 0.5,
                    })
        except Exception as e:
            print(f"[RAG] Exa search failed for '{slug}': {e}")
            continue

    return results


def retrieve_context(slugs, article_type="compare", lang="zh"):
    """Orchestrator: search Milvus → fallback Exa → format for prompt injection."""
    queries = []
    for slug in slugs:
        if lang == "en":
            if article_type == "compare":
                queries.append(f"{slug} latest features pricing 2026 review")
                queries.append(f"{slug} pros cons comparison benchmark")
            else:
                queries.append(f"{slug} tutorial guide how to use 2026")
                queries.append(f"{slug} pricing plans features review")
        else:
            if article_type == "compare":
                queries.append(f"{slug} 最新功能 特性 价格 2026")
                queries.append(f"{slug} 优缺点 评测 对比")
            else:
                queries.append(f"{slug} 使用教程 入门 核心功能 2026")
                queries.append(f"{slug} 价格 套餐 适用场景")

    chunks = search_tool_context(slugs, queries)
    print(f"[RAG] Milvus returned {len(chunks)} chunks for {slugs}")

    if len(chunks) < 2:
        exa = search_exa(slugs)
        if exa:
            chunks.extend(exa)
            chunks.sort(key=lambda x: x["score"], reverse=True)

    if not chunks:
        return ""

    tool_groups = {}
    for c in chunks:
        tool_groups.setdefault(c["tool_slug"], []).append(c)

    if lang == "en":
        parts = [
            "\n---\nReference materials from latest docs and web. Write based on these facts:",
        ]
        for slug, items in tool_groups.items():
            urls = sorted(set(i["source_url"] for i in items if i["source_url"]))
            label = ", ".join(urls[:3])
            header = f"\n### About {slug}" + (f" (source: {label})" if label else "")
            parts.append(header)
            for item in items:
                parts.append(f"- {item['content'][:600]}")
    else:
        parts = [
            "\n---\n以下是来自最新文档和网络的参考资料，请基于这些事实撰写文章：",
        ]
        for slug, items in tool_groups.items():
            urls = sorted(set(i["source_url"] for i in items if i["source_url"]))
            label = "、".join(urls[:3])
            header = f"\n### 关于 {slug}" + (f"（来源：{label}）" if label else "")
            parts.append(header)
            for item in items:
                parts.append(f"- {item['content'][:600]}")

    return "\n".join(parts)
