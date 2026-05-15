import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, Category, Tool } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolCard from "@/components/ToolCard";
import BackLink from "@/components/BackLink";
import { BreadcrumbList } from "@/components/StructuredData";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";

const BASE_URL = "https://lflaitool.top";

interface Props {
  params: Promise<{ lang: string; category: string }>;
}

const VALID_CATEGORIES: Category[] = ["chat", "image", "video", "code", "audio", "office", "search"];

export function generateStaticParams() {
  return VALID_CATEGORIES.map((c) => ({ category: c }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  if (!hasLocale(lang) || !VALID_CATEGORIES.includes(category as Category)) {
    return { title: "Not Found" };
  }
  const dict = await getDictionary(lang as Locale);
  const cat = category as Category;
  const label = dict.categories[cat];

  return {
    title: dict.category.title.replace("{category}", label),
    description: dict.category.description.replace("{category}", label),
    openGraph: {
      title: dict.category.title.replace("{category}", label),
      description: dict.category.description.replace("{category}", label),
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { lang, category } = await params;

  if (!VALID_CATEGORIES.includes(category as Category)) notFound();
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const cat = category as Category;
  const tools = (toolsData as Tool[]).filter((t) => t.category === cat);

  return (
    <>
      <BreadcrumbList
        items={[
          { name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` },
          { name: CATEGORY_LABELS[cat], url: `${BASE_URL}/${lang}/category/${cat}` },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BackLink href={`/${lang}/tools`} label={dict.tools.title} />
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {CATEGORY_LABELS[cat]}
          <span className="ml-3 text-lg font-normal text-zinc-400">
            {tools.length} {lang === "zh" ? "个工具" : "tools"}
          </span>
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale={lang} />
          ))}
        </div>
      </div>
    </>
  );
}
