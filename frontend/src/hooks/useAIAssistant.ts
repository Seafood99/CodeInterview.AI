import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AIService } from "../services/aiServices";
import { Language, Problem } from "../types/interview";

export function useAIAssistant(currentProblem: Problem | null, code: string, language: Language) {
  const { i18n } = useTranslation();
  const [aiMessages, setAiMessages] = useState<
    Array<{ id: string; type: "user" | "ai"; content: string; timestamp: Date }>
  >([]);
  const [userMessage, setUserMessage] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const aiService = AIService.getInstance();

  const handleSendMessage = useCallback(async () => {
    if (!userMessage.trim()) return;
    const newUserMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: "user" as const,
      content: userMessage,
      timestamp: new Date(),
    };
    setAiMessages((prev) => [...prev, newUserMessage]);
    setUserMessage("");
    setIsAiThinking(true);
    try {
      let aiResponse = "";
      if (userMessage.toLowerCase().includes("hint")) {
        aiResponse = await aiService.getHint(currentProblem?.id || 1, code, language);
      } else if (userMessage.toLowerCase().includes("explain")) {
        aiResponse = await aiService.explainCode(code, language);
      } else if (
        userMessage.toLowerCase().includes("debug") ||
        userMessage.toLowerCase().includes("error")
      ) {
        aiResponse = await aiService.debugCode(code, "General debugging request", language);
      } else if (userMessage.toLowerCase().includes("optimize")) {
        aiResponse = await aiService.optimizeCode(code, language);
      } else {
        const lang = i18n.language === 'id' ? 'id' : 'en';
        aiResponse = await aiService.chat(userMessage, code, language, currentProblem?.title ? currentProblem.title[lang] : undefined);
      }
      const aiResponseMessage = {
        id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: "ai" as const,
        content: aiResponse,
        timestamp: new Date(),
      };
      setAiMessages((prev) => [...prev, aiResponseMessage]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("AI Error:", error);
    } finally {
      setIsAiThinking(false);
    }
  }, [userMessage, aiService, currentProblem, code, language]);

  const handleQuickAction = useCallback(
    async (action: string) => {
      setIsAiThinking(true);
      try {
        let response = "";
        switch (action) {
          case "hint":
            response = await aiService.getHint(currentProblem?.id || 1, code, language);
            break;
          case "explain":
            response = await aiService.explainCode(code, language);
            break;
          case "debug":
            response = await aiService.debugCode(code, "Debug request", language);
            break;
          case "optimize":
            response = await aiService.optimizeCode(code, language);
            break;
        }
        const aiMessage = {
          id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          type: "ai" as const,
          content: response,
          timestamp: new Date(),
        };
        setAiMessages((prev) => [...prev, aiMessage]);
      } finally {
        setIsAiThinking(false);
      }
    },
    [aiService, currentProblem, code, language]
  );

  return {
    aiMessages,
    setAiMessages,
    userMessage,
    setUserMessage,
    isAiThinking,
    handleSendMessage,
    handleQuickAction,
  };
}
