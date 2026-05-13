import { MetadataRoute } from "next";
import { Tool } from "@/types/tool";
import toolsData from "@/data/tools.json";
import { getAllComparePages, getAllGuidePages } from "@/lib/content";

const BASE_URL = "https://lflaitool.top";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = toolsData as Tool[];

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/guide`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/category/chat`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/category/image`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/category/video`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/category/code`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/category/audio`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/category/office`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/category/search`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const toolPages = tools.map((tool) => ({
    url: `${BASE_URL}/tool/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const comparePages = getAllComparePages();
  const compareUrls = comparePages.map((p) => ({
    url: `${BASE_URL}/compare/${p.slug}`,
    lastModified: new Date(p.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7 as const,
  }));

  const guidePages = getAllGuidePages();
  const guideUrls = guidePages.map((p) => ({
    url: `${BASE_URL}/guide/${p.slug}`,
    lastModified: new Date(p.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7 as const,
  }));

  return [...staticPages, ...toolPages, ...compareUrls, ...guideUrls];
}
