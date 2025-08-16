import React from "react";
import { useTranslation } from "react-i18next";
import { Problem } from "../types/interview";

interface ProblemDescriptionProps {
  problem: Problem;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const { t } = useTranslation();

  const { i18n } = useTranslation();
  const lang = i18n.language === 'id' ? 'id' : 'en';
  return (
    <div className="p-6">
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold mb-4">
          {t("problemDescription")}
        </h3>
        <div className="whitespace-pre-line text-gray-700 mb-6">
          {problem.description[lang]}
        </div>

        <h4 className="font-semibold mb-3">{t("examples")}</h4>
        {problem.examples.map((example, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="mb-2">
              <strong>{t("input")}:</strong>{" "}
              <code className="bg-gray-200 px-1 rounded">
                {example.input}
              </code>
            </div>
            <div className="mb-2">
              <strong>{t("output")}:</strong>{" "}
              <code className="bg-gray-200 px-1 rounded">
                {example.output}
              </code>
            </div>
            {example.explanation && (
              <div className="text-sm text-gray-600">
                <strong>{t("explanation")}:</strong> {example.explanation[lang]}
              </div>
            )}
          </div>
        ))}

        <h4 className="font-semibold mb-3">{t("constraints")}</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {problem.constraints.map((constraint, index) => (
            <li key={index}>{constraint[lang]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemDescription;
