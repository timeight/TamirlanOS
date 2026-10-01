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
    <label className="mb-1.5 flex flex-col gap-1 text-[11px] @[420px]:flex-row @[420px]:items-start @[420px]:gap-3">
      <span className="shrink-0 text-[#777] @[420px]:w-[108px] @[420px]:pt-[3px] @[420px]:text-right">
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
