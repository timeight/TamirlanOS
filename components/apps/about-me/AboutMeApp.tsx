"use client";

import { useCallback, useState } from "react";
import { Reveal } from "@/components/apps/about-me/DossierParts";
import {
  CurrentProject,
  ProfileTimeline,
  QuoteCard,
  RoleCards,
  TechStack,
} from "@/components/apps/about-me/ProfileBody";
import {
  ProfileBoot,
  bootAlreadyPlayed,
} from "@/components/apps/about-me/ProfileBoot";
import { ProfileHero } from "@/components/apps/about-me/ProfileHero";
import { ProfileSidebar } from "@/components/apps/about-me/ProfileSidebar";
import { cn } from "@/core/utils/cn";

export function AboutMeApp() {
  const [booting, setBooting] = useState(() => !bootAlreadyPlayed());
  const finish = useCallback(() => setBooting(false), []);

  return (
    <div className="@container relative flex h-full min-h-0 bg-[#050a0f]">
      {booting && <ProfileBoot onDone={finish} />}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(#1c3346 1px, transparent 1px), linear-gradient(90deg, #1c3346 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#5fd4ff]/[0.05] to-transparent motion-safe:animate-[scan-sweep_9s_linear_infinite]"
      />

      <ProfileSidebar />

      <div
        className={cn(
          "relative min-w-0 flex-1 overflow-auto transition-opacity duration-300 motion-reduce:transition-none",
          booting ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="space-y-7 px-5 py-6">
          <ProfileHero />

          <Reveal>
            <RoleCards />
          </Reveal>

          <div className="grid gap-6 @[720px]:grid-cols-3">
            <Reveal>
              <TechStack />
            </Reveal>
            <Reveal delay={80}>
              <CurrentProject />
            </Reveal>
            <div className="space-y-6">
              <Reveal delay={140}>
                <ProfileTimeline />
              </Reveal>
              <Reveal delay={200}>
                <QuoteCard />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
