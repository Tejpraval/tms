import jsPDF from "jspdf";

interface Inputs {
  healthScore: number;
  healthLabel: string;
  stressScore: number;
  tier: string;
  predictedNext: number;
  narrative: string;
  recommendations: string[];
}

export const useExecutiveReport = ({
  healthScore,
  healthLabel,
  stressScore,
  tier,
  predictedNext,
  narrative,
  recommendations,
}: Inputs) => {
  const generate = () => {
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("Governance Executive Report", 20, y);

    y += 15;
    doc.setFontSize(12);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      20,
      y
    );

    y += 20;
    doc.text(
      `30-Day Health Score: ${healthScore} (${healthLabel})`,
      20,
      y
    );

    y += 10;
    doc.text(
      `Current Stress Score: ${stressScore} (${tier})`,
      20,
      y
    );

    y += 10;
    doc.text(
      `Predicted Next Stress: ${predictedNext}`,
      20,
      y
    );

    y += 20;
    doc.text("Narrative:", 20, y);

    y += 10;
    doc.text(narrative, 20, y, {
      maxWidth: 170,
    });

    y += 30;
    doc.text("Recommended Actions:", 20, y);

    y += 10;
    recommendations.forEach((rec) => {
      doc.text(`- ${rec}`, 25, y, {
        maxWidth: 165,
      });
      y += 8;
    });

    doc.save("governance-report.pdf");
  };

  return { generate };
};
