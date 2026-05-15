import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tool as ToolType } from "@/types/tool";
import toolsData from "@/data/tools.json";
import { getAllComparePages, getAllGuidePages } from "@/lib/content";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";
import { BreadcrumbList, WebSite } from "@/components/StructuredData";

const BASE_URL = "https://lflaitool.top";
const tools = toolsData as ToolType[];

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  return {
    title: dict.metadata.homeTitle,
    description: dict.metadata.homeDescription,
    openGraph: {
      title: dict.metadata.homeTitle,
      description: dict.metadata.homeOGDescription,
    },
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  const compareCount = getAllComparePages().length;
  const guideCount = getAllGuidePages().length;

  return (
    <>
      <WebSite />
      <BreadcrumbList
        items={[{ name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` }]}
      />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <section className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-violet-50 px-8 py-16 text-center dark:from-blue-950/30 dark:via-zinc-900 dark:to-violet-950/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.06),transparent_50%)]" />
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 bg-clip-text text-transparent">
                {dict.home.heroTitle}
              </span>
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
              {dict.home.heroSubtitle.replace("{toolCount}", String(tools.length))}
            </p>
          </div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href={`/${lang}/tools`}
            className="group rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-blue-300 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-blue-700"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl dark:bg-blue-900/30">
              🧭
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {dict.home.toolsCardTitle}
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {dict.home.toolsCardDesc.replace("{count}", String(tools.length))}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
              {dict.home.toolsCardCTA} <span aria-hidden="true">→</span>
            </span>
          </Link>

          <Link
            href={`/${lang}/compare`}
            className="group rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-amber-300 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-amber-700"
          >
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl dark:bg-amber-900/30">
              ⚡
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
              {dict.home.compareCardTitle}
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {dict.home.compareCardDesc.replace("{count}", String(compareCount))}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:gap-2 transition-all">
              {dict.home.compareCardCTA} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>

        <Link
          href={`/${lang}/guide`}
          className="mt-6 block rounded-2xl border border-zinc-200/80 bg-white p-8 transition hover:border-emerald-300 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-emerald-700 group"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl dark:bg-emerald-900/30 shrink-0">
              📖
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {dict.home.guideCardTitle}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {dict.home.guideCardDesc.replace("{count}", String(guideCount))}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all shrink-0">
              {dict.home.guideCardCTA} <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}
