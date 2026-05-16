import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNewsPages } from "@/lib/content";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";
import { BreadcrumbList } from "@/components/StructuredData";
import BackLink from "@/components/BackLink";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ lang: string }>;
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

export default async function NewsListPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const pages = getAllNewsPages(lang);

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

        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{dict.news.listingTitle}</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">{dict.news.listingSubtitle}</p>

        {pages.length === 0 ? (
          <p className="mt-12 text-center text-zinc-400 dark:text-zinc-500">{dict.news.emptyText}</p>
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
                  <div className="absolute left-[3px] top-3 h-4 w-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 ring-4 ring-white dark:ring-zinc-950 shadow-sm sm:left-[12px]" />

                  {/* Card */}
                  <Link
                    href={`/${lang}/news/${page.slug}`}
                    className="group block rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100/50 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-purple-700 dark:hover:shadow-purple-900/20"
                  >
                    <time dateTime={page.frontmatter.date} className="text-xs font-medium text-purple-500 dark:text-purple-400">
                      {page.frontmatter.date}
                    </time>
                    <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {page.frontmatter.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                      {page.frontmatter.description}
                    </p>
                    {page.mentionedTools.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {page.mentionedTools.map((t) => (
                          <span
                            key={t.slug}
                            className="rounded-md bg-purple-50 px-2 py-0.5 text-xs text-purple-600 dark:bg-purple-950 dark:text-purple-400"
                          >
                            {t.name}
                          </span>
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
