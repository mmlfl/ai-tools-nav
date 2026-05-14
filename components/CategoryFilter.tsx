"use client";

import { Category, CATEGORY_LABELS } from "@/types/tool";

interface CategoryFilterProps {
  selected: Category | null;
  onChange: (category: Category | null) => void;
}

const ALL_CATEGORIES: (Category | null)[] = [null, "chat", "image", "video", "code", "audio", "office", "search"];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat ?? "all"}
          onClick={() => onChange(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            selected === cat
              ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/30"
              : "bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          }`}
        >
          {cat === null ? "全部" : CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
