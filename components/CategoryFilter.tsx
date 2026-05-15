"use client";

import { Category, CATEGORY_LABELS, CATEGORY_LABELS_EN } from "@/types/tool";
import PillButton from "./PillButton";

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
        <PillButton
          key={cat ?? "all"}
          active={selected === cat}
          onClick={() => onChange(cat)}
        >
          {cat === null ? allLabel : labels[cat]}
        </PillButton>
      ))}
    </div>
  );
}
