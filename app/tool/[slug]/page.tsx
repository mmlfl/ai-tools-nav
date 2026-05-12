import { Tool, CATEGORY_LABELS, PRICING_LABELS } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tools = toolsData as Tool[];
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <svg suppressHydrationWarning className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        返回首页
      </Link>

      <article className="rounded-2xl border border-zinc-200/80 bg-white p-8 dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-100 text-2xl font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {tool.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{tool.name}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{tool.description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-zinc-100 px-3 py-1 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {CATEGORY_LABELS[tool.category]}
            </span>
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:bg-blue-950 dark:text-blue-400"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {PRICING_LABELS[tool.pricing]}
          </span>
        </div>

        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          访问官网
          <svg suppressHydrationWarning className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M7 17L17 7m0 0H7m10 0v10" />
          </svg>
        </a>
      </article>

      {relatedTools.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">相关工具</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
