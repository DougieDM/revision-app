import { DiagramExercise } from "@/components/DiagramExercise";
import { RespiratoryDiagram } from "@/components/RespiratoryDiagram";
import { respiratoryLabels } from "@/lib/diagramLabels";

export default function LabelDiagramPage() {
  return <DiagramExercise labels={respiratoryLabels} system="respiratory" area="Gas exchange" diagram={<RespiratoryDiagram />} explanation="Air passes through the trachea, bronchi and bronchioles. Gas exchange takes place in the alveoli inside the lungs. The diaphragm helps change the volume of the chest during breathing." />;
}
