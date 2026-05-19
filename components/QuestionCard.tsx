"use client";

import type { GeneratedQuestion } from "@/types/quiz";

interface QuestionCardProps {
  question: GeneratedQuestion;
  questionNumber: number;
  total: number;
  answer: string;
  showHint: boolean;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onDontKnow: () => void;
  onToggleHint: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  total,
  answer,
  showHint,
  onAnswerChange,
  onSubmit,
  onDontKnow,
  onToggleHint
}: QuestionCardProps) {
  const progress = Math.round((questionNumber / total) * 100);

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-500">
          <span>
            Question {questionNumber} of {total}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-ocean" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="mb-2 text-sm font-semibold text-berry">{question.topic}</p>
      <h1 className="text-2xl font-bold leading-snug text-ink">{question.question}</h1>
      <p className="mt-2 text-sm text-slate-500">{question.subtopic}</p>

      {question.options?.length ? (
        <div className="mt-6 grid gap-3">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onAnswerChange(option)}
              className={`rounded-lg border-2 px-4 py-4 text-left text-lg font-semibold transition ${
                answer === option
                  ? "border-ocean bg-teal-50 text-ocean"
                  : "border-slate-200 bg-white text-ink hover:border-teal-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          className="mt-6 min-h-32 w-full rounded-lg border-2 border-slate-200 bg-white p-4 text-lg text-ink outline-none focus:border-ocean"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
        />
      )}

      {showHint ? (
        <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm font-medium text-amber-900">
          Hint: {question.hint}
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-lg bg-ocean px-4 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-teal-800"
        >
          Check answer
        </button>
        <button
          type="button"
          onClick={onToggleHint}
          className="rounded-lg border-2 border-amber-200 bg-amber-50 px-4 py-4 text-lg font-bold text-amber-900"
        >
          Hint
        </button>
        <button
          type="button"
          onClick={onDontKnow}
          className="rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-4 text-lg font-bold text-slate-700"
        >
          I don&apos;t know
        </button>
      </div>
    </section>
  );
}
