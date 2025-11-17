// app/quiz/[courseId]/[moduleId]/QuizClient.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizClient({ courseId, moduleId, quizTitle, questions }) {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const orderedAnswers = questions.map((q) => answers[q.id] ?? null);

      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          quiz_id: moduleId,
          answers: orderedAnswers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Gagal mengirim jawaban");
      }

      setResult(data);
    } catch (e) {
      setError(e.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const goBackToModule = () => {
    // balik ke modul sekarang
    router.push(`/learn/${courseId}?m=${moduleId}`);
  };

  const goToNextModule = () => {
    // Next module di-handle dari halaman learn lewat tombol "Modul Berikutnya"
    // Di sini kita cukup kembali ke learn, user bisa klik "Modul Berikutnya"
    router.push(`/learn/${courseId}?m=${moduleId}`);
  };

  const totalQuestions = questions.length || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-2">{quizTitle}</h1>
      <p className="text-gray-600 mb-6">
        Jawablah semua pertanyaan di bawah ini. Minimal{" "}
        <span className="font-semibold">4 jawaban benar</span> untuk bisa lanjut ke modul berikutnya.
      </p>

      {questions.length === 0 && (
        <p className="text-gray-500">Soal untuk modul ini belum tersedia.</p>
      )}

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={q.id} className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3">
              {index + 1}. {q.body}
            </h3>
            <div className="space-y-2">
              {(q.options || []).map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q.id, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-gray-50">
          <p className="font-semibold">
            Skor kamu: {result.score} / {result.total || totalQuestions}
          </p>
          {result.passed ? (
            <p className="text-green-600 mt-1">
              Selamat! Kamu lulus kuis modul ini. Sekarang kamu sudah boleh lanjut ke modul berikutnya.
            </p>
          ) : (
            <p className="text-red-600 mt-1">
              Belum lulus. Minimal 4 jawaban benar. Silakan coba lagi.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting || questions.length === 0}
          className="px-4 py-2 rounded-xl bg-[#1ABC9C] text-white hover:bg-[#16a085] disabled:opacity-60"
        >
          {submitting ? "Mengirim..." : "Kirim Jawaban"}
        </button>

        <button
          onClick={goBackToModule}
          className="px-4 py-2 rounded-xl border border-gray-300"
        >
          Kembali ke Modul
        </button>
      </div>

      {result?.passed && (
        <div className="mt-3">
          <button
            onClick={goToNextModule}
            className="text-sm text-[#1ABC9C] underline"
          >
            Kembali ke halaman belajar dan lanjutkan ke modul berikutnya
          </button>
        </div>
      )}
    </div>
  );
}
