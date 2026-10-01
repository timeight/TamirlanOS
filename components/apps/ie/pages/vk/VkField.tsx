interface VkFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "date";
  placeholder?: string;
  hint?: string;
}

/** The label-left / input-right row every VK 2012 form was built from. */
export function VkField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: VkFieldProps) {
  return (
    <label className="mb-1.5 flex items-start gap-3 text-[11px]">
      <span className="w-[108px] shrink-0 pt-[3px] text-right text-[#777]">
        {label}
      </span>
      <span className="min-w-0 flex-1">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full max-w-[260px] border border-[#c0cad5] bg-white px-1.5 py-[3px] text-[11px] outline-none focus:border-[#7196bd]"
        />
        {hint && (
          <span className="mt-0.5 block text-[10px] text-[#999]">{hint}</span>
        )}
      </span>
    </label>
  );
}
