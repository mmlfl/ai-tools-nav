import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tool, tName, tDesc, getCategoryLabel, getPricingLabel, getTagLabel, CATEGORY_TAG_COLORS } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolCard from "@/components/ToolCard";
import BackLink from "@/components/BackLink";
import { BreadcrumbList, SoftwareApplication } from "@/components/StructuredData";
import { getComparePagesForTool, getGuidePageForTool } from "@/lib/content";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  const tools = toolsData as Tool[];
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const tools = toolsData as Tool[];
  const tool = tools.find((t) => t.slug === slug);

  if (!tool || !hasLocale(lang)) return { title: "Not Found" };

  return {
    title: `${tool.name} - AI Tools`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - AI Tools`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const tools = toolsData as Tool[];
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) notFound();

  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 3);

  const comparePages = getComparePagesForTool(tool.slug, lang);
  const guidePage = getGuidePageForTool(tool.slug, lang);

  return (
    <>
      <BreadcrumbList
        items={[
          { name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` },
          { name: getCategoryLabel(tool.category, lang), url: `${BASE_URL}/${lang}/category/${tool.category}` },
          { name: tName(tool, lang), url: `${BASE_URL}/${lang}/tool/${tool.slug}` },
        ]}
      />
      <SoftwareApplication tool={tool} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <BackLink href={`/${lang}`} label={dict.common.backHome} />

        <article className="rounded-2xl border border-hairline bg-surface p-8">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-elevated text-2xl font-bold text-muted">
              {tName(tool, lang).charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{tName(tool, lang)}</h1>
              <p className="mt-2 text-muted">{tDesc(tool, lang)}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-md px-3 py-1 text-sm font-medium ${CATEGORY_TAG_COLORS[tool.category]}`}>
                {getCategoryLabel(tool.category, lang)}
              </span>
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                >
                  {getTagLabel(tag, lang)}
                </span>
              ))}
            </div>
            <span className="rounded-lg bg-surface-elevated px-3 py-1 text-sm font-medium text-muted">
              {getPricingLabel(tool.pricing, lang)}
            </span>
          </div>

          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-medium text-white transition hover:from-blue-600 hover:to-violet-600 shadow-sm shadow-blue-200 dark:shadow-blue-900/30"
          >
            {dict.tool.visitWebsite}
            <svg suppressHydrationWarning className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M7 17L17 7m0 0H7m10 0v10" />
            </svg>
          </a>
        </article>

        {relatedTools.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">{dict.tool.similarTools}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((t) => (
                <ToolCard key={t.slug} tool={t} locale={lang} />
              ))}
            </div>
          </section>
        )}

        {comparePages.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">{dict.tool.relatedCompare}</h2>
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

        {guidePage && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">{dict.tool.relatedGuide}</h2>
            <div className="mt-4">
              <Link
                href={`/${lang}/guide/${guidePage.slug}`}
                className="group rounded-xl border border-hairline bg-surface p-5 transition hover:border-emerald-300 hover:shadow-sm dark:hover:border-emerald-700 block"
              >
                <h3 className="font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {guidePage.frontmatter.title}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {guidePage.frontmatter.description}
                </p>
                <span className="mt-2 inline-block text-xs text-muted">
                  {guidePage.frontmatter.date}
                </span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
