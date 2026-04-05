import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./intake-types";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex items-start gap-2", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border",
          isUser ? "order-2 border-siso-orange/40 bg-siso-orange/20" : "order-1 border-siso-orange/20 bg-siso-orange/15",
        )}
      >
        {isUser ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-siso-text-primary">YOU</span>
        ) : (
          <Image src="/branding/siso-logo.svg" alt="SISO" width={20} height={20} className="h-5 w-5" priority={false} />
        )}
      </div>
      <div className={cn("flex max-w-[80%] flex-col gap-1", isUser ? "order-1 items-end text-right" : "order-2 items-start text-left")}> 
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
          <span className="text-white">{message.author ?? (isUser ? "You" : "Intake Assistant")}</span>
          {message.timestamp ? <span>{message.timestamp}</span> : null}
        </div>
        <div
          className={cn(
            "rounded-3xl px-4 py-2 text-sm shadow-[0_6px_20px_rgba(0,0,0,0.35)]",
            isUser
              ? "rounded-br border border-siso-orange/40 bg-siso-orange text-[#120600]"
              : "rounded-bl border border-white/12 bg-siso-bg-tertiary text-white",
          )}
        >
          {message.content}
        </div>
        {!isUser && message.helper ? <p className="text-xs text-white/60">{message.helper}</p> : null}
      </div>
    </div>
  );
}
