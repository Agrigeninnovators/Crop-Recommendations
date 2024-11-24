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

const YieldPotentialChart = ({ varieties = [] }) => {
    if (!varieties || varieties.length === 0) {
        return <p>No data available for Yield Potential.</p>;
    }

    const labels = varieties.map((variety) => variety.name);
    const data = {
        labels,
        datasets: [
            {
                label: "Yield Potential (tons/hectare)",
                data: varieties.map((variety) => variety.yieldPotential || 0),
                backgroundColor: "blue",
            },
        ],
    };

    return <Bar data={data} />;
};

export default YieldPotentialChart;
