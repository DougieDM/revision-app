"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProgressSummary } from "@/components/ProgressSummary";
import { clearProgress, emptyProgress, loadProgress } from "@/lib/progress";
import type { ProgressState } from "@/types/quiz";

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-ocean">
            Home
          </Link>
          <button
            type="button"
            onClick={() => {
              clearProgress();
              setProgress(emptyProgress);
            }}
            className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm"
          >
            Reset
          </button>
        </div>
        <ProgressSummary progress={progress} />
      </div>
    </main>
  );
}
