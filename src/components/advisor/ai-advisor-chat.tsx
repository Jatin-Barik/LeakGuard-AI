"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Mail, Send, Sparkles, User, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  advisorQuickPrompts,
  demoDashboardStats,
  demoInsights,
  demoSubscriptions,
  emailTemplates,
  monthlyFinancialStory,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const biggestRecurring = demoSubscriptions
  .filter((subscription) => subscription.isActive)
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 5)
  .map((subscription, index) => `${index + 1}. ${subscription.name}: ${formatCurrency(subscription.amount)}/mo`)
  .join("\n");

const demoResponses: Record<string, string> = {
  "where am i wasting money?": `I found ${formatCurrency(demoDashboardStats.potentialSavings)}/mo in realistic savings opportunities.\n\nTop leaks:\n1. Gym Membership: $24.99/mo with only 8% usage.\n2. Apple Music + YouTube Music: $21.98/mo duplicated by Spotify.\n3. iCloud+ + Dropbox: $21.98/mo duplicated by Google One.\n4. Disney+ and YouTube Premium overlap with Netflix and Prime.\n\nBusiness value: these changes create a starter annual savings plan of ${formatCurrency(demoDashboardStats.projectedSavings)} without touching rent, loans, insurance, or essentials.`,
  "which subscriptions should i cancel?": `Cancel or pause in this order:\n\nHigh confidence:\n- Gym Membership: save $24.99/mo.\n- Apple Music: save $10.99/mo.\n- YouTube Music: save $10.99/mo.\n- Dropbox Plus: save $11.99/mo.\n\nMedium confidence:\n- Disney+: pause for 60 days.\n- Zomato Gold: cancel unless food delivery usage rebounds.\n\nKeep Spotify, ChatGPT Plus, GitHub Copilot, Internet, Insurance, Student Loan, and Credit Card Bill.`,
  "explain my leak score.": `Your Leak Score is 42/100, which means your finances are stable but recurring waste is high.\n\nScore drivers:\n- Unused subscriptions: 28/100 because six services show low usage.\n- Duplicates: 35/100 because music, video, cloud, and AI tools overlap.\n- Price hikes: 52/100 after Netflix, Internet, Amazon Prime, and Adobe increases.\n- Spending trend: 38/100 because recurring spend rose 18% month over month.\n\nIf you apply the top three actions, the simulator projects the score moving into the high 60s immediately.`,
  "how can i save $50 every month?": `A clean $50/month plan:\n\n1. Cancel Gym Membership: $24.99.\n2. Cancel Apple Music: $10.99.\n3. Cancel YouTube Music: $10.99.\n4. Cancel Zomato Gold: $3.59.\n\nTotal: $50.56/month, or $606.72/year.\n\nThis is the lowest-friction plan because it removes duplicates and low-usage services without changing your core workflow.`,
  "show my biggest recurring expenses.": `Here are your biggest recurring expenses:\n\n${biggestRecurring}\n\nThe AI recommendation engine does not suggest cancelling essentials like loans or insurance. It focuses on negotiable, duplicated, or low-usage services.`,
  "generate a cancellation email.": `${emailTemplates.cancel}\n\nI can also generate discount, downgrade, and pause emails from the Export page.`,
};

function getResponse(input: string): string {
  const normalized = input.toLowerCase().trim();
  const matchedKey = Object.keys(demoResponses).find(
    (key) => normalized.includes(key.replace(".", "").slice(0, 18)) || key.includes(normalized.slice(0, 18))
  );

  if (matchedKey) return demoResponses[matchedKey];
  if (normalized.includes("discount")) return emailTemplates.discount;
  if (normalized.includes("downgrade")) return emailTemplates.downgrade;
  if (normalized.includes("pause")) return emailTemplates.pause;

  return `${monthlyFinancialStory.title}\n\n${monthlyFinancialStory.summary}\n\nKey insights:\n- ${demoInsights.slice(0, 4).join("\n- ")}\n\nBest next action: cancel the low-usage gym membership and duplicate music plans first.`;
}

export function AIAdvisorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi Alex. I already analyzed 12 months, ${demoSubscriptions.length} subscriptions, and 1,200+ transactions. I found ${formatCurrency(demoDashboardStats.potentialSavings)}/mo in potential savings. What should we optimize first?`,
      timestamp: new Date().toISOString(),
      suggestions: advisorQuickPrompts,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageSequence = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    messageSequence.current += 1;
    setMessages((prev) => [
      ...prev,
      {
        id: `user_${messageSequence.current}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 420));

    messageSequence.current += 1;
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant_${messageSequence.current}`,
        role: "assistant",
        content: getResponse(text),
        timestamp: new Date().toISOString(),
        suggestions: advisorQuickPrompts.filter((prompt) => prompt !== text).slice(0, 3),
      },
    ]);
    setIsTyping(false);
  };

  const speakLastResponse = () => {
    const lastResponse = [...messages].reverse().find((message) => message.role === "assistant");
    if (lastResponse && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(lastResponse.content));
    }
  };

  return (
    <Card className="flex h-[calc(100vh-12rem)] flex-col">
      <CardHeader className="shrink-0 border-b border-white/5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Smart Financial Assistant</CardTitle>
              <p className="text-xs text-muted-foreground">Preloaded demo intelligence with realistic financial context</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={speakLastResponse} aria-label="Read the latest response aloud">
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
            >
              {message.role === "assistant" && (
                <div className="h-fit rounded-lg bg-sky-500/20 p-2">
                  <Bot className="h-4 w-4 text-sky-300" />
                </div>
              )}
              <div className={`max-w-[82%] rounded-lg px-4 py-3 text-sm ${message.role === "user" ? "bg-sky-500/20" : "bg-secondary/50"}`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-200 transition-colors hover:bg-sky-500/20"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="h-fit rounded-lg bg-secondary p-2">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="h-fit rounded-lg bg-sky-500/20 p-2">
                <Bot className="h-4 w-4 text-sky-300" />
              </div>
              <div className="rounded-lg bg-secondary/50 px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      className="h-2 w-2 rounded-full bg-sky-300"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-white/5 p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about savings, cancellations, score, or emails..."
              className="flex-1 bg-secondary/30"
              disabled={isTyping}
            />
            <Button type="button" variant="outline" size="icon" onClick={() => sendMessage("Generate a cancellation email.")} aria-label="Generate email">
              <Mail className="h-4 w-4" />
            </Button>
            <Button type="submit" variant="gradient" size="icon" disabled={isTyping || !input.trim()} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
