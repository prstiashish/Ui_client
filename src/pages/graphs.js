import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { BsArrowsFullscreen, BsArrowsCollapse, BsTrash, BsBorderWidth } from "react-icons/bs";
import chroma from "chroma-js";

import * as d3 from "d3";
import SlideOutPanel from "./slideoutpannel"; // Ensure this path is correct
import { DashboardLayout } from "src/components/dashboard-layout";
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { useRouter } from "next/router";
import { concat } from "lodash";

const App = () => {
  const [chartsData, setChartsData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isPanelOpen, setPanelOpen] = useState(false);

  const [chartDataSets, setChartDataSets] = useState([]);
  const [currentData, setCurrentData] = useState(null);

  const [payload, setPayload] = useState(null);

  const [chartDataList, setChartDataList] = useState([]);
  const [selectedChartData, setSelectedChartData] = useState(null);

  const [scenario1Title, setScenario1Title] = useState(null);
  const [scenario1Dimension, setscenario1Dimension] = useState(null);
  const [scenario1Measure, setscenario1Measure] = useState(null);

  const [scenario2Title, setScenario2Title] = useState(null);
  const [scenario2Dimension, setscenario2Dimension] = useState(null);
  const [scenario2Measure, setscenario2Measure] = useState(null);

  const [scenario3Title, setScenario3Title] = useState(null);
  const [scenario3Dimension, setscenario3Dimension] = useState(null);
  const [scenario3Measure, setscenario3Measure] = useState(null);

  const [dialogStyles, setDialogStyles] = useState({});
  const [barDivStyles, setBarDivStyles] = useState({});

  const handleOpenModal = (index) => {
    const data = chartDataList[index];
    setCurrentData(data);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  //   console.log("responseeeeeeeeeee", data);
  //   console.log("Received Payload:", payload);

  //   if (data) {
  //     setChartsData(data);

  //     setPanelOpen(false);
  //   }
  // };

  // worlignn

  // const handleSubmit = (data, receivedPayload) => {
  //   console.log("responseeeeeeeeeee", data);
  //   console.log(receivedPayload, "receivedPayload");

  //   if (data) {
  //     // Assuming setChartsData and setPanelOpen are state setters
  //     setChartsData(data);
  //     setPanelOpen(false);
  //   }

  //   // Store the payload in state
  //   setPayload(receivedPayload);
  // };

  // Scenario 1

  const convert = (data, dimension, measure) => {
    const dimensionKey = dimension.split(":")[0];
    const topLabels = Object.keys(data);
    let allItems = [];
    let datasets = [];

    topLabels.forEach((label, labelIdx) => {
      data[label].forEach((item, idx) => {
        // check if the item already exits and find out its idx;
        const itemIdx = allItems.findIndex((i) => i === item[dimensionKey]);

        if (itemIdx > -1) {
          // ** items exits
          if (Array.isArray(datasets[itemIdx])) {
            datasets[itemIdx][labelIdx] = item[measure];
          } else {
            let ar = [];
            ar[labelIdx] = item[measure];
            datasets[itemIdx] = ar;
          }
        } else {
          // ** item does not exit
          const currentLength = allItems.length;
          allItems.push(item[dimensionKey]);
          if (Array.isArray(datasets[currentLength])) {
            datasets[currentLength][labelIdx] = item[measure];
          } else {
            let ar = [];
            ar[labelIdx] = item[measure];
            datasets[currentLength] = ar;
          }
        }
      });
    });

    console.log("All Items:", allItems); // Log all items
    console.log("Datasets:", datasets); // Log datasets

    return {
      labels: topLabels,
      datasets: allItems?.map((i, idx) => ({
        label: i,
        backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        data: datasets[idx],
      })),
    };
  };

  function scenario1(data, dimension, measure) {
    let labels = [];
    let values = [];
    console.log("All Items:", labels); // Log all items
    console.log("Datasets:", values); // Log datasets

    data.forEach((d) => {
      labels.push(d[dimension]);
      values.push(d[measure]);
    });

    console.log(labels, "labels");
    console.log(values, "values");

    // Define the dynamic title and labels
    const title = `Charts based on ${dimension} and ${measure}`;
    console.log(title, "tttt");

    setScenario1Title(title);

    // const xLabel = `Dimension: ${dimension}`;
    const xLabel = dimension;

    console.log(xLabel, "x");
    setscenario1Dimension(xLabel);

    // const yLabel = `Measure: ${measure}`;
    const yLabel = measure;

    console.log(yLabel, "y");
    setscenario1Measure(yLabel);
    // 5369ac Color Ankita
    const result = {
      labels,
      datasets: [
        {
          backgroundColor: "#003380", // Lighter shade of #ac53ac
          borderColor: "#003380", // Original color
          hoverBackgroundColor: "#003380", // Lighter shade for hover
          hoverBorderColor: "#003380", // Original color for hover border

          barThickness: 50,

          maxBarThickness: 80,
          barPercentage: 0.1, // Reduce bar width relative to category width
          categoryPercentage: 1, // Reduce spacing between categories
          data: values,
        },
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: title, // Set the dynamic title here
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: xLabel, // Set the dynamic X-axis label here
            },
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: yLabel, // Set the dynamic Y-axis label here
            },
          },
        },
      },
    };

    console.log(result, "result");
    // return result;
    return { ...result, title, xLabel, yLabel };
  }

  function scenario2(data, dimension, measure, itemsToStack) {
    console.log(measure, "mmm");
    let labels = [];
    let dataSets = [];

    // // blue
    // const colors = [
    //   // "#3D4F89", // Darkest shade
    //   "#5369AC", // Base shade
    //   "#6B84D3", // Lighter shade
    //   "#849CE0", // Lightest shade
    //   "#A0B9F0",
    // ];

    // orange
    const colors = [
      "#003380",
      "#0052cc", // Darkest shade
      "#1a75ff", // Base shade

    ];

    // Create a dataset for each stackable item
    itemsToStack.forEach((item, index) => {
      dataSets.push({
        label: item.label,
        backgroundColor: colors[index % colors.length], // Apply the shades
        borderColor: colors[index % colors.length], // Border color
        hoverBackgroundColor: colors[index % colors.length], // Keep the same color on hover
        hoverBorderColor: colors[index % colors.length], // Keep the same border color on hover
        data: [], // Breakdown data
        stack: "stack1",
      });
    });

    // Add the Margin dataset
    dataSets.push({
      label: "Margin",
      backgroundColor: "#66a3ff", // A lighter shade for margin
      borderColor: "#66a3ff", // Border color
      hoverBackgroundColor: "#66a3ff", // Keep the same color on hover
      hoverBorderColor: "#66a3ff", // Keep the same border color on hover
      data: [], // Margin data
      stack: "stack1",
    });

    // Process each data point
    data.forEach((d) => {
      labels.push(d[dimension]); // Set labels for x-axis

      // Retrieve total sales for the current data point
      const totalSales = d[measure] || 0;

      // Calculate cumulative value from breakdown items
      let cumulativeValue = 0;

      // Calculate and store values for each stackable item
      itemsToStack.forEach((item, idx) => {
        const itemValue = d[item.itemKey] || 0;
        dataSets[idx].data.push(itemValue); // Update dataset with breakdown item value
        cumulativeValue += itemValue; // Accumulate values for margin calculation
      });

      // Calculate the margin for the current data point
      const margin = totalSales - cumulativeValue;

      // Update the Margin dataset with the calculated margin
      dataSets[dataSets.length - 1].data.push(margin); // Append margin value
    });
    console.log(dataSets, "ddd");

    return {
      labels,
      datasets: dataSets,
    };
  }

  // function scenario3(data, dimension, measure) {
  //   const topLabels = Object.keys(data);
  //   console.log(topLabels, "topLabelstopLabels");
  //   let allItems = [];
  //   console.log(allItems, "s222");
  //   let datasets = [];
  //   console.log(datasets, "s111");

  //   const colorPalette = [
  //     '#80d4ff', // Light Blue
  //     '#ff80aa', // Light Pink
  //     '#b366ff', // Light Purple
  //     '#538cc6', // Medium Blue
  //     '#dd99ff'  // Light Purple
  //   ];

  //   topLabels.forEach((label, labelIdx) => {
  //     data[label].forEach((item, idx) => {
  //       // check if the item already exits and find out its idx;
  //       const itemIdx = allItems.findIndex((i) => i === item[dimension]);
  //       console.log(itemIdx, "item");

  //       if (itemIdx > -1) {
  //         // ** items exits
  //         if (Array.isArray(datasets[itemIdx])) {
  //           datasets[itemIdx][labelIdx] = item[measure];
  //         } else {
  //           let ar = [];
  //           ar[labelIdx] = item[measure];
  //           datasets[itemIdx] = ar;
  //         }
  //       } else {
  //         // ** item does not exit
  //         const currentLength = allItems.length;
  //         allItems.push(item[dimension]);
  //         if (Array.isArray(datasets[currentLength])) {
  //           datasets[currentLength][labelIdx] = item[measure];
  //         } else {
  //           let ar = [];
  //           ar[labelIdx] = item[measure];
  //           datasets[currentLength] = ar;
  //         }
  //       }
  //     });
  //   });

  //   return {
  //     labels: topLabels,
  //     datasets: allItems?.map((i, idx) => ({
  //       label: i,
  //       // backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  //       backgroundColor: colorPalette[idx % colorPalette.length], // Use color palette

  //       data: datasets[idx],
  //       barThickness: 45,
  //       // maxBarThickness: 8,
  //       // borderWidth:1,
  //       // barCategoryGap: "50%",
  //     })),
  //   };
  // }

  // function scenario4(data, dimension, totalSalesMeasure, itemsToStack) {
  //   const topLabels = Object.keys(data);

  //   let stacks = [];
  //   let datasets = [];
  //   let values = [];

  //   topLabels.forEach((label, labelIdx) => {
  //     data[label]?.forEach((item) => {
  //       const stackIdx = stacks.findIndex((i) => i === item[dimension]);

  //       if (stackIdx > -1) {
  //         itemsToStack.forEach((i, iIdx) => {
  //           datasets[stackIdx][iIdx][labelIdx] = item[i];
  //         });
  //       } else {
  //         const currentLength = stacks.length;
  //         stacks.push(item[dimension]);

  //         let ar = Array(itemsToStack.length)
  //           .fill(0)
  //           .map(() => Array(topLabels.length).fill(0));
  //         itemsToStack.forEach((i, iIdx) => {
  //           ar[iIdx][labelIdx] = item[i];
  //         });
  //         datasets[currentLength] = ar;
  //       }
  //     });
  //   });

  //   stacks.forEach((stack, stackIdx) => {
  //     let marginValues = Array(topLabels.length).fill(0);

  //     topLabels.forEach((label, labelIdx) => {
  //       const totalSales =
  //         data[label]?.find((item) => item[dimension] === stack)?.[totalSalesMeasure] || 0;

  //       let totalCost = 0;
  //       itemsToStack.forEach((item, itemIdx) => {
  //         totalCost += datasets[stackIdx][itemIdx][labelIdx] || 0;
  //       });

  //       // Calculate margin = Total Sales - (Material Cost + Suppliers Cost + Discount)
  //       marginValues[labelIdx] = totalSales - totalCost;
  //     });

  //     datasets[stackIdx].push(marginValues);

  //     // Only add non-zero values to the dataset
  //     itemsToStack.concat("Margin").forEach((item, itemIdx) => {
  //       const dataForItem = datasets[stackIdx][itemIdx];
  //       const hasNonZeroValue = dataForItem.some((value) => value !== 0);

  //       if (hasNonZeroValue) {
  //         values.push({
  //           label: `${stack}: ${item}`,
  //           backgroundColor:
  //             item === "Margin"
  //               ? "#6C757D"
  //               : `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  //           stack: stack,
  //           data: dataForItem,
  //           barThickness: 5,
  //         });
  //       }
  //     });
  //   });

  //   return {
  //     labels: topLabels,
  //     datasets: values,
  //   };
  // }

  // okkkkkkkkkkk

  // function scenario3(data, dimension, measure) {
  //   const topLabels = Object.keys(data);
  //   let allItems = [];
  //   let datasets = [];

  //   // Define a set of colors to be used for groups
  //   const colors = ['#ff80aa', '#ff6666', '#66b3ff', '#99ff99', '#ffcc99']; // Customize as needed
  //   const colorMap = {};
  //   let colorIndex = 0;

  //   topLabels.forEach((label, labelIdx) => {
  //     data[label].forEach((item) => {
  //       const itemValue = item[dimension];

  //       // Check if the item already exists and find its index
  //       const itemIdx = allItems.findIndex((i) => i === itemValue);

  //       if (itemIdx > -1) {
  //         // Item exists
  //         if (Array.isArray(datasets[itemIdx])) {
  //           datasets[itemIdx][labelIdx] = item[measure];
  //         } else {
  //           let ar = [];
  //           ar[labelIdx] = item[measure];
  //           datasets[itemIdx] = ar;
  //         }
  //       } else {
  //         // Item does not exist
  //         const currentLength = allItems.length;
  //         allItems.push(itemValue);
  //         if (Array.isArray(datasets[currentLength])) {
  //           datasets[currentLength][labelIdx] = item[measure];
  //         } else {
  //           let ar = [];
  //           ar[labelIdx] = item[measure];
  //           datasets[currentLength] = ar;
  //         }

  //         // Assign a color to the new group
  //         if (!colorMap[itemValue]) {
  //           colorMap[itemValue] = colors[colorIndex % colors.length];
  //           colorIndex++;
  //         }
  //       }
  //     });
  //   });

  //   // Create datasets with the assigned colors
  //   return {
  //     labels: topLabels,
  //     datasets: allItems.map((i, idx) => ({
  //       label: i,
  //       backgroundColor: colorMap[i], // Use color map for consistent colors
  //       data: datasets[idx],
  //       barThickness: 45,
  //     })),
  //   };
  // }

  function scenario3(data, dimension, measure) {
    const topLabels = Object.keys(data);
    let allItems = [];
    let datasets = [];

    // Define a fixed set of colors to be used for groups
    // const colors = ["#0d001a","#1a0033","#26004d","#330066",'#400080', '#4d0099', '#5900b3', '#6600cc','#7300e6', '#8000ff', '#8c1aff', '#9933ff', '#a64dff', '#b366ff', '#bf80ff', '#cc99ff', '#d9b3ff', '#e6ccff', '#f2e6ff']; // Customize as needed
    // const colors = [
    //   "#111522",
    //   "#192034",
    //   "#212a45",
    //   "#293556",
    //   "#323f67",
    //   "#3a4a78",
    //   "#42548a",
    //   "#4b5f9b",
    //   "#5369ac",
    //   "#6478b4",
    //   "#7587bd",
    //   "#8796c5",
    //   "#98a5cd",
    //   "#a9b4d6",
    //   "#bac3de",
    //   "#cbd2e6",
    //   "#dde1ee",
    //   "#eef0f7",
    // ]; // Customize as needed
    const colors = ["#002966","#003380","#003d99","#0047b3",'#0052cc', '#005ce6', '#0066ff', '#1a75ff','#3385ff', '#4d94ff', '#66a3ff', '#80b3ff', '#99c2ff', '#b3d1ff', '#cce0ff', '#e6f0ff']; // Customize as needed

    const colorMap = {};

    topLabels.forEach((label, labelIdx) => {
      data[label].forEach((item) => {
        const itemValue = item[dimension];

        // Check if the item already exists and find its index
        const itemIdx = allItems.findIndex((i) => i === itemValue);

        if (itemIdx > -1) {
          // Item exists
          if (Array.isArray(datasets[itemIdx])) {
            datasets[itemIdx][labelIdx] = item[measure];
          } else {
            let ar = [];
            ar[labelIdx] = item[measure];
            datasets[itemIdx] = ar;
          }
        } else {
          // Item does not exist
          const currentLength = allItems.length;
          allItems.push(itemValue);
          if (Array.isArray(datasets[currentLength])) {
            datasets[currentLength][labelIdx] = item[measure];
          } else {
            let ar = [];
            ar[labelIdx] = item[measure];
            datasets[currentLength] = ar;
          }

          // Assign a color to the new group
          if (!colorMap[itemValue]) {
            // Cycle through colors for each new group
            colorMap[itemValue] = colors[allItems.length % colors.length];
          }
        }
      });
    });

    // Create datasets with the assigned colors
    return {
      labels: topLabels,
      datasets: allItems.map((i, idx) => ({
        label: i,
        backgroundColor: colorMap[i], // Use color map for consistent colors
        data: datasets[idx],
        barThickness: 45,
      })),
    };
  }

  //   function scenario4(data, dimension, totalSalesMeasure, itemsToStack) {
  //     const topLabels = Object.keys(data);

  //     let stacks = [];

  //     let datasets = [];
  //     console.log(datasets,'datasets')
  //     let values = [datasets];

  //     topLabels.forEach((label, labelIdx) => {
  //       data[label]?.forEach((item) => {
  //         const stackIdx = stacks.findIndex((i) => i === item[dimension]);

  //         if (stackIdx > -1) {
  //           itemsToStack.forEach((i, iIdx) => {
  //             datasets[stackIdx][iIdx][labelIdx] = item[i];
  //           });
  //         } else {
  //           const currentLength = stacks.length;
  //           stacks.push(item[dimension]);

  //           let ar = Array(itemsToStack.length)
  //             .fill(0)
  //             .map(() => Array(topLabels.length).fill(0));
  //           itemsToStack.forEach((i, iIdx) => {
  //             ar[iIdx][labelIdx] = item[i];
  //           });
  //           datasets[currentLength] = ar;
  //         }
  //       });
  //     });

  //     stacks.forEach((stack, stackIdx) => {
  //       let marginValues = Array(topLabels.length).fill(0);

  //       topLabels.forEach((label, labelIdx) => {
  //         const totalSales =
  //           data[label]?.find((item) => item[dimension] === stack)?.[totalSalesMeasure] || 0;

  //         let totalCost = 0;
  //         itemsToStack.forEach((item, itemIdx) => {
  //           totalCost += datasets[stackIdx][itemIdx][labelIdx] || 0;
  //         });

  //         // Calculate margin = Total Sales - (Material Cost + Suppliers Cost + Discount)
  //         marginValues[labelIdx] = totalSales - totalCost;
  //       });

  //       datasets[stackIdx].push(marginValues);

  //       // Generate a random color for margin
  //       const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  //       // Add each dataset
  //       itemsToStack.concat("Margin").forEach((item, itemIdx) => {
  //         const dataForItem = datasets[stackIdx][itemIdx];
  //         const hasNonZeroValue = dataForItem.some((value) => value !== 0);

  //         if (hasNonZeroValue) {
  //           values.push({
  //             label: `${stack}: ${item}`,
  //             backgroundColor:
  //               item === "Margin"
  //                 ? getRandomColor() // Random color for Margin
  //                 : getRandomColor(), // Random color for other items
  //             stack: stack,
  //             data: dataForItem,
  //             barThickness: 45,
  //             barPercentage: 0.1,
  // categoryPercentage: 0.1,

  //           });
  //         }
  //       });
  //     });

  //     return {
  //       labels: topLabels,
  //       datasets: values,
  //     };
  //   }

  // function scenario4(data, dimension, measure, itemsToStack) {
  //   const topLabels = Object.keys(data);
  // console.log(data,'dstaaaaaaaaaaa')
  //   let stacks = [];
  //   console.log(stacks)
  //   let datasets = [];
  //   console.log(datasets)
  //   let values = [];
  //   console.log(values)

  //   // ** eg:
  //   // ** stacks = ["Hyderabad", "Chennai"]
  //   // ** datasets = [
  //   //**  [ [hyd disc], [hyd supcost] , [hyd matcost] ],
  //   // ** [ [chennai disc], [chennai supcost], [chennai matcost] ]
  //   // ** ]

  //   topLabels.forEach((label, labelIdx) => {
  //     data[label]?.forEach((item, itemIdx) => {
  //       console.log("label", label, "item", item);
  //       // check if the item already exits in stack and find out its idx;
  //       const stackIdx = stacks.findIndex((i) => i === item[dimension]);
  //       if (stackIdx > -1) {
  //         const currentStackData = datasets[stackIdx];
  //         if (Array.isArray(currentStackData)) {
  //           itemsToStack.forEach((i, iIdx) => {
  //             datasets[stackIdx][iIdx][labelIdx] = item[i];
  //           });
  //         } else {
  //           let ar = Array(3)
  //             .fill(0)
  //             .map((v) => [0]);
  //           itemsToStack.forEach((i, iIdx) => (ar[iIdx][labelIdx] = item[i]));
  //           console.log("ar", ar);
  //           datasets[stackIdx] = ar;
  //         }
  //       } else {
  //         // ** item does not exit
  //         const currentLength = stacks.length;
  //         stacks.push(item[dimension]);

  //         let ar = Array(3)
  //           .fill(0)
  //           .map((v) => [0]);
  //         console.log("INDXXX BEF: ", ar);

  //         itemsToStack.forEach((i, iIdx) => {
  //           console.log("INDXXX INS", iIdx, labelIdx, i, item[i]);
  //           ar[iIdx][labelIdx] = item[i];
  //         });
  //         console.log("INDXXX AFT: ", ar);

  //         datasets[currentLength] = ar;
  //       }
  //     });
  //   });

  //   stacks.forEach((stack, stackIdx) => {
  //     itemsToStack.forEach((item, itemIdx) => {
  //       values.push({
  //         label: `${stack}: ${item}`,
  //         backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
  //           16
  //         )}`,
  //         stack: stack,
  //         data: datasets[stackIdx][itemIdx],
  //       });
  //     });
  //   });

  //   return {
  //     labels: topLabels,
  //     datasets: values,
  //   };
  // }

  // okokko
  // function scenario4(data, dimension, measure, itemsToStack) {
  //   const topLabels = Object.keys(data);

  //   let stacks = [];
  //   let datasets = [];
  //   let values = [];

  //   // Sort topLabels based on rank
  //   topLabels.sort((a, b) => {
  //     const rankA = data[a]?.[0]?.rank || 0; // Assuming rank is the same for all items in the dimension
  //     const rankB = data[b]?.[0]?.rank || 0;
  //     return rankA - rankB; // For ascending order, change to rankB - rankA for descending
  //   });

  //   // Initialize datasets
  //   topLabels.forEach((label, labelIdx) => {
  //     data[label]?.forEach((item) => {
  //       const stackIdx = stacks.findIndex((i) => i === item[dimension]);
  //       if (stackIdx > -1) {
  //         // Update existing stack
  //         itemsToStack.forEach((i, iIdx) => {
  //           datasets[stackIdx][iIdx][labelIdx] = item[i];
  //         });
  //       } else {
  //         // Create new stack
  //         stacks.push(item[dimension]);

  //         let ar = Array(itemsToStack.length)
  //           .fill(0)
  //           .map(() => Array(topLabels.length).fill(0));
  //         itemsToStack.forEach((i, iIdx) => {
  //           ar[iIdx][labelIdx] = item[i];
  //         });
  //         datasets[stacks.length - 1] = ar;
  //       }
  //     });
  //   });

  //   // Calculate margins and prepare dataset values
  //   stacks.forEach((stack, stackIdx) => {
  //     let marginValues = Array(topLabels.length).fill(0);

  //     topLabels.forEach((label, labelIdx) => {
  //       const totalSales =
  //         data[label]?.find((item) => item[dimension] === stack)?.[measure] || 0;

  //       let totalCost = 0;
  //       itemsToStack.forEach((item, itemIdx) => {
  //         totalCost += datasets[stackIdx]?.[itemIdx]?.[labelIdx] || 0;
  //       });

  //       marginValues[labelIdx] = totalSales - totalCost;
  //     });

  //     // Add margin to datasets
  //     datasets[stackIdx].push(marginValues);

  //     // Add dataset values
  //     itemsToStack.concat("Margin").forEach((item, itemIdx) => {
  //       const dataForItem = datasets[stackIdx]?.[itemIdx] || [];
  //       const hasNonZeroValue = dataForItem.some((value) => value !== 0);

  //       if (hasNonZeroValue) {
  //         values.push({
  //           label: `${stack}: ${item}`,
  //           backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  //           stack: stack,
  //           data: dataForItem,
  //           barThickness: 45,
  //           barPercentage: 0.8,
  //           categoryPercentage: 0.8,
  //           maxBarThickness: 50,
  //         });
  //       }
  //     });
  //   });

  //   return {
  //     labels: topLabels,
  //     datasets: values,
  //   };
  // }

  function generateShades(baseColor) {
    // Function to generate shades of a base color
    const shades = [];
    for (let i = 0; i <= 5; i++) {
      const shade = Math.min(255, Math.floor(parseInt(baseColor.slice(1), 16) + i * 0x333333))
        .toString(16)
        .padStart(6, "0");
      shades.push(`#${shade}`);
    }
    return shades;
  }

  function scenario4(data, dimension, measure, itemsToStack) {
    const topLabels = Object.keys(data);

    let stacks = [];
    let datasets = [];
    let values = [];

    // Predefined color palette
    const colors = ["#002966","#003380","#003d99","#0047b3",'#0052cc', '#005ce6', '#0066ff', '#1a75ff','#3385ff', '#4d94ff', '#66a3ff', '#80b3ff', '#99c2ff', '#b3d1ff', '#cce0ff', '#e6f0ff']; // Customize as needed


    // Helper function to lighten a color
    function lightenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      ).toString(16).slice(1)}`;
    }

    // Process and sort each dimension's data by rank
    topLabels.forEach((label) => {
      data[label] = (data[label] || []).sort((a, b) => (a.rank || 0) - (b.rank || 0));
    });

    topLabels.forEach((label, labelIdx) => {
      (data[label] || []).forEach((item) => {
        const stackIdx = stacks.findIndex((i) => i === item[dimension]);

        if (stackIdx > -1) {
          // Update existing stack
          itemsToStack.forEach((i, iIdx) => {
            datasets[stackIdx][iIdx][labelIdx] = item[i];
          });
        } else {
          // Create new stack
          stacks.push(item[dimension]);

          // Initialize new array for this stack
          let ar = Array(itemsToStack.length)
            .fill(0)
            .map(() => Array(topLabels.length).fill(0));
          itemsToStack.forEach((i, iIdx) => {
            ar[iIdx][labelIdx] = item[i];
          });
          datasets[stacks.length - 1] = ar;
        }
      });
    });

    // Calculate margins and prepare dataset values
    stacks.forEach((stack, stackIdx) => {
      let marginValues = Array(topLabels.length).fill(0);

      topLabels.forEach((label, labelIdx) => {
        const totalSales =
          (data[label] || []).find((item) => item[dimension] === stack)?.[measure] || 0;

        let totalCost = 0;
        itemsToStack.forEach((item, itemIdx) => {
          totalCost += (datasets[stackIdx]?.[itemIdx]?.[labelIdx] || 0);
        });

        marginValues[labelIdx] = totalSales - totalCost;
      });

      // Add margin to datasets
      datasets[stackIdx].push(marginValues);

      // Add dataset values with the predefined colors
      itemsToStack.concat("Margin").forEach((item, itemIdx) => {
        const dataForItem = datasets[stackIdx]?.[itemIdx] || [];
        const hasNonZeroValue = dataForItem.some((value) => value !== 0);

        if (hasNonZeroValue) {
          // Base color for the group
          const baseColor = colors[stackIdx % colors.length];
          // Lighten the base color for the specific measure
          const backgroundColor = lightenColor(baseColor, itemIdx * 15); // Adjust 15% per measure for lighter shades

          values.push({
            label: `${stack}: ${item}`,
            backgroundColor: backgroundColor,
            stack: stack,
            data: dataForItem,
            barThickness: 45,
            barPercentage: 0.8,
            categoryPercentage: 0.8,
            maxBarThickness: 50,
          });
        }
      });
    });

    return {
      labels: topLabels,
      datasets: values,
    };
  }



  const activeScenario = {
    title: scenario1Title || scenario2Title,
    dimension: scenario1Dimension || scenario2Dimension,
    measure: scenario1Measure || scenario2Measure,
  };

  const getChartTitle = (dimension, measure, includeCOGS, partition, scenario) => {
    if (scenario === 1) return `Chart based on ${dimension} and ${measure}`;
    if (scenario === 2) return `Chart based on ${dimension} and ${measure}`;
    if (scenario === 3)
      return `Chart based on ${dimension} ${measure} and grouped by ${partition.split(":")[0]}`;
    if (scenario === 4)
      return `Chart based on ${dimension} ${measure} and grouped by ${partition.split(":")[0]}`;
    return "Bar Charts";
  };

  const getChartDimenion = (dimension, scenario) => {
    if (scenario === 1) return dimension;
    if (scenario === 2) return dimension;
    if (scenario === 3) return dimension;
    if (scenario === 4) return dimension;
    return "Dimension";
  };

  // const handleSubmit = (data, receivedPayload) => {
  //   console.log("responseeeeeeeeeee", data);
  //   console.log(receivedPayload, "receivedPayload");

  //   if (data) {
  //     setChartsData(data);
  //     setPanelOpen(false);
  //   }

  //   if (receivedPayload) {
  //     const { dimension, measure, includeCOGS, partition } = receivedPayload;

  //     let generatedChartData;
  //     let chartTitle = "";

  //     if (dimension && measure && !includeCOGS && partition === "None") {
  //       generatedChartData = scenario1(data, dimension.split(":")[0], measure);
  //       console.log(dimension.split(":")[0], "dddd");
  //       console.log(measure, "mmm");

  //       chartTitle = getChartTitle(dimension, measure, 1);

  //     } else if (dimension && measure && includeCOGS && partition === "None") {
  //       generatedChartData = scenario2(data, dimension.split(":")[0], measure, [
  //         { label: "Materials Cost", itemKey: "Materials_Cost" },
  //         { label: "Discounts", itemKey: "Discounts" },
  //         { label: "Supplies Cost", itemKey: "Supplies_Cost" },
  //       ]);
  //       chartTitle = getChartTitle(dimension, measure, 2);
  //     } else if (dimension && measure && !includeCOGS && partition !== "None") {
  //       generatedChartData = scenario3(data, dimension.split(":")[0], measure);

  //       chartTitle = getChartTitle(dimension, measure, partition, 3);

  //     } else if (dimension && measure && includeCOGS && partition !== "None") {
  //       generatedChartData = scenario4(data, dimension.split(":")[0], measure, [
  //         "Materials_Cost",
  //         "Discounts",
  //         "Supplies_Cost",
  //       ]);
  //       chartTitle = getChartTitle(dimension, measure, partition, 4);
  //     }

  //     if (generatedChartData) {
  //       // Add new chart data to the list, preserving the previous data
  //       generatedChartData.title = chartTitle;

  //       setChartDataList((prevDataList) => [...prevDataList, generatedChartData]);
  //     }
  //   }

  //   // Store the payload in state
  //   setPayload(receivedPayload);
  // };

  // const getChartTitle = (dimension, measure, includeCOGS, partition, scenario) => {
  //   if (scenario === 1) return `Scenario 1: ${dimension} - ${measure}`;
  //   if (scenario === 2) return `Scenario 2: ${dimension} - ${measure} (COGS Included)`;
  //   if (scenario === 3) return `Scenario 3: ${dimension} - ${measure} (Partition: ${partition})`;
  //   if (scenario === 4) return `Scenario 4: ${dimension} - ${measure} (COGS Included, Partition: ${partition})`;
  //   return 'Default Title';
  // };

  // for styling width of dialog scroll

  const getDialogContentStyles = (scenario) => {
    switch (scenario) {
      case 1:
        return {
          padding: 0,
          overflowX: "auto",
          overflowY: "auto",
          minWidth: "1500px",
          whiteSpace: "nowrap",
        };
      case 2:
        return { padding: 0, overflowX: "auto", overflowY: "auto", minWidth: "2000px" };
      case 3:
        return { padding: 0, overflowX: "auto", overflowY: "auto", minWidth: "3080px" };
      case 4:
        return { padding: 0, overflowX: "auto", overflowY: "auto", minWidth: "5080px" };
      default:
        return { padding: "16px", overflow: "auto" };
    }
  };

  const getBarDivStyles = (scenario, labelsLength) => {
    switch (scenario) {
      case 1:
        return { minWidth: labelsLength * 80 };
      case 2:
        return { minWidth: labelsLength * 90 };
      case 3:
        return { minWidth: labelsLength * 1080 };
      case 4:
        return { minWidth: labelsLength * 1000 };
      //   default:
      //     return { minWidth: labelsLength * 80 }; // Ensure this is your default value
    }
  };

  // Usage in the component

  const handleSubmit = (data, receivedPayload) => {
    console.log("Data:", data);
    console.log("Received Payload:", receivedPayload);

    if (data) {
      setChartsData(data);
      setPanelOpen(false);
    }

    if (receivedPayload) {
      const { dimension, measure, includeCOGS, partition } = receivedPayload;
      let generatedChartData;
      let chartTitle = "";
      let chartDimension = "";

      // Determine the scenario for style scroll bar width
      let scenario = 1; // Default scenario

      if (dimension && measure) {
        const dimensionKey = dimension.split(":")[0];
        if (!includeCOGS && partition === "None") {
          generatedChartData = scenario1(data, dimensionKey, measure);
          chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 1);
          chartDimension = getChartDimenion(dimensionKey, 1);
          scenario = 1;
        } else if (includeCOGS && partition === "None") {
          generatedChartData = scenario2(data, dimensionKey, measure, [
            { label: "Materials Cost", itemKey: "Materials_Cost" },
            { label: "Discounts", itemKey: "Discounts" },
            { label: "Supplies Cost", itemKey: "Supplies_Cost" },
          ]);
          chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 2);
          chartDimension = getChartDimenion(dimensionKey, 2);
          scenario = 2;
        } else if (!includeCOGS && partition !== "None") {
          generatedChartData = scenario3(data, dimensionKey, measure);
          chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 3);
          chartDimension = getChartDimenion(dimensionKey, 3);
          scenario = 3;
        } else if (includeCOGS && partition !== "None") {
          generatedChartData = scenario4(data, dimensionKey, measure, [
            "Materials_Cost",
            "Discounts",
            "Supplies_Cost",
          ]);
          chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 4);
          chartDimension = getChartDimenion(dimensionKey, 4);
          scenario = 4;
        }
        console.log("Determined Scenario:", scenario); // Debugging
        if (generatedChartData) {
          generatedChartData.title = chartTitle;
          generatedChartData.dimension = chartDimension;
          generatedChartData.scenario = scenario;
          setChartDataList((prevDataList) => [...prevDataList, generatedChartData]);
        }

        const labelsLength = generatedChartData.labels.length;
        const styles = getBarDivStyles(scenario, labelsLength);
        setBarDivStyles(styles);
        setDialogStyles(getDialogContentStyles(scenario));

        // setBarDivStyles(getBarDivStyles(scenario, labelsLength));
      }

      setPayload(receivedPayload);
    }
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
  };

  const transformData = () => {
    if (!chartsData || typeof chartsData !== "object") {
      console.error("Invalid chartsData format");
      return { labels: [], datasets: [] };
    }

    const allData = Object.keys(chartsData).flatMap((groupKey) => {
      const groupData = chartsData[groupKey];

      if (!Array.isArray(groupData)) {
        console.error(`Expected an array for groupKey ${groupKey}, but got`, groupData);
        return [];
      }

      return groupData.map((item) => ({
        ...item,
        Group: groupKey, // Keep group key for later processing
      }));
    });

    if (allData.length === 0) {
      console.error("No data available to transform");
      return { labels: [], datasets: [] };
    }

    const keys = Object.keys(allData[0]);
    const dimensionKey = keys.find(
      (key) => typeof allData[0][key] === "string" && key !== "rank" && key !== "Group"
    );
    const groupingKey = keys.find(
      (key) =>
        typeof allData[0][key] === "string" &&
        key !== dimensionKey &&
        key !== "rank" &&
        key !== "Group"
    );
    const measureKey = keys.find((key) => {
      const value = allData[0][key];
      return typeof value === "number" && value !== 0;
    });

    if (!dimensionKey || !measureKey) {
      console.error("Required keys for dimension or measure are missing");
      return { labels: [], datasets: [] };
    }

    // Filter out data with zero values
    const filteredData = allData.filter((d) => d[measureKey] !== 0);

    const labels = [...new Set(filteredData.map((d) => d[dimensionKey]))];
    const groups = [...new Set(filteredData.map((d) => d[groupingKey] || "No Group"))];
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const datasets = groups.map((group, groupIndex) => {
      return {
        label: group,
        data: labels.map((label) => {
          const groupData = filteredData.filter(
            (d) => d[dimensionKey] === label && (d[groupingKey] || "No Group") === group
          );
          const total = groupData.reduce((acc, d) => acc + (d[measureKey] || 0), 0);
          return total;
        }),
        backgroundColor: colorScale(groupIndex),
      };
    });

    return {
      labels,
      datasets,
    };
  };

  const formatValue = (value) => {
    if (typeof value !== "number") {
      console.error("Value is not a number:", value);
      return value;
    }

    const currentChartData = chartDataList[0];

    if (!currentChartData || !currentChartData.datasets) {
      console.error("Chart data or datasets are undefined:", currentChartData);
      return value;
    }

    const datasets = currentChartData.datasets;
    const maxValue = datasets
      .flatMap((dataset) => dataset.data || [])
      .reduce((max, current) => Math.max(max, current), 0);

    console.log("Max Value:", maxValue);

    if (maxValue >= 100000) {
      return `${(value / 1000).toFixed(1)}k`; // For millions
    }
    //  else if (maxValue >= 1000000) {
    //   return `${(value / 1000000).toFixed(1)}M`; // For millions
    // }
    //  else if (maxValue >= 100000) {
    //   return `${(value / 1000).toFixed(1)}K`; // For thousands
    // }
    else {
      return value.toFixed(2); // For smaller values
    }
  };

  // const options = {
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: "Dynamic Chart",
  //     },
  //     legend: {
  //       display: false,
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: function (tooltipItem) {
  //           // Access the dataset and data
  //           let dataset = tooltipItem.dataset;
  //           let data = dataset.data[tooltipItem.dataIndex];

  //           // Check if data is available
  //           if (data && data.value !== undefined) {
  //             const { value, dimension, rank, measure } = data;

  //             // Customize the label to include rank and measure
  //             return `${dimension}: ${value}, Rank: ${rank}, Measure: ${measure}`;
  //           } else {
  //             return "No data available";
  //           }
  //         },
  //       },
  //     },
  //   },
  //   layout: {
  //     padding: {
  //       left: 10,
  //       right: 10,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       stacked: false,
  //       title: {
  //         display: true,
  //         text: "Dimension",
  //       },
  //     },
  //     y: {
  //       beginAtZero: true,
  //       ticks: {
  //         callback: formatValue,
  //       },
  //     },
  //   },
  // };

  // Use the options in your Bar component
  // <Bar data={chartData} options={options} />;

  const handleCreateClick = () => {
    setPanelOpen(true);
  };

  const getDynamicTitle = (chartData) => {
    // if (!chartsData || !chartsData.dimensionKey || !chartsData.groupingKey) return "Chart Title";
    return `Chart based onon ${chartData.dimension} grouped by ${chartData.partition}`;
  };

  const handleDeleteChart = (index) => {
    setChartDataList((prevList) => prevList.filter((_, i) => i !== index));
  };

  return (
    <>
      <Grid item xs={12} md={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        {/* <Button variant="contained" onClick={handleCreateClick} style={{ marginBottom: "1%" }}>
          Create
        </Button> */}
        <Tooltip title="Create new graph" arrow>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            style={{
              marginBottom: "1%",
              backgroundColor: "#4d0099", // Button color
              color: "#fff", // Text color
              borderColor: "#b366ff", // Border color
              "&:hover": {
                backgroundColor: "#9a4fff", // Color on hover
                borderColor: "#9a4fff", // Border color on hover
              },
            }}
          >
            Create
          </Button>
        </Tooltip>
      </Grid>

      {/* for delte */}
      <Grid container spacing={2}>
        {chartDataList.length > 0 &&
          chartDataList.map((chartData, index) => {
            const isScenario2 = chartData.datasets.some(
              (dataset) => dataset.label === "Total Sales"
            );
            const labelsLength = chartData.labels.length;
            const minWidth = getBarDivStyles(chartData.scenario, labelsLength).minWidth;
            return (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Box
                  style={{
                    backgroundColor: "white",
                    // height: "350px",
                    boxShadow: "1px 2px 2px 1px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                    padding: "10px",
                    position: "relative",
                    // maxWidth: "500px",
                    overflow: "auto", // Ensure overflow is auto for scroll
                  }}
                >
                  <div
                    style={{
                      position: "sticky",
                      top: 0,
                      left: 0,
                      zIndex: 1000,
                      backgroundColor: "white",
                      padding: "5px",
                      display: "flex",
                      alignItems: "center", // Vertically center items
                      justifyContent: "space-between", // Space out the heading and icons
                      width: "100%",
                      // borderBottom: "1px solid gray",
                      boxShadow: "1px 2px 2px 1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Left empty to push heading to center */}
                    {/* <div style={{ flex: 1, width: "300px" }}></div> */}

                    {/* Centered heading */}
                    <h2 style={{ textAlign: "center", flex: 1, fontSize: "11px" }}>
                      {chartData.title || "Bar Charts"}
                    </h2>

                    {/* Icon buttons */}
                    <div style={{ display: "flex", gap: "10px" }}>
                      <IconButton
                        onClick={() => handleOpenModal(index)}
                        style={{
                          zIndex: 1000,
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "5px",
                        }}
                      >
                        <BsArrowsFullscreen />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteChart(index)}
                        style={{
                          zIndex: 1000,
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "5px",
                        }}
                      >
                        <BsTrash />
                      </IconButton>
                    </div>
                  </div>

                  <div
                    // style={{
                    //   // Ankita confirm width
                    //   minWidth: chartData.labels.length * 80,
                    //   display: "flex",
                    //   flexDirection: "column",
                    //   height: "300px",
                    //   // width:"100%"
                    // }}
                    style={{
                      // ...barDivStyles, // Apply the dynamically calculated styles
                      // ...styles,
                      minWidth: minWidth,
                      display: "flex",
                      flexDirection: "column",
                      height: "300px",
                    }}
                  >
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          title: {
                            display: true,
                            // text: getDynamicTitle(chartData),
                          },
                        },
                        layout: {
                          padding: {
                            left: -4,
                            right: 0,
                          },
                        },
                        scales: {
                          // x: {
                          //   offset: true,
                          //   min: -9,
                          //   stacked: isScenario2,
                          //   title: {
                          //     display: true,

                          //   },
                          //   grid: {
                          //     display: false,
                          //   },
                          //   ticks: {
                          //     autoSkip: false,

                          //   },

                          // },
                          x: {
                            offset: true, // This adds padding between the y-axis and the first bar
                            grid: {
                              display: false, // Hide grid lines for a cleaner look
                            },
                            ticks: {
                              autoSkip: false, // Ensure all labels are shown
                              padding: 10, // Adds padding between the labels and the bars
                            },
                            afterFit: (scale) => {
                              scale.paddingLeft = 20; // Extra space on the left of the x-axis
                              scale.paddingRight = 20; // Extra space on the right of the x-axis
                            },
                          },

                          y: {
                            beginAtZero: true,
                            type: "logarithmic",
                            ticks: {
                              callback: formatValue,
                            },
                            title: {
                              display: true,
                              text: "Measure",
                              font: {
                                size: 14, // Adjust the font size as needed
                                weight: "bold", // Make the font bold
                              },
                            },
                          },
                        },
                        //                     elements: {
                        //   bar: {
                        //     maxBarThickness: 100, // Avoid restricting bar thickness
                        //   },
                        // },
                      }}
                    />
                  </div>

                  <div
                    style={{
                      position: "sticky",
                      top: 0,
                      left: 0,
                      zIndex: 1000,
                      backgroundColor: "white",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center", // Vertically center items
                      justifyContent: "space-between", // Space out the heading and icons
                      width: "100%",
                    }}
                  >
                    {/* Left empty to push heading to center */}
                    <div style={{ flex: 1, width: "300px" }}></div>

                    {/* Centered heading */}
                    <h2
                      style={{
                        marginRight: 50,
                        textAlign: "center",
                        flex: 1,
                        fontSize: "14px",
                        marginTop: -20,
                      }}
                    >
                      {/* {activeScenario.dimension} */}
                      {chartData.dimension || "Dimension"}
                    </h2>

                    {/* Icon buttons */}
                  </div>
                </Box>
              </Grid>
            );
          })}

        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          sx={{
            "& .MuiDialog-paper": {
              maxWidth: "100%",
              width: "80%",
              borderRadius: "15px",
              margin: "10px",
              height: "100%",
              marginBottom: "10px",
            },
            "& .MuiDialogContent-root": {
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                zIndex: 1000,
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <BsArrowsCollapse />
            </IconButton>
          </DialogTitle>
          <DialogContent
            // style={{ padding: 0, overflowX: "auto", overflowY: "auto", minWidth: "2000px" }}
            // Ankita Chnage style
            style={dialogStyles}
          >
            <div style={{ width: "100%", height: "100%" }}>
              {currentData && (
                <Bar
                  data={currentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        // text: getDynamicTitle(currentData),
                        text: "",
                      },
                      legend: {
                        display: false,
                      },
                    },
                    layout: {
                      padding: {
                        left: 0,
                        right: 10,
                      },
                    },
                    scales: {
                      x: {
                        stacked: currentData.datasets.some(
                          (dataset) => dataset.label === "Total Sales"
                        ),
                        title: {
                          display: true,
                          // text: activeScenario.dimension,
                          text: "",

                          font: {
                            size: 14, // Adjust the font size as needed
                            weight: "bold", // Make the font bold
                          },
                        },
                        grid: {
                          display: true, // Turn off grid lines on the x-axis
                        },
                      },
                      y: {
                        beginAtZero: true,
                        type: "logarithmic",
                        ticks: {
                          callback: formatValue,
                        },
                        title: {
                          display: true,
                          // text: activeScenario.measure,
                          text: "",

                          font: {
                            size: 14, // Adjust the font size as needed
                            weight: "bold", // Make the font bold
                          },
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* <Dialog
          open={openModal}
          onClose={handleCloseModal}
          sx={{
            "& .MuiDialog-paper": {
              maxWidth: "100%",
              width: "100%",
              borderRadius: "15px",
              margin: "10px",
              height: "100%",
              marginBottom: "10px",
              overflow: "auto",
            },
            "& .MuiDialogContent-root": {
              overflow: "auto",
            },
          }}
        >
          <DialogTitle
            style={{
              position: "sticky", // Sticky positioning for the header
              top: 0,
              backgroundColor: "white",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "1px 2px 2px 1px rgba(0, 0, 0, 0.1)",
              zIndex: 1000, // Ensure the header is above other elements
              width: "100%",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "16px",
                textAlign: "center",
                flex: 1,
              }}
            >
              Bar Chart
            </h2>

            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                right: 20,
                top: 20,
                zIndex: 1001,
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <BsArrowsCollapse />
            </IconButton>
          </DialogTitle>

          <DialogContent
            style={{
              padding: 0,
              overflow: "auto", // Enable scrolling for the content
              flex: 1, // Make sure DialogContent takes up available space
            }}
          >
            <div style={{ width: "100%", height: "100%",overflowX: "auto", overflowY: "auto", }}>
              {currentData && (
                <Bar
                  data={currentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: getDynamicTitle(currentData),
                      },
                      legend: {
                        display: false,
                      },
                    },
                    layout: {
                      padding: {
                        left: 20,
                        right: 10,
                      },
                    },
                    scales: {
                      x: {
                        stacked: currentData.datasets.some(
                          (dataset) => dataset.label === "Total Sales"
                        ),
                        title: {
                          display: true,
                          text: "Dimension",
                          font: {
                            size: 14,
                            weight: "bold",
                          },
                        },
                      },
                      y: {
                        beginAtZero: true,
                        type: "logarithmic",
                        ticks: {
                          callback: formatValue,
                        },
                        title: {
                          display: true,
                          text: "Measure",
                          font: {
                            size: 14,
                            weight: "bold",
                          },
                        },
                      },

                    },
                    elements: {
      bar: {
        maxBarThickness: 100, // Avoid restricting bar thickness
      },
    },

                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog> */}
      </Grid>

      <SlideOutPanel open={isPanelOpen} onClose={handleClosePanel} handleSubmit={handleSubmit} />
    </>
  );
};

App.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default App;

{
  /* <Dialog
  open={openModal}
  onClose={handleCloseModal}
  sx={{
    "& .MuiDialog-paper": {
      maxWidth: "100%",
      width: "80%",
      borderRadius: "15px",
      margin: "10px",
      height: "100%",
      marginBottom: "10px",
    },
    "& .MuiDialogContent-root": {
      overflow: "hidden",
    },
  }}
>


  <DialogContent style={{ padding: 0, overflowX: "auto", overflowY: "auto", width: "1800px" }}>
    <div style={{ width: "100%", height: "100%" }}>
      {currentData && (
        <Bar
          data={currentData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                // text: getDynamicTitle(currentData),
              },
              legend: {
                display: false,
              },
            },
            layout: {
              padding: {
                left: 20,
                right: 10,
              },
            },
            scales: {
              x: {
                stacked: currentData.datasets.some((dataset) => dataset.label === "Total Sales"),
                title: {
                  display: true,
                  text: "Dimenion",
                  font: {
                    size: 14, // Adjust the font size as needed
                    weight: "bold", // Make the font bold
                  },
                },
              },
              y: {
                beginAtZero: true,
                type: "logarithmic",
                ticks: {
                  callback: formatValue,
                },
                title: {
                  display: true,
                  text: "Measure",
                  font: {
                    size: 14, // Adjust the font size as needed
                    weight: "bold", // Make the font bold
                  },
                },
              },
            },
          }}
        />
      )}
    </div>
  </DialogContent>
</Dialog>; */
}
