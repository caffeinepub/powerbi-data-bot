import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className="flex-shrink-0">
        {isBot ? (
          <img
            src="/assets/generated/bot-avatar.dim_128x128.png"
            alt="Bot"
            className="h-8 w-8 rounded-full border-2 border-emerald"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-charcoal border-2 border-border flex items-center justify-center">
            <span className="text-xs font-semibold">You</span>
          </div>
        )}
      </div>
      <div className={`flex-1 max-w-[80%] ${isBot ? '' : 'flex flex-col items-end'}`}>
        <div
          className={`rounded-lg p-4 ${
            isBot
              ? 'bg-card border border-border/40'
              : 'bg-emerald text-white'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
