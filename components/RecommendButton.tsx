"use client";

interface Props {
  onClick: () => void;
  isOpen: boolean;
  openLabel?: string;
  closeLabel?: string;
}

export default function RecommendButton({
  onClick,
  isOpen,
  openLabel = "打开 AI 推荐",
  closeLabel = "关闭 AI 推荐",
}: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-canvas shadow-lg transition-all hover:scale-105 hover:opacity-90"
      aria-label={isOpen ? closeLabel : openLabel}
    >
      {isOpen ? (
        <svg suppressHydrationWarning width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        <svg suppressHydrationWarning width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  );
}
