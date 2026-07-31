import { BAND_COUNT } from "@/core/audio/playback-engine";

export enum VisualizerMode {
  Spectrum = "spectrum",
  Oscilloscope = "oscilloscope",
  Off = "off",
}

export interface SpectrumFrame {
  /** Band levels 0–1, low to high frequency. */
  bands: Float32Array;
  /** Peak caps that fall slowly, as the original did. */
  peaks: Float32Array;
}

const PEAK_FALL = 0.012;
/** Logarithmic bin edges: linear FFT bins would put everything in one bar. */
const EDGES = Array.from({ length: BAND_COUNT + 1 }, (_, i) =>
  Math.round(Math.pow(i / BAND_COUNT, 2.1) * 190),
);

export function createFrame(): SpectrumFrame {
  return {
    bands: new Float32Array(BAND_COUNT),
    peaks: new Float32Array(BAND_COUNT),
  };
}

/**
 * Folds the FFT into 19 logarithmic bands in place. Allocation-free: this runs
 * every animation frame and must not create garbage.
 */
export function readSpectrum(
  analyser: AnalyserNode,
  buffer: Uint8Array<ArrayBuffer>,
  frame: SpectrumFrame,
): void {
  analyser.getByteFrequencyData(buffer);

  for (let band = 0; band < BAND_COUNT; band++) {
    const start = EDGES[band] ?? 0;
    const end = Math.max(EDGES[band + 1] ?? start + 1, start + 1);
    let sum = 0;
    for (let bin = start; bin < end; bin++) sum += buffer[bin] ?? 0;

    const level = Math.min(sum / (end - start) / 210, 1);
    const previous = frame.bands[band] ?? 0;
    // Rises instantly, falls smoothly — the asymmetry is what reads as "Winamp".
    frame.bands[band] =
      level > previous ? level : previous * 0.82 + level * 0.18;

    const peak = frame.peaks[band] ?? 0;
    frame.peaks[band] =
      frame.bands[band]! > peak
        ? frame.bands[band]!
        : Math.max(peak - PEAK_FALL, 0);
  }
}

/** Waveform in −1…1, decimated to the width the oscilloscope draws. */
export function readWaveform(
  analyser: AnalyserNode,
  buffer: Uint8Array<ArrayBuffer>,
  out: Float32Array,
): void {
  analyser.getByteTimeDomainData(buffer);
  const step = buffer.length / out.length;
  for (let i = 0; i < out.length; i++) {
    out[i] = ((buffer[Math.floor(i * step)] ?? 128) - 128) / 128;
  }
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  return `${String(minutes).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
