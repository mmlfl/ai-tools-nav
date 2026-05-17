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
  const latestNews = getLatestNewsPages(lang, 5);
  const newsCount = latestNews.length;
  const featuredTools = tools.slice(0, 6);

  return (
    <>
      <WebSite />
      <BreadcrumbList
        items={[{ name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` }]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        {/* Hero */}
        <section className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 px-8 py-20 text-center text-white shadow-xl shadow-violet-500/20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full border border-white/20" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full border border-white/15" />
            <div className="absolute top-1/4 left-10 h-2 w-2 rounded-full bg-white/50" />
            <div className="absolute bottom-1/3 right-12 h-3 w-3 rounded-full bg-white/40" />
            <div className="absolute top-1/2 left-1/4 h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
          <div className="relative">
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium backdrop-blur">
              {dict.home.heroTitle}
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl animate-in animate-in-1">
              {dict.home.introTitle}
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl mx-auto animate-in animate-in-2 leading-relaxed">
              {dict.home.heroSubtitle.replace("{toolCount}", String(tools.length))}
            </p>
          </div>
        </section>

        {/* News highlight — front and center */}
        {latestNews.length > 0 && (
          <section className="mb-16 animate-in animate-in-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500 text-white text-sm">📰</span>
              <h2 className="text-xl font-bold text-foreground">{dict.home.newsCardTitle}</h2>
              <span className="text-xs text-muted bg-surface px-2.5 py-1 rounded-full border border-hairline">每日更新</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${lang}/news/${article.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface p-6 transition hover:border-purple-300 hover:shadow-lg hover:-translate-y-0.5 dark:hover:border-purple-700"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 opacity-0 group-hover:opacity-100 transition" />
                  <time className="text-xs font-medium text-purple-500 dark:text-purple-400">
                    {article.frontmatter.date}
                  </time>
                  <h3 className="mt-2 text-sm font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-2">
                    {article.frontmatter.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted line-clamp-2">
                    {article.frontmatter.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 group-hover:gap-1.5 transition-all">
                    {dict.home.newsCardCTA} →
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link
                href={`/${lang}/news`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 transition"
              >
                {lang === "en" ? `View all ${newsCount} news briefs` : `查看全部 ${newsCount} 期快讯`} →
              </Link>
            </div>
          </section>
        )}

        {/* Module cards — 3 columns */}
        <section className="mb-16 animate-in animate-in-2">
          <div className="grid gap-5 sm:grid-cols-3">
            <Link
              href={`/${lang}/tools`}
              className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface p-7 transition hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 dark:hover:border-blue-700"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition" />
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl dark:bg-blue-900/30">
                🧭
              </div>
              <h2 className="text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {dict.home.toolsCardTitle}
              </h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {dict.home.toolsCardDesc.replace("{count}", String(tools.length))}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                {dict.home.toolsCardCTA} →
              </span>
            </Link>

            <Link
              href={`/${lang}/compare`}
              className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface p-7 transition hover:border-amber-300 hover:shadow-lg hover:-translate-y-0.5 dark:hover:border-amber-700"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition" />
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl dark:bg-amber-900/30">
                ⚡
              </div>
              <h2 className="text-lg font-semibold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
                {dict.home.compareCardTitle}
              </h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {dict.home.compareCardDesc.replace("{count}", String(compareCount))}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:gap-2 transition-all">
                {dict.home.compareCardCTA} →
              </span>
            </Link>

            <Link
              href={`/${lang}/guide`}
              className="group relative overflow-hidden rounded-2xl border border-hairline bg-surface p-7 transition hover:border-emerald-300 hover:shadow-lg hover:-translate-y-0.5 dark:hover:border-emerald-700"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition" />
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl dark:bg-emerald-900/30">
                📖
              </div>
              <h2 className="text-lg font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {dict.home.guideCardTitle}
              </h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {dict.home.guideCardDesc.replace("{count}", String(guideCount))}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                {dict.home.guideCardCTA} →
              </span>
            </Link>
          </div>
        </section>

        {/* Featured tools */}
        <section className="animate-in animate-in-3">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
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
