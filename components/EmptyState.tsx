export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        suppressHydrationWarning
        className="h-16 w-16 text-blue-200 dark:text-blue-900/50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        viewBox="0 0 24 24"
      >
        <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-zinc-500 dark:text-zinc-400">
        没有找到匹配的工具
      </h3>
      <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
        试试更换筛选条件或搜索关键词
      </p>
    </div>
  );
}
