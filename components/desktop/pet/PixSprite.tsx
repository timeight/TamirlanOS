import type { MouthShape, Pose } from "@/core/pet/animation/pose";
import type { PetSkin } from "@/core/pet/pet-skins";

interface PixSpriteProps {
  pose: Pose;
  skin: PetSkin;
  /** Steering tilt from the movement controller, added to the clip rotation. */
  lean: number;
}

export function PixSprite({ pose, skin, lean }: PixSpriteProps) {
  const sitOffset = pose.sit * 7;
  const standing = pose.sit < 0.5;

  return (
    <svg
      viewBox="0 0 64 80"
      aria-hidden="true"
      className="h-full w-full overflow-visible"
      style={{
        transform: `translate3d(0, ${pose.bodyY}px, 0) rotate(${pose.bodyRot + lean}deg)`,
      }}
    >
      <ellipse
        cx="32"
        cy="76"
        rx={17 - pose.bodyY * 0.12}
        ry="3.4"
        fill="rgba(0,0,0,0.22)"
      />

      <g
        transform={`translate(0 ${sitOffset}) scale(1 ${pose.bodySquash})`}
        style={{ transformOrigin: "32px 72px" }}
      >
        <g transform={`rotate(${pose.antennaRot} 32 18)`}>
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
            cy={7 + pose.antennaY}
            r="4"
            fill={skin.antenna}
            stroke={skin.outline}
            strokeWidth="1.4"
          />
        </g>

        {standing && (
          <>
            <rect
              x="22"
              y="60"
              width="8"
              height="12"
              rx="3.4"
              fill={skin.bodyDark}
              stroke={skin.outline}
              strokeWidth="1.6"
              transform={`rotate(${pose.legSwing} 26 60)`}
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
              transform={`rotate(${-pose.legSwing} 38 60)`}
            />
          </>
        )}

        <rect
          x="15"
          y="38"
          width="34"
          height={26 - pose.sit * 4}
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
          transform={`rotate(${pose.armL} 12 42)`}
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
          transform={`rotate(${-pose.armR} 52 42)`}
        />

        <g
          transform={`translate(0 ${pose.headY}) rotate(${pose.headRot} 32 34)`}
        >
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

          <Eyes pose={pose} color={skin.eye} />
          <Mouth shape={pose.mouth} color={skin.eye} />
        </g>
      </g>

      {pose.zzz > 0.05 && (
        <g fill={skin.outline} opacity={pose.zzz * 0.85}>
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

function Eyes({ pose, color }: { pose: Pose; color: string }) {
  const open = Math.max(0, Math.min(1, pose.eyeOpen));
  if (open < 0.12) {
    return (
      <>
        <path
          d={`M21 ${29 + pose.eyeY}q3.5 3 7 0`}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d={`M36 ${29 + pose.eyeY}q3.5 3 7 0`}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </>
    );
  }
  const ry = 4.6 * open;
  return (
    <>
      <ellipse
        cx={24.5 + pose.eyeX}
        cy={29 + pose.eyeY}
        rx="4.6"
        ry={ry}
        fill="#ffffff"
      />
      <ellipse
        cx={39.5 + pose.eyeX}
        cy={29 + pose.eyeY}
        rx="4.6"
        ry={ry}
        fill="#ffffff"
      />
      <ellipse
        cx={25.4 + pose.eyeX}
        cy={29.6 + pose.eyeY}
        rx="2.6"
        ry={2.6 * open}
        fill={color}
      />
      <ellipse
        cx={40.4 + pose.eyeX}
        cy={29.6 + pose.eyeY}
        rx="2.6"
        ry={2.6 * open}
        fill={color}
      />
      {open > 0.6 && (
        <>
          <circle
            cx={24 + pose.eyeX}
            cy={27.8 + pose.eyeY}
            r="0.9"
            fill="#ffffff"
          />
          <circle
            cx={39 + pose.eyeX}
            cy={27.8 + pose.eyeY}
            r="0.9"
            fill="#ffffff"
          />
        </>
      )}
    </>
  );
}

const MOUTH_PATHS: Record<MouthShape, string> = {
  smile: "M27 36q5 4 10 0",
  flat: "M28 37h8",
  wavy: "M27 37q2.5 -3 5 0t5 0",
  open: "M29 36q3 5 6 0z",
  small: "M30 37h4",
};

function Mouth({ shape, color }: { shape: MouthShape; color: string }) {
  return (
    <path
      d={MOUTH_PATHS[shape]}
      fill={shape === "open" ? color : "none"}
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
