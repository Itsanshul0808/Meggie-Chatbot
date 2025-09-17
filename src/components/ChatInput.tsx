import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const quickQuestions = [
    "I have rice and tomatoes 🍅",
    "Quick breakfast ideas? 🍳",
    "Budget meal under ₹50 💰",
    "No cooking ingredients 😅"
  ];

  return (
    <div className="border-t border-warm-peach/20 bg-gradient-to-r from-creamy-white to-soft-sage/10 p-4">
      {/* Quick question chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => setMessage(question.replace(/[🍅🍳💰😅]/g, '').trim())}
            className="text-xs px-3 py-1 rounded-full bg-warm-peach/10 text-cozy-brown border border-warm-peach/30 hover:bg-warm-peach/20 transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me what ingredients you have... 🥘"
          className={cn(
            "flex-1 border-warm-peach/30 focus:border-warm-peach focus:ring-warm-peach/20",
            "bg-creamy-white placeholder:text-cozy-brown/50"
          )}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          variant="warm" 
          size="icon"
          disabled={!message.trim() || isLoading}
          className="shrink-0"
        >
          {isLoading ? (
            <Utensils className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
};