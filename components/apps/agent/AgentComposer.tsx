"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { cn } from "@/core/utils/cn";

interface AgentComposerProps {
  value: string;
  avatarSrc: string;
  labels: {
    text: string;
    sms: string;
    placeholder: string;
    send: string;
    changePhoto: string;
  };
  onChange: (value: string) => void;
  onSend: () => void;
}

const FORMAT_BUTTONS = [
  { glyph: "«»", className: "font-serif" },
  { glyph: "T", className: "font-bold text-[#2b6cb0]" },
  { glyph: "ABC", className: "text-[9px] text-[#3fa64a]" },
  { glyph: "A", className: "font-bold text-[#c0392b] italic" },
  { glyph: "A", className: "font-bold text-[#c0392b] underline" },
  { glyph: "✎", className: "text-[#8a6d3b]" },
  { glyph: "Ж", className: "font-bold" },
  { glyph: "К", className: "font-bold italic" },
  { glyph: "Ч", className: "font-bold underline" },
] as const;

const EMOJI = ["🙂", "😄", "😉", "👍", "🔥"] as const;

export function AgentComposer({
  value,
  avatarSrc,
  labels,
  onChange,
  onSend,
}: AgentComposerProps) {
  return (
    <div className="shrink-0 border-t border-[#8fbde4] bg-[#dcecfb]">
      <div className="flex items-end gap-0 px-2 pt-1">
        <span className="rounded-t-[4px] border border-b-0 border-[#8fbde4] bg-white px-4 py-0.5 text-[11px] font-bold text-[#1c4e80]">
          {labels.text}
        </span>
        <span className="rounded-t-[4px] border border-b-0 border-[#a9cdec] bg-[#cbe2f6] px-4 py-0.5 text-[11px] text-[#5a7d9c]">
          {labels.sms}
        </span>
      </div>

      <div className="flex gap-1.5 border-t border-[#8fbde4] bg-white p-1.5">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-0.5 border-b border-[#dbe9f5] pb-1">
            {FORMAT_BUTTONS.map((button, index) => (
              <span
                key={`${button.glyph}-${index}`}
                aria-hidden="true"
                className={cn(
                  "flex h-5 min-w-[20px] items-center justify-center rounded-[3px] px-1 text-[12px] text-[#333] hover:bg-[#e6f1fc]",
                  button.className,
                )}
              >
                {button.glyph}
              </span>
            ))}
            <span className="mx-1 h-4 w-px bg-[#dbe9f5]" />
            {EMOJI.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onChange(value + emoji)}
                aria-label={emoji}
                className="rounded-[3px] px-0.5 text-[14px] hover:bg-[#e6f1fc] focus-visible:bg-[#e6f1fc] focus-visible:outline-none"
              >
                {emoji}
              </button>
            ))}
          </div>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            placeholder={labels.placeholder}
            rows={3}
            className="mt-1 block w-full resize-none rounded-[2px] bg-white px-1 text-[13px] text-black outline-none placeholder:text-[#9aa0a6]"
          />
        </div>

        <div className="hidden w-[104px] shrink-0 flex-col items-center gap-1 border-l border-[#dbe9f5] pl-1.5 @[440px]:flex">
          <Image
            src={avatarSrc}
            alt=""
            width={88}
            height={70}
            unoptimized
            className="h-[70px] w-[88px] rounded-[2px] border border-[#a9cdec] object-cover"
          />
          <span className="text-[10px] text-[#2b6cb0] underline">
            {labels.changePhoto}
          </span>
        </div>
      </div>
    </div>
  );
}
