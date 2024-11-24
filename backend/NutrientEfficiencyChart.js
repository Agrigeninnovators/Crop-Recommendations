// import React from "react";
// import { Bar } from "react-chartjs-2";
// import "../ChartConfig"
// const NutrientEfficiencyChart = ({ data }) => {
//   const chartData = {
//     labels: ["Nitrogen (N)", "Phosphorus (P)", "Sulphur (S)"],
//     datasets: [
//       {
//         label: "Efficiency (%)",
//         data: [data.N, data.P, data.S],
//         backgroundColor: ["green", "yellow", "red"],
//       },
//     ],
//   };

//   return <Bar data={chartData} />;
// };

// export default NutrientEfficiencyChart;
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

const NutrientEfficiencyChart = ({ varieties }) => {
  const labels = ["Nitrogen (N)", "Phosphorus (P)", "Sulphur (S)"];
  const datasets = varieties.map((variety, index) => ({
    label: variety.name,
    data: [variety.nutrientUseEfficiency.N, variety.nutrientUseEfficiency.P, variety.nutrientUseEfficiency.S],
    backgroundColor: ["red", "green", "blue","yellow"][index % 4],
  }));

  const data = { labels, datasets };

  return <Bar data={data} />;
};

export default NutrientEfficiencyChart;
