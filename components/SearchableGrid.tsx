"use client";

import { useState } from "react";
import Link from "next/link";

export interface SearchableItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
}

interface Props {
  items: SearchableItem[];
  basePath: string;
  placeholder?: string;
  emptyText?: string;
  noMatchText?: string;
}

export default function SearchableGrid({
  items,
  basePath,
  placeholder = "搜索工具名...",
  emptyText = "暂无内容",
  noMatchText = "没有匹配的结果",
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? items.filter((item) => {
        const q = search.toLowerCase();
        const haystack = [
          item.title,
          item.description,
          ...item.keywords,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
    : items;

  return (
    <>
      {items.length > 3 && (
        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-600 dark:focus:ring-blue-900/30"
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-zinc-500">{emptyText}</p>
      ) : filtered.length === 0 ? (
        <p className="text-zinc-500">{noMatchText}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Link
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              className="group rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                {item.description}
              </p>
              <span className="mt-3 inline-block text-xs text-zinc-400 dark:text-zinc-500">
                {item.date}
              </span>
            </Link>
          ))}
        </div>
      )}

      {search.trim() && filtered.length > 0 && (
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
          找到 {filtered.length} 条匹配结果
        </p>
      )}
    </>
  );
}
