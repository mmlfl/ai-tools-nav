import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGuideSlugs, getGuideContent, getComparePagesForTool } from "@/lib/content";
import ToolCard from "@/components/ToolCard";
import BackLink from "@/components/BackLink";
import { BreadcrumbList, Article } from "@/components/StructuredData";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = getGuideContent(slug, lang);
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

export default async function GuidePage({ params }: Props) {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const page = getGuideContent(slug, lang);

  if (!page) notFound();

  const comparePages = page.tool ? getComparePagesForTool(page.tool.slug, lang) : [];

  return (
    <>
      <BreadcrumbList
        items={[
          { name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` },
          { name: dict.guide.breadcrumb, url: `${BASE_URL}/${lang}/guide` },
          { name: page.frontmatter.title, url: `${BASE_URL}/${lang}/guide/${page.slug}` },
        ]}
      />
      <Article page={{ ...page.frontmatter, slug }} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BackLink href={`/${lang}/guide`} label={dict.guide.breadcrumb} />

        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <h1>{page.frontmatter.title}</h1>
          <p className="text-muted">{page.frontmatter.description}</p>
          <time className="text-sm text-muted" dateTime={page.frontmatter.date}>
            {page.frontmatter.date}
          </time>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: page.html }} />
        </article>

        {page.tool && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">
              {dict.guide.relatedTools}
            </h2>
            <div className="mt-4 max-w-sm">
              <ToolCard tool={page.tool} locale={lang} />
            </div>
          </section>
        )}

        {comparePages.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">
              {dict.tool.relatedCompare}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {comparePages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${lang}/compare/${p.slug}`}
                  className="group rounded-xl border border-hairline bg-surface p-4 transition hover:border-blue-300 hover:shadow-sm dark:hover:border-blue-700"
                >
                  <h3 className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {p.frontmatter.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">
                    {p.frontmatter.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
