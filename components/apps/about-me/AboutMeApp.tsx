"use client";

import {
  Counter,
  PhotoSlot,
  Reveal,
  SectionTitle,
} from "@/components/apps/about-me/DossierParts";
import {
  DIAGNOSTICS,
  GEAR,
  MEMORY_WALL,
  ROLE_CARDS,
  TECH_DNA,
  TERMINAL_LINES,
  TIMELINE,
  WORKSPACE_TAGS,
} from "@/core/about/dossier";

export function AboutMeApp() {
  return (
    <div className="@container h-full overflow-auto bg-[#060a10] text-[#c7d6e2]">
      <div className="mx-auto max-w-[900px] px-5 py-7">
        <Reveal>
          <header className="mb-8">
            <h1 className="font-mono text-[clamp(28px,7vw,52px)] leading-none tracking-[0.06em] text-white">
              PERSON<span className="text-[#5fd4ff]">.DAT</span>
            </h1>
            <p className="mt-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#5f8db0] uppercase">
              status
              <span className="inline-flex items-center gap-1.5 text-[#5ff85f]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#5ff85f] motion-safe:animate-[blink_1.4s_step-end_infinite]" />
                online
              </span>
            </p>
          </header>
        </Reveal>

        <div className="mb-10 grid gap-4 @[560px]:grid-cols-[minmax(0,260px)_1fr]">
          <Reveal>
            <div>
              <PhotoSlot
                label="your portrait"
                caption="SCANNING…"
                scanning
                className="aspect-[3/4]"
              />
              <dl className="mt-2 grid grid-cols-2 gap-x-3 font-mono text-[9px] text-[#3f5d78]">
                <div className="flex justify-between">
                  <dt>ID</dt>
                  <dd className="text-[#5f8db0]">TZ-001</dd>
                </div>
                <div className="flex justify-between">
                  <dt>QUALITY</dt>
                  <dd className="text-[#5f8db0]">
                    <Counter to={98} suffix="%" />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>SIGNAL</dt>
                  <dd className="text-[#5f8db0]">
                    <Counter to={94} suffix="%" />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>SRC</dt>
                  <dd className="text-[#5f8db0]">LOCAL</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <ul className="grid grid-cols-2 gap-2 self-start @[720px]:grid-cols-3">
            {ROLE_CARDS.map((role, index) => (
              <li key={role.id}>
                <Reveal delay={index * 70}>
                  <article className="group h-full border border-[#1c2836] bg-[#0a1119] p-3 transition-[translate,border-color,box-shadow] duration-150 hover:-translate-y-0.5 hover:border-[#2f6f9e] hover:shadow-[0_6px_20px_rgba(0,0,0,0.5)] motion-reduce:transition-none">
                    <span
                      aria-hidden="true"
                      className="mb-2 block h-6 w-6 border border-[#2f6f9e] bg-[#0e1a26] transition-colors duration-150 group-hover:bg-[#14293b]"
                    />
                    <h3 className="font-mono text-[11px] tracking-[0.14em] text-[#9fd8ff]">
                      {role.label}
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-4 text-[#6b8299]">
                      {role.note}
                    </p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <section className="mb-10">
          <SectionTitle index="02" title="system information" />
          <dl className="border border-[#1c2836] bg-[#0a1119]">
            {DIAGNOSTICS.map((row, index) => (
              <Reveal key={row.key} delay={index * 50}>
                <div className="flex flex-wrap gap-x-4 border-b border-[#141f2b] px-3 py-2 last:border-0">
                  <dt className="w-[130px] shrink-0 font-mono text-[10px] tracking-[0.18em] text-[#3f5d78]">
                    {row.key}
                  </dt>
                  <dd className="min-w-0 flex-1 text-[12px] text-[#d8e6f2]">
                    {row.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>

        <section className="mb-10">
          <SectionTitle index="03" title="tech dna" />
          <ul className="space-y-1.5">
            {TECH_DNA.map((entry, index) => (
              <li key={entry.name}>
                <Reveal delay={index * 45}>
                  <div className="flex items-center gap-3">
                    <span className="w-[130px] shrink-0 truncate font-mono text-[11px] text-[#9fd8ff]">
                      {entry.name}
                    </span>
                    <span
                      className="flex gap-[3px]"
                      aria-label={`${entry.level} из 10`}
                    >
                      {Array.from({ length: 10 }, (_, cell) => (
                        <span
                          key={cell}
                          className={
                            cell < entry.level
                              ? "h-3 w-2 bg-[#5fd4ff] shadow-[0_0_6px_rgba(95,212,255,0.5)]"
                              : "h-3 w-2 bg-[#16232f]"
                          }
                        />
                      ))}
                    </span>
                    <span className="ml-auto font-mono text-[9px] text-[#3f5d78]">
                      c {entry.since}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <SectionTitle index="04" title="timeline" />
          <ol className="flex gap-3 overflow-x-auto pb-2">
            {TIMELINE.map((point, index) => (
              <li key={point.year} className="min-w-[128px] flex-1">
                <Reveal delay={index * 60}>
                  <div className="group border-t-2 border-[#1c2836] pt-2 transition-colors duration-200 hover:border-[#5fd4ff] motion-reduce:transition-none">
                    <p className="font-mono text-[15px] text-[#5fd4ff] transition-[text-shadow] duration-200 group-hover:[text-shadow:0_0_12px_rgba(95,212,255,0.6)]">
                      {point.year}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#d8e6f2]">
                      {point.title}
                    </p>
                    <p className="text-[11px] leading-4 text-[#6b8299]">
                      {point.note}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-10">
          <SectionTitle index="05" title="workspace" />
          <Reveal>
            <PhotoSlot label="workspace photo" className="aspect-[16/7]" />
          </Reveal>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {WORKSPACE_TAGS.map((tag) => (
              <li
                key={tag}
                className="border border-[#22384c] px-2 py-0.5 font-mono text-[10px] text-[#5f8db0]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <SectionTitle index="06" title="current gear" />
          <ul className="grid grid-cols-2 gap-2 @[640px]:grid-cols-4">
            {GEAR.map((item, index) => (
              <li key={item.id}>
                <Reveal delay={index * 60}>
                  <div className="transition-transform duration-150 hover:-translate-y-1 motion-reduce:transition-none">
                    <PhotoSlot
                      label={item.label}
                      caption={item.caption}
                      className="aspect-square"
                    />
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <SectionTitle index="07" title="current project" />
          <Reveal>
            <article className="border border-[#22384c] bg-gradient-to-b from-[#0c1621] to-[#080d14] p-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <h3 className="font-mono text-[22px] text-white">TamirlanOS</h3>
                <span className="border border-[#2f8a4f] px-2 py-[1px] font-mono text-[9px] tracking-[0.2em] text-[#5ff85f]">
                  ACTIVE
                </span>
              </div>
              <p className="mt-2 max-w-[52ch] text-[12px] leading-[1.7] text-[#98adc0]">
                Операционная система вместо портфолио. Она загружается, помнит
                посетителя и живёт своей жизнью, пока её никто не смотрит.
              </p>
              <pre className="mt-3 overflow-x-auto border border-[#16232f] bg-[#050a0f] p-3 font-mono text-[10px] leading-[1.7] text-[#5ff85f]">
                {TERMINAL_LINES.join("\n")}
                <span className="ml-1 inline-block h-3 w-1.5 bg-[#5ff85f] align-middle motion-safe:animate-[blink_1s_step-end_infinite]" />
              </pre>
            </article>
          </Reveal>
        </section>

        <section className="mb-12">
          <SectionTitle index="08" title="memory wall" />
          <ul className="grid grid-cols-2 gap-3 @[640px]:grid-cols-3">
            {MEMORY_WALL.map((slot, index) => (
              <li key={slot.id}>
                <Reveal delay={index * 50}>
                  <div
                    style={{ rotate: `${slot.tilt}deg` }}
                    className="bg-[#e9e6dc] p-2 pb-6 shadow-[0_6px_18px_rgba(0,0,0,0.55)] transition-[rotate,box-shadow] duration-200 hover:rotate-0 hover:shadow-[0_14px_34px_rgba(0,0,0,0.7)] motion-reduce:transition-none"
                  >
                    <PhotoSlot label={slot.label} className="aspect-square" />
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <Reveal>
          <section className="border-t border-[#1c2836] py-14 text-center">
            <p className="mx-auto max-w-[16ch] text-[clamp(24px,6vw,44px)] leading-[1.15] font-light tracking-tight text-white">
              Create software people remember.
            </p>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
