interface EmptyStateProps {
  title?: string;
  subtitle?: string;
}

export default function EmptyState({ title = "没有找到匹配的工具", subtitle = "试试更换筛选条件或搜索关键词" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        suppressHydrationWarning
        className="h-20 w-20 text-hairline"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-muted">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {subtitle}
      </p>
    </div>
  );
}
