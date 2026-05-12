"use client";

import { useState } from "react";
import { Category, Pricing, Tool as ToolType } from "@/types/tool";
import toolsData from "@/data/tools.json";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ToolCard from "@/components/ToolCard";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);

  const tools = toolsData as ToolType[];

  const filtered = tools.filter((tool) => {
    if (search && !tool.name.toLowerCase().includes(search.toLowerCase()) && !tool.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (category && tool.category !== category) return false;
    if (pricing && tool.pricing !== pricing) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          AI 工具导航
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          发现最优秀的 AI 工具，提升工作效率
        </p>
      </section>

      <section className="space-y-4 mb-8">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CategoryFilter selected={category} onChange={setCategory} />
          <div className="flex gap-2">
            {([null, "free", "freemium", "paid"] as (Pricing | null)[]).map((p) => (
              <button
                key={p ?? "all-price"}
                onClick={() => setPricing(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  pricing === p
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                {p === null ? "全部价格" : p === "free" ? "免费" : p === "freemium" ? "Freemium" : "付费"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
