import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { QuickQuestion } from "../components/QuickQuestionCard";

const QuickQuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<QuickQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sel = params.get("selected");
    setSelected(sel ? parseInt(sel) : null);
  }, [location.search]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/quick-question/${id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load question");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !data) return <div className="p-8 text-center text-red-500">{error || "Not found."}</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 mt-8">
      <div className="font-semibold text-lg mb-2 text-primary-700">Quick Question</div>
      <div className="mb-4 text-gray-800">{data.question}</div>
      <div className="grid gap-2 mb-4">
        {data.options.map((opt, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded border transition-all ${
              idx === data.answer
                ? "border-green-500 bg-green-50 text-green-800 font-semibold"
                : idx === selected
                ? "border-red-500 bg-red-50 text-red-800"
                : "border-gray-200 bg-gray-50 text-gray-800"
            }`}
          >
            {opt}
            {idx === data.answer && (
              <span className="ml-2 text-green-600 font-bold">✓</span>
            )}
            {selected === idx && idx !== data.answer && (
              <span className="ml-2 text-red-600 font-bold">✗</span>
            )}
          </div>
        ))}
      </div>
      <button
        className="mt-2 px-5 py-2 rounded bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all"
        onClick={() => navigate(-1)}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default QuickQuestionDetail;
