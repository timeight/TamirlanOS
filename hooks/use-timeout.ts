"use client";

import { useEffect, useRef } from "react";

export function useTimeout(callback: () => void, delayMs: number): void {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = window.setTimeout(() => saved.current(), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs]);
}
