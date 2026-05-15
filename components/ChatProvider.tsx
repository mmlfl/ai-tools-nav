"use client";

import { useState } from "react";
import RecommendButton from "@/components/RecommendButton";
import RecommendChat from "@/components/RecommendChat";

export interface ChatLabels {
  title?: string;
  intro?: string;
  placeholder?: string;
  send?: string;
  error?: string;
  closeLabel?: string;
  openLabel?: string;
  closeChatLabel?: string;
}

interface Props {
  chatLabels?: ChatLabels;
}

export default function ChatProvider({ chatLabels }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <RecommendButton
        onClick={() => setIsOpen((v) => !v)}
        isOpen={isOpen}
        openLabel={chatLabels?.openLabel}
        closeLabel={chatLabels?.closeChatLabel}
      />
      <RecommendChat
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        labels={chatLabels}
      />
    </>
  );
}
