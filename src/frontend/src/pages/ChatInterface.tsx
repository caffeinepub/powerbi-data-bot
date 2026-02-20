import { useState } from 'react';
import { useGetAllBotConfigs } from '../hooks/useQueries';
import ChatMessage from '../components/ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      content: 'Hello! I\'m your PowerBI Data Bot. Ask me anything about your data sources and I\'ll provide insights based on configured queries.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: botConfigs } = useGetAllBotConfigs();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate bot processing and find relevant query results
    setTimeout(() => {
      let botResponse = 'I\'m analyzing your data sources...';

      if (botConfigs && botConfigs.length > 0) {
        // Find relevant queries based on user input
        const relevantConfig = botConfigs[0];
        const relevantQuery = relevantConfig.queries.find((q) =>
          input.toLowerCase().includes(q.queryText.toLowerCase().split(' ')[0])
        );

        if (relevantQuery) {
          botResponse = `Based on your query, here's what I found:\n\n${relevantQuery.result}\n\nThis insight comes from analyzing ${relevantConfig.dataSources.length} data source(s).`;
        } else if (relevantConfig.queries.length > 0) {
          botResponse = `I found ${relevantConfig.queries.length} related queries in your configuration. Here's a sample insight:\n\n${relevantConfig.queries[0].result}`;
        } else {
          botResponse = 'I have access to your data sources, but no queries have been configured yet. Please set up bot configurations with specific queries to get insights.';
        }
      } else {
        botResponse = 'No bot configurations found. Please upload data sources and create bot configurations to enable data analysis.';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 p-6">
        <Card className="h-full flex flex-col border-border/40">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="flex items-center gap-3">
              <img
                src="/assets/generated/bot-avatar.dim_128x128.png"
                alt="Bot Avatar"
                className="h-10 w-10 rounded-full border-2 border-emerald"
              />
              <div>
                <h2 className="text-xl font-bold">Data Bot Assistant</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  Ask questions about your data
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Bot is thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="border-t border-border/40 p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your data..."
                  disabled={isProcessing}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  className="bg-emerald hover:bg-emerald/90"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
