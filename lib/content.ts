import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { CompareFrontmatter, ComparePage, GuideFrontmatter, GuidePage, Tool } from "@/types/tool";
import toolsData from "@/data/tools.json";

const CONTENT_DIR = path.join(process.cwd(), "content/compare");
const tools = toolsData as Tool[];

export function getCompareSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getCompareContent(slug: string): ComparePage | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
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

export function getAllComparePages(): ComparePage[] {
  return getCompareSlugs()
    .map(getCompareContent)
    .filter((p): p is ComparePage => p !== null);
}

const GUIDE_CONTENT_DIR = path.join(process.cwd(), "content/guide");

export function getGuideSlugs(): string[] {
  if (!fs.existsSync(GUIDE_CONTENT_DIR)) return [];
  return fs.readdirSync(GUIDE_CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getGuideContent(slug: string): GuidePage | null {
  const filePath = path.join(GUIDE_CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as GuideFrontmatter;
  const html = marked(content) as string;

  const tool = tools.find((t) => t.slug === frontmatter.tool);

  return { slug, frontmatter, content, html, tool };
}

export function getAllGuidePages(): GuidePage[] {
  return getGuideSlugs()
    .map(getGuideContent)
    .filter((p): p is GuidePage => p !== null);
}

// Cross-reference helpers

export function getComparePagesForTool(slug: string): ComparePage[] {
  return getAllComparePages().filter((p) =>
    p.frontmatter.tools.includes(slug)
  );
}

export function getGuidePageForTool(slug: string): GuidePage | null {
  return getAllGuidePages().find((p) => p.frontmatter.tool === slug) ?? null;
}
