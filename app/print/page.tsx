"use client";

import { topicLabel } from "@/lib/topicLabels";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { buildPrintableTest } from "@/lib/quiz";

export default function PrintPage() {
  return <Suspense fallback={<p className="p-6">Preparing your test…</p>}><PrintContent /></Suspense>;
}

function PrintContent() {
  const params = useSearchParams();
  const topic = params.get("topic") ?? "All available topics";
  const subtopic = params.get("subtopic") ?? "";
  const scope = new URLSearchParams({ topic, subtopic }).toString();
  const questions = buildPrintableTest(topic, subtopic);

  return (
    <main className="min-h-screen bg-zinc-900 px-4 py-6">
      <div className="no-print mx-auto mb-4 flex max-w-3xl items-center justify-between">
        <Link href="/" className="font-bold text-pink-300">
          Home
        </Link>
        <div className="flex gap-2">
          <Link href={`/answers?${scope}`} className="rounded-lg bg-surface px-4 py-2 font-bold text-ink">
            Answer sheet
          </Link>
          <button type="button" onClick={() => window.print()} className="rounded-lg bg-brand-pink px-4 py-2 font-bold text-white">
            Print
          </button>
        </div>
      </div>
      <section className="print-page mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black text-ink">{topic === "All available topics" ? "Science" : topicLabel(topic)} Printable Test</h1>
        <p className="mt-2 text-zinc-300">{questions.length} questions{ subtopic ? ` · ${subtopic}` : "" }. Try your best, then mark with the answer sheet.</p>
        <ol className="mt-8 space-y-5">
          {questions.map((question, index) => (
            <li key={question.id} className="break-inside-avoid">
              <p className="font-bold text-ink">
                {index + 1}. {question.question}
              </p>
              {question.options?.length ? (
                <ul className="mt-2 grid gap-1 pl-4 text-zinc-200">
                  {question.options.map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 h-12 border-b border-zinc-700" />
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
