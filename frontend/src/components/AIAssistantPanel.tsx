import React from "react";
import {
  Brain,
  Lightbulb,
  Code,
  Bug,
  Zap,
  Send,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIAssistantPanelProps {
  show: boolean;
  onClose: () => void;
  aiMessages: Message[];
  userMessage: string;
  setUserMessage: (msg: string) => void;
  isAiThinking: boolean;
  handleSendMessage: () => void;
  handleQuickAction: (action: string) => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  show,
  onClose,
  aiMessages,
  userMessage,
  setUserMessage,
  isAiThinking,
  handleSendMessage,
  handleQuickAction,
}) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <div className="fixed top-20 right-8 w-[400px] max-w-[90vw] h-[70vh] z-50 bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col animate-fadein">
      <div className="p-4 border-b bg-white flex items-center justify-between rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary-600" />
          <span className="font-semibold">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 text-xl font-bold px-2"
        >
          ×
        </button>
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-b bg-white">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickAction("hint")}
            className="flex items-center space-x-1 p-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
          >
            <Lightbulb className="h-3 w-3" />
            <span>{t("hint")}</span>
          </button>
          <button
            onClick={() => handleQuickAction("explain")}
            className="flex items-center space-x-1 p-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
          >
            <Code className="h-3 w-3" />
            <span>{t("explain")}</span>
          </button>
          <button
            onClick={() => handleQuickAction("debug")}
            className="flex items-center space-x-1 p-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
          >
            <Bug className="h-3 w-3" />
            <span>{t("debug")}</span>
          </button>
          <button
            onClick={() => handleQuickAction("optimize")}
            className="flex items-center space-x-1 p-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors"
          >
            <Zap className="h-3 w-3" />
            <span>{t("optimize")}</span>
          </button>
        </div>
      </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {aiMessages.map((message) => (
          <div
            key={message.id}
            className={`${message.type === "user" ? "ml-8" : "mr-8"}`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.type === "user"
                  ? "bg-primary-600 text-white ml-auto"
                  : "bg-white border"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>
              <div
                className={`text-xs mt-1 ${
                  message.type === "user"
                    ? "text-primary-100"
                    : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isAiThinking && (
          <div className="mr-8">
            <div className="bg-white border p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
                <span className="text-sm text-gray-600">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Message Input */}
      <div className="p-4 border-t bg-white rounded-b-xl">
        <div className="flex space-x-2">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={t("askAi")}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!userMessage.trim() || isAiThinking}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
