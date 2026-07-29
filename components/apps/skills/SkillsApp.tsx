"use client";

import { useState } from "react";
import { SKILL_KEYS, yearsOfUse } from "@/core/skills/registry";
import { cn } from "@/core/utils/cn";
import { useIsCompact } from "@/hooks/use-compact";

const ROOT = "HKEY_CURRENT_USER\\Software\\TamirlanOS\\Skills";

export function SkillsApp() {
  const [openId, setOpenId] = useState(SKILL_KEYS[0]!.id);
  const compact = useIsCompact();
  const now = new Date().getFullYear();
  const active = SKILL_KEYS.find((key) => key.id === openId) ?? SKILL_KEYS[0]!;

  return (
    <div className="@container flex h-full flex-col bg-[#ece9d8] text-[11px] text-black select-none">
      <div className="flex min-h-0 flex-1 gap-0">
        <nav
          className={cn(
            "shrink-0 overflow-auto border-r border-[#aca899] bg-white py-1",
            compact ? "w-[132px]" : "w-[176px]",
          )}
          aria-label="Разделы навыков"
        >
          <p className="flex items-center gap-1 px-1.5 py-0.5 font-bold">
            <FolderIcon open />
            Skills
          </p>
          {SKILL_KEYS.map((key) => {
            const selected = key.id === active.id;
            return (
              <button
                key={key.id}
                type="button"
                onClick={() => setOpenId(key.id)}
                aria-current={selected}
                className={cn(
                  "flex w-full items-center gap-1 py-0.5 pr-1 pl-4 text-left focus-visible:outline-1 focus-visible:outline-[#316ac5]",
                  selected
                    ? "bg-[#316ac5] text-white"
                    : "hover:bg-[#d8e6f7] hover:text-black",
                )}
              >
                <FolderIcon open={selected} />
                <span className="truncate">{key.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex shrink-0 border-b border-[#d4d0c8] bg-[#f4f3ee] font-bold">
            <span className="flex-1 border-r border-[#d4d0c8] px-2 py-1">
              Имя
            </span>
            <span className="hidden w-[150px] border-r border-[#d4d0c8] px-2 py-1 @[420px]:block">
              Значение
            </span>
            <span className="w-[74px] px-2 py-1 text-right">Стаж</span>
          </div>
          <ul className="min-h-0 flex-1 overflow-auto">
            {active.values.map((value) => (
              <li
                key={value.name}
                className="flex items-center border-b border-[#f0efe9] hover:bg-[#eaf2fc]"
              >
                <span className="flex flex-1 items-center gap-1.5 truncate px-2 py-1">
                  <ValueIcon />
                  {value.name}
                </span>
                <span className="hidden w-[150px] truncate px-2 py-1 text-[#4a5a70] @[420px]:block">
                  {value.data}
                </span>
                <span className="w-[74px] px-2 py-1 text-right text-[#4a5a70] tabular-nums">
                  {value.since ? `${yearsOfUse(value.since, now)} г.` : "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex shrink-0 items-stretch gap-0.5 border-t border-[#f6f4ec] p-0.5 text-[10px] text-[#4a4a3a]">
        <span className="flex-1 truncate border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
          {ROOT}\{active.label}
        </span>
        <span className="border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
          {active.values.length}
        </span>
      </div>
    </div>
  );
}

function FolderIcon({ open = false }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 16 14" aria-hidden="true" className="h-3.5 w-4 shrink-0">
      <path
        d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3.2l1.4 1.6h6.4A1.5 1.5 0 0 1 15 4.1V11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 11Z"
        fill={open ? "#f5c95b" : "#ecc158"}
        stroke="#a67c1e"
        strokeWidth="0.8"
      />
      {open && <path d="M2 12.4 4.6 6.4h11L13 12.4Z" fill="#fadb8e" />}
    </svg>
  );
}

function ValueIcon() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3 shrink-0">
      <rect
        x="1"
        y="1.5"
        width="10"
        height="9"
        rx="1"
        fill="#fff"
        stroke="#7f9db9"
        strokeWidth="0.9"
      />
      <path d="M3 4.5h6M3 6.5h6M3 8.5h4" stroke="#316ac5" strokeWidth="0.9" />
    </svg>
  );
}
