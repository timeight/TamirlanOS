"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface LoadingMessagesProps {
  messages: readonly string[];
  intervalMs: number;
}

export function LoadingMessages({
  messages,
  intervalMs,
}: LoadingMessagesProps) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || messages.length < 2) return;
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % messages.length),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [intervalMs, messages.length, reducedMotion]);

  return (
    <p
      role="status"
      key={index}
      className="animate-fade-in h-4 text-center text-[12px] text-white/70 motion-reduce:animate-none sm:text-[13px]"
    >
      {messages[index]}
    </p>
  );
}
