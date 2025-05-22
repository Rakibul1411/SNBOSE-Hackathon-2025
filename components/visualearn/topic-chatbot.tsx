"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Mic, MicOff } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useToast } from "@/components/ui/use-toast"

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// Add this after your declare global block
type SpeechRecognition = typeof window.SpeechRecognition;
type SpeechRecognitionEvent = any;

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function TopicChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your learning assistant. Ask me any questions about this topic in English or Bangla.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Only run in the browser and if SpeechRecognition is supported
    if (
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US"; // or "bn-BD" for Bangla
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        toast({
          title: "Voice Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    } else {
      recognitionRef.current = null;
    }
  }, [toast])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add the "AI is Thinking....!!!" message
    const thinkingId = "thinking-" + Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: thinkingId,
        content: "AI is Thinking....!!!",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();

      // Remove the "AI is Thinking....!!!" message
      setMessages((prev) => prev.filter((msg) => msg.id !== thinkingId));

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: data.reply,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error("No reply from AI");
      }
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== thinkingId));
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Sorry, I couldn't process your request. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (
      typeof window === "undefined" ||
      (!window.SpeechRecognition && !window.webkitSpeechRecognition)
    ) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your learning assistant. Ask me any questions about this topic in English or Bangla.",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-primary/5 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Learning Assistant</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat}>
          Clear Chat
        </Button>
      </div>

      <div className="h-[300px] overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`
              flex w-full
              ${message.sender === "user" ? "justify-end" : "justify-start"}
            `}
          >
            <div
              className={`
                max-w-[80%] rounded-xl p-3 mb-2 break-words whitespace-pre-line
                ${message.sender === "user"
                  ? "bg-primary text-primary-foreground self-end"
                  : "bg-muted border border-primary/20 self-start"}
              `}
            >
              {message.sender === "bot" ? (
                <div className="prose prose-invert max-w-none text-sm">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <Button variant="ghost" size="icon" onClick={toggleRecording} className={isRecording ? "text-red-500" : ""}>
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
