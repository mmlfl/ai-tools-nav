"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const zh = {
  title: "页面未找到",
  description: "你访问的页面不存在或已被移除",
  backHome: "返回首页",
};

const en = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been removed",
  backHome: "Back to Home",
};

export default function NotFound() {
  const pathname = usePathname();
  const t = pathname.startsWith("/en") ? en : zh;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-bold text-zinc-300 dark:text-zinc-700">404</p>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {t.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {t.description}
      </p>
      <Link
        href={pathname.startsWith("/en") ? "/en" : "/zh"}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-medium text-white transition hover:from-blue-600 hover:to-violet-600 shadow-sm shadow-blue-200 dark:shadow-blue-900/30"
      >
        <svg
          suppressHydrationWarning
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        {t.backHome}
      </Link>
    </div>
  );
}
