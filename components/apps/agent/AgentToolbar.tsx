"use client";

interface AgentToolbarProps {
  onRestart: () => void;
  onHelp: () => void;
  archiveLabel: string;
  profileLabel: string;
  menuLabel: string;
}

const ROUND_BUTTONS = [
  { glyph: "✓", bg: "#3fa64a", label: "ok" },
  { glyph: "◉", bg: "#3d8fd6", label: "status" },
  { glyph: "↻", bg: "#5aa8e0", label: "refresh" },
  { glyph: "▤", bg: "#7b8fa6", label: "save" },
  { glyph: "▦", bg: "#4a90c8", label: "history" },
  { glyph: "☺", bg: "#e0a83f", label: "contacts" },
] as const;

export function AgentToolbar({
  onRestart,
  onHelp,
  archiveLabel,
  profileLabel,
  menuLabel,
}: AgentToolbarProps) {
  return (
    <div className="flex items-center gap-1.5 border-b border-[#8fbde4] bg-gradient-to-b from-[#eaf5ff] to-[#c9e3f8] px-2 py-1.5">
      {ROUND_BUTTONS.map((button) => (
        <span
          key={button.label}
          aria-hidden="true"
          className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white/70 text-[11px] text-white shadow-sm"
          style={{ background: button.bg }}
        >
          {button.glyph}
        </span>
      ))}
      <div className="ml-auto flex items-center gap-1">
        <ToolbarTab onClick={onRestart}>{archiveLabel}</ToolbarTab>
        <ToolbarTab onClick={onHelp}>{profileLabel}</ToolbarTab>
        <ToolbarTab onClick={onHelp}>{menuLabel}</ToolbarTab>
      </div>
    </div>
  );
}

function ToolbarTab({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[3px] border border-[#8fbde4] bg-gradient-to-b from-white to-[#dceefc] px-3 py-0.5 text-[11px] text-[#1c4e80] hover:brightness-105 focus-visible:outline-1 focus-visible:outline-[#2b6cb0]"
    >
      {children}
    </button>
  );
}
