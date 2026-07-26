"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/core/utils/cn";

const COLORS = [
  "#000000",
  "#7f7f7f",
  "#e2482f",
  "#f2b71f",
  "#3aa94f",
  "#2f7fd8",
  "#8a3ab9",
  "#7a5636",
  "#ffffff",
  "#ff8fb1",
];

const SIZES = [2, 5, 10, 18];

export function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [eraser, setEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const toCanvas = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const stroke = (to: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = eraser ? "#ffffff" : color;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    const from = last.current ?? to;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(to.x, to.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    last.current = to;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const swatch =
    "h-5 w-5 rounded-sm border border-[#8a8676] focus-visible:outline-2 focus-visible:outline-[#316ac5]";

  return (
    <div className="flex h-full flex-col bg-[#ece9d8] text-[11px] text-black">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#aca899] p-2">
        <div className="flex flex-wrap gap-1">
          {COLORS.map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`Цвет ${value}`}
              onClick={() => {
                setColor(value);
                setEraser(false);
              }}
              className={cn(
                swatch,
                color === value && !eraser && "ring-2 ring-[#316ac5]",
              )}
              style={{ background: value }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          {SIZES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSize(value)}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-sm border border-[#8a8676] bg-white",
                size === value && "ring-2 ring-[#316ac5]",
              )}
            >
              <span
                className="rounded-full bg-black"
                style={{ width: value, height: value }}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setEraser((on) => !on)}
          className={cn(
            "rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-2 py-1",
            eraser && "ring-2 ring-[#316ac5]",
          )}
        >
          Ластик
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#ecebe5] px-2 py-1"
        >
          Очистить
        </button>
      </div>
      <div className="min-h-0 flex-1 p-2">
        <canvas
          ref={canvasRef}
          width={1000}
          height={700}
          className="h-full w-full touch-none rounded-sm border border-[#8a8676] bg-white"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            drawing.current = true;
            last.current = null;
            stroke(toCanvas(event));
          }}
          onPointerMove={(event) => {
            if (drawing.current) stroke(toCanvas(event));
          }}
          onPointerUp={() => {
            drawing.current = false;
            last.current = null;
          }}
          onPointerLeave={() => {
            drawing.current = false;
            last.current = null;
          }}
        />
      </div>
    </div>
  );
}
