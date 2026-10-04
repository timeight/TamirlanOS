interface VkMobileGroupLabelProps {
  children: React.ReactNode;
}

/** Серая полоса-заголовок между блоками списка. */
export function VkMobileGroupLabel({ children }: VkMobileGroupLabelProps) {
  return (
    <h3 className="border-y border-[#d5d9de] bg-[#eceff1] px-[10px] pt-[5px] pb-1 text-[11px] tracking-[0.3px] text-[#8a8a8a] uppercase">
      {children}
    </h3>
  );
}
