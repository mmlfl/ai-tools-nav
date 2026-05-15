import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllComparePages } from "@/lib/content";
import { CATEGORY_LABELS, CATEGORY_LABELS_EN } from "@/types/tool";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";
import { BreadcrumbList } from "@/components/StructuredData";
import BackLink from "@/components/BackLink";
import SearchableGrid from "@/components/SearchableGrid";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  return {
    title: dict.metadata.compareTitle,
    description: dict.metadata.compareDescription,
    openGraph: {
      title: dict.metadata.compareTitle,
      description: dict.metadata.compareOGDescription,
    },
  };
}

export default async function CompareListPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const pages = getAllComparePages(lang);

  const items = pages.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    date: p.frontmatter.date,
    keywords: p.frontmatter.tools,
    categories: p.relatedTools.map((t) => t.category),
  }));

  return (
    <>
      <BreadcrumbList
        items={[
          { name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` },
          { name: dict.compare.breadcrumb, url: `${BASE_URL}/${lang}/compare` },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BackLink href={`/${lang}`} label={dict.common.backHome} />
        <section className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {dict.compare.listingTitle}
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            {dict.compare.listingSubtitle}
          </p>
        </section>

        <SearchableGrid
          items={items}
          basePath={`/${lang}/compare`}
          placeholder={dict.compare.searchPlaceholder}
          emptyText={dict.compare.emptyText}
          noMatchText={dict.compare.noMatchText}
          categoryLabels={lang === "en" ? CATEGORY_LABELS_EN : CATEGORY_LABELS}
          allLabel={dict.common.searchAll}
          resultLabel={dict.common.searchResult}
        />
      </div>
    </>
  );
}
