"use client";

interface PillButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function PillButton({ active, onClick, children }: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/30"
          : "bg-zinc-100 text-zinc-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-950 dark:hover:text-blue-400"
      }`}
    >
      {children}
    </button>
  );
}
