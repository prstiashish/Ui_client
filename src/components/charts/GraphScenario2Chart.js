


// start all set without periodic

// import React from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";

// // Register chart components
// Chart.register(
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   ChartDataLabels // Register the data labels plugin
// );

// const GraphScenario2Chart = ({ chartData, receivedPayload }) => {
//   console.log("GraphScenario2Chart data:", chartData);
//   console.log("GraphScenario2Chart receivedPayload:", receivedPayload);

//   // Format the y-axis values for display
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

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       datalabels: {
//         display: true, // Enable data labels to be displayed
//         formatter: (value, context) => {
//           const percentage = context.dataset.percentageData[context.dataIndex];
//           return percentage > 0 ? `${percentage.toFixed(1)}%` : null; // Show percentage on the bar if > 0
//         },
//         color: "#0000cc",

//         anchor: "center", // Center the label on the bar
//         align: "center", // Align label to the center of the bar
//         font: {
//           weight: "bold", // Make the font bold
//           size: "7", // Set the font size (adjust as needed)
//         },
//       },

//       title: {
//         display: false,
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
//         grid: {
//           display: false,
//         },
//         ticks: {
//           display: false, // Hide x-axis labels
//           autoSkip: false,
//           padding: 10,
//         },
//       },
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: formatValue,
        
//         },
//         title: {
//           display: true,
//         },
//       },
//     },
//   };

//   return <Bar data={chartData} options={options} />;
// };

// export default GraphScenario2Chart;


import React, { useState, useRef, useEffect } from "react";
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
  // console.log("GraphScenario2Chart data:", chartData);
  // console.log("GraphScenario2Chart receivedPayload:", receivedPayload);

  const chartRef = useRef(null);


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

  // const handleBarClick = (event, elements) => {
  //   console.log("GraphScenario2Chart data:", chartData);
  //   console.log("GraphScenario2Chart receivedPayload:", receivedPayload);
  
  //   // Check if any element was clicked
  //   if (elements.length === 0) return;
  
  //   const element = elements[0];
  
  //   const clickedIndex = element.index; // Get the clicked bar's index
  //   const clickedDatasetIndex = element.datasetIndex; // Get the index of the dataset (segment) clicked
  //   const clickedLabel = chartData.labels[clickedIndex]; // Get the clicked label (e.g., product name)
  //   const dimensionType = chartData.dimension;

  
  //   console.log("Clicked index:", clickedIndex); // e.g., 0 for 'Belgian Chocolate Thick Shake'
  //   console.log("Clicked label:", clickedLabel); // e.g., 'Belgian Chocolate Thick Shake'
  //   console.log("Clicked dataset index:", clickedDatasetIndex); // e.g., 0 for 'Materials Cost', 1 for 'Discounts'
  //   console.log("Dimension type:", dimensionType); // e.g., 'Materials Cost', 'Discounts'
  
  //   // Get the dataset corresponding to the clicked segment
  //   const dataset = chartData.datasets[clickedDatasetIndex]; 
  //   const clickedValue = dataset.data[clickedIndex]; // Get the value for the clicked segment
  
  //   console.log("Clicked dataset label:", dataset.label); // e.g., 'Materials Cost', 'Discounts'
  //   console.log("Clicked value:", clickedValue); // The actual value in that segment

  //   // const hitToUrl = {
  //   //   bottomRank: finalPayload.bottomRank,
  //   //   topRank: finalPayload.topRank,
  //   //   dimension: `${finalPayload.dimension.split(":")[0]}:${clickedLabel}`,
  //   //   measure: finalPayload.measure,
  //   //   partition: finalPayload.partition,
  //   //   includeCOGS: finalPayload.includeCOGS,
  //   //   start_date: finalPayload.start_date,
  //   //   end_date: finalPayload.end_date,
  //   //   time_window: timeWindow, // Using the default time window here
  //   // };
  
  // };
  
  // const handleBarClick = (event, elements) => {
  //   // Log the payload array to inspect it
  //   console.log("GraphScenario2Chart receivedPayload:", receivedPayload);
  
  //   // Check if any element was clicked
  //   if (elements.length === 0) return;
  
  //   const element = elements[0];
  //   const clickedIndex = element.index; // Get the clicked bar's index
  //   const clickedDatasetIndex = element.datasetIndex; // Get the clicked dataset's index
  
  //   const clickedLabel = chartData.labels[clickedIndex]; // Label of the clicked bar
  //   const clickedDatasetLabel = chartData.datasets[clickedDatasetIndex].label; // Dataset label
  //   const clickedValue = chartData.datasets[clickedDatasetIndex].data[clickedIndex]; // Value of the clicked bar
  
  //   // Log click details for reference
  //   console.log("Clicked index:", clickedIndex);
  //   console.log("Clicked label:", clickedLabel);
  //   console.log("Clicked dataset index:", clickedDatasetIndex);
  //   console.log("Clicked dataset label:", clickedDatasetLabel);
  //   console.log("Clicked value:", clickedValue);
  
  //   // Match the clicked dataset and index with the payload array
  //   const matchingPayload = receivedPayload[clickedDatasetIndex];
  
  //   // Log the matched payload
  //   console.log("Matched Payload:", matchingPayload);
  
  //   // Further processing can be done based on the matched payload
  // };

  const handleBarClick = (event, elements) => {

    console.log("GraphScenario2Chart data:", chartData);
    console.log("GraphScenario2Chart receivedPayload:", receivedPayload);

    // const receivedPayload = Array.isArray(receivedPayload) ? receivedPayload : [receivedPayload];
  
    // Check if any element was clicked
    if (elements.length === 0) return;
    const element = elements[0];
    const clickedIndex = element.index;
    // Get the first clicked element
    const clickedDatasetIndex = element.datasetIndex; // Get the index of the clicked segment
    const clickedLabel = chartData.labels[clickedIndex];
    console.log(" clickedLabel:", clickedLabel);
    // Get the clicked dataset label
    const clickedDatasetLabel = chartData.datasets[clickedDatasetIndex].label; // The dataset label
    console.log("Clicked dataset label:", clickedDatasetLabel);

    // Find the matching payload based on the clicked dataset label
    const matchingPayload = receivedPayload.find(payload => {
        return payload.measure === "Gross_Amount" &&
               payload.partition === 'None' &&
               payload.includeCOGS === true;
    });

    const hitToUrl = {
      bottomRank: matchingPayload.bottomRank,
      topRank: matchingPayload.topRank,
      dimension: `${matchingPayload.dimension.split(":")[0]}:${clickedLabel}`,
      measure: matchingPayload.measure,
      partition: matchingPayload.partition,
      includeCOGS: matchingPayload.includeCOGS,
      start_date: matchingPayload.start_date,
      end_date: matchingPayload.end_date,
      // time_window: timeWindow, // Using the default time window here
    };
    console.log("hitToUrl:", hitToUrl);

    // Handle matching or non-matching payloads
    if (matchingPayload) {
        console.log("Matched Payload:", matchingPayload);
        // Add further logic to handle matched payload
        const isCOGSIncluded = matchingPayload.includeCOGS;
        console.log("Include COGS:", isCOGSIncluded);
        // You can now use matchingPayload for your next steps
    } else {
        console.error(`No matching payload found for clicked dataset label: "${clickedDatasetLabel}". Please ensure your measures in the payload match your dataset labels and additional criteria.`);
    }
};



  

  const options = {
    onClick: (event, elements) => handleBarClick(event, elements),
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

  return <Bar data={chartData} options={options} ref={chartRef} />;
};

export default GraphScenario2Chart;
