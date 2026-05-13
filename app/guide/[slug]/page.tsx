import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGuideSlugs, getGuideContent, getComparePagesForTool } from "@/lib/content";
import ToolCard from "@/components/ToolCard";
import BackLink from "@/components/BackLink";
import { BreadcrumbList, Article } from "@/components/StructuredData";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuideContent(slug);
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

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const page = getGuideContent(slug);

  if (!page) notFound();

  const comparePages = page.tool ? getComparePagesForTool(page.tool.slug) : [];

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "首页", url: BASE_URL },
          { name: "工具指南", url: `${BASE_URL}/guide` },
          { name: page.frontmatter.title, url: `${BASE_URL}/guide/${page.slug}` },
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

        {page.tool && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">相关工具</h2>
            <div className="mt-4 max-w-sm">
              <ToolCard tool={page.tool} />
            </div>
          </section>
        )}

        {comparePages.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">相关对比</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {comparePages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/compare/${p.slug}`}
                  className="group rounded-xl border border-zinc-200/80 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {p.frontmatter.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
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
