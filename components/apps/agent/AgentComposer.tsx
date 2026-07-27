"use client";

interface AgentComposerProps {
  value: string;
  placeholder: string;
  sendLabel: string;
  statusLabel: string;
  textLabel: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

const EMOJI = ["🙂", "😄", "😉", "👍", "🔥", "🙈"] as const;

export function AgentComposer({
  value,
  placeholder,
  sendLabel,
  statusLabel,
  textLabel,
  onChange,
  onSend,
}: AgentComposerProps) {
  return (
    <div className="border-t border-[#a9cdec] bg-[#eaf4ff]">
      <div className="flex items-center gap-1 border-b border-[#cbe0f4] px-2 py-1">
        {EMOJI.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(value + emoji)}
            className="rounded-[3px] px-1 text-[15px] hover:bg-[#d3e7fb] focus-visible:bg-[#d3e7fb] focus-visible:outline-none"
            aria-label={emoji}
          >
            {emoji}
          </button>
        ))}
        <span className="ml-auto rounded-t-[3px] border border-b-0 border-[#a9cdec] bg-white px-3 py-0.5 text-[11px] font-bold text-[#2b6cb0]">
          {textLabel}
        </span>
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
        placeholder={placeholder}
        rows={3}
        className="block w-full resize-none bg-white px-3 py-2 text-[13px] text-black outline-none placeholder:text-[#9aa0a6]"
      />
      <div className="flex items-center justify-between gap-2 px-2 py-1.5">
        <span className="truncate text-[11px] text-[#6b7785]">
          {statusLabel}
        </span>
        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim()}
          className="rounded-[3px] border border-[#2b6cb0] bg-gradient-to-b from-[#7cc0f5] to-[#3f8ed6] px-4 py-1 text-[12px] font-bold text-white shadow-sm hover:brightness-105 disabled:cursor-default disabled:opacity-45 disabled:hover:brightness-100"
        >
          {sendLabel}
        </button>
      </div>
    </div>
  );
}
