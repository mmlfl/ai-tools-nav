export type Category = "chat" | "image" | "video" | "code" | "audio" | "office" | "search";

export type Pricing = "free" | "freemium" | "paid" | "waitlist";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  url: string;
  category: Category;
  tags: string[];
  pricing: Pricing;
  featured: boolean;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  chat: "对话",
  image: "图像",
  video: "视频",
  code: "编程",
  audio: "音频",
  office: "办公",
  search: "搜索",
};

export const PRICING_LABELS: Record<Pricing, string> = {
  free: "免费",
  freemium: "Freemium",
  paid: "付费",
  waitlist: "内测中",
};

// Content types (Phase 2)

export interface CompareFrontmatter {
  title: string;
  description: string;
  tools: string[];
  date: string;
  featured?: boolean;
}

export interface ComparePage {
  slug: string;
  frontmatter: CompareFrontmatter;
  content: string;
  html: string;
  relatedTools: Tool[];
}

export interface GuideFrontmatter {
  title: string;
  description: string;
  tool: string;            // single tool slug
  date: string;
  featured?: boolean;
}

export interface GuidePage {
  slug: string;
  frontmatter: GuideFrontmatter;
  content: string;
  html: string;
  tool: Tool | undefined;  // resolved from frontmatter.tool
}
