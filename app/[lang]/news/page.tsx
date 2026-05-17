import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNewsPages } from "@/lib/content";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";
import { BreadcrumbList } from "@/components/StructuredData";
import BackLink from "@/components/BackLink";
import toolsData from "@/data/tools.json";
import type { Tool } from "@/types/tool";

const BASE_URL = "https://lflaitool.top";
const tools = toolsData as Tool[];

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tool?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  return {
    title: dict.metadata.newsTitle,
    description: dict.metadata.newsDescription,
    openGraph: {
      title: dict.metadata.newsTitle,
      description: dict.metadata.newsOGDescription,
    },
  };
}

export default async function NewsListPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const s = await searchParams;
  const activeTool = s.tool ?? null;
  const activeToolName = activeTool ? tools.find((t) => t.slug === activeTool)?.name ?? activeTool : null;

  const allPages = getAllNewsPages(lang);
  const pages = activeTool
    ? allPages.filter((p) => p.frontmatter.tools?.includes(activeTool))
    : allPages;

  return (
    <>
      <BreadcrumbList
        items={[
          { name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` },
          { name: dict.news.breadcrumb, url: `${BASE_URL}/${lang}/news` },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BackLink href={`/${lang}`} label={dict.common.backHome} />

        <h1 className="mt-4 text-3xl font-bold text-foreground">{dict.news.listingTitle}</h1>
        <p className="mt-2 text-muted">{dict.news.listingSubtitle}</p>

        {/* Active filter pill */}
        {activeTool && (
          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm text-muted">{lang === "en" ? "Filtered by:" : "筛选工具:"}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              {activeToolName}
              <Link
                href={`/${lang}/news`}
                className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-purple-500 hover:bg-purple-200 dark:hover:bg-purple-800 transition"
                aria-label={lang === "en" ? "Clear filter" : "清除筛选"}
              >
                ×
              </Link>
            </span>
          </div>
        )}

        {pages.length === 0 ? (
          <p className="mt-12 text-center text-muted">{activeTool ? dict.news.noMatchText : dict.news.emptyText}</p>
        ) : (
          <div className="mt-10 relative">
            {/* Timeline vertical line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-300 dark:from-purple-600 dark:via-pink-600 dark:to-purple-500 sm:left-5" />

            <div className="flex flex-col gap-6">
              {pages.map((page, i) => (
                <div
                  key={page.slug}
                  className="relative pl-10 sm:pl-14 animate-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[3px] top-3 h-4 w-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 ring-4 ring-canvas dark:ring-canvas shadow-sm sm:left-[12px]" />

                  {/* Card */}
                  <Link
                    href={`/${lang}/news/${page.slug}`}
                    className="group block rounded-xl border border-hairline bg-surface p-5 transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50 dark:hover:border-purple-700 dark:hover:shadow-purple-900/20"
                  >
                    <time dateTime={page.frontmatter.date} className="text-xs font-medium text-purple-500 dark:text-purple-400">
                      {page.frontmatter.date}
                    </time>
                    <h2 className="mt-1 text-lg font-semibold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {page.frontmatter.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {page.frontmatter.description}
                    </p>
                    {page.mentionedTools.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {page.mentionedTools.map((t) => (
                          <Link
                            key={t.slug}
                            href={`/${lang}/news?tool=${t.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className={`rounded-md px-2 py-0.5 text-xs transition ${
                              activeTool === t.slug
                                ? "bg-purple-500 text-white dark:bg-purple-400 dark:text-white"
                                : "bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-400 dark:hover:bg-purple-900"
                            }`}
                          >
                            {t.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
