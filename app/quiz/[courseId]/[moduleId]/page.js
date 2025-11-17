"use client";

import { useState } from "react";

export default function QuizClient({ moduleId, questions, onPassed }) {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submitQuiz = async () => {
    setLoading(true);

    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        module_id: moduleId,
        answers: Object.values(answers),
      }),
    });

    const data = await res.json();
    setResult(data);

    if (data.passed) {
      onPassed(); // aktifkan button next
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={q.id} className="p-4 border rounded-xl">
          <h3 className="font-semibold mb-2">
            {idx + 1}. {q.question}
          </h3>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q-${idx}`}
                  value={opt}
                  onChange={() => setAnswers((a) => ({ ...a, [idx]: opt }))}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={submitQuiz}
        disabled={loading}
        className="px-5 py-3 bg-[#1ABC9C] text-white rounded-xl"
      >
        {loading ? "Memproses..." : "Kirim Jawaban"}
      </button>

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-gray-50">
          <p>Skor: {result.score} / 5</p>
          {result.passed ? (
            <p className="text-green-600 font-semibold mt-2">
              Kamu lulus! Silakan lanjut ke modul berikutnya.
            </p>
          ) : (
            <p className="text-red-600 font-semibold mt-2">
              Belum lulus. Minimal 4 benar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
