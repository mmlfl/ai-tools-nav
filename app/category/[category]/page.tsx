import { CATEGORY_LABELS, Category, Tool } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ category: string }>;
}

const VALID_CATEGORIES: Category[] = ["chat", "image", "video", "code", "audio", "office", "search"];

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const cat = category as Category;
  const tools = (toolsData as Tool[]).filter((t) => t.category === cat);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        返回首页
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {CATEGORY_LABELS[cat]}
        <span className="ml-3 text-lg font-normal text-zinc-400">{tools.length} 个工具</span>
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
