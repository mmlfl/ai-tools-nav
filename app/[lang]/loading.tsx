export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 rounded-lg bg-blue-100 dark:bg-blue-900/30" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-xl border border-hairline bg-surface p-5"
            >
              <div className="h-5 w-3/4 rounded bg-blue-100 dark:bg-blue-900/30" />
              <div className="mt-2 h-4 w-full rounded bg-surface-elevated" />
              <div className="mt-1 h-4 w-2/3 rounded bg-surface-elevated" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
