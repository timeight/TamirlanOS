"use client";

import { useEffect, useRef } from "react";
import {
  VisualizerMode,
  createFrame,
  readSpectrum,
  readWaveform,
} from "@/core/audio/fft-analyzer";
import { BAND_COUNT, analyserNode } from "@/core/audio/playback-engine";

interface WinampVisualizerProps {
  mode: VisualizerMode;
  active: boolean;
  onCycle: () => void;
}

const WIDTH = 76;
const HEIGHT = 32;

export function WinampVisualizer({
  mode,
  active,
  onCycle,
}: WinampVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // Paused or hidden: stop the loop entirely rather than draw idle frames.
    if (!active || mode === VisualizerMode.Off) {
      context.fillStyle = "#000";
      context.fillRect(0, 0, WIDTH, HEIGHT);
      return;
    }

    const frame = createFrame();
    const bins = new Uint8Array(256);
    const wave = new Float32Array(WIDTH);
    let raf = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const analyser = analyserNode();
      context.fillStyle = "#000";
      context.fillRect(0, 0, WIDTH, HEIGHT);
      if (!analyser) return;

      if (mode === VisualizerMode.Spectrum) {
        readSpectrum(analyser, bins, frame);
        for (let band = 0; band < BAND_COUNT; band++) {
          const height = Math.round((frame.bands[band] ?? 0) * HEIGHT);
          const x = band * 4;
          const gradient = context.createLinearGradient(
            0,
            HEIGHT - height,
            0,
            HEIGHT,
          );
          gradient.addColorStop(0, "#5ff85f");
          gradient.addColorStop(0.5, "#d8e84a");
          gradient.addColorStop(1, "#2f9a2f");
          context.fillStyle = gradient;
          context.fillRect(x, HEIGHT - height, 3, height);

          const peak = Math.round((frame.peaks[band] ?? 0) * HEIGHT);
          context.fillStyle = "#c8c8c8";
          context.fillRect(x, HEIGHT - peak - 1, 3, 1);
        }
        return;
      }

      readWaveform(analyser, bins, wave);
      context.strokeStyle = "#5ff85f";
      context.beginPath();
      for (let x = 0; x < WIDTH; x++) {
        const y = HEIGHT / 2 - (wave[x] ?? 0) * (HEIGHT / 2 - 1);
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [mode, active]);

  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label="Режим визуализации"
      className="border border-[#1b1b1b] bg-black focus-visible:outline-1 focus-visible:outline-[#5ff85f]"
    >
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="block h-8 w-[76px]"
      />
    </button>
  );
}
