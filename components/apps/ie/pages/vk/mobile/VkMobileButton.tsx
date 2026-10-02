import { cn } from "@/core/utils/cn";

interface VkMobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Синяя заливка для главного действия, светлая — для второстепенного. */
  tone?: "primary" | "secondary";
  size?: "regular" | "small";
  className?: string;
}

export function VkMobileButton({
  children,
  onClick,
  type = "button",
  disabled,
  tone = "primary",
  size = "regular",
  className,
}: VkMobileButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-[3px] border text-center font-medium disabled:opacity-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4a76a8]",
        size === "small"
          ? "min-h-[32px] px-3 text-[13px]"
          : "min-h-[38px] px-4 text-[14px]",
        tone === "primary"
          ? "border-[#4a76a8] bg-[#5181b8] text-white active:bg-[#4a76a8]"
          : "border-[#ccd4dd] bg-[#f0f2f5] text-[#2a5885] active:bg-[#e3e8ee]",
        className,
      )}
    >
      {children}
    </button>
  );
}
