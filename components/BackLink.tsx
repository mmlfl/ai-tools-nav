import Link from "next/link";

interface Props {
  href?: string;
  label?: string;
}

export default function BackLink({ href = "/", label = "返回首页" }: Props) {
  return (
    <Link
      href={href}
      className="mb-8 inline-flex min-h-[40px] items-center gap-1.5 text-sm text-muted transition hover:text-blue-600 dark:hover:text-blue-400 group"
    >
      <svg
        suppressHydrationWarning
        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
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
