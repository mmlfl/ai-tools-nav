import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tool as ToolType } from "@/types/tool";
import toolsData from "@/data/tools.json";
import ToolGrid from "@/components/ToolGrid";
import BackLink from "@/components/BackLink";
import { BreadcrumbList } from "@/components/StructuredData";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";

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
    title: dict.metadata.toolsTitle,
    description: dict.tools.description.replace("{count}", String(tools.length)),
    openGraph: {
      title: dict.metadata.toolsTitle,
      description: dict.metadata.toolsOGDescription,
    },
  };
}

export default async function ToolsPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <BreadcrumbList
        items={[
          { name: dict.home.breadcrumbHome, url: `${BASE_URL}/${lang}` },
          { name: dict.tools.breadcrumb, url: `${BASE_URL}/${lang}/tools` },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BackLink href={`/${lang}`} label={dict.common.backHome} />
        <section className="mb-10 animate-in animate-in-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {dict.tools.title}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {dict.tools.description.replace("{count}", String(tools.length))}
          </p>
        </section>

        <ToolGrid
          tools={tools}
          locale={lang}
          searchPlaceholder={dict.tools.searchPlaceholder}
          emptyTitle={dict.tools.emptyTitle}
          emptySubtitle={dict.tools.emptySubtitle}
        />
      </div>
    </>
  );
}
