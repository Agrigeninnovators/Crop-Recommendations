import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const pHAdaptabilityChart = ({ varieties }) => {
  const labels = ["Acidic", "Neutral", "Alkaline"];
  const datasets = varieties.map((variety, index) => ({
    label: variety.name,
    data: [variety.environmentalAdaptability.pHRange.acidic, variety.environmentalAdaptability.pHRange.neutral, variety.environmentalAdaptability.pHRange.alkaline],
    backgroundColor: ["purple", "pink", "yellow"][index % 3],
  }));

  const data = { labels, datasets };

  return <Bar data={data} />;
};

export default pHAdaptabilityChart;
