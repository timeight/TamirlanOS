import type { FsNode } from "@/core/files/file-system";
import { cn } from "@/core/utils/cn";

interface FsIconProps {
  node: FsNode;
  className?: string;
}

const EXT_BADGE: Record<string, { label: string; fill: string }> = {
  txt: { label: "TXT", fill: "#4a6b8a" },
  doc: { label: "DOC", fill: "#2b5797" },
  pdf: { label: "PDF", fill: "#b8322c" },
  jpg: { label: "JPG", fill: "#7a4fa0" },
  exe: { label: "EXE", fill: "#2f6f3d" },
  sys: { label: "SYS", fill: "#8a6d3b" },
  log: { label: "LOG", fill: "#6b5a8a" },
  dll: { label: "DLL", fill: "#5a6470" },
};

export function FsIcon({ node, className }: FsIconProps) {
  if (node.kind === "folder") {
    return (
      <svg
        viewBox="0 0 32 28"
        aria-hidden="true"
        className={cn("shrink-0", className)}
      >
        <path
          d="M2 5.5A2 2 0 0 1 4 3.5h7.5l2.6 3.2H28a2 2 0 0 1 2 2V24H2Z"
          fill="#f0c14b"
          stroke="#b8860b"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M2 24 6.5 11h25L27 24Z"
          fill="#fbe08a"
          stroke="#b8860b"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const badge = EXT_BADGE[node.ext] ?? EXT_BADGE.txt!;
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <path
        d="M6 2h13l7 7v21H6Z"
        fill="#fdfdfb"
        stroke="#8a8676"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M19 2v7h7" fill="none" stroke="#8a8676" strokeWidth="1.3" />
      <path
        d="M9.5 13h13M9.5 16.5h13M9.5 20h8"
        stroke="#c3bfa8"
        strokeWidth="1.2"
      />
      <rect x="3" y="21" width="21" height="9" rx="1.5" fill={badge.fill} />
      <text
        x="13.5"
        y="27.6"
        textAnchor="middle"
        fill="#fff"
        fontSize="7"
        fontFamily="Tahoma, sans-serif"
        fontWeight="bold"
      >
        {badge.label}
      </text>
    </svg>
  );
}
