import type { IcqMessage } from "@/core/icq/chat-types";
import { cn } from "@/core/utils/cn";

interface IcqMessageRowProps {
  message: IcqMessage;
}

function stamp(at: number): string {
  const date = new Date(at);
  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const today = new Date().toDateString() === date.toDateString();
  return today ? time : `${date.toLocaleDateString("ru-RU")} ${time}`;
}

export function IcqMessageRow({ message }: IcqMessageRowProps) {
  return (
    <li className={cn("flex", !message.fromPix && "justify-end")}>
      <div
        className={cn(
          "max-w-[85%] rounded-sm border px-2.5 py-1.5",
          message.fromPix
            ? "border-[#c8d8e8] bg-white"
            : "border-[#a8bed6] bg-[#dce9f6]",
        )}
      >
        <p className="mb-0.5 text-[10px] text-[#8a93a0]">
          {message.fromPix ? "PIX" : "Вы"} · {stamp(message.at)}
        </p>

        {message.text && (
          <p className="text-[12px] leading-[1.5] text-[#1e2a38]">
            {message.text}
          </p>
        )}

        {message.attachment?.type === "sticker" && (
          <p
            aria-label={message.attachment.label}
            className="py-1 font-mono text-[16px] text-[#2c4a6b]"
          >
            {message.attachment.glyph}
          </p>
        )}

        {message.attachment?.type === "file" && (
          <div className="mt-1.5 border border-[#c8d8e8] bg-[#f6f9fc] px-2 py-1.5">
            <p className="font-mono text-[11px] text-[#2c4a6b]">
              {message.attachment.name}
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-[#5b6b7d]">
              {message.attachment.note}
            </p>
          </div>
        )}
      </div>
    </li>
  );
}
