import { Suspense } from "react";
import { QuizClient } from "@/components/QuizClient";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen px-4 py-6">
          <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-soft">
            <h1 className="text-2xl font-bold text-ink">Getting your quiz ready...</h1>
          </div>
        </main>
      }
    >
      <QuizClient />
    </Suspense>
  );
}
