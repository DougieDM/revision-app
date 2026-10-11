import { DiagramExercise } from "@/components/DiagramExercise";
import { DigestiveDiagram } from "@/components/DigestiveDiagram";
import { digestiveLabels } from "@/lib/diagramLabels";

export default function DigestiveLabelPage() {
  return <DiagramExercise labels={digestiveLabels} system="digestive" area="Digestive system" diagram={<DigestiveDiagram />} explanation="Food travels from the mouth through the oesophagus to the stomach, then the small and large intestines. The small intestine absorbs nutrients. The large intestine absorbs water. The liver makes bile to help digest fats; food does not pass through the liver." />;
}
