"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ProgressSummary } from "@/components/ProgressSummary";
import { clearProgress, emptyProgress, loadProgress } from "@/lib/progress";
import type { ProgressState } from "@/types/quiz";

export function ReadinessDashboard() {
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Image src="/readispark-logo-black.png" alt="Readispark" width={2172} height={724} priority className="h-auto w-56 max-w-full" />
          <Link href="/make-a-test" className="rounded-lg bg-brand-pink px-5 py-3 font-bold text-white">Make a test</Link>

        </div>
        <ProgressSummary progress={progress} />
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("Reset practice history and readiness on this browser? This cannot be undone. Your test settings and checklist ratings will be kept.")) return;
              clearProgress();
              setProgress(emptyProgress);
            }}
            className="rounded-lg bg-surface px-3 py-2 text-sm font-bold text-zinc-300 shadow-sm"
          >
            Reset practice progress
          </button>
        </div>
      </div>
    </main>
  );
}
