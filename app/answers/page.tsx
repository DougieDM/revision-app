"use client";

import { topicLabel } from "@/lib/topicLabels";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { buildPrintableTest } from "@/lib/quiz";

export default function AnswersPage() {
  return <Suspense fallback={<p className="p-6">Preparing your test…</p>}><AnswersContent /></Suspense>;
}

function AnswersContent() {
  const params = useSearchParams();
  const topic = params.get("topic") ?? "All available topics";
  const subtopic = params.get("subtopic") ?? "";
  const scope = new URLSearchParams({ topic, subtopic }).toString();
  const questions = buildPrintableTest(topic, subtopic);

  return (
    <main className="min-h-screen bg-zinc-900 px-4 py-6">
      <div className="no-print mx-auto mb-4 flex max-w-3xl items-center justify-between">
        <Link href={`/print?${scope}`} className="font-bold text-pink-300">
          Printable test
        </Link>
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-brand-pink px-4 py-2 font-bold text-white">
          Print answers
        </button>
      </div>
      <section className="print-page mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black text-ink">Answer Sheet</h1>
        <p className="mt-2 text-zinc-300">{topicLabel(topic)}{subtopic ? ` · ${subtopic}` : ""}</p>
        <ol className="mt-8 space-y-4">
          {questions.map((question, index) => (
            <li key={question.id} className="break-inside-avoid">
              <p className="font-bold text-ink">
                {index + 1}. {question.answer}
              </p>
              <p className="mt-1 text-zinc-300">{question.explanation}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
