/** Bands the spectrum analyser reports, matching the classic 19-bar display. */
export const BAND_COUNT = 19;

export interface PlaybackHandles {
  element: HTMLAudioElement;
  analyser: AnalyserNode;
  gain: GainNode;
  panner: StereoPannerNode;
}

let handles: PlaybackHandles | null = null;
let context: AudioContext | null = null;

/**
 * One graph for the whole session: element → gain → panner → analyser → out.
 * Recreating it per track would drop the analyser and click on every switch.
 */
export function ensureGraph(element: HTMLAudioElement): PlaybackHandles {
  if (handles) return handles;

  context = new AudioContext();
  const source = context.createMediaElementSource(element);
  const gain = context.createGain();
  const panner = context.createStereoPanner();
  const analyser = context.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.72;

  source.connect(gain).connect(panner).connect(analyser);
  analyser.connect(context.destination);

  handles = { element, analyser, gain, panner };
  return handles;
}

/** Browsers suspend the context until a gesture; every play path calls this. */
export async function unlock(): Promise<void> {
  if (context?.state === "suspended") await context.resume();
}

const FADE_S = 0.06;

/** Ramps instead of jumping: a hard gain change is audible as a click. */
export function setVolume(value: number): void {
  if (!handles || !context) return;
  const target = Math.min(Math.max(value, 0), 1);
  handles.gain.gain.cancelScheduledValues(context.currentTime);
  handles.gain.gain.setTargetAtTime(target, context.currentTime, FADE_S);
}

export function setBalance(value: number): void {
  if (!handles || !context) return;
  handles.panner.pan.setTargetAtTime(
    Math.min(Math.max(value, -1), 1),
    context.currentTime,
    FADE_S,
  );
}

/** Mutes across the seek so the discontinuity is never heard. */
export async function seekTo(seconds: number): Promise<void> {
  if (!handles || !context) return;
  const { gain, element } = handles;
  const level = gain.gain.value;
  gain.gain.setTargetAtTime(0, context.currentTime, 0.02);
  element.currentTime = seconds;
  gain.gain.setTargetAtTime(level, context.currentTime + 0.05, FADE_S);
}

export function analyserNode(): AnalyserNode | null {
  return handles?.analyser ?? null;
}

export function disposeGraph(): void {
  void context?.close();
  context = null;
  handles = null;
}
