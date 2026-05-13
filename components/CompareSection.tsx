import Link from "next/link";
import { getAllComparePages } from "@/lib/content";

export default function CompareSection() {
  const pages = getAllComparePages();
  if (pages.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        热门工具对比
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        深度对比热门 AI 工具，帮你做出最佳选择
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p) => (
          <Link
            key={p.slug}
            href={`/compare/${p.slug}`}
            className="group rounded-xl border border-zinc-200/80 bg-white p-5 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {p.frontmatter.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
              {p.frontmatter.description}
            </p>
            <span className="mt-3 inline-block text-xs text-zinc-400 dark:text-zinc-500">
              {p.frontmatter.date}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
