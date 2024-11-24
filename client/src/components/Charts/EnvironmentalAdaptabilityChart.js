import React from "react";
import { Bar } from "react-chartjs-2";
import "../ChartConfig"
const EnvironmentalAdaptabilityChart = ({ data }) => {
  const soilData = {
    labels: ["Sandy", "Clay", "Loamy"],
    datasets: [
      {
        label: "Performance Score (Soil Types)",
        data: [
          data.soilTypes.sandy,
          data.soilTypes.clay,
          data.soilTypes.loamy,
        ],
        backgroundColor: "purple",
      },
    ],
  };

  const pHData = {
    labels: ["Acidic", "Neutral", "Alkaline"],
    datasets: [
      {
        label: "Performance Score (pH Range)",
        data: [
          data.pHRange.acidic,
          data.pHRange.neutral,
          data.pHRange.alkaline,
        ],
        backgroundColor: "pink",
      },
    ],
  };

  return (
    <div>
      <Bar data={soilData} />
      <Bar data={pHData} />
    </div>
  );
};

export default EnvironmentalAdaptabilityChart;
