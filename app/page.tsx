import { Tool as ToolType } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolGrid from "@/components/ToolGrid";

const tools = toolsData as ToolType[];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          AI 工具导航
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          发现最优秀的 AI 工具，提升工作效率
        </p>
      </section>

      <ToolGrid tools={tools} />
    </div>
  );
}
