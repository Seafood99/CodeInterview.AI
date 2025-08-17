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
import { useNavigationBlock } from "../contexts/NavigationBlockContext";

const InterviewPage: React.FC = () => {
  // Navigation block context
  const { setBlockNavigation, setOnTryNavigate } = useNavigationBlock();

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
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useTimer(isActive);
  // Get current problem by id
  const currentProblem = PROBLEMS.find((p) => p.id === Number(id)) || null;
  const lang = i18n.language === 'id' ? 'id' : 'en';
  // AI Chat States
  const [showAiPanel, setShowAiPanel] = useState(false);
  // Mobile view state
  const [showDescription, setShowDescription] = useState(true);
  const {
    aiMessages,
    setAiMessages,
    userMessage,
    setUserMessage,
    isAiThinking,
    handleSendMessage,
    handleQuickAction,
  } = useAIAssistant(currentProblem, code, language);

  // Maintain navigation block state based on user's progress
  useEffect(() => {
    // Always unblock if submitted or not started
    if (!hasStarted || hasSubmitted) {
      setBlockNavigation(false);
      setOnTryNavigate(null);
    }
    // Cleanup when unmounting
    return () => {
      setBlockNavigation(false);
      setOnTryNavigate(null);
    };
  }, [hasStarted, hasSubmitted, setBlockNavigation, setOnTryNavigate]);

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
  const handleStart = useCallback(() => {
    setHasStarted(true);
    setIsActive(true);
    setTimer(0);
    // Jika di mobile, langsung tampilkan editor
    if (window.innerWidth < 1024) {
      setShowDescription(false);
    }
    // Set block navigation immediately when user starts
    setBlockNavigation(true);
    setOnTryNavigate(async () => {
      return window.confirm(t("confirmLeaveMessage", "Kamu belum submit jawaban. Apakah yakin ingin keluar?"));
    });
  }, [setBlockNavigation, setOnTryNavigate, t]);

  // Handler tombol Submit
  const handleSubmit = () => {
    setHasSubmitted(true);
    setIsActive(false);
    // Jika di mobile, langsung tampilkan editor agar tombol Resubmit terlihat
    if (window.innerWidth < 1024) {
      setShowDescription(false);
    }
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
    // Setelah submit dan user konfirmasi mengakhiri sesi, unblock navigation
    setBlockNavigation(false);
    setOnTryNavigate(null);
  };

  const [showConfirm, setShowConfirm] = useState(false);
const [pendingNavigation, setPendingNavigation] = useState<null | (() => void)>(null);

  if (!currentProblem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-full mx-auto h-screen flex flex-col px-2 sm:px-4 bg-gray-50">
      {/* Header */}
  <div className="bg-white border-b px-3 sm:px-6 py-3 sm:py-4">
        {/* Language switcher removed, already present in navbar */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                if (!hasSubmitted) {
                  setShowConfirm(true);
                  setPendingNavigation(() => () => navigate("/problems"));
                } else {
                  navigate("/problems");
                }
              }}
              className="text-gray-600 hover:text-gray-800 min-h-[36px] min-w-[100px] px-2 py-1 rounded"
              disabled={!hasSubmitted}
              style={!hasSubmitted ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              ← Back to Problems
            </button>
      {/* Confirm Leave Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">{t("confirmLeaveTitle", "Keluar dari soal?")}</h2>
            <p className="mb-6">{t("confirmLeaveMessage", "Kamu belum submit jawaban. Apakah yakin ingin keluar?")}</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowConfirm(false);
                  setPendingNavigation(null);
                }}
              >
                {t("cancel", "Batal")}
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  setShowConfirm(false);
                  if (pendingNavigation) pendingNavigation();
                }}
              >
                {t("leaveAnyway", "Keluar")}
              </button>
            </div>
          </div>
        </div>
      )}
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
          <div className="flex items-center gap-2 sm:gap-6">
            <Timer timer={timer} />
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`flex items-center gap-2 px-3 py-2 min-h-[36px] min-w-[100px] rounded-lg transition-colors text-base ${
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
  <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-2">
        {/* Header Controls for Mobile */}
  <div className="lg:hidden flex items-center justify-between p-2 border-b bg-white">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="px-4 py-2 min-h-[36px] min-w-[100px] bg-gray-100 rounded-lg font-medium text-gray-700 hover:bg-gray-200 text-base"
          >
            {showDescription ? t("showEditor") : t("showProblem")}
          </button>
          <div className="flex items-center gap-2">
            <Timer timer={timer} />
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`flex items-center gap-2 px-3 py-2 min-h-[36px] min-w-[36px] rounded-lg transition-colors text-base ${
                showAiPanel
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Brain className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Problem Description - Full width on mobile when shown */}
        <div className={`${
          showDescription ? 'block' : 'hidden'
        } lg:block lg:w-1/2 bg-white border-r overflow-y-auto w-full max-w-full`}>
          <ProblemDescription problem={currentProblem} />
          {/* Tombol Start di bawah deskripsi soal, hanya di mobile dan jika belum mulai */}
          {!hasStarted && !hasSubmitted && (
            <div className="block lg:hidden w-full p-4 flex justify-center">
              <button
                className="w-full max-w-sm px-8 py-3 min-h-[44px] bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
                onClick={handleStart}
              >
                {t("start")}
              </button>
            </div>
          )}
        </div>

        {/* Code Editor & Results, hanya tampil jika sudah mulai */}
        <div className={`${
          !showDescription ? 'block' : 'hidden'
        } lg:block lg:w-1/2 flex flex-col relative w-full max-w-full`}>
          {!hasStarted && !hasSubmitted && (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <button
                className="w-full max-w-sm px-8 py-3 min-h-[44px] bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
                onClick={handleStart}
              >
                {t("start")}
              </button>
            </div>
          )}
          {(hasStarted || hasSubmitted) && (
            <>
              <div className="flex-1 p-2 sm:p-4 md:p-6">
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
                <div className="p-4 sm:p-6 border-t flex flex-col items-end gap-2">
                  <div className="flex gap-2 w-full">
                    <button
                      className={`flex-1 px-4 py-2 min-h-[40px] rounded-lg font-semibold transition-colors text-base ${testResults.length > 0 && testResults.every(r => r.passed) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      onClick={() => {
                        if (testResults.length > 0 && testResults.every(r => r.passed)) handleSubmit();
                      }}
                      disabled={!(testResults.length > 0 && testResults.every(r => r.passed))}
                    >
                      {t("submit")}
                    </button>
                    <button
                      className="flex-1 px-4 py-2 min-h-[40px] bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-base"
                      onClick={() => {
                        if (window.confirm(t('confirmEndAnyway', 'Jawabanmu belum benar. Akhiri dan submit sebagai gagal?'))) {
                          handleSubmit();
                        }
                      }}
                    >
                      {t('finishAnyway', 'Akhiri')}
                    </button>
                  </div>
                </div>
              )}
              {hasSubmitted && (
                <div className="p-4 sm:p-6 border-t flex flex-col items-center gap-3 mt-2">
                  <div className="text-green-700 font-semibold text-center">
                    {t("submittedMessage")}
                  </div>
                  <button
                    className="w-full max-w-xs px-6 py-3 min-h-[44px] bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-base shadow-md"
                    style={{ position: 'relative', zIndex: 10 }}
                    onClick={() => {
                      setHasSubmitted(false);
                      setHasStarted(true);
                      setIsActive(true);
                      setTimer(0);
                      setTestResults([]);
                    }}
                  >
                    {t('resubmit', 'Resubmit')}
                  </button>
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
