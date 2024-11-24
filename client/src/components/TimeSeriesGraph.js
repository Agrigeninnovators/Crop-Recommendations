import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Ensure Chart.js auto-import

const TimeSeriesGraph = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/timeseries");
        const data = response.data;

        const labels = data.map((entry) => new Date(entry.date).toLocaleDateString());
        const ndvi = data.map((entry) => entry.NDVI);
        const ndre = data.map((entry) => entry.NDRE);
        const gndvi = data.map((entry) => entry.GNDVI);
        const ndwi = data.map((entry) => entry.NDWI);

        // Set chart data in state
        setChartData({
          labels,
          datasets: [
            {
              label: "NDVI",
              data: ndvi,
              borderColor: "green",
              backgroundColor: "rgba(0, 128, 0, 0.2)",
              fill: true,
              tension: 0.4, // Smooth curve
            },
            {
              label: "NDRE",
              data: ndre,
              borderColor: "red",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "GNDVI",
              data: gndvi,
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "NDWI",
              data: ndwi,
              borderColor: "purple",
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching time series data:", error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h2>Time Series Analysis</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "category",
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: "Index Value",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Time Series of Crop Indices",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
            legend: {
              position: "top",
            },
          },
        }}
      />
    </div>
  );
};

export default TimeSeriesGraph;
