import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const YieldPotentialChart = ({ varieties }) => {
  const data = {
    labels: varieties.map((variety) => variety.name),
    datasets: [
      {
        label: "Yield Potential",
        data: varieties.map((variety) => variety.yieldPotential),
        backgroundColor: [
          "#FF5733",
          "#33FF57",
          "#3357FF",
          "#FFD700",
          "#FF4500",
          "#9B30FF",
        ],
        borderColor: [
          "#FF5733",
          "#33FF57",
          "#3357FF",
          "#FFD700",
          "#FF4500",
          "#9B30FF",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Yield Potential of Different Crop Varieties",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Yield: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ display: "flex", width: "100%", padding: "20px"}}>
      {/* Chart Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "70%",
          height: "500px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <div style={{ width: "80%", height: "100%" }}>
          <Bar data={data} options={options} />
        </div>
      </div>

      {/* Right-Side Info Container */}

      </div>
  );
};

export default YieldPotentialChart;
