import { cn } from "@/core/utils/cn";

interface FileIconProps {
  kind: "sys" | "txt" | "exe" | "log";
  className?: string;
}

const BADGE: Record<FileIconProps["kind"], { text: string; fill: string }> = {
  sys: { text: "SYS", fill: "#8a6d3b" },
  txt: { text: "TXT", fill: "#4a6b8a" },
  exe: { text: "EXE", fill: "#2f6f3d" },
  log: { text: "LOG", fill: "#6b5a8a" },
};

export function FileIcon({ kind, className }: FileIconProps) {
  const badge = BADGE[kind];
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d="M6 3h13l7 7v19H6Z"
        fill="#fdfdfb"
        stroke="#8a8676"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M19 3v7h7" fill="none" stroke="#8a8676" strokeWidth="1.3" />
      <path
        d="M9.5 14h13M9.5 17.5h13M9.5 21h8"
        stroke="#c3bfa8"
        strokeWidth="1.2"
      />
      <rect x="4" y="22" width="19" height="8" rx="1.5" fill={badge.fill} />
      <text
        x="13.5"
        y="28"
        textAnchor="middle"
        fill="#fff"
        fontSize="6.5"
        fontFamily="Tahoma, sans-serif"
        fontWeight="bold"
      >
        {badge.text}
      </text>
    </svg>
  );
}
