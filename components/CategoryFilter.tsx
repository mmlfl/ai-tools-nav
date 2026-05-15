"use client";

import { Category, CATEGORY_LABELS, CATEGORY_LABELS_EN } from "@/types/tool";

interface CategoryFilterProps {
  selected: Category | null;
  onChange: (category: Category | null) => void;
  locale?: string;
}

const ALL_CATEGORIES: (Category | null)[] = [null, "chat", "image", "video", "code", "audio", "office", "search"];

export default function CategoryFilter({ selected, onChange, locale }: CategoryFilterProps) {
  const isEn = locale === "en";
  const labels = isEn ? CATEGORY_LABELS_EN : CATEGORY_LABELS;
  const allLabel = isEn ? "All" : "全部";

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
          {cat === null ? allLabel : labels[cat]}
        </button>
      ))}
    </div>
  );
}
