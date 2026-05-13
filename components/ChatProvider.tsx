"use client";

import { useState } from "react";
import RecommendButton from "@/components/RecommendButton";
import RecommendChat from "@/components/RecommendChat";

export default function ChatProvider() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <RecommendButton onClick={() => setIsOpen((v) => !v)} isOpen={isOpen} />
      <RecommendChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
