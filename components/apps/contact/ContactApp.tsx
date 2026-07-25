"use client";

import { useEffect, useRef, useState } from "react";

const EMAIL = "tamirlanzhamalov@gmail.com";

export function ContactApp() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== undefined) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    if (resetTimer.current !== undefined) {
      window.clearTimeout(resetTimer.current);
    }
    resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col gap-3 bg-[#ece9d8] p-3 text-[11px] text-black">
      <div className="rounded-sm border border-[#aca899] bg-white p-3">
        <p className="text-[14px] font-bold text-[#003399]">Связаться</p>
        <p className="mt-1 leading-4 text-[#4a5a70]">
          Быстрее всего связаться со мной по email — я читаю всё, что приходит.
          Нахожусь в Казахстане; с удовольствием пообщаюсь на казахском, русском
          или английском.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-sm border border-[#aca899] bg-white p-3">
        <span className="flex-1 truncate font-mono text-[12px]">{EMAIL}</span>
        <a
          href={`mailto:${EMAIL}`}
          className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 text-black hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]"
        >
          Написать письмо
        </a>
        <button
          type="button"
          onClick={copyEmail}
          className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-3 py-1 hover:from-[#fff7e0] hover:to-[#f5e4b8] focus-visible:outline-2 focus-visible:outline-[#f0a63c] active:from-[#e0ded5] active:to-[#efeee9]"
        >
          {copied ? "Скопировано" : "Копировать адрес"}
        </button>
      </div>
      <p role="status" className="sr-only">
        {copied ? "Адрес email скопирован в буфер обмена" : ""}
      </p>
    </div>
  );
}
