import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { CompareFrontmatter, ComparePage, GuideFrontmatter, GuidePage, Tool } from "@/types/tool";
import toolsData from "@/data/tools.json";

const tools = toolsData as Tool[];

function getCompareDir(locale: string): string {
  const dir = path.join(process.cwd(), "content/compare", locale);
  if (fs.existsSync(dir)) return dir;
  return path.join(process.cwd(), "content/compare", "zh");
}

function getGuideDir(locale: string): string {
  const dir = path.join(process.cwd(), "content/guide", locale);
  if (fs.existsSync(dir)) return dir;
  return path.join(process.cwd(), "content/guide", "zh");
}

export function getCompareSlugs(locale: string = "zh"): string[] {
  const dir = getCompareDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getCompareContent(slug: string, locale: string = "zh"): ComparePage | null {
  const dir = getCompareDir(locale);
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as CompareFrontmatter;
  const html = marked(content) as string;

  const relatedTools = frontmatter.tools
    .map((s) => tools.find((t) => t.slug === s))
    .filter((t): t is Tool => t !== undefined);

  return { slug, frontmatter, content, html, relatedTools };
}

export function getAllComparePages(locale: string = "zh"): ComparePage[] {
  return getCompareSlugs(locale)
    .map((slug) => getCompareContent(slug, locale))
    .filter((p): p is ComparePage => p !== null);
}

export function getGuideSlugs(locale: string = "zh"): string[] {
  const dir = getGuideDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getGuideContent(slug: string, locale: string = "zh"): GuidePage | null {
  const dir = getGuideDir(locale);
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as GuideFrontmatter;
  const html = marked(content) as string;

  const tool = tools.find((t) => t.slug === frontmatter.tool);

  return { slug, frontmatter, content, html, tool };
}

export function getAllGuidePages(locale: string = "zh"): GuidePage[] {
  return getGuideSlugs(locale)
    .map((slug) => getGuideContent(slug, locale))
    .filter((p): p is GuidePage => p !== null);
}

export function getComparePagesForTool(slug: string, locale: string = "zh"): ComparePage[] {
  return getAllComparePages(locale).filter((p) =>
    p.frontmatter.tools.includes(slug)
  );
}

export function getGuidePageForTool(slug: string, locale: string = "zh"): GuidePage | null {
  return getAllGuidePages(locale).find((p) => p.frontmatter.tool === slug) ?? null;
}
