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
  const title = dontKnow ? "No problem. Let's learn it together." : correct ? "Great answer!" : "Good try - nearly there.";

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft">
      <p className={`text-lg font-bold ${correct ? "text-ocean" : "text-berry"}`}>{title}</p>
      {!correct ? (
        <p className="mt-3 text-base text-ink">
          The answer is <strong>{question.answer}</strong>.
        </p>
      ) : null}
      <div className="mt-4 rounded-lg bg-teal-50 p-4 text-base leading-relaxed text-ink">
        <strong>Let&apos;s remember this:</strong> {question.explanation}
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-6 w-full rounded-lg bg-ocean px-4 py-4 text-lg font-bold text-white"
      >
        {isLast ? "See my score" : "Next question"}
      </button>
    </section>
  );
}
