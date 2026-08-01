"use client";

import { useEffect, useState } from "react";
import { NAV_ITEMS, PIX_LINES, QUICK_LINKS } from "@/core/about/profile";
import { OS_VERSION } from "@/core/system/runtime-managers";
import { cn } from "@/core/utils/cn";

const START = Date.now();

function uptime(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  return `${Math.floor(minutes / 60)}ч ${minutes % 60}м`;
}

export function ProfileSidebar() {
  const [active, setActive] = useState(NAV_ITEMS[0]!.id);
  const [elapsed, setElapsed] = useState(0);
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setElapsed(Date.now() - START),
      30_000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside className="hidden w-[196px] shrink-0 flex-col gap-3 border-r border-[#16232f] bg-[#080d13] p-3 @[720px]:flex">
      <nav>
        <p className="mb-2 font-mono text-[10px] tracking-[0.22em] text-[#3f5d78] uppercase">
          Навигация
        </p>
        <ul className="space-y-px">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActive(item.id)}
                className={cn(
                  "w-full rounded-[3px] px-2 py-1.5 text-left text-[11px] transition-colors duration-150 motion-reduce:transition-none",
                  active === item.id
                    ? "bg-[#132433] text-[#9fd8ff]"
                    : "text-[#6b8299] hover:bg-[#0e1a26] hover:text-[#9fd8ff]",
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[#16232f] pt-3">
        <p className="mb-2 font-mono text-[10px] tracking-[0.22em] text-[#3f5d78] uppercase">
          Быстрые ссылки
        </p>
        <ul className="space-y-px">
          {QUICK_LINKS.map((link) => (
            <li
              key={link.id}
              className="px-2 py-1 text-[11px] text-[#6b8299] transition-colors duration-150 hover:text-[#9fd8ff] motion-reduce:transition-none"
            >
              {link.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[#16232f] pt-3">
        <p className="mb-2 font-mono text-[10px] tracking-[0.22em] text-[#3f5d78] uppercase">
          Система
        </p>
        <dl className="space-y-0.5 font-mono text-[10px] text-[#5f8db0]">
          <div>TamirlanOS v{OS_VERSION}</div>
          <div>Build 2026.07.31</div>
          <div>Uptime {uptime(elapsed)}</div>
          <div>User: Visitor</div>
        </dl>
      </div>

      <div
        onMouseEnter={() =>
          setGreeting(
            PIX_LINES[Math.floor(Math.random() * PIX_LINES.length)] ?? null,
          )
        }
        onMouseLeave={() => setGreeting(null)}
        className="relative mt-auto border border-[#16232f] bg-[#050a0f] p-3"
      >
        {greeting && (
          <p className="absolute -top-2 right-2 left-2 rounded-sm border border-[#22384c] bg-[#0e1a26] px-2 py-1 text-[10px] text-[#9fd8ff]">
            {greeting}
          </p>
        )}
        <span
          aria-hidden="true"
          className="mx-auto block h-12 w-10 rounded-[4px] border border-[#2f6f9e] bg-[#0e1a26] motion-safe:animate-[desktop-breathe_5s_ease-in-out_infinite]"
        />
        <p className="mt-2 text-center font-mono text-[9px] tracking-[0.18em] text-[#3f5d78]">
          PIX
        </p>
      </div>
    </aside>
  );
}
