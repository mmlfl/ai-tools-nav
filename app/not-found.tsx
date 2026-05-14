import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - 页面未找到",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-bold text-zinc-300 dark:text-zinc-700">404</p>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        页面未找到
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        你访问的页面不存在或已被移除
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
        返回首页
      </Link>
    </div>
  );
}
