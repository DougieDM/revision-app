export function QuestionIllustration({ question }: { question: string }) {
  if (!/bell.jar/i.test(question)) return null;
  return <figure className="mt-5 rounded-lg bg-white p-4 text-zinc-900">
    <svg viewBox="0 0 520 300" className="w-full" role="img" aria-labelledby="bell-jar-title">
      <title id="bell-jar-title">Bell-jar breathing model: a tube branches into two balloons inside a rigid jar, sealed by a rubber sheet at the bottom.</title>
      <path d="M160 250V95Q160 35 215 35H305Q360 35 360 95V250" fill="#eff6ff" stroke="#334155" strokeWidth="4" />
      <path d="M260 10V110L215 160M260 110L305 160" fill="none" stroke="#64748b" strokeWidth="12" />
      <ellipse cx="210" cy="180" rx="32" ry="48" fill="#f9a8d4" stroke="#be185d" strokeWidth="3" />
      <ellipse cx="310" cy="180" rx="32" ry="48" fill="#f9a8d4" stroke="#be185d" strokeWidth="3" />
      <path d="M155 250Q260 280 365 250" fill="none" stroke="#7e22ce" strokeWidth="8" />
      <g fill="none" stroke="#334155" strokeWidth="2"><path d="M270 20H390"/><path d="M342 178H390"/><path d="M360 100H390"/><path d="M260 267H390"/></g>
      <g fill="#0f172a" fontSize="18"><text x="395" y="25">Tube</text><text x="395" y="105">Rigid jar</text><text x="395" y="183">Balloon</text><text x="395" y="272">Rubber sheet</text></g>
    </svg>
    <figcaption className="text-sm text-zinc-600">Bell-jar model described in the school breathing checklist. This is a simplified schematic.</figcaption>
  </figure>;
}
