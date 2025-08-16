import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useParams, useNavigate } from "react-router-dom";
import { Clock, Brain } from "lucide-react";
import CodeEditor from "../components/CodeEditor";
import ProblemDescription from "../components/ProblemDescription";
import TestResults from "../components/TestResults";
import Timer from "../components/Timer";
import AIAssistantPanel from "../components/AIAssistantPanel";
import { Language, Problem, TestResult } from "../types/interview";
import { API_BASE_URL } from "../config";
import { useTimer } from "../hooks/useTimer";
import { useAIAssistant } from "../hooks/useAIAssistant";

import PROBLEMS from "../data/problemsData";

const InterviewPage: React.FC = () => {
  // Language state for code editor
  const [language, setLanguage] = useState<Language>("javascript");
  // Test results state
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  // Code running state
  const [isRunning, setIsRunning] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  // State
  const [codeMap, setCodeMap] = useState<{ [lang in Language]: string }>({
    javascript: "",
    python: "",
    java: "",
    cpp: "",
  });
  const [code, setCode] = useState("");
  {/* Language switcher removed, as it's already present in the navbar */}
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useTimer(isActive);
  // Get current problem by id
  const currentProblem = PROBLEMS.find((p) => p.id === Number(id)) || null;
  const lang = i18n.language === 'id' ? 'id' : 'en';
  // AI Chat States
  const [showAiPanel, setShowAiPanel] = useState(false);
  const {
    aiMessages,
    setAiMessages,
    userMessage,
    setUserMessage,
    isAiThinking,
    handleSendMessage,
    handleQuickAction,
  } = useAIAssistant(currentProblem, code, language);

  // Timer effect


  // Load starter code & welcome message when problem changes
  useEffect(() => {
    if (currentProblem) {
      setCodeMap((prev) => {
        const starter = currentProblem.starterCode;
        return {
          javascript: prev.javascript || starter.javascript,
          python: prev.python || starter.python,
          java: prev.java || starter.java,
          cpp: prev.cpp || starter.cpp,
        };
      });
      setCode((prev) => prev || currentProblem.starterCode[language]);
      setAiMessages([
        {
          id: "ai-welcome",
          type: "ai",
          content: `👋 Hi! I'm your AI assistant powered by IBM Granite. I'm here to help you solve "${currentProblem.title}". \n\nFeel free to ask me for:\n• 💡 Hints to get started\n• 🔍 Code explanations  \n• 🐛 Debugging help\n• ⚡ Optimization suggestions\n\nGood luck! 🚀`,
          timestamp: new Date(),
        },
      ]);
      // Cek localStorage untuk status soal
      const solved = localStorage.getItem(`ci_solved_${currentProblem.id}`);
      setHasSubmitted(!!solved);
      setHasStarted(!!solved); // Jika sudah submit, anggap sudah mulai
    }
  }, [id, currentProblem, setAiMessages]);

  // Update code saat ganti bahasa
  useEffect(() => {
    if (currentProblem) {
      setCode(codeMap[language] || currentProblem.starterCode[language]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, currentProblem]);

  // formatTime now handled by Timer component

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      setCodeMap((prev) => ({ ...prev, [language]: newCode }));
    },
    [language]
  );

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    // code akan di-set oleh useEffect di atas
  }, []);

  const getFunctionNameForProblem = (problemTitle: string): string => {
    switch (problemTitle) {
      case "Two Sum":
        return "twoSum";
      case "Valid Parentheses":
        return "isValid";
      case "Reverse Linked List":
        return "reverseList";
      case "Maximum Subarray":
        return "maxSubArray";
      case "Binary Tree Inorder Traversal":
        return "inorderTraversal";
      case "3Sum":
        return "threeSum";
      default:
        return "";
    }
  };

  const handleRunCode = useCallback(async () => {
    if (!currentProblem) return;
    setIsRunning(true);
    setTestResults([]);

    try {
  const functionName = getFunctionNameForProblem(currentProblem.title[lang]);

      // Build test cases payload in backend format
      const payloadTestCases = currentProblem.testCases.map((tc) => ({
        input: tc.input,
        expected:
          tc.expectedOutput.length === 1
            ? tc.expectedOutput[0]
            : tc.expectedOutput,
      }));

      const res = await fetch(`${API_BASE_URL}/api/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          functionName,
          testCases: payloadTestCases,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Execution failed");

      const results: TestResult[] = (data.results || []).map(
        (r: any, idx: number) => ({
          id: String(idx + 1),
          passed: !!r.passed,
          input: Array.isArray(r.input) ? r.input : [r.input],
          expectedOutput: Array.isArray(r.expected) ? r.expected : [r.expected],
          actualOutput: Array.isArray(r.actual) ? r.actual : [r.actual],
          executionTime:
            typeof data.executionTime === "number" ? data.executionTime : 0,
          error: r.error,
        })
      );

      setTestResults(results);
    } catch (err: any) {
      setTestResults([
        {
          id: "error",
          passed: false,
          input: [],
          expectedOutput: [],
          actualOutput: [],
          executionTime: 0,
          error: err?.message || "Execution error",
        },
      ]);
      // Log error ke console untuk debugging
      // eslint-disable-next-line no-console
      console.error("RunCode Error:", err);
    } finally {
      setIsRunning(false);
    }
  }, [currentProblem, code, language]);


  // Handler tombol Start
  const handleStart = () => {
    setHasStarted(true);
    setIsActive(true);
    setTimer(0);
  };

  // Handler tombol Submit
  const handleSubmit = () => {
    setHasSubmitted(true);
    setIsActive(false);
    // Simpan status ke localStorage
    localStorage.setItem(
      `ci_solved_${currentProblem?.id}`,
      JSON.stringify({
        id: currentProblem?.id,
        time: timer,
        code,
        date: new Date().toISOString(),
      })
    );
  };

  if (!currentProblem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-full mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        {/* Language switcher removed, already present in navbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/problems")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Problems
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentProblem.title[lang]}
            </h1>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                currentProblem.difficulty === "Easy"
                  ? "text-green-600 bg-green-100"
                  : currentProblem.difficulty === "Medium"
                  ? "text-yellow-600 bg-yellow-100"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {currentProblem.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Timer timer={timer} />
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showAiPanel
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>{t("aiAssistant")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description */}
        <div className="w-1/2 bg-white border-r overflow-y-auto">
          <ProblemDescription problem={currentProblem} />
        </div>

        {/* Code Editor & Results, hanya tampil jika sudah mulai */}
        <div className="w-1/2 flex flex-col relative">
          {!hasStarted && !hasSubmitted && (
            <div className="flex flex-col items-center justify-center h-full">
              <button
                className="px-8 py-3 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
                onClick={handleStart}
              >
                {t("start")}
              </button>
            </div>
          )}
          {(hasStarted || hasSubmitted) && (
            <>
              <div className="flex-1 p-6">
                <CodeEditor
                  initialCode={code}
                  language={language}
                  onCodeChange={handleCodeChange}
                  onLanguageChange={handleLanguageChange}
                  onRun={handleRunCode}
                  isRunning={isRunning}
                  hideRunButton={showAiPanel}
                />
              </div>
              <TestResults testResults={testResults} />
              {!hasSubmitted && (
                <div className="p-6 border-t flex justify-end">
                  <button
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    onClick={handleSubmit}
                  >
                    {t("submit")}
                  </button>
                </div>
              )}
              {hasSubmitted && (
                <div className="p-6 border-t text-green-700 font-semibold text-center">
                  {t("submittedMessage")}
                </div>
              )}
            </>
          )}
        </div>

        {/* AI Assistant Overlay Panel */}
        <AIAssistantPanel
          show={showAiPanel}
          onClose={() => setShowAiPanel(false)}
          aiMessages={aiMessages}
          userMessage={userMessage}
          setUserMessage={setUserMessage}
          isAiThinking={isAiThinking}
          handleSendMessage={handleSendMessage}
          handleQuickAction={handleQuickAction}
        />
      </div>
    </div>
  );
};

export default InterviewPage;
