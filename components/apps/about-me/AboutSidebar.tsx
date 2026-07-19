"use client";

import Image from "next/image";

import { SKILLS, SOCIAL_LINKS, SOFTWARE } from "./about-content";

interface SidebarPanelProps {
  title: string;
  children: React.ReactNode;
}

function SidebarPanel({ title, children }: SidebarPanelProps) {
  return (
    <details
      open
      className="overflow-hidden rounded-[3px] border border-[#7ba0d9] bg-[#d3e5fa]"
    >
      <summary className="cursor-pointer bg-gradient-to-b from-[#5a8ee0] to-[#3a6fce] px-2 py-1 text-[11px] font-bold text-white select-none">
        {title}
      </summary>
      <div className="p-2">{children}</div>
    </details>
  );
}

export function AboutSidebar() {
  return (
    <nav className="flex w-full shrink-0 flex-col gap-2 overflow-auto bg-gradient-to-b from-[#7aa4e8] to-[#5484d6] p-2 @sm:w-[176px]">
      <SidebarPanel title="Social Links">
        <ul className="space-y-1.5">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-[2px] px-1 py-0.5 text-[11px] text-[#0b3d91] hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-[#f0a63c]"
              >
                <Image
                  src={link.icon}
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                />
                <span className="underline">{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Skills">
        <ul className="space-y-1">
          {SKILLS.map((skill) => (
            <li
              key={skill}
              className="flex items-center gap-2 text-[11px] text-[#0b3d91]"
            >
              <span className="size-2 shrink-0 rotate-45 rounded-[1px] bg-[#3a6fce]" />
              {skill}
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Software">
        <ul className="space-y-1">
          {SOFTWARE.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-[11px] text-[#0b3d91]"
            >
              <span className="size-2 shrink-0 rounded-[1px] bg-[#e0812c]" />
              {item}
            </li>
          ))}
        </ul>
      </SidebarPanel>
    </nav>
  );
}
