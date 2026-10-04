interface VkMobileGroupLabelProps {
  children: React.ReactNode;
}

/** Серая полоса-заголовок между блоками списка. */
export function VkMobileGroupLabel({ children }: VkMobileGroupLabelProps) {
  return (
    <h3 className="border-t border-b border-t-[#c9ced4] border-b-[#c9ced4] bg-[linear-gradient(#f2f4f6,#e9ecef)] px-[10px] pt-[5px] pb-1 text-[11px] font-bold tracking-[0.4px] text-[#7d858d] uppercase">
      {children}
    </h3>
  );
}
