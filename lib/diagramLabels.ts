import { normalise } from "@/lib/quiz";

export const respiratoryLabels = [
  { name: "Trachea", accepted: ["trachea", "windpipe"], x: 0, y: 168, width: 75, height: 36 },
  { name: "Lung", accepted: ["lung", "lungs"], x: 340, y: 160, width: 45, height: 22 },
  { name: "Bronchi", accepted: ["bronchi", "bronchus"], x: 0, y: 240, width: 56, height: 23 },
  { name: "Bronchioles", accepted: ["bronchioles", "bronchiole"], x: 340, y: 198, width: 80, height: 22 },
  { name: "Alveoli", accepted: ["alveoli", "alveolus", "air sacs", "air sac"], x: 340, y: 223, width: 80, height: 34 },
  { name: "Diaphragm", accepted: ["diaphragm"], x: 0, y: 300, width: 70, height: 23 }
];

export const digestiveLabels = [
  { name: "Mouth", accepted: ["mouth"], x: 281, y: 20, width: 48, height: 23 },
  { name: "Oesophagus", accepted: ["oesophagus", "esophagus", "gullet"], x: 306, y: 123, width: 90, height: 23 },
  { name: "Liver", accepted: ["liver"], x: 0, y: 166, width: 123, height: 52 },
  { name: "Stomach", accepted: ["stomach"], x: 287, y: 208, width: 130, height: 56 },
  { name: "Small intestine", accepted: ["small intestine"], x: 26, y: 227, width: 100, height: 98 },
  { name: "Large intestine", accepted: ["large intestine", "colon"], x: 0, y: 327, width: 136, height: 70 }
];

export function checkDiagramLabels(answers: string[], labels = respiratoryLabels) {
  return labels.map((label, index) => label.accepted.includes(normalise(answers[index] ?? "")));
}
