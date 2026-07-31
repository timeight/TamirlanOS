"use client";

import { PageId } from "@/core/browser/pages";
import { useT } from "@/hooks/use-translations";

interface HomePageProps {
  onNavigate: (url: string) => void;
}

const LINKS: readonly { id: PageId; label: string }[] = [
  { id: PageId.Github, label: "GitHub" },
  { id: PageId.LinkedIn, label: "LinkedIn" },
  { id: PageId.Instagram, label: "Instagram" },
  { id: PageId.Telegram, label: "Telegram" },
  { id: PageId.Contact, label: "E-mail" },
  { id: PageId.Photography, label: "Photography" },
  { id: PageId.Resume, label: "Resume" },
  { id: PageId.Projects, label: "Projects" },
  { id: PageId.AiLab, label: "AI Lab" },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const t = useT();

  return (
    <div className="bg-white pb-6">
      <div
        className="flex items-center gap-4 px-6 py-6 text-white"
        style={{
          background:
            "linear-gradient(180deg, #2f6fd0 0%, #1a56b8 55%, #10408f 100%)",
        }}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-[26px]">
          <GlobeMark />
        </span>
        <div>
          <p className="text-[22px] leading-tight font-bold">Tamirlan Online</p>
          <p className="text-[12px] text-white/85">{t("ie.home.sub")}</p>
        </div>
      </div>

      <div className="px-6 py-5">
        <p className="text-[15px] font-bold text-[#003399]">
          {t("ie.home.welcome")}
        </p>
        <p className="mt-1 max-w-[560px] text-[12px] leading-5 text-[#333]">
          {t("ie.home.body")}
        </p>

        <p className="mt-5 mb-2 border-b border-[#c8d8ea] pb-1 text-[12px] font-bold text-[#003399]">
          {t("ie.home.quickLinks")}
        </p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1 @sm:grid-cols-3">
          {LINKS.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => onNavigate(link.id)}
                className="text-[12px] text-[#0000ee] underline hover:text-[#cc0000] focus-visible:outline-1 focus-visible:outline-[#316ac5] focus-visible:outline-dotted"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[11px] text-[#7a8390]">{t("ie.home.tip")}</p>
      </div>
    </div>
  );
}

function GlobeMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 3 2.6 15 0 18M12 3c-2.6 3-2.6 15 0 18M4.6 7h14.8M4.6 17h14.8" />
    </svg>
  );
}
