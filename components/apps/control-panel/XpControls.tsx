import type { ReactNode } from "react";
import { cn } from "@/core/utils/cn";

/** The sunken group box every XP property page is built from. */
export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="mb-3 border border-[var(--os-frame)] bg-[var(--os-face)] px-3 pt-1 pb-3">
      <legend className="px-1 text-[11px] font-bold text-[var(--os-text-primary)]">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="mt-1.5 flex items-start gap-2 text-[11px] text-[var(--os-text-primary)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-[1px]"
      />
      <span>
        {label}
        {hint && (
          <span className="block text-[10px] text-[var(--os-text-secondary)]">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  display: string;
}) {
  return (
    <label className="mt-2 block text-[11px] text-[var(--os-text-primary)]">
      <span className="flex justify-between">
        {label} <span className="tabular-nums">{display}</span>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full accent-[var(--os-accent)]"
      />
    </label>
  );
}

export function XpButton({
  children,
  onClick,
  tone = "normal",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "normal" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-w-[88px] rounded-sm border border-[var(--os-frame)] bg-[var(--os-face)] px-3 py-1 text-[11px] hover:bg-[var(--os-hover-soft)] focus-visible:outline-1 focus-visible:outline-black active:translate-y-px",
        tone === "danger" && "text-[var(--os-danger)]",
      )}
    >
      {children}
    </button>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-[1px] text-[11px]">
      <span className="w-[140px] shrink-0 text-[var(--os-text-secondary)]">
        {label}
      </span>
      <span className="min-w-0 flex-1 break-words text-[var(--os-text-primary)]">
        {value}
      </span>
    </div>
  );
}
