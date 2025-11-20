import React, { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area"; // 👈 make sure this import exists
import { Send, Bot, User } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

type PlanItem = { title?: string; instructions?: string; rationale?: string };
type AskResponse = {
  user_id: number;
  answer_text: string;
  disclaimer: string;
  plan: PlanItem[];
};

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  plan?: PlanItem[];
  disclaimer?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export function SymptomChecker() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      text:
        "Hello! I'm your AI medical assistant. Please describe your symptoms and I'll help provide general guidance. " +
        "Remember, this is not a substitute for professional medical advice.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Chat list scroll container
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollKey = useMemo(() => messages.map((m) => m.id).join(","), [messages]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [scrollKey, loading]);

  const sendToBackend = async (question: string): Promise<AskResponse> => {
    const res = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: 1, question }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, text, isBot: false, timestamp: new Date() };
    setMessages((p) => [...p, userMsg]);
    setInputValue("");
    setLoading(true);

    const typingId = `typing-${Date.now() + 1}`;
    setMessages((p) => [...p, { id: typingId, text: "Typing…", isBot: true, timestamp: new Date() }]);

    try {
      const data = await sendToBackend(text);
      setMessages((p) =>
        p
          .filter((m) => m.id !== typingId)
          .concat({
            id: `b-${Date.now()}`,
            text: data.answer_text || "",
            isBot: true,
            timestamp: new Date(),
            plan: data.plan || [],
            disclaimer: data.disclaimer,
          })
      );
    } catch (e) {
      setMessages((p) =>
        p
          .filter((m) => m.id !== typingId)
          .concat({
            id: `err-${Date.now()}`,
            text: "⚠️ Couldn’t reach the server. Make sure the backend is running.",
            isBot: true,
            timestamp: new Date(),
          })
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <strong>Disclaimer:</strong> This AI assistant provides general information only and is not a
          substitute for professional medical advice, diagnosis, or treatment.
        </AlertDescription>
      </Alert>

      {/* Keep the overall card height fixed */}
      <Card className="h-[560px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Symptom Checker
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* CHAT LIST (scrolls when there are many messages) */}
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto pr-2">
            <div className="space-y-4 px-1">
              {messages.map((m) => {
                const bubbleBase = "max-w-[900px] rounded-xl p-4 shadow-sm";
                const bubbleColor = m.isBot
                  ? "bg-white border text-foreground" // your theme might render this as blue-tinted
                  : "bg-primary text-primary-foreground";
                const side = m.isBot ? "" : "flex-row-reverse";

                return (
                  <div key={m.id} className={`flex items-start gap-3 ${side}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        m.isBot ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {m.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* MESSAGE BUBBLE */}
                    <div className={`${bubbleBase} ${bubbleColor} overflow-hidden`}>
                      {m.isBot ? (
                        // >>> SCROLLBAR INSIDE THIS BLUE/WHITE BUBBLE <<<
                        <ScrollArea className="max-h-[380px] pr-2">
                          <div className="prose prose-sm sm:prose-base max-w-none prose-headings:mt-3 prose-ul:my-1 prose-li:my-0 prose-strong:font-semibold">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {m.text || ""}
                            </ReactMarkdown>

                            {m.plan && m.plan.length > 0 && (
                              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {m.plan.map((p, i) => (
                                  <div key={i} className="rounded-lg border bg-muted/30 p-3">
                                    <div className="font-semibold">{p.title || "Recommendation"}</div>
                                    {p.instructions && <div className="text-sm mt-1">{p.instructions}</div>}
                                    {p.rationale && <div className="text-xs mt-1 opacity-70">Why: {p.rationale}</div>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {m.disclaimer && <p className="text-xs opacity-60 mt-3">{m.disclaimer}</p>}
                          </div>
                        </ScrollArea>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                      )}
                    </div>

                    {/* Timestamp outside the bubble so it stays visible */}
                    <p className="text-[11px] opacity-60 mt-2">{m.timestamp.toLocaleTimeString()}</p>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pl-10">
                  <div className="animate-pulse">•</div>
                  <div className="animate-pulse delay-150">•</div>
                  <div className="animate-pulse delay-300">•</div>
                  <span>AI is thinking…</span>
                </div>
              )}
            </div>
          </div>

          {/* INPUT */}
          <div className="flex gap-2 mt-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms…"
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={handleSendMessage} size="icon" disabled={loading || !inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
