import {
  Tool,
  CATEGORY_LABELS,
  PRICING_LABELS,
  CATEGORY_LABELS_EN,
  PRICING_LABELS_EN,
  CATEGORY_TAG_COLORS,
  tName,
  tDesc,
  getTagLabel,
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
      className="group flex flex-col gap-3 rounded-xl border border-hairline bg-surface p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:border-blue-700 dark:hover:shadow-blue-900/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-lg font-bold text-white shadow-sm shadow-blue-200/50 dark:shadow-blue-900/30">
          {tName(tool, locale ?? "zh").charAt(0)}
        </div>
        <span className="rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
          {priceLabels[tool.pricing]}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">
          {tName(tool, locale ?? "zh")}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {tDesc(tool, locale ?? "zh")}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className={`rounded-md px-2 py-0.5 text-xs ${CATEGORY_TAG_COLORS[tool.category]}`}>
          {catLabels[tool.category]}
        </span>
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            {getTagLabel(tag, locale ?? "zh")}
          </span>
        ))}
      </div>
    </Link>
  );
}
