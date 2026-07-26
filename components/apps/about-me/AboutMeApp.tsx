"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { siteConfig } from "@/core/config/site";
import { SOCIAL_LINKS } from "@/core/config/social";
import { BIO_SECTIONS, SKILLS, SOFTWARE } from "./about-content";

const EMAIL = "tamirlanzhamalov@gmail.com";
const CARD_ACCENTS = ["#7c3aed", "#2563eb", "#0d9488"];

export function AboutMeApp() {
  const [intro, ...rest] = BIO_SECTIONS;

  return (
    <div className="h-full overflow-auto bg-gradient-to-b from-[#f7f8fc] to-[#eceef6] text-slate-800">
      <div className="bg-gradient-to-br from-[#6d28d9] via-[#4f46e5] to-[#2563eb] px-5 pt-6 pb-7 text-white">
        <div className="flex flex-wrap items-center gap-4">
          <Image
            src={siteConfig.avatarSrc}
            alt="Портрет Тамирлана"
            width={82}
            height={82}
            unoptimized
            className="rounded-2xl border-2 border-white/70 shadow-lg"
          />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">Тамирлан Жамалов</h1>
            <p className="text-[12px] text-white/85">
              Разработчик · AI-инженер · 3D-художник · моушн-дизайнер ·
              преподаватель
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-white/15 px-2.5 py-1">
                Казахстан · 25 лет
              </span>
              <a
                href={`mailto:${EMAIL}`}
                className="rounded-full bg-white/15 px-2.5 py-1 hover:bg-white/25"
              >
                {EMAIL}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11px] backdrop-blur transition-colors hover:bg-white/25"
            >
              <Image
                src={link.icon}
                alt=""
                width={16}
                height={16}
                unoptimized
                draggable={false}
              />
              {link.name}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-6 p-5">
        {intro && (
          <p className="text-[13px] leading-5 text-slate-700">{intro.body}</p>
        )}

        <section>
          <h2 className="mb-2 text-[11px] font-bold tracking-[0.12em] text-[#6d28d9] uppercase">
            Навыки
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-3 @lg:grid-cols-3">
          {rest.map((section, index) => (
            <div
              key={section.heading}
              className="rounded-xl border border-l-4 border-slate-200 bg-white p-4 shadow-sm"
              style={{ borderLeftColor: CARD_ACCENTS[index] ?? "#6d28d9" }}
            >
              <h3 className="mb-1 text-sm font-bold text-slate-800">
                {section.heading}
              </h3>
              <p className="text-[12px] leading-5 text-slate-600">
                {section.body}
              </p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-2 text-[11px] font-bold tracking-[0.12em] text-[#6d28d9] uppercase">
            Программы
          </h2>
          <div className="flex flex-wrap gap-2">
            {SOFTWARE.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
