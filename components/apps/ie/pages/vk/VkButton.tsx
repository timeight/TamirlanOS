import { cn } from "@/core/utils/cn";

interface VkButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Серая кнопка 2012 года и её «мягкий» вариант для второстепенных действий. */
  tone?: "solid" | "quiet";
  className?: string;
}

export function VkButton({
  children,
  onClick,
  type = "button",
  disabled,
  tone = "solid",
  className,
}: VkButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "border px-3 py-[3px] text-[11px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#45688e] disabled:text-[#aaa]",
        tone === "solid"
          ? "border-[#b2bdc8] bg-[#edf1f5] text-[#2b587a] hover:bg-[#e2e8ee]"
          : "border-transparent bg-transparent text-[#2b587a] hover:underline",
        className,
      )}
    >
      {children}
    </button>
  );
}
