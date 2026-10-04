interface VkMobileFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date";
}

/** Подпись сверху, поле снизу — форма мобильного приложения, не таблица. */
export function VkMobileField({
  label,
  value,
  onChange,
  type = "text",
}: VkMobileFieldProps) {
  return (
    <label className="mb-2 block text-[12px] text-[#8a8a8a]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-[29px] w-full rounded-[3px] border border-[#c2cad3] bg-white px-[7px] text-[13px] text-[#333] outline-none focus:border-[#5181b8]"
      />
    </label>
  );
}
