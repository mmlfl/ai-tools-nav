import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompareSlugs, getCompareContent, getGuidePageForTool } from "@/lib/content";
import ToolCard from "@/components/ToolCard";
import BackLink from "@/components/BackLink";
import { BreadcrumbList, Article } from "@/components/StructuredData";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getCompareSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getCompareContent(slug);
  if (!page) return { title: "未找到" };

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
  const { slug } = await params;
  const page = getCompareContent(slug);

  if (!page) notFound();

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "首页", url: BASE_URL },
          { name: "工具对比", url: `${BASE_URL}/compare` },
          { name: page.frontmatter.title, url: `${BASE_URL}/compare/${page.slug}` },
        ]}
      />
      <Article page={{ ...page.frontmatter, slug }} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BackLink />

        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <h1>{page.frontmatter.title}</h1>
          <p className="text-zinc-500">{page.frontmatter.description}</p>
          <time className="text-sm text-zinc-400" dateTime={page.frontmatter.date}>
            {page.frontmatter.date}
          </time>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: page.html }} />
        </article>

        {page.relatedTools.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">文章中提到的工具</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.relatedTools.map((t) => {
                const guide = getGuidePageForTool(t.slug);
                return (
                  <div key={t.slug} className="space-y-3">
                    <ToolCard tool={t} />
                    {guide && (
                      <Link
                        href={`/guide/${guide.slug}`}
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
