import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsSlugs, getNewsContent } from "@/lib/content";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";
import { BreadcrumbList, Article } from "@/components/StructuredData";
import BackLink from "@/components/BackLink";
import ToolCard from "@/components/ToolCard";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ lang: string; date: string }>;
}

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ date: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, date } = await params;
  if (!hasLocale(lang)) return { title: "Not Found" };
  const page = getNewsContent(date, lang);

  if (!page) return { title: "Not Found" };

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      type: "article",
      publishedTime: page.frontmatter.date,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { lang, date } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const page = getNewsContent(date, lang);
  if (!page) notFound();

  return (
    <>
      <BreadcrumbList
        items={[
          { name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` },
          { name: dict.news.breadcrumb, url: `${BASE_URL}/${lang}/news` },
          { name: page.frontmatter.title, url: `${BASE_URL}/${lang}/news/${page.slug}` },
        ]}
      />
      <Article page={{ title: page.frontmatter.title, description: page.frontmatter.description, slug: page.slug, date: page.frontmatter.date }} basePath="news" />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BackLink href={`/${lang}/news`} label={dict.news.breadcrumb} />

        <article className="rounded-2xl border border-hairline bg-surface p-8">
          <h1 className="text-2xl font-bold text-foreground">{page.frontmatter.title}</h1>
          <p className="mt-2 text-muted">{page.frontmatter.description}</p>
          <time dateTime={page.frontmatter.date} className="mt-2 inline-block text-sm text-muted">
            {page.frontmatter.date}
          </time>
          <hr className="my-6 border-hairline" />
          <div
            className="prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
        </article>

        {page.mentionedTools.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">
              {lang === "en" ? "Tools Mentioned" : "提及的工具"}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {page.mentionedTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${lang}/news?tool=${tool.slug}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-600 transition hover:bg-purple-100 hover:text-purple-700 dark:bg-purple-950 dark:text-purple-400 dark:hover:bg-purple-900 dark:hover:text-purple-300"
                >
                  {tool.name}
                  <span className="text-purple-400 dark:text-purple-500">→</span>
                </Link>
              ))}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.mentionedTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} locale={lang} />
              ))}
            </div>
          </section>
        )}

        <footer className="mt-12 pt-6 border-t border-hairline text-center">
          <Link
            href={`/${lang}/news`}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition"
          >
            ← {lang === "en" ? "Back to AI News" : "返回 AI 快讯列表"}
          </Link>
        </footer>
      </div>
    </>
  );
}
