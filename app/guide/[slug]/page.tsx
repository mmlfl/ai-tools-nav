import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGuideSlugs, getGuideContent } from "@/lib/content";
import ToolCard from "@/components/ToolCard";
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
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <svg suppressHydrationWarning className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          返回首页
        </Link>

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
      </div>
    </>
  );
}
