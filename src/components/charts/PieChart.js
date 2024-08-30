import React from "react";
import { Chart as ChartJS, Title, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Tabs, Tab, Typography } from "@mui/material";

ChartJS.register(Title, Tooltip, Legend);

export default function DonutChart({ chartData }) {
  return (
    <div style={{ width: "300px", height: "300px", marginLeft: "20%", textAlign: "center" }}>
      {" "}
      <Typography variant="h6" gutterBottom>
        {"Average Sales Category"} {/* Display the heading */}
      </Typography>
      <Doughnut
        data={chartData}
        options={{
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: {
                  size: 8, // Adjust font size as needed
                },
                itemMarginBottom: 2,
              },
            },
            datalabels: {
              display: true,
              color: "white",
              formatter: (value, context) => {
                return context.chart.data.labels[context.dataIndex] + ": " + value + "%";
              },
              align: "end",
              anchor: "end",
              offset: 5,
              borderWidth: 1,
              borderColor: "#aaa",
              borderRadius: 4,
              backgroundColor: "white",
              padding: {
                top: 2,
                bottom: 2,
                left: 4,
                right: 4,
              },
              labels: {
                title: {
                  font: {
                    weight: "bold",
                  },
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          cutoutPercentage: 50,
        }}
      />
    </div>
  );
}
