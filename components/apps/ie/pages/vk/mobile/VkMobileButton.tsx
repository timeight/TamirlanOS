import { cn } from "@/core/utils/cn";

interface VkMobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  tone?: "primary" | "secondary";
  size?: "regular" | "small";
  className?: string;
}

/** Маленькая кнопка с градиентом, рамкой и бликом — стиль кнопок той эпохи. */
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
        "rounded-[3px] border text-center disabled:opacity-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4a76a8]",
        size === "small"
          ? "h-[26px] px-2.5 text-[12px]"
          : "h-[30px] px-3 text-[13px]",
        tone === "primary"
          ? "border-[#41699b] bg-[linear-gradient(#6a93c3,#5181b8)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_1px_1px_rgba(0,0,0,0.06)] active:bg-[#4a76a8]"
          : "border-[#c2cad3] bg-[linear-gradient(#fdfdfe,#eef1f4)] text-[#2a5885] shadow-[inset_0_1px_0_#fff,0_1px_1px_rgba(0,0,0,0.04)] [text-shadow:0_1px_0_#fff] active:bg-[#e3e8ee]",
        className,
      )}
    >
      {children}
    </button>
  );
}
