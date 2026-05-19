"use client";

import Link from "next/link";
import { buildPrintableTest } from "@/lib/quiz";

export default function PrintPage() {
  const questions = buildPrintableTest();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="no-print mx-auto mb-4 flex max-w-3xl items-center justify-between">
        <Link href="/" className="font-bold text-ocean">
          Home
        </Link>
        <div className="flex gap-2">
          <Link href="/answers" className="rounded-lg bg-white px-4 py-2 font-bold text-ink">
            Answer sheet
          </Link>
          <button type="button" onClick={() => window.print()} className="rounded-lg bg-ocean px-4 py-2 font-bold text-white">
            Print
          </button>
        </div>
      </div>
      <section className="print-page mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black text-ink">Year 7 Science Printable Test</h1>
        <p className="mt-2 text-slate-600">20 questions. Try your best, then mark with the answer sheet.</p>
        <ol className="mt-8 space-y-5">
          {questions.map((question, index) => (
            <li key={question.id} className="break-inside-avoid">
              <p className="font-bold text-ink">
                {index + 1}. {question.question}
              </p>
              {question.options?.length ? (
                <ul className="mt-2 grid gap-1 pl-4 text-slate-700">
                  {question.options.map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 h-12 border-b border-slate-300" />
              )}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
