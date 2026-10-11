import { respiratoryLabels } from "@/lib/diagramLabels";

export function RespiratoryDiagram() {
  return <figure className="mt-5 rounded-lg bg-white p-3 text-zinc-900">
    <svg viewBox="0 0 485 330" role="img" aria-labelledby="respiratory-title" className="w-full">
      <title id="respiratory-title">Respiratory-system illustration with six numbered label spaces and leader lines pointing to the parts to identify.</title>
      <image href="/diagrams/respiratory-resource.png" width="485" height="330" />
      {respiratoryLabels.map((label, index) => <g key={label.name}>
        <rect x={label.x} y={label.y} width={label.width} height={label.height} fill="white" />
        <rect x={label.x + 2} y={label.y + 2} width="30" height="20" rx="4" fill="#fce7f3" stroke="#be185d" />
        <text x={label.x + 17} y={label.y + 17} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#831843">{index + 1}</text>
      </g>)}
    </svg>
    <figcaption className="mt-2 text-xs text-zinc-600">Illustration from the school Organisms knowledge organiser, page 1. Follow each numbered leader line to identify the part.</figcaption>
  </figure>;
}
