import { cn } from "@/core/utils/cn";

interface AgentMessageProps {
  from: "me" | "bot";
  name: string;
  body: string;
  time: string;
}

export function AgentMessage({ from, name, body, time }: AgentMessageProps) {
  const bot = from === "bot";
  return (
    <div
      className={cn(
        "rounded-[3px] px-3 py-2",
        bot ? "border border-[#cfe6fb] bg-[#f2f8ff]" : "bg-transparent",
      )}
    >
      <p className="text-[12px]">
        <span
          className={cn("font-bold", bot ? "text-[#2b6cb0]" : "text-[#8a5a2b]")}
        >
          {name}
        </span>
        <span className="text-[#9aa0a6]"> ({time}):</span>
      </p>
      <p className="mt-0.5 leading-5 whitespace-pre-line text-[#1a1a1a]">
        {body}
      </p>
    </div>
  );
}
