import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompareSlugs, getCompareContent, getGuidePageForTool } from "@/lib/content";
import ToolCard from "@/components/ToolCard";
import BackLink from "@/components/BackLink";
import { BreadcrumbList, Article } from "@/components/StructuredData";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return getCompareSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = getCompareContent(slug, lang);
  if (!page) return { title: "Not Found" };

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    openGraph: {
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      type: "article",
    },
  };
}

export default async function ComparePage({ params }: Props) {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const page = getCompareContent(slug, lang);

  if (!page) notFound();

  return (
    <>
      <BreadcrumbList
        items={[
          { name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` },
          { name: dict.compare.breadcrumb, url: `${BASE_URL}/${lang}/compare` },
          { name: page.frontmatter.title, url: `${BASE_URL}/${lang}/compare/${page.slug}` },
        ]}
      />
      <Article page={{ ...page.frontmatter, slug }} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BackLink href={`/${lang}/compare`} label={dict.compare.breadcrumb} />

        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <h1>{page.frontmatter.title}</h1>
          <p className="text-muted">{page.frontmatter.description}</p>
          <time className="text-sm text-muted" dateTime={page.frontmatter.date}>
            {page.frontmatter.date}
          </time>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: page.html }} />
        </article>

        {page.relatedTools.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">
              {dict.compare.toolsInArticle}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.relatedTools.map((t) => {
                const guide = getGuidePageForTool(t.slug, lang);
                return (
                  <div key={t.slug} className="space-y-3">
                    <ToolCard tool={t} locale={lang} />
                    {guide && (
                      <Link
                        href={`/${lang}/guide/${guide.slug}`}
                        className="block rounded-lg border border-emerald-200/60 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
                      >
                        📖 {guide.frontmatter.title}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
