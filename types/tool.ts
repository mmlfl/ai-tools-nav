export type Category = "chat" | "image" | "video" | "code" | "audio" | "office" | "search";

export type Pricing = "free" | "freemium" | "paid" | "waitlist";

export interface Tool {
  slug: string;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  url: string;
  category: Category;
  tags: string[];
  pricing: Pricing;
  featured: boolean;
}

export function tName(tool: Tool, locale: string): string {
  return locale === "en" && tool.name_en ? tool.name_en : tool.name;
}

export function tDesc(tool: Tool, locale: string): string {
  return locale === "en" && tool.description_en
    ? tool.description_en
    : tool.description;
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

export const CATEGORY_LABELS_EN: Record<Category, string> = {
  chat: "Chat",
  image: "Image",
  video: "Video",
  code: "Code",
  audio: "Audio",
  office: "Office",
  search: "Search",
};

export function getCategoryLabel(cat: Category, locale: string): string {
  return locale === "en" ? CATEGORY_LABELS_EN[cat] : CATEGORY_LABELS[cat];
}

export const PRICING_LABELS: Record<Pricing, string> = {
  free: "免费",
  freemium: "Freemium",
  paid: "付费",
  waitlist: "内测中",
};

export const PRICING_LABELS_EN: Record<Pricing, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  waitlist: "Waitlist",
};

export function getPricingLabel(p: Pricing, locale: string): string {
  return locale === "en" ? PRICING_LABELS_EN[p] : PRICING_LABELS[p];
}

export const TAG_LABELS: Record<string, string> = {
  "对话": "对话",
  "写作": "写作",
  "编程": "编程",
  "分析": "分析",
  "多模态": "多模态",
  "搜索": "搜索",
  "图像生成": "图像生成",
  "艺术": "艺术",
  "设计": "设计",
  "创意": "创意",
  "开源": "开源",
  "本地运行": "本地运行",
  "视频生成": "视频生成",
  "文字转视频": "文字转视频",
  "视频编辑": "视频编辑",
  "代码补全": "代码补全",
  "IDE 集成": "IDE 集成",
  "编辑器": "编辑器",
  "对话编程": "对话编程",
  "前端": "前端",
  "UI 生成": "UI 生成",
  "语音合成": "语音合成",
  "声音克隆": "声音克隆",
  "多语言": "多语言",
  "音乐生成": "音乐生成",
  "歌曲创作": "歌曲创作",
  "总结": "总结",
  "协作": "协作",
  "演示文稿": "演示文稿",
  "文档": "文档",
  "PPT": "PPT",
  "研究": "研究",
  "引用": "引用",
  "学术搜索": "学术搜索",
  "论文": "论文",
  "营销": "营销",
  "文案": "文案",
  "内容创作": "内容创作",
  "代码生成": "代码生成",
  "游戏": "游戏",
  "概念艺术": "概念艺术",
  "推理": "推理",
  "长文本": "长文本",
  "办公": "办公",
  "生活": "生活",
  "实时信息": "实时信息",
  "社交": "社交",
  "知识": "知识",
  "中文": "中文",
  "高质量": "高质量",
  "文字渲染": "文字渲染",
  "Logo": "Logo",
  "数字人": "数字人",
  "视频翻译": "视频翻译",
  "口型同步": "口型同步",
  "短视频": "短视频",
  "物理模拟": "物理模拟",
  "自动化": "自动化",
  "全栈": "全栈",
  "Web 开发": "Web 开发",
  "在线": "在线",
  "SaaS": "SaaS",
  "快速开发": "快速开发",
  "在线 IDE": "在线 IDE",
  "部署": "部署",
  "音乐": "音乐",
  "播客": "播客",
  "转录": "转录",
  "语音转文字": "语音转文字",
  "会议": "会议",
  "翻译": "翻译",
  "思维导图": "思维导图",
  "综合": "综合",
  "开发者": "开发者",
  "隐私": "隐私",
};

export const TAG_LABELS_EN: Record<string, string> = {
  "对话": "Chat",
  "写作": "Writing",
  "编程": "Coding",
  "分析": "Analysis",
  "多模态": "Multimodal",
  "搜索": "Search",
  "图像生成": "Image Gen",
  "艺术": "Art",
  "设计": "Design",
  "创意": "Creative",
  "开源": "Open Source",
  "本地运行": "Local",
  "视频生成": "Video Gen",
  "文字转视频": "Text-to-Video",
  "视频编辑": "Video Edit",
  "代码补全": "Code Completion",
  "IDE 集成": "IDE Integration",
  "编辑器": "Editor",
  "对话编程": "Conversational",
  "前端": "Frontend",
  "UI 生成": "UI Gen",
  "语音合成": "TTS",
  "声音克隆": "Voice Clone",
  "多语言": "Multilingual",
  "音乐生成": "Music Gen",
  "歌曲创作": "Songwriting",
  "总结": "Summarization",
  "协作": "Collaboration",
  "演示文稿": "Slides",
  "文档": "Docs",
  "PPT": "PPT",
  "研究": "Research",
  "引用": "Citations",
  "学术搜索": "Academic",
  "论文": "Papers",
  "营销": "Marketing",
  "文案": "Copywriting",
  "内容创作": "Content",
  "代码生成": "Code Gen",
  "游戏": "Gaming",
  "概念艺术": "Concept Art",
  "推理": "Reasoning",
  "长文本": "Long Context",
  "办公": "Office",
  "生活": "Lifestyle",
  "实时信息": "Real-time",
  "社交": "Social",
  "知识": "Knowledge",
  "中文": "Chinese",
  "高质量": "High Quality",
  "文字渲染": "Text Render",
  "Logo": "Logo",
  "数字人": "Avatar",
  "视频翻译": "Video Translate",
  "口型同步": "Lip Sync",
  "短视频": "Short Video",
  "物理模拟": "Physics",
  "自动化": "Automation",
  "全栈": "Full Stack",
  "Web 开发": "Web Dev",
  "在线": "Online",
  "SaaS": "SaaS",
  "快速开发": "Rapid Dev",
  "在线 IDE": "Online IDE",
  "部署": "Deploy",
  "音乐": "Music",
  "播客": "Podcast",
  "转录": "Transcription",
  "语音转文字": "Speech-to-Text",
  "会议": "Meeting",
  "翻译": "Translation",
  "思维导图": "Mind Map",
  "综合": "All-in-One",
  "开发者": "Developer",
  "隐私": "Privacy",
};

export function getTagLabel(tag: string, locale: string): string {
  return locale === "en" ? TAG_LABELS_EN[tag] ?? tag : TAG_LABELS[tag] ?? tag;
}

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
