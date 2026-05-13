import type { Metadata } from "next";
import Link from "next/link";
import { Tool as ToolType } from "@/types/tool";
import toolsData from "@/data/tools.json";
import { getAllComparePages, getAllGuidePages } from "@/lib/content";
import { BreadcrumbList, WebSite } from "@/components/StructuredData";

const BASE_URL = "https://lflaitool.top";
const tools = toolsData as ToolType[];

export const metadata: Metadata = {
  title: "AI 一站式速通 — 从选工具到用工具",
  description: "AI 工具导航、深度对比评测、详细使用指南，一站式帮你找到并掌握最适合的 AI 工具。覆盖对话、图像、视频、编程等 7 大分类。",
  openGraph: {
    title: "AI 一站式速通 — 从选工具到用工具",
    description: "AI 工具导航、深度对比、使用指南，一站式搞定 AI 工具。",
  },
};

export default function Home() {
  const compareCount = getAllComparePages().length;
  const guideCount = getAllGuidePages().length;

  return (
    <>
      <WebSite />
      <BreadcrumbList
        items={[{ name: "首页", url: BASE_URL }]}
      />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            AI 一站式速通
          </h1>
          <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            从选工具到用工具，一站式搞定 AI。精选 20+ 优质 AI 工具，提供深度对比评测与详细使用教程。
          </p>
        </section>

        {/* Module Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Tools Nav */}
          <Link
            href="/tools"
            className="group rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-blue-300 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-blue-700"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl dark:bg-blue-900/30">
              🧭
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              AI 工具导航
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              精选 {tools.length} 款 AI 工具，覆盖 7 大分类。按分类、价格快速筛选，找到你需要的工具。
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
              浏览工具 <span aria-hidden="true">→</span>
            </span>
          </Link>

          {/* Compare */}
          <Link
            href="/compare"
            className="group rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-amber-300 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-amber-700"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl dark:bg-amber-900/30">
              ⚡
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
              工具对比
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              已收录 {compareCount} 篇深度对比评测，从功能、价格、场景帮你做出最佳选择。
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:gap-2 transition-all">
              查看对比 <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>

        {/* Guide — full width */}
        <Link
          href="/guide"
          className="mt-6 block rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-emerald-700 group"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl dark:bg-emerald-900/30 shrink-0">
              📖
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                使用指南
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                已收录 {guideCount} 篇详细教程，从入门到精通掌握每个 AI 工具的核心功能与使用技巧。
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all shrink-0">
              浏览指南 <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}
