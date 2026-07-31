import { cn } from "@/core/utils/cn";

interface AchievementIconProps {
  icon: string;
  locked?: boolean;
  className?: string;
}

const PATHS: Record<string, string> = {
  power: "M12 4v8M7.5 6.5a7 7 0 1 0 9 0",
  folder: "M3 6.5h5l1.5 2H21V19H3Z",
  flag: "M6 20V4m0 1c4-2 8 2 12 0v8c-4 2-8-2-12 0",
  user: "M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 9c.8-4.5 3.8-7 7-7s6.2 2.5 7 7",
  code: "m8.5 8-4.5 4 4.5 4m7-8 4.5 4-4.5 4M13.5 5l-3 14",
  doc: "M6 3h8l4 4v14H6Zm8 0v4h4M9 12h6M9 16h6",
  camera:
    "M4 8h3l1.5-2h7L17 8h3v11H4Zm8 8.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  mail: "M3 6h18v12H3Zm0 0 9 7 9-7",
  chat: "M4 5h16v11h-9l-4 4v-4H4Z",
  game: "M7 9h10a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8Zm2 4h2m-1-1v2m6-1h.01",
  mine: "M12 6v12M6 12h12m-8.5-3.5 7 7m0-7-7 7",
  crown: "M4 17h16M4 17 5 7l4 4 3-6 3 6 4-4 1 10",
  grid: "M4 4h16v16H4Zm0 5.3h16M4 14.6h16M9.3 4v16M14.6 4v16",
  target: "M12 3v4m0 10v4M3 12h4m10 0h4m-7 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  brush: "M6 18c2 0 3-1 3-3l8-9 3 3-9 8c-1.5 0-2 1-2 3-1 .5-2.5.5-3-2Z",
  globe:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c-3 3-3 15 0 18m0-18c3 3 3 15 0 18M3.5 9h17m-17 6h17",
  monitor: "M3 5h18v11H3Zm6 15h6m-3-4v4",
  star: "m12 4 2.4 5.2 5.6.7-4.2 3.9 1.2 5.6-5-3-5 3 1.2-5.6L4 9.9l5.6-.7Z",
};

export function AchievementIcon({
  icon,
  locked = false,
  className,
}: AchievementIconProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[4px] border",
        locked
          ? "border-[#b8b4a4] bg-[#e6e3d7] text-[#9a968a]"
          : "border-[#c98f1f] text-white",
        className,
      )}
      style={
        locked
          ? undefined
          : {
              background:
                "radial-gradient(circle at 32% 28%, #ffe08a, #e8a317 62%, #c07d0a 100%)",
            }
      }
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[62%] w-[62%]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={PATHS[icon] ?? PATHS.star} />
      </svg>
    </span>
  );
}
