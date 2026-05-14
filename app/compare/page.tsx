import type { Metadata } from "next";
import { getAllComparePages } from "@/lib/content";
import { BreadcrumbList } from "@/components/StructuredData";
import BackLink from "@/components/BackLink";
import SearchableGrid from "@/components/SearchableGrid";

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

  const items = pages.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    date: p.frontmatter.date,
    keywords: p.frontmatter.tools,
  }));

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "首页", url: BASE_URL },
          { name: "工具对比", url: `${BASE_URL}/compare` },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BackLink />
        <section className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            工具对比
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            深度对比热门 AI 工具，帮你做出最佳选择
          </p>
        </section>

        <SearchableGrid
          items={items}
          basePath="/compare"
          placeholder="搜索工具名，例如 ChatGPT、Claude…"
          emptyText="暂无对比文章"
          noMatchText="没有匹配的对比文章"
        />
      </div>
    </>
  );
}
