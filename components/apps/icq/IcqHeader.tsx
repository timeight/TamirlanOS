import { PixStatus } from "@/core/icq/chat-types";

interface IcqHeaderProps {
  status: PixStatus;
}

const LABEL: Record<PixStatus, string> = {
  [PixStatus.Online]: "в сети",
  [PixStatus.Away]: "отошёл",
  [PixStatus.Typing]: "печатает…",
  [PixStatus.Sleeping]: "спит",
  [PixStatus.Listening]: "слушает музыку",
  [PixStatus.Exploring]: "изучает систему",
  [PixStatus.Thinking]: "думает",
};

const DOT: Record<PixStatus, string> = {
  [PixStatus.Online]: "#3fae3f",
  [PixStatus.Away]: "#e0a63c",
  [PixStatus.Typing]: "#3fae3f",
  [PixStatus.Sleeping]: "#8a93a0",
  [PixStatus.Listening]: "#7f5fd4",
  [PixStatus.Exploring]: "#2f79d0",
  [PixStatus.Thinking]: "#2f79d0",
};

export function IcqHeader({ status }: IcqHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-2.5 border-b border-[#b9cbe0] bg-gradient-to-b from-[#e9f1fa] to-[#d3e2f2] px-3 py-2">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#a8bed6] bg-white font-mono text-[11px] text-[#2c4a6b]"
      >
        {status === PixStatus.Sleeping ? "-_-" : "^_^"}
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-bold text-[#1e3a5c]">PIX</span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#5b6b7d]">
          <span
            aria-hidden="true"
            className="inline-block h-[7px] w-[7px] rounded-full"
            style={{ background: DOT[status] }}
          />
          {LABEL[status]}
        </span>
      </span>
    </header>
  );
}
