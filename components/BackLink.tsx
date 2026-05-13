import Link from "next/link";

interface Props {
  href?: string;
  label?: string;
}

export default function BackLink({ href = "/", label = "返回首页" }: Props) {
  return (
    <Link
      href={href}
      className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
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
      {label}
    </Link>
  );
}
