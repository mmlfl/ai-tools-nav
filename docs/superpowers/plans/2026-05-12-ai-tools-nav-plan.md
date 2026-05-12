# AI Tools Navigation Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a data-driven AI tools navigation site with category filtering, search, and detail pages.

**Architecture:** JSON data file drives all content. Next.js App Router with dynamic routes for categories (`/[category]`) and tool details (`/tool/[slug]`). All filtering is client-side via React state.

**Tech Stack:** Next.js 16.2.6, React 19, TypeScript 5, Tailwind CSS v4

---

### Task 1: Shared types and data layer

**Files:**
- Create: `types/tool.ts`
- Create: `data/tools.json`

- [ ] **Step 1: Create TypeScript types**

```typescript
// types/tool.ts

export type Category = "chat" | "image" | "video" | "code" | "audio" | "office" | "search";

export type Pricing = "free" | "freemium" | "paid" | "waitlist";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  url: string;
  category: Category;
  tags: string[];
  pricing: Pricing;
  featured: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  chat: "对话",
  image: "图像",
  video: "视频",
  code: "编程",
  audio: "音频",
  office: "办公",
  search: "搜索",
};

export const PRICING_LABELS: Record<Pricing, string> = {
  free: "免费",
  freemium: "Freemium",
  paid: "付费",
  waitlist: "内测中",
};
```

- [ ] **Step 2: Create tools.json data file**

```json
[
  {
    "slug": "chatgpt",
    "name": "ChatGPT",
    "description": "OpenAI 推出的对话式 AI 助手，支持文本生成、代码编写、创意写作等多种场景。",
    "url": "https://chat.openai.com",
    "category": "chat",
    "tags": ["对话", "写作", "编程"],
    "pricing": "freemium",
    "featured": true
  },
  {
    "slug": "claude",
    "name": "Claude",
    "description": "Anthropic 开发的 AI 助手，擅长长文本分析、代码审查和复杂推理任务。",
    "url": "https://claude.ai",
    "category": "chat",
    "tags": ["对话", "编程", "分析"],
    "pricing": "freemium",
    "featured": true
  },
  {
    "slug": "gemini",
    "name": "Gemini",
    "description": "Google 的多模态 AI 模型，深度集成 Google 生态，支持文本、图像、代码理解。",
    "url": "https://gemini.google.com",
    "category": "chat",
    "tags": ["对话", "多模态", "搜索"],
    "pricing": "freemium",
    "featured": true
  },
  {
    "slug": "midjourney",
    "name": "Midjourney",
    "description": "顶级的 AI 图像生成工具，以艺术风格和高质量输出闻名。",
    "url": "https://www.midjourney.com",
    "category": "image",
    "tags": ["图像生成", "艺术", "设计"],
    "pricing": "paid",
    "featured": true
  },
  {
    "slug": "dall-e",
    "name": "DALL·E 3",
    "description": "OpenAI 的图像生成模型，擅长理解复杂提示词，生成准确且创意的图片。",
    "url": "https://openai.com/dall-e-3",
    "category": "image",
    "tags": ["图像生成", "创意"],
    "pricing": "freemium",
    "featured": false
  },
  {
    "slug": "stable-diffusion",
    "name": "Stable Diffusion",
    "description": "开源的图像生成模型，可在本地运行，社区生态丰富。",
    "url": "https://stability.ai",
    "category": "image",
    "tags": ["图像生成", "开源", "本地运行"],
    "pricing": "free",
    "featured": false
  },
  {
    "slug": "sora",
    "name": "Sora",
    "description": "OpenAI 的文字转视频模型，可生成长达一分钟的高质量视频。",
    "url": "https://openai.com/sora",
    "category": "video",
    "tags": ["视频生成", "文字转视频"],
    "pricing": "paid",
    "featured": true
  },
  {
    "slug": "runway",
    "name": "Runway",
    "description": "专业的 AI 视频编辑和生成平台，提供丰富的视频创作工具。",
    "url": "https://runwayml.com",
    "category": "video",
    "tags": ["视频生成", "视频编辑"],
    "pricing": "freemium",
    "featured": false
  },
  {
    "slug": "github-copilot",
    "name": "GitHub Copilot",
    "description": "GitHub 出品的 AI 编程助手，深度集成主流 IDE，根据上下文生成代码。",
    "url": "https://github.com/features/copilot",
    "category": "code",
    "tags": ["代码补全", "IDE 集成"],
    "pricing": "paid",
    "featured": true
  },
  {
    "slug": "cursor",
    "name": "Cursor",
    "description": "AI 优先的代码编辑器，基于 VS Code，内建对话式编程体验。",
    "url": "https://cursor.sh",
    "category": "code",
    "tags": ["编辑器", "对话编程"],
    "pricing": "freemium",
    "featured": true
  },
  {
    "slug": "vercel-v0",
    "name": "v0 by Vercel",
    "description": "Vercel 推出的 AI 前端开发工具，通过自然语言描述生成 UI 代码。",
    "url": "https://v0.dev",
    "category": "code",
    "tags": ["前端", "UI 生成"],
    "pricing": "freemium",
    "featured": false
  },
  {
    "slug": "elevenlabs",
    "name": "ElevenLabs",
    "description": "领先的 AI 语音合成平台，支持多种语言的文本转语音和声音克隆。",
    "url": "https://elevenlabs.io",
    "category": "audio",
    "tags": ["语音合成", "声音克隆", "多语言"],
    "pricing": "freemium",
    "featured": true
  },
  {
    "slug": "suno",
    "name": "Suno",
    "description": "AI 音乐生成工具，通过文字描述即可创作完整的歌曲。",
    "url": "https://suno.com",
    "category": "audio",
    "tags": ["音乐生成", "歌曲创作"],
    "pricing": "freemium",
    "featured": false
  },
  {
    "slug": "notion-ai",
    "name": "Notion AI",
    "description": "Notion 内置的 AI 功能，辅助写作、总结、翻译和头脑风暴。",
    "url": "https://www.notion.so/product/ai",
    "category": "office",
    "tags": ["写作", "总结", "协作"],
    "pricing": "paid",
    "featured": true
  },
  {
    "slug": "gamma",
    "name": "Gamma",
    "description": "AI 驱动的演示文稿和文档创建工具，快速生成精美的 PPT 和网页文档。",
    "url": "https://gamma.app",
    "category": "office",
    "tags": ["演示文稿", "文档", "PPT"],
    "pricing": "freemium",
    "featured": false
  },
  {
    "slug": "perplexity",
    "name": "Perplexity",
    "description": "AI 搜索引擎，提供带来源引用的准确答案，适合研究和事实查询。",
    "url": "https://www.perplexity.ai",
    "category": "search",
    "tags": ["搜索", "研究", "引用"],
    "pricing": "freemium",
    "featured": true
  },
  {
    "slug": "consensus",
    "name": "Consensus",
    "description": "AI 学术搜索引擎，直接从科研论文中提取和总结研究发现。",
    "url": "https://consensus.app",
    "category": "search",
    "tags": ["学术搜索", "论文", "研究"],
    "pricing": "freemium",
    "featured": false
  },
  {
    "slug": "jasper",
    "name": "Jasper",
    "description": "面向营销团队的 AI 内容创作平台，擅长博客、广告文案和社交媒体。",
    "url": "https://www.jasper.ai",
    "category": "office",
    "tags": ["营销", "文案", "内容创作"],
    "pricing": "paid",
    "featured": false
  },
  {
    "slug": "windsurf",
    "name": "Windsurf",
    "description": "Codeium 推出的 AI IDE，支持多文件编辑和上下文感知的代码生成。",
    "url": "https://codeium.com/windsurf",
    "category": "code",
    "tags": ["编辑器", "代码生成"],
    "pricing": "freemium",
    "featured": false
  },
  {
    "slug": "leonardo",
    "name": "Leonardo.ai",
    "description": "面向游戏和设计领域的 AI 图像生成平台，擅长游戏资产和概念艺术。",
    "url": "https://leonardo.ai",
    "category": "image",
    "tags": ["图像生成", "游戏", "概念艺术"],
    "pricing": "freemium",
    "featured": false
  }
]
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors related to types/tool.ts

- [ ] **Step 4: Commit**

```bash
git add types/tool.ts data/tools.json
git commit -m "feat: add shared types and tool data"
```

---

### Task 2: Update global styles and layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update globals.css with design tokens**

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}
```

- [ ] **Step 2: Update layout.tsx with Navbar and Footer placeholders**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Tools Nav - 发现最优秀的 AI 工具",
  description: "精选 AI 工具导航，帮你发现最新最实用的 AI 产品",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <a href="/" className="text-lg font-bold tracking-tight">
              AI Tools Nav
            </a>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200/80 bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-950/60">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} AI Tools Nav - AI 工具导航
          </div>
        </footer>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: update global styles and root layout"
```

---

### Task 3: Create UI components

**Files:**
- Create: `components/SearchBar.tsx`
- Create: `components/CategoryFilter.tsx`
- Create: `components/ToolCard.tsx`
- Create: `components/EmptyState.tsx`

- [ ] **Step 1: Create SearchBar component**

```tsx
// components/SearchBar.tsx
"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      <input
        type="text"
        placeholder="搜索 AI 工具..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-600"
      />
    </div>
  );
}
```

- [ ] **Step 2: Create CategoryFilter component**

```tsx
// components/CategoryFilter.tsx
"use client";

import { Category, CATEGORY_LABELS } from "@/types/tool";

interface CategoryFilterProps {
  selected: Category | null;
  onChange: (category: Category | null) => void;
}

const ALL_CATEGORIES: (Category | null)[] = [null, "chat", "image", "video", "code", "audio", "office", "search"];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat ?? "all"}
          onClick={() => onChange(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            selected === cat
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          {cat === null ? "全部" : CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create ToolCard component**

```tsx
// components/ToolCard.tsx
import { Tool, CATEGORY_LABELS, PRICING_LABELS } from "@/types/tool";
import Link from "next/link";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-100 text-lg font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {tool.name.charAt(0)}
        </div>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {PRICING_LABELS[tool.pricing]}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
          {tool.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          {CATEGORY_LABELS[tool.category]}
        </span>
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Create EmptyState component**

```tsx
// components/EmptyState.tsx

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="h-16 w-16 text-zinc-300 dark:text-zinc-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        viewBox="0 0 24 24"
      >
        <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-zinc-500 dark:text-zinc-400">
        没有找到匹配的工具
      </h3>
      <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
        试试更换筛选条件或搜索关键词
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/
git commit -m "feat: add SearchBar, CategoryFilter, ToolCard, EmptyState components"
```

---

### Task 4: Build homepage with filtering

**Files:**
- Rewrite: `app/page.tsx`

- [ ] **Step 1: Rewrite homepage with client-side filtering**

```tsx
// app/page.tsx
"use client";

import { useState } from "react";
import { Category, Pricing, Tool as ToolType } from "@/types/tool";
import toolsData from "@/data/tools.json";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import ToolCard from "@/components/ToolCard";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);

  const tools = toolsData as ToolType[];

  const filtered = tools.filter((tool) => {
    if (search && !tool.name.toLowerCase().includes(search.toLowerCase()) && !tool.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (category && tool.category !== category) return false;
    if (pricing && tool.pricing !== pricing) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          AI 工具导航
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          发现最优秀的 AI 工具，提升工作效率
        </p>
      </section>

      {/* Filters */}
      <section className="space-y-4 mb-8">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CategoryFilter selected={category} onChange={setCategory} />
          <div className="flex gap-2">
            {([null, "free", "freemium", "paid"] as (Pricing | null)[]).map((p) => (
              <button
                key={p ?? "all-price"}
                onClick={() => setPricing(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  pricing === p
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                {p === null ? "全部价格" : p === "free" ? "免费" : p === "freemium" ? "Freemium" : "付费"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section>
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build homepage with search, category and pricing filters"
```

---

### Task 5: Create category page

**Files:**
- Create: `app/category/[category]/page.tsx`

- [ ] **Step 1: Create dynamic category page**

```tsx
// app/category/[category]/page.tsx
import { CATEGORY_LABELS, Category, Tool } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ category: string }>;
}

const VALID_CATEGORIES: Category[] = ["chat", "image", "video", "code", "audio", "office", "search"];

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const cat = category as Category;
  const tools = (toolsData as Tool[]).filter((t) => t.category === cat);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        返回首页
      </Link>
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
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/category/
git commit -m "feat: add dynamic category filter page"
```

---

### Task 6: Create tool detail page

**Files:**
- Create: `app/tool/[slug]/page.tsx`

- [ ] **Step 1: Create tool detail page**

```tsx
// app/tool/[slug]/page.tsx
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
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add app/tool/
git commit -m "feat: add tool detail page with related tools"
```

---

### Task 7: Final verification

- [ ] **Step 1: Run full production build**

Run: `npm run build`
Expected: All pages build without errors

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Start dev server and smoke test**

Run: `npm run dev`
Check:
- Homepage loads at http://localhost:3000
- Category filter works (click "图像" → only image tools)
- Search works (type "AI" → filters correctly)
- Click a tool card → detail page loads
- Click "返回首页" → back to homepage
- Detail page shows related tools
