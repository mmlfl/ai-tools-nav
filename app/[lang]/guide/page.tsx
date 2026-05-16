import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllGuidePages } from "@/lib/content";
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
    title: dict.metadata.guideTitle,
    description: dict.metadata.guideDescription,
    openGraph: {
      title: dict.metadata.guideTitle,
      description: dict.metadata.guideOGDescription,
    },
  };
}

export default async function GuideListPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const pages = getAllGuidePages(lang);

  const items = pages.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    date: p.frontmatter.date,
    keywords: [p.frontmatter.tool],
    categories: p.tool ? [p.tool.category] : [],
  }));

  return (
    <>
      <BreadcrumbList
        items={[
          { name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` },
          { name: dict.guide.breadcrumb, url: `${BASE_URL}/${lang}/guide` },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BackLink href={`/${lang}`} label={dict.common.backHome} />
        <section className="mb-8 animate-in animate-in-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {dict.guide.listingTitle}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {dict.guide.listingSubtitle}
          </p>
        </section>

        <SearchableGrid
          items={items}
          basePath={`/${lang}/guide`}
          placeholder={dict.guide.searchPlaceholder}
          emptyText={dict.guide.emptyText}
          noMatchText={dict.guide.noMatchText}
          categoryLabels={lang === "en" ? CATEGORY_LABELS_EN : CATEGORY_LABELS}
          allLabel={dict.common.searchAll}
          resultLabel={dict.common.searchResult}
        />
      </div>
    </>
  );
}
