import type { Metadata } from "next";
import { getAllGuidePages } from "@/lib/content";
import { BreadcrumbList } from "@/components/StructuredData";
import SearchableGrid from "@/components/SearchableGrid";

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

  const items = pages.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    date: p.frontmatter.date,
    keywords: [p.frontmatter.tool],
  }));

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "首页", url: BASE_URL },
          { name: "工具指南", url: `${BASE_URL}/guide` },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            使用指南
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            深入了解每个 AI 工具的使用方法和技巧
          </p>
        </section>

        <SearchableGrid
          items={items}
          basePath="/guide"
          placeholder="搜索工具名，例如 Midjourney、Sora…"
          emptyText="暂无使用指南"
          noMatchText="没有匹配的使用指南"
        />
      </div>
    </>
  );
}
