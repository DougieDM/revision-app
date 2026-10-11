"use client";

import type { GeneratedQuestion } from "@/types/quiz";

interface FeedbackCardProps {
  question: GeneratedQuestion;
  correct: boolean;
  dontKnow?: boolean;
  onNext: () => void;
  isLast: boolean;
}

export function FeedbackCard({ question, correct, dontKnow, onNext, isLast }: FeedbackCardProps) {
  const title = dontKnow ? "No problem. Let's learn it together." : correct ? "Great answer!" : "Good try. Let's check the answer.";

  return (
    <section className={`rounded-lg border-2 p-5 shadow-soft ${correct ? "border-emerald-400 bg-emerald-950/40" : "border-transparent bg-surface"}`}>
      <div role="status" className={`flex items-center gap-3 ${correct ? "text-emerald-300" : "text-purple-300"}`}>
        {correct ? <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-2xl font-bold text-emerald-950">✓</span> : null}
        <p className="text-lg font-bold">{correct ? "Correct! Great answer." : title}</p>
      </div>
      {!correct ? (
        <p className="mt-3 text-base text-ink">
          The answer is <strong>{question.answer}</strong>.
        </p>
      ) : null}
      <div className={`mt-4 rounded-lg p-4 text-base leading-relaxed text-ink ${correct ? "bg-emerald-950" : "bg-purple-950"}`}>
        <strong>Let&apos;s remember this:</strong> {question.explanation}
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-6 w-full rounded-lg bg-brand-pink px-4 py-4 text-lg font-bold text-white"
      >
        {isLast ? "See my score" : "Next question"}
      </button>
    </section>
  );
}
