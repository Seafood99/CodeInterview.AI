import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface QuickQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number; // index of correct answer
  aiStatus?: 'powered' | 'fallback';
  aiLog?: string | null;
}

const QuickQuestionCard: React.FC = () => {
  const [data, setData] = useState<QuickQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ganti endpoint ini sesuai backend kamu
    fetch("/api/quick-question")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load question");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading Quick Question...</div>;
  if (error || !data) return <div className="p-4 text-red-500">{error || "No question available."}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-lg text-primary-700">Quick Question</div>
        {data.aiStatus === 'powered' ? (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">Powered by IBM Granite</span>
        ) : (
          <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">Fallback mode</span>
        )}
      </div>
      <div className="mb-4 text-gray-800">{data.question}</div>
      <div className="grid gap-2">
        {data.options.map((opt, idx) => (
          <button
            key={idx}
            className="w-full px-4 py-2 rounded border border-primary-200 bg-primary-50 hover:bg-primary-100 text-left transition-all"
            onClick={() => navigate(`/quick-question/${data.id}?selected=${idx}`)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickQuestionCard;
