import { RecoveredPreview } from "@/components/apps/lost-files/RecoveredPreview";
import type { LostFile } from "@/core/lost-files/archive";
import { useT } from "@/hooks/use-translations";

interface ArchiveViewerProps {
  file: LostFile;
}

export function ArchiveViewer({ file }: ArchiveViewerProps) {
  const t = useT();

  return (
    <article className="p-4">
      <h2 className="font-mono text-[14px] text-[#e6e2d6]">{file.name}</h2>
      <p className="mt-1 text-[11px] text-[#7d828c]">
        {file.size} · {file.modified}
      </p>

      {file.recovery && (
        <figure className="mt-3">
          <div className="aspect-[3/2] w-full max-w-[420px] overflow-hidden rounded-sm border border-[#2c3441]">
            <RecoveredPreview
              seed={file.recovery.seed}
              tint={file.recovery.tint}
            />
          </div>
          <figcaption className="mt-1 font-mono text-[10px] text-[#5f6672]">
            {t("lost.recovered")}
          </figcaption>
        </figure>
      )}

      <div className="mt-4 space-y-2 text-[12px] leading-[1.65] text-[#c9c6ba]">
        {file.body.map((line, index) =>
          line === "" ? (
            <span key={index} className="block h-1" />
          ) : (
            <p key={index}>{line}</p>
          ),
        )}
      </div>
    </article>
  );
}
