import type { PetSkin } from "@/core/pet/pet-skins";
import { PetState, type PetFrame } from "@/core/pet/pet-types";

interface PixSpriteProps {
  frame: PetFrame;
  skin: PetSkin;
  reducedMotion: boolean;
}

export function PixSprite({ frame, skin, reducedMotion }: PixSpriteProps) {
  const t = reducedMotion ? 0 : frame.elapsed;
  const { state } = frame;

  const walking = state === PetState.Walk || state === PetState.FollowCursor;
  const running = state === PetState.Run;
  const bob = walking || running ? Math.sin(t * 9) * 2 : Math.sin(t * 2) * 0.8;
  const legSwing = walking || running ? Math.sin(t * 9) * 8 : 0;
  const armSwing =
    state === PetState.Wave
      ? Math.sin(t * 12) * 36 - 20
      : state === PetState.Dance
        ? Math.sin(t * 7) * 30
        : walking
          ? Math.sin(t * 9) * -10
          : 0;
  const tilt =
    state === PetState.Dizzy
      ? Math.sin(t * 11) * 14
      : state === PetState.Dance
        ? Math.sin(t * 6) * 8
        : state === PetState.Confused
          ? 7
          : 0;
  const hop =
    state === PetState.Jump
      ? -Math.abs(Math.sin(t * 6)) * 16
      : state === PetState.Dance
        ? -Math.abs(Math.sin(t * 7)) * 5
        : 0;
  const sitting = state === PetState.Sit || state === PetState.Sleep;
  const sleeping = state === PetState.Sleep;
  const blink = !sleeping && Math.sin(t * 1.7) > 0.97;

  const eyeShift =
    state === PetState.LookAround
      ? Math.sin(t * 2.2) * 2.4
      : frame.facing * 0.6;

  return (
    <svg
      viewBox="0 0 64 80"
      aria-hidden="true"
      className="h-full w-full overflow-visible"
      style={{
        transform: `translate3d(0, ${bob + hop}px, 0) rotate(${tilt}deg)`,
      }}
    >
      <ellipse cx="32" cy="76" rx="17" ry="3.4" fill="rgba(0,0,0,0.22)" />

      <g transform={`translate(0 ${sitting ? 7 : 0})`}>
        <line
          x1="32"
          y1="18"
          x2="32"
          y2="9"
          stroke={skin.outline}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle
          cx="32"
          cy={7 + (reducedMotion ? 0 : Math.sin(t * 3) * 1.2)}
          r="4"
          fill={skin.antenna}
          stroke={skin.outline}
          strokeWidth="1.4"
        />

        {!sitting && (
          <>
            <rect
              x={22 + legSwing * 0.1}
              y="60"
              width="8"
              height="12"
              rx="3.4"
              fill={skin.bodyDark}
              stroke={skin.outline}
              strokeWidth="1.6"
              transform={`rotate(${legSwing} 26 60)`}
            />
            <rect
              x="34"
              y="60"
              width="8"
              height="12"
              rx="3.4"
              fill={skin.bodyDark}
              stroke={skin.outline}
              strokeWidth="1.6"
              transform={`rotate(${-legSwing} 38 60)`}
            />
          </>
        )}

        <rect
          x="15"
          y="38"
          width="34"
          height={sitting ? 22 : 26}
          rx="11"
          fill={skin.body}
          stroke={skin.outline}
          strokeWidth="2"
        />
        <rect
          x="23"
          y="44"
          width="18"
          height="12"
          rx="4"
          fill={skin.panel}
          stroke={skin.outline}
          strokeWidth="1.4"
        />
        <circle cx="29" cy="50" r="1.8" fill={skin.accent} />
        <circle cx="35" cy="50" r="1.8" fill={skin.antenna} />

        <rect
          x="8"
          y="40"
          width="7"
          height="15"
          rx="3.4"
          fill={skin.bodyDark}
          stroke={skin.outline}
          strokeWidth="1.5"
          transform={`rotate(${armSwing} 12 42)`}
        />
        <rect
          x="49"
          y="40"
          width="7"
          height="15"
          rx="3.4"
          fill={skin.bodyDark}
          stroke={skin.outline}
          strokeWidth="1.5"
          transform={`rotate(${-armSwing} 52 42)`}
        />

        <rect
          x="12"
          y="16"
          width="40"
          height="26"
          rx="12"
          fill={skin.body}
          stroke={skin.outline}
          strokeWidth="2"
        />
        <rect
          x="16"
          y="21"
          width="32"
          height="16"
          rx="8"
          fill={skin.panel}
          stroke={skin.outline}
          strokeWidth="1.4"
        />

        {sleeping || blink ? (
          <>
            <path
              d="M21 29q3.5 3 7 0"
              fill="none"
              stroke={skin.eye}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M36 29q3.5 3 7 0"
              fill="none"
              stroke={skin.eye}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx={24.5 + eyeShift} cy="29" r="4.6" fill="#ffffff" />
            <circle cx={39.5 + eyeShift} cy="29" r="4.6" fill="#ffffff" />
            <circle cx={25.4 + eyeShift} cy="29.6" r="2.6" fill={skin.eye} />
            <circle cx={40.4 + eyeShift} cy="29.6" r="2.6" fill={skin.eye} />
            <circle cx={24 + eyeShift} cy="27.8" r="0.9" fill="#ffffff" />
            <circle cx={39 + eyeShift} cy="27.8" r="0.9" fill="#ffffff" />
          </>
        )}

        <Mouth mood={frame.mood} state={state} color={skin.eye} />
      </g>

      {sleeping && !reducedMotion && (
        <g fill={skin.outline} opacity="0.8">
          <text x="48" y="16" fontSize="9" fontFamily="Tahoma, sans-serif">
            z
          </text>
          <text x="54" y="9" fontSize="7" fontFamily="Tahoma, sans-serif">
            z
          </text>
        </g>
      )}
    </svg>
  );
}

function Mouth({
  mood,
  state,
  color,
}: {
  mood: PetFrame["mood"];
  state: PetState;
  color: string;
}) {
  if (state === PetState.Confused || mood === "dizzy") {
    return (
      <path
        d="M27 37q5 -3 10 0"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    );
  }
  if (mood === "focused") {
    return (
      <path
        d="M28 37h8"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    );
  }
  return (
    <path
      d="M27 36q5 4 10 0"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  );
}
