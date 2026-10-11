import { normalise } from "@/lib/quiz";

export const respiratoryLabels = [
  { name: "Trachea", accepted: ["trachea", "windpipe"], x: 0, y: 168, width: 75, height: 36 },
  { name: "Lung", accepted: ["lung", "lungs"], x: 340, y: 160, width: 45, height: 22 },
  { name: "Bronchi", accepted: ["bronchi", "bronchus"], x: 0, y: 240, width: 56, height: 23 },
  { name: "Bronchioles", accepted: ["bronchioles", "bronchiole"], x: 340, y: 198, width: 80, height: 22 },
  { name: "Alveoli", accepted: ["alveoli", "alveolus", "air sacs", "air sac"], x: 340, y: 223, width: 80, height: 34 },
  { name: "Diaphragm", accepted: ["diaphragm"], x: 0, y: 300, width: 70, height: 23 }
];

export function checkDiagramLabels(answers: string[]) {
  return respiratoryLabels.map((label, index) => label.accepted.includes(normalise(answers[index] ?? "")));
}
