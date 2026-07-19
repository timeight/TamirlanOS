"use client";

import Image from "next/image";

import { siteConfig } from "@/core/config/site";

import { AboutSidebar } from "./AboutSidebar";
import { BIO_SECTIONS } from "./about-content";

const EMAIL = "tamirlanzhamalov@gmail.com";

export function AboutMeApp() {
  return (
    <div className="flex h-full flex-col bg-[#ece9d8] text-[11px] text-black @sm:flex-row">
      <AboutSidebar />
      <div className="flex-1 overflow-auto bg-white p-4">
        <div className="mb-4 flex items-center gap-3 border-b border-[#c9d3e0] pb-3">
          <Image
            src={siteConfig.avatarSrc}
            alt="Portrait of Tamirlan"
            width={56}
            height={56}
            unoptimized
            className="rounded-md border border-[#aca899]"
          />
          <div>
            <p className="text-[20px] font-bold text-[#0b3d91]">
              Tamirlan Zhamalov
            </p>
            <p className="text-[#4a5a70]">
              Software Developer · AI Engineer · 3D Artist · Motion Designer ·
              Teacher
            </p>
            <p className="text-[#4a5a70]">Kazakhstan · 25</p>
            <a href={`mailto:${EMAIL}`} className="text-[#0046d5] underline">
              {EMAIL}
            </a>
          </div>
        </div>
        {BIO_SECTIONS.map((section) => (
          <section key={section.heading} className="mb-4">
            <p className="mb-1 font-bold text-[#003399]">{section.heading}</p>
            <p className="leading-4">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
