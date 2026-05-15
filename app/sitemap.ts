import { MetadataRoute } from "next";
import { Tool } from "@/types/tool";
import toolsData from "@/data/tools.json";
import { getAllComparePages, getAllGuidePages } from "@/lib/content";

const BASE_URL = "https://lflaitool.top";
const LANGS = ["zh", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = toolsData as Tool[];

  const staticPages = LANGS.flatMap((lang) => [
    { url: `${BASE_URL}/${lang}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/${lang}/tools`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/${lang}/compare`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/${lang}/guide`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/${lang}/category/chat`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/${lang}/category/image`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/${lang}/category/video`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/${lang}/category/code`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/${lang}/category/audio`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/${lang}/category/office`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/${lang}/category/search`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ]);

  const toolPages = LANGS.flatMap((lang) =>
    tools.map((tool) => ({
      url: `${BASE_URL}/${lang}/tool/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const comparePages = getAllComparePages();
  const compareUrls = LANGS.flatMap((lang) =>
    comparePages.map((p) => ({
      url: `${BASE_URL}/${lang}/compare/${p.slug}`,
      lastModified: new Date(p.frontmatter.date),
      changeFrequency: "monthly" as const,
      priority: 0.7 as const,
    }))
  );

  const guidePages = getAllGuidePages();
  const guideUrls = LANGS.flatMap((lang) =>
    guidePages.map((p) => ({
      url: `${BASE_URL}/${lang}/guide/${p.slug}`,
      lastModified: new Date(p.frontmatter.date),
      changeFrequency: "monthly" as const,
      priority: 0.7 as const,
    }))
  );

  return [...staticPages, ...toolPages, ...compareUrls, ...guideUrls];
}
