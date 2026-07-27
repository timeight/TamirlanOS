"use client";

import { AssetImage as Image } from "@/components/ui/AssetImage";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { CyberShell } from "@/components/apps/cyber/CyberShell";
import { siteConfig } from "@/core/config/site";
import { SOCIAL_LINKS } from "@/core/config/social";
import { BIO_SECTIONS, SKILLS, SOFTWARE } from "./about-content";

const EMAIL = "tamirlanzhamalov@gmail.com";

export function AboutMeApp() {
  const [intro, ...rest] = BIO_SECTIONS;

  return (
    <CyberShell heading="About Me" section="01 ABOUT">
      <div className="grid gap-6 @[520px]:grid-cols-[1fr_auto] @[520px]:items-start">
        <div className="space-y-4">
          <p className="text-cyber-cyan text-[11px] tracking-[0.2em]">
            PROFILE://
          </p>
          {intro && (
            <p className="text-[13px] leading-6 text-slate-300">{intro.body}</p>
          )}
          {rest.map((section) => (
            <div key={section.heading}>
              <p className="text-cyber-lime mb-1 text-[10px] tracking-[0.2em]">
                {section.heading.toUpperCase()}://
              </p>
              <p className="text-[12px] leading-5 text-slate-400">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <CornerFrame
          accent="#c6f24e"
          className="mx-auto w-fit rotate-[-2deg] bg-[#0d1524] p-2 shadow-[0_0_25px_rgba(95,212,255,0.12)]"
        >
          <Image
            src={siteConfig.avatarSrc}
            alt="Портрет Тамирлана"
            width={150}
            height={150}
            unoptimized
            className="block h-[150px] w-[150px] object-cover"
          />
          <p className="mt-1.5 text-[9px] tracking-[0.25em] text-slate-500">
            IMG://01 — PORTRAIT
          </p>
        </CornerFrame>
      </div>

      <Section label="SKILLS://">
        {SKILLS.map((skill) => (
          <Chip key={skill}>{skill}</Chip>
        ))}
      </Section>

      <Section label="SOFTWARE://">
        {SOFTWARE.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </Section>

      <div className="mt-8 border-t border-[#1b2740] pt-4">
        <p className="text-cyber-cyan mb-2 text-[11px] tracking-[0.2em]">
          CONNECT://
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[12px]">
          <a
            href={`mailto:${EMAIL}`}
            className="hover:text-cyber-lime text-slate-400"
          >
            &gt; {EMAIL}
          </a>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyber-lime text-slate-400"
            >
              &gt; {link.name}
            </a>
          ))}
        </div>
      </div>
    </CyberShell>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-7">
      <p className="text-cyber-cyan mb-2 text-[11px] tracking-[0.2em]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-[#22314f] bg-[#0e1626] px-2.5 py-1 text-[11px] text-slate-300">
      {children}
    </span>
  );
}
