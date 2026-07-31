export enum DayPhase {
  Dawn = "dawn",
  Morning = "morning",
  Afternoon = "afternoon",
  Sunset = "sunset",
  Dusk = "dusk",
  Night = "night",
}

export interface AmbientLight {
  /** Colour washed over the wallpaper. */
  tint: string;
  /** How strongly the wash is applied, 0–1. */
  strength: number;
  /** Extra darkening applied on top, 0–1. */
  shade: number;
}

interface PhaseStop {
  hour: number;
  phase: DayPhase;
  light: AmbientLight;
}

/**
 * Anchors, not buckets: the renderer interpolates between two neighbouring
 * stops so the light never jumps at the top of an hour.
 */
const STOPS: readonly PhaseStop[] = [
  {
    hour: 0,
    phase: DayPhase.Night,
    light: { tint: "#0b1430", strength: 0.42, shade: 0.3 },
  },
  {
    hour: 5,
    phase: DayPhase.Dawn,
    light: { tint: "#3a3560", strength: 0.3, shade: 0.16 },
  },
  {
    hour: 8,
    phase: DayPhase.Morning,
    light: { tint: "#ffd9a3", strength: 0.14, shade: 0 },
  },
  {
    hour: 13,
    phase: DayPhase.Afternoon,
    light: { tint: "#ffffff", strength: 0.04, shade: 0 },
  },
  {
    hour: 18,
    phase: DayPhase.Sunset,
    light: { tint: "#ff9c53", strength: 0.24, shade: 0.05 },
  },
  {
    hour: 21,
    phase: DayPhase.Dusk,
    light: { tint: "#1e2a55", strength: 0.34, shade: 0.2 },
  },
  {
    hour: 24,
    phase: DayPhase.Night,
    light: { tint: "#0b1430", strength: 0.42, shade: 0.3 },
  },
];

function mixHex(from: string, to: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1 = 0, g1 = 0, b1 = 0] = parse(from);
  const [r2 = 0, g2 = 0, b2 = 0] = parse(to);
  const channel = (a: number, b: number) =>
    Math.round(a + (b - a) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r1, r2)}${channel(g1, g2)}${channel(b1, b2)}`;
}

/** Fractional hour in, smoothly interpolated light out. */
export function lightAt(hour: number): AmbientLight {
  const clamped = Math.min(Math.max(hour, 0), 24);
  for (let i = 0; i < STOPS.length - 1; i++) {
    const from = STOPS[i]!;
    const to = STOPS[i + 1]!;
    if (clamped < from.hour || clamped > to.hour) continue;
    const span = to.hour - from.hour;
    const t = span === 0 ? 0 : (clamped - from.hour) / span;
    return {
      tint: mixHex(from.light.tint, to.light.tint, t),
      strength:
        from.light.strength + (to.light.strength - from.light.strength) * t,
      shade: from.light.shade + (to.light.shade - from.light.shade) * t,
    };
  }
  return STOPS[0]!.light;
}

export function phaseAt(hour: number): DayPhase {
  let current = STOPS[0]!.phase;
  for (const stop of STOPS) {
    if (hour >= stop.hour) current = stop.phase;
  }
  return current;
}

export function currentHour(now = new Date()): number {
  return now.getHours() + now.getMinutes() / 60;
}
