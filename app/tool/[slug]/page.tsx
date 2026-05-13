import type { Metadata } from "next";
import { Tool, CATEGORY_LABELS, PRICING_LABELS } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolCard from "@/components/ToolCard";
import BackLink from "@/components/BackLink";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbList, SoftwareApplication } from "@/components/StructuredData";
import { getComparePagesForTool, getGuidePageForTool } from "@/lib/content";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const tools = toolsData as Tool[];
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tools = toolsData as Tool[];
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    return { title: "工具未找到" };
  }

  return {
    title: `${tool.name} - AI 工具详情`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - AI 工具详情`,
      description: tool.description,
    },
  };
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

  const comparePages = getComparePagesForTool(tool.slug);
  const guidePage = getGuidePageForTool(tool.slug);

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "首页", url: BASE_URL },
          { name: CATEGORY_LABELS[tool.category], url: `${BASE_URL}/category/${tool.category}` },
          { name: tool.name, url: `${BASE_URL}/tool/${tool.slug}` },
        ]}
      />
      <SoftwareApplication tool={tool} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BackLink />

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
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">同类工具</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )}

        {comparePages.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">相关对比</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {comparePages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/compare/${p.slug}`}
                  className="group rounded-xl border border-zinc-200/80 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {p.frontmatter.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {p.frontmatter.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {guidePage && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">使用指南</h2>
            <div className="mt-4">
              <Link
                href={`/guide/${guidePage.slug}`}
                className="group rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-emerald-700 block"
              >
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {guidePage.frontmatter.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {guidePage.frontmatter.description}
                </p>
                <span className="mt-2 inline-block text-xs text-zinc-400 dark:text-zinc-500">
                  {guidePage.frontmatter.date}
                </span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
