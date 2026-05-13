import type { Metadata } from "next";
import Link from "next/link";
import { getAllGuidePages } from "@/lib/content";
import { BreadcrumbList } from "@/components/StructuredData";

const BASE_URL = "https://lflaitool.top";

export const metadata: Metadata = {
  title: "AI 工具使用指南 — 从入门到精通",
  description: "为 20+ AI 工具提供详细的使用教程，涵盖核心功能、操作步骤、价格说明和适用场景，助你充分发挥每款工具的潜力。",
  openGraph: {
    title: "AI 工具使用指南 — 从入门到精通",
    description: "为 20+ AI 工具提供详细的使用教程，助你充分发挥每款工具的潜力。",
  },
};

export default function GuideListPage() {
  const pages = getAllGuidePages();

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "首页", url: BASE_URL },
          { name: "工具指南", url: `${BASE_URL}/guide` },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            使用指南
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            深入了解每个 AI 工具的使用方法和技巧
          </p>
        </section>

        {pages.length === 0 ? (
          <p className="text-zinc-500">暂无使用指南</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((p) => (
              <Link
                key={p.slug}
                href={`/guide/${p.slug}`}
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
