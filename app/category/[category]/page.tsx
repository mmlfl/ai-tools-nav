import type { Metadata } from "next";
import { CATEGORY_LABELS, Category, Tool } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolCard from "@/components/ToolCard";
import BackLink from "@/components/BackLink";
import { notFound } from "next/navigation";
import { BreadcrumbList } from "@/components/StructuredData";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ category: string }>;
}

const VALID_CATEGORIES: Category[] = ["chat", "image", "video", "code", "audio", "office", "search"];

export function generateStaticParams() {
  return VALID_CATEGORIES.map((c) => ({ category: c }));
}

const CATEGORY_SEO: Record<Category, { title: string; description: string }> = {
  chat: { title: "AI 对话工具", description: "收录 ChatGPT、Claude、Gemini 等优秀 AI 对话助手，支持文本生成、代码编写、创意写作等多种场景。" },
  image: { title: "AI 图像生成工具", description: "收录 Midjourney、DALL·E 3、Stable Diffusion 等 AI 图像生成工具，满足设计、艺术、游戏资产等需求。" },
  video: { title: "AI 视频生成工具", description: "收录 Sora、Runway 等 AI 视频生成和编辑工具，轻松创作高质量视频内容。" },
  code: { title: "AI 编程工具", description: "收录 GitHub Copilot、Cursor、v0 等 AI 编程助手，提升代码编写效率和代码质量。" },
  audio: { title: "AI 音频工具", description: "收录 ElevenLabs、Suno 等 AI 音频合成和音乐生成工具，探索声音创作的无限可能。" },
  office: { title: "AI 办公效率工具", description: "收录 Notion AI、Gamma、Jasper 等 AI 办公工具，提升文档协作、演示制作和内容创作效率。" },
  search: { title: "AI 搜索引擎", description: "收录 Perplexity、Consensus 等 AI 搜索引擎，快速获取准确、有引用的答案和研究成果。" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as Category)) {
    return { title: "未找到" };
  }
  const seo = CATEGORY_SEO[category as Category];
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const cat = category as Category;
  const tools = (toolsData as Tool[]).filter((t) => t.category === cat);

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "首页", url: BASE_URL },
          { name: CATEGORY_LABELS[cat], url: `${BASE_URL}/category/${cat}` },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BackLink />
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
    </>
  );
}
