"use client";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BsRobot } from "react-icons/bs";
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

interface ChatMessage {
  role: "user" | "model";
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
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(
    []
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);

    const currentPrompt = prompt;
    setTimeout(() => setPrompt(""), 0);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat-gemini`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: currentPrompt,
            conversationHistory,
            context: { examTitle, correct, incorrect, skipped },
          }),
        }
      );

      const data = await res.json();
      const aiMessage: Message = { role: "ai", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);

      if (data.conversationHistory) {
        setConversationHistory(data.conversationHistory);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "❌ Failed to get response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChat = () => {
    if (open) {
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
      <button
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-xl transition-all"
        onClick={handleToggleChat}
      >
        💬 Ask AI
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[27rem] bg-white shadow-2xl border border-slate-200 rounded-2xl flex flex-col h-[80vh] overflow-hidden">
          <div className="p-4 text-base font-semibold text-zinc-800 flex justify-between items-center">
            <div className="w-11 h-11 rounded-full bg-slate-400 flex items-center justify-center">
              <BsRobot size={25} />
            </div>
            <span className="font-medium">AI Assistant</span>
            <button
              className="text-sm text-zinc-500 hover:text-red-500"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-3 py-2 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-slate-400 text-black"
                      : "bg-violet-100 text-black"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-2">
                          <table className="w-full border text-left text-xs border-collapse">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-gray-50 text-xs font-semibold">
                          {children}
                        </thead>
                      ),
                      th: ({ children }) => (
                        <th className="border px-2 py-1 border-slate-300">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border px-2 py-1 border-slate-200 font-mono">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
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

          <div className=" p-3 bg-white">
            <Textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask something about your result..."
              className="w-full  rounded-2xl resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
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
