"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { useState } from "react";
import { siteConfig } from "@/core/config/site";
import { cn } from "@/core/utils/cn";

interface ArtPiece {
  src: string;
  title: string;
  note: string;
}

const GALLERY: readonly ArtPiece[] = [
  {
    src: "/assets/wallpapers/meadow.svg",
    title: "Луг",
    note: "Обои по умолчанию — зелёные холмы, тёплое солнце, нарисованы вручную в SVG.",
  },
  {
    src: siteConfig.avatarSrc,
    title: "Портрет",
    note: "Аватар входа в тёплой палитре системы.",
  },
  {
    src: "/assets/icons/portfolio.svg",
    title: "Портфель",
    note: "Иконка проводника портфолио в стиле начала 2000-х.",
  },
  {
    src: "/assets/icons/photography.svg",
    title: "Камера",
    note: "Иконка этого приложения — глянцевый объектив и всё такое.",
  },
  {
    src: "/assets/icons/gallery-3d.svg",
    title: "Изометрический куб",
    note: "Знак 3D-галереи, три фиолетовые грани.",
  },
  {
    src: "/assets/icons/ideas.svg",
    title: "Лампочка",
    note: "Иконка блокнота идей в момент свечения.",
  },
  {
    src: "/assets/icons/certificates.svg",
    title: "Печать и лента",
    note: "Иконка сертификатов с золотой печатью.",
  },
  {
    src: "/assets/icons/shutdown.svg",
    title: "Питание",
    note: "Самая уважаемая кнопка в любой операционной системе.",
  },
];

export function PhotographyApp() {
  const [index, setIndex] = useState(0);
  const piece = GALLERY[index] ?? GALLERY[0];

  return (
    <div className="flex h-full flex-col bg-white text-[11px] text-black">
      <div className="border-b border-[#aca899] bg-[#ebf3fb] px-3 py-2">
        <p className="text-[13px] font-bold text-[#003399]">
          Fujifilm X-T2 · XF 35mm F2
        </p>
        <p className="text-[#4a5a70]">
          Стрит, портрет и кинематографичная съёмка — плёночные симуляции и
          цветокоррекция. Реальные снимки скоро; пока — собственная графика
          системы.
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col @sm:flex-row">
        <ul className="flex w-full shrink-0 gap-1 overflow-auto border-b border-[#aca899] bg-[#ebf3fb] p-1.5 @sm:w-[104px] @sm:flex-col @sm:border-r @sm:border-b-0">
          {GALLERY.map((item, itemIndex) => (
            <li key={item.src} className="shrink-0 @sm:w-full">
              <button
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-label={item.title}
                className={cn(
                  "flex w-full items-center justify-center rounded-sm border bg-white p-1.5",
                  itemIndex === index
                    ? "border-[#316ac5] ring-1 ring-[#316ac5]"
                    : "border-[#aca899] hover:border-[#7da2ce]",
                )}
              >
                <Image
                  src={item.src}
                  alt=""
                  width={64}
                  height={48}
                  unoptimized
                  draggable={false}
                  className="h-12 w-16 object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
        {piece && (
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 items-center justify-center bg-[#f4f6f9] p-3">
              <Image
                src={piece.src}
                alt={piece.title}
                width={420}
                height={280}
                unoptimized
                draggable={false}
                className="max-h-full max-w-full rounded-sm border border-[#aca899] bg-white object-contain p-2"
              />
            </div>
            <div className="flex items-center gap-2 border-t border-[#aca899] bg-[#ebf3fb] px-3 py-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() =>
                  setIndex((index + GALLERY.length - 1) % GALLERY.length)
                }
                className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-2.5 py-0.5 hover:from-[#fff7e0] hover:to-[#f5e4b8] active:from-[#e0ded5] active:to-[#efeee9]"
              >
                ◀
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => setIndex((index + 1) % GALLERY.length)}
                className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-2.5 py-0.5 hover:from-[#fff7e0] hover:to-[#f5e4b8] active:from-[#e0ded5] active:to-[#efeee9]"
              >
                ▶
              </button>
              <p className="min-w-0 flex-1 truncate">
                <span className="font-bold">{piece.title}</span>
                <span className="text-[#4a5a70]"> — {piece.note}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
