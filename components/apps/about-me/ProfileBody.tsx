"use client";

import { Reveal } from "@/components/apps/about-me/DossierParts";
import {
  PROJECT,
  QUOTE,
  ROLE_CARDS,
  TECH_STACK,
  TIMELINE,
} from "@/core/about/profile";

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mb-3 font-mono text-[12px] tracking-[0.24em] text-[#5ff85f] uppercase">
      {children}
    </h2>
  );
}

export function RoleCards() {
  return (
    <ul className="grid gap-3 @[560px]:grid-cols-3">
      {ROLE_CARDS.map((card, index) => (
        <li key={card.id}>
          <Reveal delay={index * 80}>
            <article
              style={{ borderColor: `${card.accent}33` }}
              className="group h-full border bg-[#0a1119] p-3 transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.6)] motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                style={{ borderColor: card.accent, color: card.accent }}
                className="mb-2 flex h-8 w-8 items-center justify-center border font-mono text-[13px] transition-shadow duration-200 group-hover:shadow-[0_0_14px_currentColor] motion-reduce:transition-none"
              >
                ◆
              </span>
              <h3
                style={{ color: card.accent }}
                className="font-mono text-[12px] tracking-[0.12em]"
              >
                {card.title}
              </h3>
              <p className="mt-1.5 text-[11px] leading-[1.6] text-[#8ea3b8]">
                {card.body}
              </p>
              <p className="mt-2 font-mono text-[10px] text-[#4d6b85]">
                {card.stack.join(" • ")}
              </p>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function TechStack() {
  return (
    <div>
      <Heading>Стек технологий</Heading>
      <ul className="flex flex-wrap gap-1.5">
        {TECH_STACK.map((tag) => (
          <li
            key={tag}
            className="rounded-[4px] border border-[#22384c] bg-[#0a1119] px-2.5 py-1 text-[11px] text-[#8ea3b8] transition-[color,border-color,box-shadow] duration-150 hover:border-[#5fd4ff] hover:text-[#9fd8ff] hover:shadow-[0_0_10px_rgba(95,212,255,0.25)] motion-reduce:transition-none"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CurrentProject() {
  return (
    <div>
      <Heading>Сейчас работаю над</Heading>
      <article className="group border border-[#22384c] bg-[#0a1119] p-3">
        <p className="font-mono text-[12px] text-[#9fd8ff]">
          <span className="text-[#5ff85f]">&gt;</span> {PROJECT.name}
          <span className="ml-1 inline-block h-3 w-[6px] bg-[#5ff85f] align-middle motion-safe:animate-[blink_1.1s_step-end_infinite] group-hover:motion-safe:animate-[blink_0.4s_step-end_infinite]" />
        </p>
        <p className="mt-2 text-[11px] leading-[1.6] text-[#8ea3b8]">
          {PROJECT.body}
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-[#5ff85f]">
          STATUS: {PROJECT.status}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="h-2 flex-1 overflow-hidden bg-[#0e1a26]">
            <span
              style={{ width: `${PROJECT.progress}%` }}
              className="block h-full bg-gradient-to-r from-[#2f8a4f] to-[#5ff85f] transition-[width] duration-[1200ms] ease-out motion-reduce:transition-none"
            />
          </span>
          <span className="font-mono text-[10px] text-[#5ff85f] tabular-nums">
            {PROJECT.progress}%
          </span>
        </div>
      </article>
    </div>
  );
}

export function ProfileTimeline() {
  return (
    <div>
      <Heading>TIMELINE.EXE</Heading>
      <ol className="space-y-2">
        {TIMELINE.map((entry, index) => (
          <li key={entry.year}>
            <Reveal delay={index * 60}>
              <div className="group flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full bg-[#2f8a4f] transition-shadow duration-200 group-hover:bg-[#5ff85f] group-hover:shadow-[0_0_10px_#5ff85f] motion-reduce:transition-none"
                />
                <span className="w-[42px] shrink-0 font-mono text-[12px] text-[#9fd8ff]">
                  {entry.year}
                </span>
                <span className="min-w-0 text-[11px] leading-[1.6] text-[#8ea3b8]">
                  {entry.text}
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function QuoteCard() {
  return (
    <div>
      <Heading>Цитата дня</Heading>
      <blockquote className="border border-[#22384c] bg-[#0a1119] p-3">
        <span
          aria-hidden="true"
          className="font-serif text-[22px] text-[#5ff85f]"
        >
          &ldquo;
        </span>
        <p className="mt-1 text-[12px] leading-[1.7] text-[#d8e6f2]">
          {QUOTE.text}
        </p>
        <footer className="mt-2 font-mono text-[11px] text-[#5f8db0]">
          — {QUOTE.author}
        </footer>
      </blockquote>
    </div>
  );
}
