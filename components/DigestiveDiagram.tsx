import { digestiveLabels } from "@/lib/diagramLabels";

export function DigestiveDiagram({ labelled = false }: { labelled?: boolean }) {
  return <figure className="mt-5 rounded-lg bg-white p-3 text-zinc-900">
    <svg viewBox="0 0 417 400" role="img" aria-labelledby="digestive-title" className="mx-auto w-full max-w-lg">
      <title id="digestive-title">{labelled ? "Digestive-system illustration with named organs." : "Digestive-system illustration with six numbered label spaces and leader lines pointing to the organs to identify."}</title>
      <image href="/diagrams/digestive-resource.png" width="417" height="400" />
      <rect x="400" width="17" height="400" fill="white" />
      {!labelled && digestiveLabels.map((label, index) => <g key={label.name}>
        <rect x={label.x} y={label.y} width={label.width} height={label.height} fill="white" />
        <rect x={label.x + 2} y={label.y + 2} width="30" height="20" rx="4" fill="#fce7f3" stroke="#be185d" />
        <text x={label.x + 17} y={label.y + 17} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#831843">{index + 1}</text>
      </g>)}
    </svg>
    <figcaption className="mt-2 text-xs text-zinc-600">Digestive-system illustration from the school Organisms knowledge organiser, page 1.{!labelled ? " Follow each numbered leader line to identify the organ." : ""}</figcaption>
  </figure>;
}
