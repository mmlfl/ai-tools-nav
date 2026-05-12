import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { CompareFrontmatter, ComparePage, Tool } from "@/types/tool";
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
