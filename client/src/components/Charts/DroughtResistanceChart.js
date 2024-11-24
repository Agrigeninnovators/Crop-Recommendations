// import React from "react";
// import { Bar } from "react-chartjs-2";
// import "../ChartConfig"
// const DroughtResistanceChart = ({ data }) => {
//   const chartData = {
//     labels: ["Drought Resistance"],
//     datasets: [
//       {
//         label: "Score",
//         data: [data],
//         backgroundColor: "orange",
//       },
//     ],
//   };

//   return <Bar data={chartData} />;
// };

// export default DroughtResistanceChart;
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

const DroughtResistanceChart = ({ varieties }) => {
  const labels = varieties.map((variety) => variety.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Drought Resistance Score",
        data: varieties.map((variety) => variety.droughtResistance),
        backgroundColor: "orange",
      },
    ],
  };

  return <Bar data={data} />;
};

export default DroughtResistanceChart;
