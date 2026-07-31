"use client";

import { useEffect } from "react";

/** Any key or pointer press jumps past the current boot screen. */
export function useSkipBoot(skip: () => void): void {
  useEffect(() => {
    const handler = () => skip();
    window.addEventListener("keydown", handler);
    window.addEventListener("pointerdown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("pointerdown", handler);
    };
  }, [skip]);
}
