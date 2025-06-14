"use client";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import ReactMarkdown from "react-markdown";

interface AskAIProps {
  examTitle: string;
  correct: number;
  incorrect: number;
  skipped: number;
}

interface Message {
  role: "user" | "ai";
  content: string;
}

// Add this interface for Gemini conversation history
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function AskAI({
  examTitle,
  correct,
  incorrect,
  skipped,
}: AskAIProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Add conversation history state for Gemini API
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentPrompt = prompt; // Store prompt before clearing
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-gemini`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: currentPrompt,
            conversationHistory: conversationHistory, // Send conversation history
            context: {
              examTitle,
              correct,
              incorrect,
              skipped,
            },
          }),
        }
      );

      const data = await res.json();
      const aiMessage: Message = { role: "ai", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
      
      // Update conversation history with the response from backend
      if (data.conversationHistory) {
        setConversationHistory(data.conversationHistory);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "❌ Failed to get response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Clear conversation history when chat is closed and reopened
  const handleToggleChat = () => {
    if (open) {
      // When closing, optionally clear history for fresh start
      // Remove these lines if you want to keep history between sessions
      setMessages([]);
      setConversationHistory([]);
    }
    setOpen(!open);
  };

  const TypingDots = () => (
    <div className="text-black text-base italic px-2 py-1">
      <span className="inline-block animate-bounce [animation-delay:-0.3s]">
        .
      </span>
      <span className="inline-block animate-bounce [animation-delay:-0.15s]">
        .
      </span>
      <span className="inline-block animate-bounce">.</span>
    </div>
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-xl transition-all"
        onClick={handleToggleChat}
      >
        💬 Ask AI
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[22rem] bg-white shadow-2xl border border-slate-200 rounded-xl flex flex-col h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b text-base font-semibold text-zinc-800 flex justify-between items-center">
            🧠 TOEIC AI Assistant
            <button
              className="text-sm text-zinc-500 hover:text-red-500"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Message history */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-slate-400 text-black"
                      : "bg-violet-100 text-black"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-violet-100 text-black rounded-lg px-3 py-2 max-w-[80%]">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 bg-white">
            <Textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask something about your result..."
              className="w-full resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // prevent new line
                  handleSend();
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}