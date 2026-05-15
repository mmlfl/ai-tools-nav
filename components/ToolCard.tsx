import {
  Tool,
  CATEGORY_LABELS,
  PRICING_LABELS,
  CATEGORY_LABELS_EN,
  PRICING_LABELS_EN,
  tName,
  tDesc,
} from "@/types/tool";
import Link from "next/link";

interface ToolCardProps {
  tool: Tool;
  locale?: string;
}

export default function ToolCard({ tool, locale }: ToolCardProps) {
  const isEn = locale === "en";
  const catLabels = isEn ? CATEGORY_LABELS_EN : CATEGORY_LABELS;
  const priceLabels = isEn ? PRICING_LABELS_EN : PRICING_LABELS;
  const prefix = locale ? `/${locale}` : "";

  return (
    <Link
      href={`${prefix}/tool/${tool.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:shadow-blue-900/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-lg font-bold text-white">
          {tName(tool, locale ?? "zh").charAt(0)}
        </div>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          {priceLabels[tool.pricing]}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          {tName(tool, locale ?? "zh")}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
          {tDesc(tool, locale ?? "zh")}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {catLabels[tool.category]}
        </span>
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
