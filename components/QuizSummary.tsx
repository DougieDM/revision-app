"use client";

import Link from "next/link";
import { getTopicBreakdown, getWeakAreas } from "@/lib/quiz";
import type { AnswerRecord } from "@/types/quiz";

interface QuizSummaryProps {
  score: number;
  total: number;
  answers: AnswerRecord[];
  onRetryWeak: () => void;
  onNewQuiz: () => void;
}

export function QuizSummary({ score, total, answers, onRetryWeak, onNewQuiz }: QuizSummaryProps) {
  const percentage = Math.round((score / total) * 100);
  const breakdown = getTopicBreakdown(answers);
  const weakAreas = getWeakAreas(answers);

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-berry">Nova&apos;s summary</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">
        You scored {score}/{total}
      </h1>
      <p className="mt-2 text-xl font-semibold text-ocean">{percentage}%</p>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        {percentage >= 80
          ? "Brilliant focus. Keep revisiting the tricky bits so they stay fresh."
          : percentage >= 50
            ? "Nice work. A little repeat practice will make the ideas feel much easier."
            : "Good effort. Let’s use this to choose exactly what to practise next."}
      </p>

      <div className="mt-6 space-y-3">
        <h2 className="text-lg font-bold text-ink">Topic breakdown</h2>
        {Object.entries(breakdown).map(([topic, item]) => (
          <div key={topic} className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{topic}</span>
              <span className="font-bold text-ocean">
                {item.correct}/{item.total}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-amber-50 p-4">
        <h2 className="text-lg font-bold text-ink">Suggested revision focus</h2>
        {weakAreas.length ? (
          <ul className="mt-3 space-y-2 text-base text-ink">
            {weakAreas.slice(0, 5).map((area) => (
              <li key={area}>Practise: {area}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-base text-ink">No weak areas this time. Try a challenge quiz next.</p>
        )}
      </div>

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={onRetryWeak}
          className="rounded-lg bg-berry px-4 py-4 text-lg font-bold text-white"
        >
          Retry weak areas
        </button>
        <button
          type="button"
          onClick={onNewQuiz}
          className="rounded-lg bg-ocean px-4 py-4 text-lg font-bold text-white"
        >
          New random quiz
        </button>
        <Link
          href="/progress"
          className="rounded-lg border-2 border-slate-200 bg-white px-4 py-4 text-center text-lg font-bold text-ink"
        >
          View progress
        </Link>
      </div>
    </section>
  );
}
