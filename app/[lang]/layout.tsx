import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { WebSite } from "@/components/StructuredData";
import ChatProvider from "@/components/ChatProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionary";
import { notFound } from "next/navigation";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://lflaitool.top"),
    title: {
      default: "AI Tools Nav - 发现最优秀的 AI 工具",
      template: "%s | AI Tools Nav",
    },
    description:
      "精选 AI 工具导航，涵盖对话、图像、视频、编程、音频、办公、搜索等 7 大类 AI 工具。帮你发现最新最实用的 AI 产品，提升工作效率。",
    keywords: [
      "AI工具",
      "人工智能",
      "AI导航",
      "ChatGPT",
      "AI编程",
      "AI绘图",
      "AI视频",
      "AI工具推荐",
    ],
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: "AI Tools Nav",
      title: "AI Tools Nav - 发现最优秀的 AI 工具",
      description: "精选 AI 工具导航，帮你发现最新最实用的 AI 产品",
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const year = new Date().getFullYear();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <WebSite />
        <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 opacity-70" />
          <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link
              href={`/${lang}`}
              className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-lg font-bold tracking-tight text-transparent"
            >
              AI Tools Nav
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher currentLang={lang} />
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition hover:text-blue-600 dark:hover:text-blue-400"
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200/80 bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-950/60">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-zinc-400">
            {dict.footer.replace("{year}", String(year))}
          </div>
        </footer>
        <Suspense fallback={null}>
          <ChatProvider
            chatLabels={{
              title: dict.chat.title,
              intro: dict.chat.intro,
              placeholder: dict.chat.placeholder,
              send: dict.chat.send,
              error: dict.chat.error,
              closeLabel: dict.chat.closeLabel,
              openLabel: dict.chat.openLabel,
              closeChatLabel: dict.chat.closeChatLabel,
            }}
          />
        </Suspense>
      </body>
    </html>
  );
}
