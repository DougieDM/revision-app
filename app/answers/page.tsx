"use client";

import Link from "next/link";
import { buildPrintableTest } from "@/lib/quiz";

export default function AnswersPage() {
  const questions = buildPrintableTest();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="no-print mx-auto mb-4 flex max-w-3xl items-center justify-between">
        <Link href="/print" className="font-bold text-ocean">
          Printable test
        </Link>
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-ocean px-4 py-2 font-bold text-white">
          Print answers
        </button>
      </div>
      <section className="print-page mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black text-ink">Answer Sheet</h1>
        <ol className="mt-8 space-y-4">
          {questions.map((question, index) => (
            <li key={question.id} className="break-inside-avoid">
              <p className="font-bold text-ink">
                {index + 1}. {question.answer}
              </p>
              <p className="mt-1 text-slate-600">{question.explanation}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
