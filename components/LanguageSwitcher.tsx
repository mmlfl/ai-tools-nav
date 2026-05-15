"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  currentLang: string;
}

const LABELS: Record<string, string> = {
  zh: "EN",
  en: "中",
};

export default function LanguageSwitcher({ currentLang }: Props) {
  const pathname = usePathname();
  const otherLang = currentLang === "zh" ? "en" : "zh";

  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, "") || "/";
  const switchUrl = `/${otherLang}${pathWithoutLang}`;

  return (
    <Link
      href={switchUrl}
      className="inline-flex h-7 w-12 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600 transition hover:scale-105 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
      title={otherLang === "zh" ? "切换到中文" : "Switch to English"}
      aria-label={otherLang === "zh" ? "Switch to Chinese" : "切换到英文"}
    >
      {LABELS[currentLang]}
    </Link>
  );
}
