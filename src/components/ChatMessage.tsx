import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 shadow-soft",
        isUser 
          ? "bg-gradient-to-r from-warm-peach to-warm-orange text-creamy-white rounded-br-sm" 
          : "bg-creamy-white border border-warm-peach/20 text-cozy-brown rounded-bl-sm"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        <span className={cn(
          "text-xs mt-2 block",
          isUser ? "text-creamy-white/70" : "text-cozy-brown/60"
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};