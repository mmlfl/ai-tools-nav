import type { Metadata } from "next";
import { Tool as ToolType } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolGrid from "@/components/ToolGrid";
import CompareSection from "@/components/CompareSection";
import { BreadcrumbList } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "AI 工具导航 - 发现最优秀的 AI 工具",
  description: "精选 20+ AI 工具，涵盖 AI 对话、图像生成、视频创作、编程辅助、音频合成、办公效率、智能搜索等 7 大分类。帮你快速找到最适合的 AI 工具。",
  openGraph: {
    title: "AI 工具导航 - 发现最优秀的 AI 工具",
    description: "精选 20+ AI 工具，涵盖 7 大分类。帮你快速找到最适合的 AI 工具。",
  },
};

const tools = toolsData as ToolType[];

export default function Home() {
  return (
    <>
      <BreadcrumbList
        items={[{ name: "首页", url: "https://lflaitool.top" }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            AI 工具导航
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            发现最优秀的 AI 工具，提升工作效率 — 收录 {tools.length} 款 AI 工具
          </p>
        </section>

        <ToolGrid tools={tools} />

        <CompareSection />
      </div>
    </>
  );
}
