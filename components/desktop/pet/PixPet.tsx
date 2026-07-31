"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PixSprite } from "@/components/desktop/pet/PixSprite";
import { findSkin } from "@/core/pet/pet-skins";
import { canSpeak, pickLine, SPEECH_VISIBLE_MS } from "@/core/pet/pet-speech";
import { PET_SIZE, PetState } from "@/core/pet/pet-types";
import { usePetEngine } from "@/hooks/use-pet-engine";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useT } from "@/hooks/use-translations";
import { usePetStore } from "@/stores/pet-store";

const DOUBLE_CLICK_MS = 320;

export function PixPet() {
  const enabled = usePetStore((store) => store.enabled);
  const friendship = usePetStore((store) => store.friendship);
  const addFriendship = usePetStore((store) => store.addFriendship);
  const skinId = usePetStore((store) => store.skinId);
  const reducedMotion = useReducedMotion();
  const t = useT();
  const [line, setLine] = useState<string | null>(null);
  const lastClickAt = useRef(0);
  const dragging = useRef(false);

  const speak = useCallback((state: PetState) => {
    const store = usePetStore.getState();
    if (!canSpeak(store.lastSpokeAt, Date.now())) return;
    store.markSpoke();
    setLine(pickLine(state, store.friendship));
    window.setTimeout(() => setLine(null), SPEECH_VISIBLE_MS);
  }, []);

  const { frame, trigger, makeDizzy, setPosition } = usePetEngine({
    reducedMotion,
    onSpeak: speak,
  });

  useEffect(() => {
    if (!dragging.current) return;
    const onMove = (event: PointerEvent) => {
      setPosition({
        x: event.clientX - PET_SIZE.width / 2,
        y: event.clientY - PET_SIZE.height / 2,
      });
    };
    const onUp = () => {
      dragging.current = false;
      makeDizzy();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  });

  if (!enabled || frame.state === PetState.Hide) return null;

  const skin = findSkin(skinId);

  const onPointerDown = (event: React.PointerEvent) => {
    event.stopPropagation();
    const now = Date.now();
    const isDouble = now - lastClickAt.current < DOUBLE_CLICK_MS;
    lastClickAt.current = now;
    dragging.current = true;
    addFriendship(isDouble ? 2 : 1);
    trigger(isDouble ? PetState.Jump : PetState.Wave, isDouble ? 1.2 : 1.6);
  };

  return (
    <div
      role="img"
      aria-label={t("pix.aria", { friendship })}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          addFriendship(1);
          trigger(PetState.Wave, 1.6);
        }
      }}
      className="absolute z-[40] cursor-pointer touch-none focus-visible:outline-1 focus-visible:outline-white focus-visible:outline-dotted"
      style={{
        width: PET_SIZE.width,
        height: PET_SIZE.height,
        transform: `translate3d(${frame.position.x}px, ${frame.position.y}px, 0) scaleX(${frame.facing})`,
        willChange: "transform",
      }}
    >
      {line && (
        <div
          className="animate-fade-in absolute -top-9 left-1/2 w-max max-w-[170px] -translate-x-1/2 rounded-[6px] border border-[#767676] bg-[#ffffe1] px-2 py-1 text-[11px] text-black shadow-[1px_1px_5px_rgba(0,0,0,0.35)] motion-reduce:animate-none"
          style={{ transform: `translateX(-50%) scaleX(${frame.facing})` }}
        >
          {t(line)}
          <span
            aria-hidden="true"
            className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r border-b border-[#767676] bg-[#ffffe1]"
          />
        </div>
      )}
      <PixSprite frame={frame} skin={skin} reducedMotion={reducedMotion} />
    </div>
  );
}
