"use client";

import { useEffect, useRef, useState } from "react";
import {
  createWorld,
  MAX_HP,
  PLAYER_RADIUS,
  updateWorld,
  type Input,
  type World,
} from "@/core/games/shooter";
import { AchievementId } from "@/core/achievements/catalog";
import { useAchievement } from "@/hooks/use-achievement";
import { useT } from "@/hooks/use-translations";

const WIDTH = 480;
const HEIGHT = 340;
const MOVE_KEYS: Record<string, keyof Input> = {
  w: "up",
  ArrowUp: "up",
  s: "down",
  ArrowDown: "down",
  a: "left",
  ArrowLeft: "left",
  d: "right",
  ArrowRight: "right",
};

export function ShooterApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World>(createWorld(WIDTH, HEIGHT));
  const keys = useRef<Set<keyof Input>>(new Set());
  const pointer = useRef({ x: WIDTH / 2, y: 0, down: false, touch: false });
  const [over, setOver] = useState(false);
  const [hud, setHud] = useState({ score: 0, wave: 1 });
  const t = useT();

  useAchievement(AchievementId.Sharpshooter, hud.wave >= 5);

  const restart = () => {
    worldRef.current = createWorld(WIDTH, HEIGHT);
    setOver(false);
    setHud({ score: 0, wave: 1 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const key = MOVE_KEYS[event.key];
      if (key) {
        keys.current.add(key);
        event.preventDefault();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const key = MOVE_KEYS[event.key];
      if (key) keys.current.delete(key);
    };
    const toCanvas = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) * WIDTH) / rect.width,
        y: ((clientY - rect.top) * HEIGHT) / rect.height,
      };
    };
    const onDown = (event: PointerEvent) => {
      const p = toCanvas(event.clientX, event.clientY);
      pointer.current = {
        x: p.x,
        y: p.y,
        down: true,
        touch: event.pointerType === "touch",
      };
    };
    const onMove = (event: PointerEvent) => {
      const p = toCanvas(event.clientX, event.clientY);
      pointer.current.x = p.x;
      pointer.current.y = p.y;
      if (event.pointerType === "touch") pointer.current.touch = true;
    };
    const onUp = () => {
      pointer.current.down = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    let raf = 0;
    let last = performance.now();
    let wasOver = false;
    let lastScore = -1;
    let lastWave = -1;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const world = worldRef.current;
      const pt = pointer.current;

      let aimX = pt.x;
      let aimY = pt.y;
      if (pt.touch) {
        let best = Infinity;
        for (const enemy of world.enemies) {
          const d = Math.hypot(
            enemy.x - world.player.x,
            enemy.y - world.player.y,
          );
          if (d < best) {
            best = d;
            aimX = enemy.x;
            aimY = enemy.y;
          }
        }
      }
      const input: Input = {
        up: keys.current.has("up"),
        down: keys.current.has("down"),
        left: keys.current.has("left"),
        right: keys.current.has("right"),
        aimX,
        aimY,
        firing: pt.down,
        follow: pt.touch && pt.down ? { x: pt.x, y: pt.y } : null,
      };
      updateWorld(world, input, dt);
      if (world.over !== wasOver) {
        wasOver = world.over;
        setOver(world.over);
      }
      if (world.score !== lastScore || world.wave !== lastWave) {
        lastScore = world.score;
        lastWave = world.wave;
        setHud({ score: world.score, wave: world.wave });
      }
      render(ctx, world);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div className="flex h-full flex-col items-center gap-2 bg-[#12141a] p-3 text-slate-200 select-none">
      <div className="flex w-full max-w-[480px] items-center justify-between text-[12px]">
        <span>
          {t("shooter.score")}: <b>{hud.score}</b>
        </span>
        <span>
          {t("shooter.wave")} <b>{hud.wave}</b>
        </span>
        <button
          type="button"
          onClick={restart}
          className="rounded-[3px] border border-[#3a3f4b] bg-[#232833] px-2 py-1 text-[11px] hover:brightness-125"
        >
          {t("mine.new")}
        </button>
      </div>
      <div className="relative w-full max-w-[480px]">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="w-full touch-none rounded-md border border-[#2a2f3a] bg-[#1a1e27]"
        />
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-md bg-black/70">
            <p className="text-xl font-bold text-white">{t("shooter.over")}</p>
            <p className="text-[13px] text-slate-300">
              {t("shooter.score")}: {hud.score}
            </p>
            <button
              type="button"
              onClick={restart}
              className="rounded-[3px] border border-[#3a3f4b] bg-[#232833] px-4 py-1.5 text-[12px] text-white hover:brightness-125"
            >
              {t("mine.new")}
            </button>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400">{t("shooter.hint")}</p>
    </div>
  );
}

function render(ctx: CanvasRenderingContext2D, world: World): void {
  ctx.clearRect(0, 0, world.w, world.h);
  ctx.fillStyle = "#1a1e27";
  ctx.fillRect(0, 0, world.w, world.h);
  ctx.strokeStyle = "#232833";
  ctx.lineWidth = 1;
  for (let x = 0; x < world.w; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, world.h);
    ctx.stroke();
  }
  for (let y = 0; y < world.h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(world.w, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#f2c14e";
  for (const bullet of world.bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const enemy of world.enemies) {
    ctx.fillStyle = enemy.hp > 1 ? "#c0392b" : "#e0574a";
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI * 2);
    ctx.fill();
  }

  const { player } = world;
  ctx.strokeStyle = "#7fd3ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(
    player.x + Math.cos(player.aim) * 22,
    player.y + Math.sin(player.aim) * 22,
  );
  ctx.stroke();
  ctx.fillStyle = "#3d9be9";
  ctx.beginPath();
  ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2a2f3a";
  ctx.fillRect(10, world.h - 16, 120, 8);
  ctx.fillStyle = "#4ade80";
  ctx.fillRect(10, world.h - 16, 120 * Math.max(0, player.hp / MAX_HP), 8);
}
