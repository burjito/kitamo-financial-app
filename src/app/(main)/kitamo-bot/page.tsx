
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, BrainCircuit, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { kitaMoBot, KitaMoBotInput } from "@/ai/flows/kita-mo-bot-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/contexts/app-context";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const suggestionPrompts = [
    "Ano ang kaya kong ma-achieve with my current savings?",
    "Based sa risk profile ko, saan maganda mag-invest?",
    "Help me create a budget for my monthly income.",
    "Is it okay to pause one goal to focus on another?",
]

export default function KitaMoBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const { profile, goals, monthlyIncome, monthlyExpenses } = useAppContext();


  useEffect(() => {
    // Greet the user on initial load
    setMessages([
        { id: 'start', text: "Hey! I'm KitaMo Bot, your financial buddy. Ask me anything about your money goals, or try one of the suggestions below.", sender: 'bot' }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({ top: scrollViewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent | null, messageText?: string) => {
    if (e) e.preventDefault();
    const query = messageText || input;

    if (!query.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: query, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
        const userContext = JSON.stringify({
            profile,
            goals,
            monthlyIncome,
            monthlyExpenses,
        }, null, 2);

        const botResponse = await kitaMoBot({ 
            query: query,
            userContext: userContext
        });

        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: botResponse.response,
            sender: "bot",
        };
        setMessages(prev => [...prev, botMessage]);
    } catch (error) {
        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Oops, something went wrong. Please try again later.",
            sender: "bot",
        };
        setMessages(prev => [...prev, errorMessage]);
        console.error("Error calling KitaMo Bot flow:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  const showSuggestions = messages.filter(m => m.sender === 'user').length === 0;

  return (
    <div className="animate-in fade-in-0 duration-500 flex justify-center items-start h-full">
      <Card className="w-full max-w-4xl h-[calc(100vh-10rem)] flex flex-col">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">KitaMo Bot</CardTitle>
          </div>
          <CardDescription>Your AI financial assistant. Ask me in Taglish!</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-4 overflow-hidden">
          <ScrollArea className="flex-grow mb-4 pr-4" viewportRef={scrollViewportRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/bot-avatar.png" alt="Bot" />
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-4 py-2 max-w-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                       <AvatarImage src="https://placehold.co/100x100.png" alt="@alex" data-ai-hint="person" />
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/bot-avatar.png" alt="Bot" />
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 max-w-sm bg-muted space-y-2">
                       <Skeleton className="h-4 w-48" />
                       <Skeleton className="h-4 w-32" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="border-t pt-4">
             {showSuggestions && (
                <div className="mb-4 animate-in fade-in-0 duration-500">
                    <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Not sure where to start? Try these:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {suggestionPrompts.map(prompt => (
                            <Button key={prompt} variant="outline" size="sm" onClick={() => handleSendMessage(null, prompt)}>
                                {prompt}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'Magkano dapat ipon ko monthly for a trip?'"
                className="flex-grow"
                disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
