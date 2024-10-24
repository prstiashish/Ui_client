// import { display } from "@mui/system";
// import { Bar } from "react-chartjs-2";

// const GraphScenario2Chart = ({ chartData }) => {
//   console.log("GraphScenario2Charttttttttttt :", chartData);

//   // const formatValue = (value, index, values) => {
//   //   // Get the maximum value from the dataset to decide the formatting
//   //   const maxValue = Math.max(...values.map((v) => v.y));

//   //   if (maxValue >= 1000000) {
//   //     return `${(value / 1000000).toFixed(1)}M`; // For millions
//   //   } else if (maxValue >= 1000) {
//   //     return `${(value / 1000).toFixed(1)}K`; // For thousands
//   //   } else {
//   //     return value.toFixed(1); // For smaller values
//   //   }
//   // };
//   // const formatValue = (value, index, values) => {
//   //   // Get the maximum value from the dataset to decide the formatting
//   //   const maxValue = Math.max(...values.map((v) => v.y));

//   //   if (maxValue >= 10000000) {
//   //     return `${(value / 10000000).toFixed(1)}Cr`; // For crores
//   //   } else if (maxValue >= 1000000) {
//   //     return `${(value / 1000000).toFixed(1)}M`; // For millions
//   //   } else if (maxValue >= 100000) {
//   //     return `${(value / 100000).toFixed(1)}L`; // For lakhs
//   //   } else if (maxValue >= 1000) {
//   //     return `${(value / 1000).toFixed(1)}K`; // For thousands
//   //   } else {
//   //     return value.toFixed(1); // For smaller values
//   //   }
//   // };

//   let formatValue;
//   if (chartData && chartData.datasets && chartData.datasets.length > 0) {
//     const data = chartData.datasets[0].data;

//     if (data && data.length > 0) {
//       let maxValue = Math.max(...data);
//       formatValue = (value) => {
//         if (maxValue >= 10000000) {
//           return value / 10000000;
//         } else if (maxValue >= 100000) {
//           return value / 100000;
//         } else if (maxValue >= 1000) {
//           return value / 1000;
//         } else {
//           return value;
//         }
//       };
//     } else {
//       console.log("Data is empty.");
//     }
//   } else {
//     console.log("chartData or its datasets are not properly initialized.");
//   }

//   // Extract scenario specific options if needed
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       datalabels: {
//         display: true, // Disable data labels
//         formatter: (value, context) => {
//           // Get the percentage for the current data point
//           const percentage = context.dataset.percentageData[context.dataIndex];
//           return percentage > 0 ? `${percentage.toFixed(1)}%` : ''; // Show percentage if greater than 0
//         },

//       },

//       title: {
//         display: false,
//         // text: getDynamicTitle(chartData), // If you have a dynamic title function
//       },
//     },
//     layout: {
//       padding: {
//         left: -4,
//         right: 0,
//       },
//     },
//     scales: {
//       x: {
//         offset: true,
//         display: false,
//         grid: {
//           display: false,
//         },
//         ticks: {
//           autoSkip: false,
//           padding: 200,
//           maxRotation: 0, // Prevent excessive rotation of labels
//           minRotation: 0,
//         },
//         afterFit: (scale) => {
//           scale.paddingLeft = Math.max(10, scale.width * 0.05); // Dynamically adjust padding based on width
//           scale.paddingRight = Math.max(10, scale.width * 0.05);
//         },
//       },
//       y: {
//         beginAtZero: true,
//         // type: "logarithmic",
//         ticks: {
//           callback: formatValue, // Apply formatting function
//         },
//         title: {
//           display: true,
//           // text: "Measure",
//           // font: {
//           //   size: 14,
//           //   weight: "bold",
//           // },
//         },
//       },
//     },
//   };

//   return <Bar data={chartData} options={options} />;
// };

// export default GraphScenario2Chart;




import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register chart components
Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the data labels plugin
);

const GraphScenario2Chart = ({ chartData, receivedPayload }) => {
  console.log("GraphScenario2Chart data:", chartData);
  console.log("GraphScenario2Chart receivedPayload:", receivedPayload);

  // Format the y-axis values for display
  let formatValue;
  if (chartData && chartData.datasets && chartData.datasets.length > 0) {
    const data = chartData.datasets[0].data;

    if (data && data.length > 0) {
      let maxValue = Math.max(...data);
      formatValue = (value) => {
        if (maxValue >= 10000000) {
          return value / 10000000;
        } else if (maxValue >= 100000) {
          return value / 100000;
        } else if (maxValue >= 1000) {
          return value / 1000;
        } else {
          return value;
        }
      };
    } else {
      console.log("Data is empty.");
    }
  } else {
    console.log("chartData or its datasets are not properly initialized.");
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true, // Enable data labels to be displayed
        formatter: (value, context) => {
          const percentage = context.dataset.percentageData[context.dataIndex];
          return percentage > 0 ? `${percentage.toFixed(1)}%` : null; // Show percentage on the bar if > 0
        },
        color: "#0000cc",

        anchor: "center", // Center the label on the bar
        align: "center", // Align label to the center of the bar
        font: {
          weight: "bold", // Make the font bold
          size: "7", // Set the font size (adjust as needed)
        },
      },

      title: {
        display: false,
      },
    },
    layout: {
      padding: {
        left: -4,
        right: 0,
      },
    },
    scales: {
      x: {
        offset: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false, // Hide x-axis labels
          autoSkip: false,
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: formatValue,
        
        },
        title: {
          display: true,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default GraphScenario2Chart;
