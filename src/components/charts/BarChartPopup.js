import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, getElementsAtEvent } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PopupBarChart = ({ chartData, title }) => {
  React.useEffect(() => {
    const ctx = document.getElementById("popup-chart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        // Customize options if needed
      },
    });
  }, [chartData]);

  return <canvas id="popup-chart" width="400" height="300"></canvas>;
};

export default PopupBarChart;
