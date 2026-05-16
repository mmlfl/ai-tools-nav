"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatLabels {
  title?: string;
  intro?: string;
  placeholder?: string;
  send?: string;
  error?: string;
  closeLabel?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  labels?: ChatLabels;
}

export default function RecommendChat({ isOpen, onClose, labels }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const query = input.trim();
    if (!query || streaming) return;
    setInput("");
    setStreaming(true);

    const userMsg: Message = { role: "user", content: query };
    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    try {
      const res = await fetch(`${API_URL}/api/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const text = parsed.token ?? parsed.error ?? "";
              if (text) {
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = {
                    ...copy[copy.length - 1],
                    content: copy[copy.length - 1].content + text,
                  };
                  return copy;
                });
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: labels?.error ?? "抱歉，推荐服务暂时不可用，请稍后再试。",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }, [input, streaming]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex w-96 flex-col rounded-2xl border border-hairline bg-surface shadow-2xl">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          {labels?.title ?? "AI 工具推荐"}
        </h3>
        <button
          onClick={onClose}
          className="text-muted hover:text-foreground"
          aria-label={labels?.closeLabel ?? "关闭"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="h-80 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted">
            {labels?.intro ??
              "告诉我你想做什么，我帮你推荐最适合的 AI 工具。\n比如：「我想做一个产品宣传视频」"}
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm whitespace-pre-wrap ${
              msg.role === "user"
                ? "ml-8 rounded-lg bg-surface-elevated px-3 py-2"
                : "mr-8"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {streaming && messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-1 text-muted text-sm">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-hairline px-4 py-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={labels?.placeholder ?? "描述你的需求..."}
            disabled={streaming}
            className="flex-1 rounded-lg border border-hairline bg-canvas px-3 py-2 text-sm text-foreground outline-none focus:border-muted"
          />
          <button
            onClick={sendMessage}
            disabled={streaming || !input.trim()}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 px-3 py-2 text-sm text-white transition-colors hover:from-blue-600 hover:to-violet-600 disabled:opacity-40 shadow-sm shadow-blue-200 dark:shadow-blue-900/30"
          >
            {labels?.send ?? "发送"}
          </button>
        </div>
      </div>
    </div>
  );
}
