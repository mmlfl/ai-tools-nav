import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Tools Nav - 发现最优秀的 AI 工具",
  description: "精选 AI 工具导航，帮你发现最新最实用的 AI 产品",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <a href="/" className="text-lg font-bold tracking-tight">
              AI Tools Nav
            </a>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                GitHub
              </a>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200/80 bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-950/60">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} AI Tools Nav - AI 工具导航
          </div>
        </footer>
      </body>
    </html>
  );
}
