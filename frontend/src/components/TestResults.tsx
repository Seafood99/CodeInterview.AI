import React from "react";
import { useTranslation } from "react-i18next";
import { TestResult } from "../types/interview";
import { CheckCircle, XCircle } from "lucide-react";

interface TestResultsProps {
  testResults: TestResult[];
}

const TestResults: React.FC<TestResultsProps> = ({ testResults }) => {
  const { t } = useTranslation();

  if (!testResults.length) return null;

  return (
    <div className="border-t p-3 sm:p-4 md:p-6 max-h-48 sm:max-h-64 overflow-y-auto">
      <h4 className="font-semibold mb-3 flex items-center justify-between">
        <span>{t("testResults")}</span>
        <span className="text-sm font-normal text-gray-500">
          {testResults.filter(r => r.passed).length}/{testResults.length} {t("passed")}
        </span>
      </h4>
      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div
            key={result.id}
            className={`p-2 sm:p-3 rounded-lg border text-sm ${
              result.passed
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {result.passed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium">
                  Test {index + 1}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {result.executionTime}ms
              </span>
            </div>
            <div className="space-y-1 text-xs sm:text-sm break-all">
              <details>
                <summary className="cursor-pointer hover:text-gray-600">{t("showDetails")}</summary>
                <div className="mt-2 space-y-1 pl-2 border-l-2 border-gray-200">
                  <div>
                    {t("input")}: {JSON.stringify(result.input)}
                  </div>
                  <div>
                    {t("expected")}: {JSON.stringify(result.expectedOutput)}
                  </div>
                  <div>
                    {t("got")}: {JSON.stringify(result.actualOutput)}
                  </div>
                  {result.error && (
                    <div className="text-red-600 mt-1">
                      {t("error")}: {result.error}
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
