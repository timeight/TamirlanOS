"use client";

import type { ReactNode } from "react";

interface WindowContentProps {
  children?: ReactNode;
}

export function WindowContent({ children }: WindowContentProps) {
  return (
    <div className="@container flex-1 overflow-auto bg-white text-slate-900">
      {children}
    </div>
  );
}
