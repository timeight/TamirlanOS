"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { siteConfig } from "@/core/config/site";
import { SOCIAL_LINKS } from "@/core/config/social";
import { BIO_SECTIONS, SKILLS, SOFTWARE } from "./about-content";

const EMAIL = "tamirlanzhamalov@gmail.com";
const CARD_ACCENTS = ["#a78bfa", "#60a5fa", "#2dd4bf"];

export function AboutMeApp() {
  const [intro, ...rest] = BIO_SECTIONS;

  return (
    <div className="h-full overflow-auto bg-[#0e0e13] text-slate-200">
      <div
        className="px-5 pt-6 pb-7 text-white"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #2e1065 0%, #1e1b4b 45%, #0b0b13 100%)",
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Image
            src={siteConfig.avatarSrc}
            alt="Портрет Тамирлана"
            width={82}
            height={82}
            unoptimized
            className="rounded-2xl border border-white/20 shadow-lg ring-2 ring-[#a78bfa]/40"
          />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">Тамирлан Жамалов</h1>
            <p className="text-[12px] text-white/70">
              Разработчик · AI-инженер · 3D-художник · моушн-дизайнер ·
              преподаватель
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-white/80">
                Казахстан · 25 лет
              </span>
              <a
                href={`mailto:${EMAIL}`}
                className="rounded-full bg-white/10 px-2.5 py-1 text-white/80 hover:bg-white/20"
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
              className="flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-[11px] text-white/85 transition-colors hover:bg-white/20"
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
          <p className="text-[13px] leading-5 text-slate-300">{intro.body}</p>
        )}

        <section>
          <h2 className="mb-2 text-[11px] font-bold tracking-[0.12em] text-[#a78bfa] uppercase">
            Навыки
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-[#2a2a35] bg-[#181820] px-2.5 py-1 text-[11px] text-slate-300"
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
              className="rounded-xl border border-l-4 border-[#26262f] bg-[#16161d] p-4"
              style={{ borderLeftColor: CARD_ACCENTS[index] ?? "#a78bfa" }}
            >
              <h3 className="mb-1 text-sm font-bold text-slate-100">
                {section.heading}
              </h3>
              <p className="text-[12px] leading-5 text-slate-400">
                {section.body}
              </p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-2 text-[11px] font-bold tracking-[0.12em] text-[#a78bfa] uppercase">
            Программы
          </h2>
          <div className="flex flex-wrap gap-2">
            {SOFTWARE.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-[#2a2a35] bg-[#181820] px-2.5 py-1 text-[11px] text-slate-400"
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
