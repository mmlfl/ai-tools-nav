"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export interface SearchableItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
  categories?: string[];
}

interface Props {
  items: SearchableItem[];
  basePath: string;
  placeholder?: string;
  emptyText?: string;
  noMatchText?: string;
  categoryLabels?: Record<string, string>;
  allLabel?: string;
  resultLabel?: string;
}

export default function SearchableGrid({
  items,
  basePath,
  placeholder = "搜索工具名...",
  emptyText = "暂无内容",
  noMatchText = "没有匹配的结果",
  categoryLabels,
  allLabel = "全部",
  resultLabel,
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => item.categories?.forEach((c) => cats.add(c)));
    return Array.from(cats);
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (category) {
      result = result.filter((item) => item.categories?.includes(category));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((item) => {
        const haystack = [item.title, item.description, ...item.keywords]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }
    return result;
  }, [items, search, category]);

  return (
    <>
      {availableCategories.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              category === null
                ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/30"
                : "bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
            }`}
          >
            {allLabel}
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === category ? null : cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === cat
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/30"
                  : "bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
              }`}
            >
              {categoryLabels?.[cat] ?? cat}
            </button>
          ))}
        </div>
      )}

      {items.length > 3 && (
        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
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
              className="group rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:border-blue-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-blue-700"
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

      {(search.trim() || category) && filtered.length > 0 && (
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
          {resultLabel
            ? resultLabel.replace("{count}", String(filtered.length))
            : `找到 ${filtered.length} 条匹配结果`}
        </p>
      )}
    </>
  );
}
