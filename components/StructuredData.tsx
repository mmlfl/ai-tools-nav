import { Tool } from "@/types/tool";

const BASE_URL = "https://lflaitool.top";

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbList({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SoftwareApplication({ tool }: { tool: Tool }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: `${BASE_URL}/tool/${tool.slug}`,
    applicationCategory: "AIApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: tool.pricing === "free" ? "0" : undefined,
      priceCurrency: tool.pricing === "free" ? "CNY" : undefined,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSite() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Tools Nav",
    description: "发现最优秀的 AI 工具，提升工作效率",
    url: BASE_URL,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function Article({ page, basePath = "compare" }: { page: { title: string; description: string; slug: string; date: string }; basePath?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    url: `${BASE_URL}/${basePath}/${page.slug}`,
    datePublished: page.date,
    author: { "@type": "Organization", name: "AI Tools Nav" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
