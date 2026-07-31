"use client";

import { useState } from "react";
import { DiscardedIcon } from "@/components/apps/recycle-bin/DiscardedIcon";
import { DISCARDED_ITEMS, RECYCLE_TOTAL_SIZE } from "@/core/recycle/discarded";
import { cn } from "@/core/utils/cn";
import { useT } from "@/hooks/use-translations";

export function RecycleBinApp() {
  const [openId, setOpenId] = useState(DISCARDED_ITEMS[0]!.id);
  const t = useT();
  const active =
    DISCARDED_ITEMS.find((item) => item.id === openId) ?? DISCARDED_ITEMS[0]!;

  return (
    <div className="@container flex h-full flex-col bg-white text-[11px] text-black">
      <div className="shrink-0 border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2">
        <p className="text-[13px] font-bold text-[#003399]">
          {t("bin.heading")}
        </p>
        <p className="mt-0.5 leading-4 text-[#4a5a70]">{t("bin.intro")}</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col @[520px]:flex-row">
        <ul className="shrink-0 overflow-auto border-b border-[#d4d0c8] @[520px]:w-[212px] @[520px]:border-r @[520px]:border-b-0">
          {DISCARDED_ITEMS.map((item) => {
            const selected = item.id === active.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  aria-current={selected}
                  className={cn(
                    "flex w-full items-center gap-2 px-2 py-1.5 text-left focus-visible:outline-1 focus-visible:outline-[#316ac5]",
                    selected ? "bg-[#316ac5] text-white" : "hover:bg-[#e6f0fb]",
                  )}
                >
                  <DiscardedIcon kind={item.kind} className="h-7 w-7" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{item.name}</span>
                    <span
                      className={cn(
                        "block truncate text-[10px]",
                        selected ? "text-white/75" : "text-[#7a8390]",
                      )}
                    >
                      {item.year} · {item.size}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="min-h-0 flex-1 overflow-auto p-3">
          <div className="flex items-center gap-2.5">
            <DiscardedIcon kind={active.kind} className="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold">{active.name}</p>
              <p className="text-[10px] text-[#7a8390]">
                {t(`bin.kind.${active.kind}`)} · {active.year}
              </p>
            </div>
          </div>

          <Field label={t("bin.what")}>{active.what}</Field>
          <Field label={t("bin.why")}>{active.why}</Field>

          <div className="mt-3 rounded-[3px] border border-l-4 border-[#c8d8ea] border-l-[#2f8a1c] bg-[#f4faf2] p-2.5">
            <p className="mb-1 text-[10px] font-bold tracking-wide text-[#2f6b1c] uppercase">
              {t("bin.learned")}
            </p>
            <p className="leading-[1.6] text-[#22341d]">{active.learned}</p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-stretch gap-0.5 border-t border-[#f6f4ec] bg-[#ece9d8] p-0.5 text-[10px] text-[#4a4a3a]">
        <span className="flex-1 truncate border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
          {t("bin.objects", { count: DISCARDED_ITEMS.length })}
        </span>
        <span className="border border-[#c3bfa8] px-2 py-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.05)]">
          {RECYCLE_TOTAL_SIZE}
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <p className="mb-0.5 text-[10px] font-bold tracking-wide text-[#5a6470] uppercase">
        {label}
      </p>
      <p className="leading-[1.6] text-[#1a1a1a]">{children}</p>
    </div>
  );
}
