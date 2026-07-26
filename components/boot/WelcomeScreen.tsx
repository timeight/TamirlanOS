"use client";

import { useTimeout } from "@/hooks/use-timeout";
import { useT } from "@/hooks/use-translations";
import { useSystemStore } from "@/stores/system-store";

const MESSAGE_STAGGER_MS = 450;
const WELCOME_DURATION_MS = 2400;

export function WelcomeScreen() {
  const advanceBoot = useSystemStore((state) => state.advanceBoot);
  const t = useT();
  const MESSAGES = [t("boot.welcome"), t("boot.ready"), t("boot.preparing")];

  useTimeout(advanceBoot, WELCOME_DURATION_MS);

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center text-white"
      style={{
        background:
          "linear-gradient(180deg, #7a99e1 0%, #5f7fd0 50%, #4a69be 100%)",
      }}
    >
      {MESSAGES.map((message, index) => (
        <p
          key={message}
          style={{
            animationDelay: `${index * MESSAGE_STAGGER_MS}ms`,
            ...(index === 0 && {
              fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
              textShadow: "2px 2px 4px rgba(0, 20, 90, 0.6)",
            }),
          }}
          className={
            index === 0
              ? "animate-fade-in text-3xl font-bold italic motion-reduce:animate-none sm:text-5xl"
              : "animate-fade-in text-sm text-white/85 motion-reduce:animate-none"
          }
        >
          {message}
        </p>
      ))}
    </div>
  );
}
