import type { Metadata } from "next";
import Link from "next/link";
import { getAllComparePages } from "@/lib/content";
import { BreadcrumbList } from "@/components/StructuredData";

const BASE_URL = "https://lflaitool.top";

export const metadata: Metadata = {
  title: "AI 工具对比 — 深度评测帮你选择最佳 AI 工具",
  description: "全面对比主流 AI 工具的功能、价格、适用场景，涵盖 AI 对话、图像生成、编程辅助等多个分类，助你做出明智选择。",
  openGraph: {
    title: "AI 工具对比 — 深度评测帮你选择最佳 AI 工具",
    description: "全面对比主流 AI 工具的功能、价格、适用场景，助你做出明智选择。",
  },
};

export default function CompareListPage() {
  const pages = getAllComparePages();

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "首页", url: BASE_URL },
          { name: "工具对比", url: `${BASE_URL}/compare` },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            工具对比
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            深度对比热门 AI 工具，帮你做出最佳选择
          </p>
        </section>

        {pages.length === 0 ? (
          <p className="text-zinc-500">暂无对比文章</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((p) => (
              <Link
                key={p.slug}
                href={`/compare/${p.slug}`}
                className="group rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {p.frontmatter.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {p.frontmatter.description}
                </p>
                <span className="mt-3 inline-block text-xs text-zinc-400 dark:text-zinc-500">
                  {p.frontmatter.date}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
