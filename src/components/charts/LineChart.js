import React from "react";
import { Line } from "react-chartjs-2";
// import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
  // zoomPlugin
);

export default function LineChart({ chartdata }) {
  return (
    <Line
      data={chartdata}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Total Sales per Category",
          },
          legend: {
            display: true,
            position: "bottom",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
          zoom: {
            limits: {
              x: 5,
            },
            pan: {
              enabled: true,
              mode: "xy",
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "",
            },
          },
          y: {
            title: {
              display: true,
              text: "",
            },
            beginAtZero: true,
          },
        },
      }}
    />
  );
}
