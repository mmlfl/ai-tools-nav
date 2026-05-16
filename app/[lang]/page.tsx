import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tool as ToolType } from "@/types/tool";
import toolsData from "@/data/tools.json";
import { getAllComparePages, getAllGuidePages, getLatestNewsPages } from "@/lib/content";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";
import { BreadcrumbList, WebSite } from "@/components/StructuredData";
import ToolCard from "@/components/ToolCard";

const BASE_URL = "https://lflaitool.top";
const tools = toolsData as ToolType[];

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  return {
    title: dict.metadata.homeTitle,
    description: dict.metadata.homeDescription,
    openGraph: {
      title: dict.metadata.homeTitle,
      description: dict.metadata.homeOGDescription,
    },
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const compareCount = getAllComparePages().length;
  const guideCount = getAllGuidePages().length;
  const newsCount = getLatestNewsPages(lang, 20).length;
  const featuredTools = tools.slice(0, 6);

  return (
    <>
      <WebSite />
      <BreadcrumbList
        items={[{ name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` }]}
      />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        {/* Hero */}
        <section className="relative mb-20 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-violet-50 px-8 py-20 text-center dark:from-blue-950/30 dark:via-zinc-900 dark:to-violet-950/30">
          {/* Geometric decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full border border-blue-200/40 dark:border-blue-700/20" />
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full border border-violet-200/30 dark:border-violet-700/15 animate-spin" style={{ animationDuration: "25s" }} />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full border border-blue-200/30 dark:border-blue-700/15" />
            <div className="absolute top-1/4 left-10 h-2 w-2 rounded-full bg-blue-400/40 dark:bg-blue-400/30" />
            <div className="absolute bottom-1/3 right-12 h-3 w-3 rounded-full bg-violet-400/30 dark:bg-violet-400/20" />
            <div className="absolute top-1/2 left-1/4 h-1.5 w-1.5 rounded-full bg-blue-400/30 dark:bg-blue-400/20" />
          </div>

          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl animate-in animate-in-1">
              <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 bg-clip-text text-transparent">
                {dict.home.heroTitle}
              </span>
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto animate-in animate-in-2">
              {dict.home.heroSubtitle.replace("{toolCount}", String(tools.length))}
            </p>
          </div>
        </section>

        {/* Intro / Value Prop */}
        <section className="mb-20 animate-in animate-in-2">
          <div className="rounded-2xl border-l-4 border-blue-500 bg-white px-8 py-10 dark:bg-zinc-900 dark:border-blue-400 shadow-sm">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {dict.home.introTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-3xl">
              {dict.home.introBody}
            </p>
          </div>
        </section>

        {/* Module cards */}
        <div className="grid gap-6 sm:grid-cols-2 mb-20">
          <Link
            href={`/${lang}/tools`}
            className="group rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-blue-300 hover:shadow-lg hover:scale-[1.01] dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-blue-700 animate-in animate-in-1"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl dark:bg-blue-900/30">
              🧭
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {dict.home.toolsCardTitle}
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {dict.home.toolsCardDesc.replace("{count}", String(tools.length))}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
              {dict.home.toolsCardCTA} <span aria-hidden="true">→</span>
            </span>
          </Link>

          <Link
            href={`/${lang}/compare`}
            className="group rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-amber-300 hover:shadow-lg hover:scale-[1.01] dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-amber-700 animate-in animate-in-2"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl dark:bg-amber-900/30">
              ⚡
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
              {dict.home.compareCardTitle}
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {dict.home.compareCardDesc.replace("{count}", String(compareCount))}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:gap-2 transition-all">
              {dict.home.compareCardCTA} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>

        <Link
          href={`/${lang}/guide`}
          className="mb-20 block rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-emerald-300 hover:shadow-lg hover:scale-[1.01] dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-emerald-700 group animate-in animate-in-3"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl dark:bg-emerald-900/30 shrink-0">
              📖
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {dict.home.guideCardTitle}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {dict.home.guideCardDesc.replace("{count}", String(guideCount))}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all shrink-0">
              {dict.home.guideCardCTA} <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>

        {/* News brief card */}
        <Link
          href={`/${lang}/news`}
          className="mb-20 block rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-purple-300 hover:shadow-lg hover:scale-[1.01] dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-purple-700 group animate-in animate-in-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl dark:bg-purple-900/30 shrink-0">
              📰
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                {dict.home.newsCardTitle}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {dict.home.newsCardDesc.replace("{count}", String(newsCount))}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all shrink-0">
              {dict.home.newsCardCTA} <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>

        {/* Featured tools */}
        <section className="animate-in animate-in-3">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {dict.home.featuredTitle}
            </h2>
            <Link
              href={`/${lang}/tools`}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition"
            >
              {dict.home.viewAll.replace("{count}", String(tools.length))} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} locale={lang} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
