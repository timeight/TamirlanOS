import { PRIVACY_POLICY } from "@/core/vk/privacy-policy";

/** Один текст на обе оболочки; отличается только размер шрифта снаружи. */
export function VkPrivacyPolicy() {
  return (
    <div className="space-y-3">
      {PRIVACY_POLICY.map((section) => (
        <section key={section.title}>
          <h3 className="font-bold text-[#45688e]">{section.title}</h3>
          <ul className="mt-1 space-y-1">
            {section.lines.map((line) => (
              <li key={line} className="text-[#333]">
                {line}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
