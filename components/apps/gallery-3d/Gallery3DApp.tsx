"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const FACES: readonly { icon: string; transform: string }[] = [
  {
    icon: "/assets/icons/about-me.svg",
    transform: "rotateY(0deg) translateZ(70px)",
  },
  {
    icon: "/assets/icons/projects.svg",
    transform: "rotateY(90deg) translateZ(70px)",
  },
  {
    icon: "/assets/icons/skills.svg",
    transform: "rotateY(180deg) translateZ(70px)",
  },
  {
    icon: "/assets/icons/contact.svg",
    transform: "rotateY(270deg) translateZ(70px)",
  },
  {
    icon: "/assets/icons/photography.svg",
    transform: "rotateX(90deg) translateZ(70px)",
  },
  {
    icon: "/assets/icons/ideas.svg",
    transform: "rotateX(-90deg) translateZ(70px)",
  },
];

export function Gallery3DApp() {
  const cubeRef = useRef<HTMLDivElement>(null);
  const rotation = useRef({ x: -24, y: 36 });

  const apply = () => {
    const cube = cubeRef.current;
    if (!cube) return;
    cube.style.transform = `rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`;
  };

  useEffect(apply, []);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const surface = event.currentTarget;
    surface.setPointerCapture(event.pointerId);
    let lastX = event.clientX;
    let lastY = event.clientY;

    const onMove = (move: PointerEvent) => {
      rotation.current.y += (move.clientX - lastX) * 0.5;
      rotation.current.x = Math.min(
        90,
        Math.max(-90, rotation.current.x - (move.clientY - lastY) * 0.5),
      );
      lastX = move.clientX;
      lastY = move.clientY;
      apply();
    };
    const finish = (end: PointerEvent) => {
      surface.releasePointerCapture(end.pointerId);
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerup", finish);
      surface.removeEventListener("pointercancel", finish);
    };
    surface.addEventListener("pointermove", onMove);
    surface.addEventListener("pointerup", finish);
    surface.addEventListener("pointercancel", finish);
  };

  return (
    <div className="flex h-full flex-col bg-white text-[11px] text-black">
      <div
        onPointerDown={startDrag}
        className="flex min-h-0 flex-1 cursor-grab touch-none items-center justify-center bg-[#f4f6f9] active:cursor-grabbing"
        style={{ perspective: "700px" }}
      >
        <div
          ref={cubeRef}
          className="relative h-[140px] w-[140px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {FACES.map((face) => (
            <div
              key={face.transform}
              className="absolute inset-0 flex items-center justify-center border-2 border-[#316ac5] bg-[#ebf3fb]/90"
              style={{ transform: face.transform }}
            >
              <Image
                src={face.icon}
                alt=""
                width={72}
                height={72}
                unoptimized
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      <p className="border-t border-[#aca899] bg-[#ebf3fb] px-3 py-2 text-[#4a5a70]">
        Model: <span className="font-bold text-black">TamirlanOS Core</span> —
        drag to rotate. Rendered with CSS 3D transforms, no libraries.
      </p>
    </div>
  );
}
