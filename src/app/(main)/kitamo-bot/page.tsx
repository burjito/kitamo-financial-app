"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, BrainCircuit, Sparkles, MessageSquare, ChevronDown, ChevronUp, RotateCcw, History, Trash2, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { kitaMoBot } from "@/ai/flows/kita-mo-bot-flow";
import { predefinedQuestions } from "@/data/predefined-questions";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/contexts/app-context";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
}

const suggestionPrompts = [
    "Ano ang kaya kong ma-achieve with my current savings?",
    "Based sa risk profile ko, saan maganda mag-invest?",
    "Help me create a budget for my monthly income.",
    "Is it okay to pause one goal to focus on another?",
]

const initialGreeting = { 
  id: 'start', 
  text: "Hey! I'm KitaMo Bot, your financial buddy. Ask me anything about your money goals, or try one of the suggestions below. Need inspiration? Click the 'Browse Questions' button!", 
  sender: 'bot' as const
};

export default function KitaMoBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPredefinedQuestions, setShowPredefinedQuestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const { profile, goals, monthlyIncome, monthlyExpenses } = useAppContext();

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('kitamo-bot-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastMessageAt: new Date(session.lastMessageAt)
        }));
        setChatHistory(parsedHistory);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
    
    // Start with greeting
    setMessages([initialGreeting]);
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('kitamo-bot-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({ top: scrollViewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const generateChatTitle = (firstUserMessage: string): string => {
    // Take first 50 characters of the first user message as title
    return firstUserMessage.length > 50 
      ? firstUserMessage.substring(0, 50) + "..."
      : firstUserMessage;
  };

  const saveCurrentChat = () => {
    const userMessages = messages.filter(m => m.sender === 'user');
    if (userMessages.length === 0) return; // Don't save if no user messages

    const now = new Date();
    const title = generateChatTitle(userMessages[0].text);
    
    const chatSession: ChatSession = {
      id: currentChatId || Date.now().toString(),
      title,
      messages: [...messages],
      createdAt: currentChatId ? chatHistory.find(c => c.id === currentChatId)?.createdAt || now : now,
      lastMessageAt: now
    };

    setChatHistory(prev => {
      const existingIndex = prev.findIndex(c => c.id === chatSession.id);
      if (existingIndex >= 0) {
        // Update existing chat
        const updated = [...prev];
        updated[existingIndex] = chatSession;
        return updated.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
      } else {
        // Add new chat
        return [chatSession, ...prev].sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
      }
    });

    setCurrentChatId(chatSession.id);
  };

  const handleSendMessage = async (e: React.FormEvent | null, messageText?: string) => {
    if (e) e.preventDefault();
    const query = messageText || input;

    if (!query.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: query, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowPredefinedQuestions(false);

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
        
        setMessages(prev => {
          const newMessages = [...prev, botMessage];
          // Save chat after bot responds
          setTimeout(() => saveCurrentChat(), 100);
          return newMessages;
        });
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

  const handleNewChat = () => {
    // Save current chat before starting new one
    saveCurrentChat();
    
    setMessages([initialGreeting]);
    setInput("");
    setShowPredefinedQuestions(false);
    setOpenCategories({});
    setCurrentChatId(null);
    setShowHistory(false);
  };

  const loadChatSession = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentChatId(session.id);
    setShowHistory(false);
    setShowPredefinedQuestions(false);
  };

  const clearAllHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('kitamo-bot-history');
    setShowHistory(false);
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const toggleCategory = (categoryKey: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
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
          {/* Chat History Panel */}
          {showHistory && (
            <div className="mb-4 animate-in fade-in-0 duration-300">
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Chat History
                    </CardTitle>
                    {chatHistory.length > 0 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all your chat history. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={clearAllHistory}>
                              Clear All
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  <CardDescription>
                    {chatHistory.length === 0 
                      ? "No chat history yet. Start a conversation to see it here!"
                      : "Click on any conversation to continue where you left off."
                    }
                  </CardDescription>
                </CardHeader>
                {chatHistory.length > 0 && (
                  <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                    {chatHistory.map((session) => (
                      <Button
                        key={session.id}
                        variant={currentChatId === session.id ? "secondary" : "ghost"}
                        className="w-full justify-start text-left p-3 h-auto"
                        onClick={() => loadChatSession(session)}
                      >
                        <div className="flex flex-col items-start w-full">
                          <span className="font-medium text-sm line-clamp-2">{session.title}</span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(session.lastMessageAt)}
                            <span>•</span>
                            <span>{session.messages.filter(m => m.sender === 'user').length} messages</span>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                )}
              </Card>
            </div>
          )}

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
            {/* Predefined Questions Section */}
            {showPredefinedQuestions && (
              <div className="mb-4 animate-in fade-in-0 duration-300">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Browse Questions by Category
                    </CardTitle>
                    <CardDescription>
                      Can't think of what to ask? Pick from these popular questions!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(predefinedQuestions).map(([categoryKey, category]) => (
                      <Collapsible 
                        key={categoryKey} 
                        open={openCategories[categoryKey]} 
                        onOpenChange={() => toggleCategory(categoryKey)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between text-left p-3 h-auto">
                            <span className="font-medium">{category.title}</span>
                            {openCategories[categoryKey] ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                            }
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 px-3 pb-2">
                          {category.questions.map((question) => (
                            <Button
                              key={question}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start h-auto py-2 px-3 text-wrap"
                              onClick={() => handleSendMessage(null, question)}
                            >
                              {question}
                            </Button>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Suggestions for First-time Users */}
            {showSuggestions && !showPredefinedQuestions && !showHistory && (
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

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPredefinedQuestions(!showPredefinedQuestions)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {showPredefinedQuestions ? "Hide Questions" : "Browse Questions"}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                {showHistory ? "Hide History" : "Chat History"}
                {chatHistory.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 ml-1">
                    {chatHistory.length}
                  </span>
                )}
              </Button>

              {(showPredefinedQuestions || showHistory) && (
                <span className="text-xs text-muted-foreground">
                  {showPredefinedQuestions && "Click any question to ask it instantly!"}
                  {showHistory && "Click any conversation to continue it!"}
                </span>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleNewChat}
                  disabled={isLoading}
                  title="New Chat"
                  className="hover:bg-transparent"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
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