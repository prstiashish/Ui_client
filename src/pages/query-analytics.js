import React, { useState, useEffect, useRef } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";

import * as d3 from "d3";
import SlideOutPanel from "./slideoutpannel"; // Ensure this path is correct
import { DashboardLayout } from "src/components/dashboard-layout";
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { useRouter } from "next/router";
import { concat } from "lodash";

import GraphScenario1Chart from "src/components/charts/GraphScenario1Chart";
import GraphScenario2Chart from "src/components/charts/GraphScenario2Chart";
import GraphScenario3Chart from "src/components/charts/GraphScenario3Chart";
import GraphScenario4Chart from "src/components/charts/GraphScenario4Chart";

// import DancingDots from 'src/components/charts/DancingDots'; // Import the DancingDots component

import SessionStorageService from "src/utils/browser-storage/session";

import Cookies from "js-cookie";

const QueryAnalytics = () => {
  const [loadingStates, setLoadingStates] = useState([]); // Track loading states for each chart

  const [chartsData, setChartsData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isPanelOpen, setPanelOpen] = useState(false);

  const [chartDataSets, setChartDataSets] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  // console.log(currentData, "lllllllllll");
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

  // for periodic tale
  const [chartPayload, setChartPayload] = useState(null); // State to store the payload
  console.log(chartPayload, "chartPayload");

  // worlignn

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
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No valid data provided for scenario1."); // Log a warning if data is invalid
      return { labels: [], values: [] }; // Return empty data structure
    }
    let labels = [];
    let values = [];

    data.forEach((d) => {
      labels.push(d[dimension]);
      values.push(d[measure]);
    });

    // console.log(labels, "labels");
    // console.log(values, "values");

    // Define the dynamic title and labels
    const title = `Charts based on ${dimension} and ${measure}`;
    // console.log(title, "tttt");

    setScenario1Title(title);

    // const xLabel = `Dimension: ${dimension}`;
    const xLabel = dimension;

    // console.log(xLabel, "x");
    setscenario1Dimension(xLabel);

    // const yLabel = `Measure: ${measure}`;
    const yLabel = measure;

    // console.log(yLabel, "y");
    setscenario1Measure(yLabel);
    const result = {
      labels,
      datasets: [
        // {
        //   backgroundColor: "#003380",
        //   borderColor: "#003380",
        //   hoverBackgroundColor: "#003380",
        //   hoverBorderColor: "#003380",
        //   barThickness: 30,
        //   maxBarThickness: 40,
        //   barPercentage: 0.1,
        //   categoryPercentage: 1,

        // },
        {
          backgroundColor: "#A1C6E7",
          borderColor: "#FFFFFF",
          borderWidth: 1,
          hoverBackgroundColor: "#6A9BD4",
          hoverBorderColor: "#6A9BD4",
          // barThickness: 45,
          // maxBarThickness: 50,
          // barPercentage: 1.0,
          // categoryPercentage: 1.0,
          barThickness: 40,
          barPercentage: 0.8,
          categoryPercentage: 0.8,
          maxBarThickness: 50,
          data: values,
          measureName: measure, // Include the measure name here
        },
      ],
      // chartOptions: {
      //   responsive: true,
      //   maintainAspectRatio: false,
      //   plugins: {
      //     legend: {
      //       display: false,
      //     },
      //     title: {
      //       display: true,
      //       text: title, // Set the dynamic title here
      //     },
      //   },
      //   scales: {
      //     x: {
      //       title: {
      //         display: true,
      //         text: xLabel, // Set the dynamic X-axis label here
      //       },
      //       grid: {
      //         display: false,
      //       },
      //     },
      //     y: {
      //       beginAtZero: true,
      //       title: {
      //         display: true,
      //         text: yLabel, // Set the dynamic Y-axis label here
      //       },
      //     },
      //   },
      // },
    };

    // console.log(result, "resultttt");
    // return result;
    return { ...result, title, xLabel, yLabel };
  }

  // function scenario2(data, dimension, measure, itemsToStack) {

  //   let labels = [];
  //   let dataSets = [];

  //   const colors = [
  //     "#FFA07A", // Light Salmon (Soft orange-pink)
  //     "#A4D6A8",
  //     "#87CEFA", // Light Sky Blue (Calm blue)
  //     "#98FB98", // Pale Green (Soft green)

  //     "#F08080", // Light Coral (Soft red)
  //     "#FFB6C1", // Light Pink (Soft and delicate)
  //   ];

  //   console.log(itemsToStack, "itemsToStack");

  //   // Create a dataset for each stackable item
  //   itemsToStack.forEach((item, index) => {
  //     dataSets.push({
  //       label: item.label,
  //       // measure: item.measure,
  //       backgroundColor: colors[index % colors.length], // Apply the shades
  //       borderColor: colors[index % colors.length], // Border color
  //       hoverBackgroundColor: colors[index % colors.length], // Keep the same color on hover
  //       hoverBorderColor: colors[index % colors.length], // Keep the same border color on hover
  //       data: [], // Breakdown data
  //       stack: "stack1",
  //     });
  //   });

  //   // Process each data point
  //   data.forEach((d) => {
  //     labels.push(d[dimension]); // Set labels for x-axis
  //     let cumulativeValue = 0;

  //     // Calculate and store values for each stackable item
  //     itemsToStack.forEach((item, idx) => {
  //       const itemValue = d[item.itemKey] || 0;
  //       dataSets[idx].data.push(itemValue);
  //       cumulativeValue += itemValue;
  //     });

  //   });

  //   return {
  //     labels,
  //     datasets: dataSets,
  //   };
  // }

  function scenario2(data, dimension, measure, itemsToStack) {
    let labels = [];
    let dataSets = [];

    const colors = [
      "#FFA07A", // Light Salmon
      "#A4D6A8",
      "#87CEFA", // Light Sky Blue
      "#FFB6C1", // Light Pink
      "#98FB98", // Pale Green
      "#F08080", // Light Coral
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
        percentageData: [],
        stack: "stack1",
      });
    });

    // Process each data point
    data.forEach((d) => {
      labels.push(d[dimension]); // Set labels for x-axis

      // Calculate and store values for each stackable item
      itemsToStack.forEach((item, idx) => {
        const itemValue = d[item.itemKey] || 0; // Use value from fetched data
        const percentageValue = d[item.percentageKey] || 0; // Use percentage from fetched data

        dataSets[idx].data.push(itemValue); // Push the actual values for the bar
        dataSets[idx].percentageData.push(percentageValue);
      });
    });

    return {
      labels,
      datasets: dataSets,
    };
  }

  // function scenario3(data, dimension, measure) {
  //   console.log("dataaa", data); // Debugging output

  //   const topLabels = Object.keys(data); // Get all dimension labels
  //   const allItems = []; // To hold unique items for the specified dimension
  //   const datasets = []; // To hold datasets for the chart

  //   const colors = [
  //     "#A0C6E0", // Light Blue
  //     "#FFD2A6", // Light Orange
  //     "#A4D6A8", // Light Green
  //     "#F2B2B1", // Light Red
  //     "#D5C3E8", // Light Purple
  //     "#D2BFA2", // Light Brown
  //     "#F2A6C8", // Light Pink
  //     "#BEBEBE", // Light Gray
  //     "#D8D95B", // Light Olive
  //     "#A3E6E5", // Light Cyan
  //     "#C4D6E9", // Soft Blue
  //     "#FFE6B5", // Soft Orange
  //     "#B5E1B5", // Soft Green
  //     "#FFB3B1", // Soft Red
  //     "#D6B9E8", // Soft Lavender
  //     "#E1C6B0", // Soft Tan
  //     "#F9C3D0", // Soft Blush
  //     "#D7D7D7", // Light Gray
  //     "#E3E3A5", // Light Olive
  //     "#B0E4E3", // Soft Teal
  //     "#F2D6C1", // Soft Peach
  //   ];

  //   const colorMap = {}; // To store colors for each unique item

  //   // Iterate through each dimension label
  //   topLabels.forEach((label) => {
  //     data[label].forEach((item) => {
  //       const itemValue = item[dimension]; // Get the value for the specified dimension
  //       const itemMeasure = item[measure]; // Get the measure value

  //       // Check if the item already exists and find its index
  //       const itemIdx = allItems.findIndex((i) => i === itemValue);

  //       if (itemIdx > -1) {
  //         // Item exists, push the measure value into the existing dataset
  //         datasets[itemIdx].data.push(itemMeasure);
  //       } else {
  //         // Item does not exist, create a new entry
  //         allItems.push(itemValue); // Add the new item value
  //         datasets.push({
  //           // `${stack} - ${itemConfig.label}`
  //           // label: itemValue, // Assign the label for the dataset
  //           label: `${itemValue} - ${measure}`,
  //           data: [itemMeasure], // Initialize with the measure value
  //           backgroundColor: colors[allItems.length % colors.length], // Assign color
  //         });
  //       }
  //     });
  //   });

  //   // Fill in empty data arrays for missing items across different groups
  //   datasets.forEach((dataset) => {
  //     dataset.data.length = topLabels.length; // Ensure the dataset length matches the number of labels
  //     dataset.data.fill(0); // Fill with zeros initially
  //   });

  //   // Re-populate datasets with the actual measure values
  //   topLabels.forEach((label, labelIndex) => {
  //     data[label].forEach((item) => {
  //       const itemValue = item[dimension];
  //       const datasetIndex = allItems.indexOf(itemValue);
  //       if (datasetIndex > -1) {
  //         datasets[datasetIndex].data[labelIndex] = item[measure]; // Assign the measure value
  //       }
  //     });
  //   });

  //   return {
  //     labels: topLabels, // Labels for each dimension
  //     datasets: datasets, // Datasets for the chart
  //   };
  // }

  function scenario3(data, dimension, measure) {
    const topLabels = Object.keys(data); // Get all dimension labels
    const allItems = []; // To hold unique items for the specified dimension
    const datasets = []; // To hold datasets for the chart

    const colors = [
      "#A0C6E0",
      "#FFD2A6",
      "#A4D6A8",
      "#F2B2B1",
      "#D5C3E8",
      "#D2BFA2",
      "#F2A6C8",
      "#BEBEBE",
      "#D8D95B",
      "#A3E6E5",
      "#C4D6E9",
      "#FFE6B5",
      "#B5E1B5",
      "#FFB3B1",
      "#D6B9E8",
      "#E1C6B0",
      "#F9C3D0",
      "#D7D7D7",
      "#E3E3A5",
      "#B0E4E3",
      "#F2D6C1",
    ];

    const colorMap = {}; // To store colors for each unique item

    // Iterate through each dimension label
    topLabels.forEach((label, labelIndex) => {
      if (Array.isArray(data[label])) {
        data[label].forEach((item) => {
          const itemValue = item[dimension]; // Properly define itemValue here
          const itemMeasure = item[measure]; // Also capture the measure value
          const datasetIndex = allItems.indexOf(itemValue);

          if (datasetIndex > -1) {
            datasets[datasetIndex].data[labelIndex] = itemMeasure; // Update the existing dataset
          } else {
            // Item does not exist, create a new entry
            allItems.push(itemValue); // Add the new item value
            datasets.push({
              label: `${itemValue} - ${measure}`,
              data: Array(topLabels.length).fill(0), // Initialize the data array with 0s
              backgroundColor: colors[allItems.length % colors.length], // Assign a color
            });
            datasets[datasets.length - 1].data[labelIndex] = itemMeasure; // Add the measure value at the correct position
          }
        });
      }
    });

    return {
      labels: topLabels, // Labels for each dimension
      datasets: datasets, // Datasets for the chart
    };
  }

  // for color 1st
  // function scenario4(data, dimension, measure, itemsToStack) {
  //   console.log("scenario444444444dataa", data);
  //   console.log(measure, "mmmmmmm");
  //   const topLabels = Object.keys(data); // Get all dimension labels

  //   let stacks = []; // To hold unique stacks for the specified dimension
  //   let datasets = []; // To hold datasets for the chart
  //   let values = []; // To hold final data values

  //   // Define a set of distinct colors for each measure
  //   const colorPalette = [
  //     "#A0C6E0", // Light Blue
  //     "#FFD2A6", // Light Orange
  //     "#A4D6A8", // Light Green
  //     "#F2B2B1", // Light Red
  //     "#D5C3E8", // Light Purple
  //     "#D2BFA2", // Light Brown
  //     "#F2A6C8", // Light Pink
  //     "#BEBEBE", // Light Gray
  //     "#D8D95B", // Light Olive
  //     "#A3E6E5", // Light Cyan
  //     // Add more colors as needed
  //   ];

  //   // Process and sort each dimension's data by rank
  //   topLabels.forEach((label) => {
  //     data[label] = (data[label] || []).sort((a, b) => (a.rank || 0) - (b.rank || 0));
  //   });

  //   // Iterate through each label to create stacks
  //   topLabels.forEach((label, labelIdx) => {
  //     (data[label] || []).forEach((item) => {
  //       const stackIdx = stacks.findIndex((i) => i === item[dimension]);

  //       if (stackIdx > -1) {
  //         // Update existing stack
  //         itemsToStack.forEach((i, iIdx) => {
  //           datasets[stackIdx][iIdx][labelIdx] = item[i] || 0; // Ensure fallback to zero
  //         });
  //       } else {
  //         // Create new stack
  //         stacks.push(item[dimension]);

  //         // Initialize new array for this stack
  //         let ar = Array(itemsToStack.length)
  //           .fill(0)
  //           .map(() => Array(topLabels.length).fill(0));
  //         itemsToStack.forEach((i, iIdx) => {
  //           ar[iIdx][labelIdx] = item[i] || 0; // Ensure fallback to zero
  //         });
  //         datasets.push(ar);
  //       }
  //     });
  //   });

  //   stacks.forEach((stack, stackIdx) => {
  //     let marginValues = Array(topLabels.length).fill(0);

  //     topLabels.forEach((label, labelIdx) => {
  //       const totalSales =
  //         (data[label] || []).find((item) => item[dimension] === stack)?.[measure] || 0;
  //       let totalCost = 0;

  //       itemsToStack.forEach((item, itemIdx) => {
  //         totalCost += (datasets[stackIdx]?.[itemIdx] || []).reduce((a, b) => a + (b || 0), 0); // Sum up costs
  //       });

  //       // marginValues[labelIdx] = totalSales - totalCost;
  //     });

  //     // Add margin values to the last dataset
  //     // datasets[stackIdx].push(marginValues);

  //     // Create dataset for each stack
  //     itemsToStack.concat("Margin").forEach((item, itemIdx) => {
  //       const dataForItem = datasets[stackIdx][itemIdx] || [];
  //       const hasNonZeroValue = dataForItem.some((value) => value !== 0);

  //       if (hasNonZeroValue) {
  //         const baseColor = colorPalette[itemIdx % colorPalette.length]; // Use distinct color for each item

  //         values.push({
  //           label: `${stack}: ${item}`,
  //           backgroundColor: baseColor, // Use the base color for the stack
  //           data: dataForItem,
  //           stack: stack,
  //         });
  //       }
  //     });
  //   });

  //   return {
  //     labels: topLabels, // Labels for each dimension
  //     datasets: values, // Datasets for the chart
  //   };
  // }

  // working without percentage

  //

  // geting somtie error

  function scenario4(data, dimension, measure, itemsToStack) {
    const topLabels = Object.keys(data); // Get all dimension labels
    const stacks = []; // To hold unique stacks for the specified dimension
    const datasets = []; // To hold datasets for the chart
    const values = []; // To hold final data values

    const colorPalette = [
      "#FFA07A", // Light Salmon
      "#A4D6A8",
      "#87CEFA", // Light Sky Blue
      "#FFB6C1", // Light Pink
      "#98FB98", // Pale Green
      "#F08080", // Light Coral
    ];

    // chned this to beloe array

    // Sort each dimension's data by rank
    // topLabels.forEach((label) => {
    //   data[label] = (data[label] || []).sort((a, b) => (a.rank || 0) - (b.rank || 0));
    //   console.log(`Sorted data for ${label}:`, data[label]); // Log sorted data for each label
    // });

    // Sort each dimension's data by rank
    topLabels.forEach((label) => {
      // Ensure data[label] is an array
      if (!Array.isArray(data[label])) {
        console.warn(`data[${label}] is not an array. Received:`, data[label]);
        data[label] = []; // Fallback to an empty array if it's not an array
      }
      data[label] = data[label].sort((a, b) => (a.rank || 0) - (b.rank || 0));
      console.log(`Sorted data for ${label}:`, data[label]); // Log sorted data for each label
    });

    // Iterate through each label to create stacks
    topLabels.forEach((label, labelIdx) => {
      (data[label] || []).forEach((item) => {
        const stackIndex = stacks.findIndex((i) => i === item[dimension]);

        if (stackIndex > -1) {
          // Update existing stack
          itemsToStack.forEach((itemConfig, iIdx) => {
            datasets[stackIndex][iIdx][labelIdx] = item[itemConfig.itemKey] || 0; // Ensure fallback to zero
            // console.log(
            //   `Updated existing stack: ${item[dimension]}, ${itemConfig.itemKey}:`,
            //   datasets[stackIndex][iIdx][labelIdx]
            // );
          });
        } else {
          // Create new stack
          stacks.push(item[dimension]);

          // Initialize new array for this stack
          const newStackData = Array(itemsToStack.length)
            .fill(0)
            .map(() => Array(topLabels.length).fill(0));

          itemsToStack.forEach((itemConfig, iIdx) => {
            newStackData[iIdx][labelIdx] = item[itemConfig.itemKey] || 0; // Ensure fallback to zero
            // console.log(`New stack created for ${item[dimension]}:`, newStackData);
          });

          datasets.push(newStackData);
        }
      });
    });

    // Create dataset for each stack
    // Create dataset for each stack
    stacks.forEach((stack, stackIdx) => {
      itemsToStack.forEach((itemConfig, itemIdx) => {
        const dataForItem = datasets[stackIdx][itemIdx] || [];
        const hasNonZeroValue = dataForItem.some((value) => value !== 0);

        // console.log(
        //   `Data for stack: ${stack}, item: ${itemConfig.label}, has non-zero value: ${hasNonZeroValue}`,
        //   dataForItem
        // );

        if (hasNonZeroValue) {
          const baseColor = colorPalette[itemIdx % colorPalette.length]; // Use distinct color for each item

          // Calculate percentageData
          const percentageData = dataForItem.map((_, idx) => {
            const originalData = data[topLabels[idx]]; // Fetch original data using label index
            if (!originalData) {
              console.log(`Original data missing for top label ${topLabels[idx]}`);
            }
            const originalItem = originalData ? originalData[stackIdx] : undefined; // Adjust the index to safely access
            if (!originalItem) {
              console.log(
                `Original item missing for ${stack} at index ${idx} and stackIdx ${stackIdx}`
              );
            }
            const percentageValue = originalItem ? originalItem[itemConfig.percentageKey] : 0; // Return the percentage value or 0
            // console.log(
            //   `Calculating percentage for ${stack}, topLabel: ${topLabels[idx]}, percentageValue: ${percentageValue}`
            // );
            return percentageValue;
          });

          // console.log(`Final percentage data for ${stack} - ${itemConfig.label}:`, percentageData);

          values.push({
            label: `${stack} - ${itemConfig.label}`, // Dimension (stack) and label combined
            backgroundColor: baseColor, // Use the base color for the stack
            data: dataForItem,
            stack: stack, // This remains the same
            percentageData: percentageData, // Include percentageData
          });
        }
      });
    });

    // console.log("Final values to return:", values);

    return {
      labels: topLabels, // Labels for each dimension
      datasets: values, // Datasets for the chart
    };
  }

  // yes
  // function scenario4(data, dimension, measure, itemsToStack) {
  //   // console.log("Input Data:", data);
  //   // console.log("Measure:", measure);

  //   const topLabels = Object.keys(data); // Get all dimension labels
  //   const stacks = []; // To hold unique stacks for the specified dimension
  //   const datasets = []; // To hold datasets for the chart
  //   const values = []; // To hold final data values

  //   const colorPalette = [
  //     "#FFA07A", // Light Salmon (Soft orange-pink)
  //     "#A4D6A8",
  //     "#87CEFA", // Light Sky Blue (Calm blue)
  //     "#98FB98", // Pale Green (Soft green)

  //     "#F08080", // Light Coral (Soft red)
  //     "#FFB6C1", // Light Pink (Soft and delicate)
  //   ];

  //   // Sort each dimension's data by rank
  //   topLabels.forEach((label) => {
  //     data[label] = (data[label] || []).sort((a, b) => (a.rank || 0) - (b.rank || 0));
  //   });

  //   // Iterate through each label to create stacks
  //   topLabels.forEach((label, labelIdx) => {
  //     (data[label] || []).forEach((item) => {
  //       const stackIndex = stacks.findIndex((i) => i === item[dimension]);

  //       if (stackIndex > -1) {
  //         // Update existing stack
  //         itemsToStack.forEach((itemConfig, iIdx) => {
  //           datasets[stackIndex][iIdx][labelIdx] = item[itemConfig.itemKey] || 0; // Ensure fallback to zero
  //         });
  //       } else {
  //         // Create new stack
  //         stacks.push(item[dimension]);

  //         // Initialize new array for this stack
  //         const newStackData = Array(itemsToStack.length)
  //           .fill(0)
  //           .map(() => Array(topLabels.length).fill(0));

  //         itemsToStack.forEach((itemConfig, iIdx) => {
  //           newStackData[iIdx][labelIdx] = item[itemConfig.itemKey] || 0; // Ensure fallback to zero
  //         });

  //         datasets.push(newStackData);
  //       }
  //     });
  //   });

  //   // Create dataset for each stack
  //   // stacks.forEach((stack, stackIdx) => {
  //   //   itemsToStack.forEach((itemConfig, itemIdx) => {
  //   //     const dataForItem = datasets[stackIdx][itemIdx] || [];
  //   //     const hasNonZeroValue = dataForItem.some((value) => value !== 0);

  //   //     if (hasNonZeroValue) {
  //   //       const baseColor = colorPalette[itemIdx % colorPalette.length]; // Use distinct color for each item

  //   //       values.push({
  //   //         label: itemConfig.label, // Use the label directly from itemConfig
  //   //         backgroundColor: baseColor, // Use the base color for the stack
  //   //         data: dataForItem,
  //   //         stack: stack,
  //   //       });
  //   //     }
  //   //   });
  //   // });

  //   stacks.forEach((stack, stackIdx) => {
  //     itemsToStack.forEach((itemConfig, itemIdx) => {
  //       const dataForItem = datasets[stackIdx][itemIdx] || [];
  //       const hasNonZeroValue = dataForItem.some((value) => value !== 0);

  //       if (hasNonZeroValue) {
  //         const baseColor = colorPalette[itemIdx % colorPalette.length]; // Use distinct color for each item

  //         values.push({
  //           // Include both the dimension (stack) and item label in the label property
  //           label: `${stack} - ${itemConfig.label}`, // Dimension (stack) and label combined
  //           backgroundColor: baseColor, // Use the base color for the stack
  //           data: dataForItem,
  //           stack: stack, // This remains the same
  //         });
  //       }
  //     });
  //   });

  //   // console.log(datasets, "444444444444444");

  //   return {
  //     labels: topLabels, // Labels for each dimension
  //     datasets: values, // Datasets for the chart
  //   };
  // }

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
        return { padding: 0, overflowX: "auto", overflowY: "auto", maxWidth: "3080px" };
      case 4:
        return { padding: 0, overflowX: "auto", overflowY: "auto", minWidth: "5080px" };
      default:
        return { padding: "16px", overflow: "auto" };
    }
  };

  // const getBarDivStyles = (scenario, labelsLength) => {
  //   switch (scenario) {
  //     case 1:
  //       return { minWidth: labelsLength * 80 };
  //     case 2:
  //       return { minWidth: labelsLength * 90 };
  //     case 3:
  //       return { minWidth: labelsLength * 1000 };
  //     case 4:
  //       return { minWidth: labelsLength * 1000 };
  //     //   default:
  //     //     return { minWidth: labelsLength * 80 }; // Ensure this is your default value
  //   }
  // };

  const getBarDivStyles = (scenario, labelsLength) => {
    const baseWidthPerLabel = 60; // Set a smaller base width per label to avoid large bars for minimal data

    switch (scenario) {
      case 1:
        return { minWidth: Math.max(labelsLength * baseWidthPerLabel, 300) }; // Minimum width to ensure layout integrity
      case 2:
        // return { minWidth: Math.max(labelsLength * 80, 400) };
        return { minWidth: Math.max(labelsLength * baseWidthPerLabel, 300) };
      case 3:
        return { minWidth: Math.max(labelsLength * 100, 500) };
      case 4:
        return { minWidth: Math.max(labelsLength * 120, 600) };
      default:
        return { minWidth: Math.max(labelsLength * baseWidthPerLabel, 300) }; // Default case
    }
  };

  // ==========================================================

  const postQueryAnlUrl = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

  // =================================----------------

  const fetchChartData = async (payload) => {
    try {
      const response = await fetch(postQueryAnlUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json(); // Assuming the response is in JSON format
    } catch (error) {
      console.error("Error fetching chart data:", error);
      return null;
    }
  };

  const processFetchedData = (fetchedData, receivedPayload) => {
    // console.log("fetchedData", fetchedData);
    const { dimension, measure, includeCOGS, partition } = receivedPayload;
    let generatedChartData;
    let chartTitle = "";
    let chartDimension = "";

    let scenario = 1; // Default scenario

    if (dimension && measure) {
      const dimensionKey = dimension.split(":")[0];

      // Your existing chart generation logic using fetchedData
      if (!includeCOGS && partition === "None") {
        generatedChartData = scenario1(fetchedData, dimensionKey, measure);
        chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 1);
        chartDimension = getChartDimenion(dimensionKey, 1);
        scenario = 1;
      } else if (includeCOGS && partition === "None") {
        // generatedChartData = scenario2(fetchedData, dimensionKey, measure, [
        //   { label: "Materials Cost", itemKey: "Materials_Cost" },
        //   { label: "Channel Commission", itemKey: "Channel_Commission" },
        //   { label: "Discounts", itemKey: "Discounts" },
        //   { label: "Supplies Cost", itemKey: "Supplies_Cost" },
        //   { label: "Margin", itemKey: "Margin" },
        //   // { label: "Channel Commission", itemKey: "Channel_Commission" },

        // ]);

        generatedChartData = scenario2(fetchedData, dimensionKey, measure, [
          {
            label: "Materials Cost",
            itemKey: "Materials_Cost",
            percentageKey: "MATERIAL_COST_to_Gross_Amount",
          },
          {
            label: "Channel Commission",
            itemKey: "Channel_Commission",
            percentageKey: "CHANNEL_COMMISSION_to_Gross_Amount",
          },
          {
            label: "Discounts",
            itemKey: "Discounts",
            percentageKey: "DISCOUNT_COST_to_Gross_Amount",
          },
          {
            label: "Supplies Cost",
            itemKey: "Supplies_Cost",
            percentageKey: "SUPPLIES_COST_to_Gross_Amount",
          },
          {
            label: "Shipping Cost",
            itemKey: "Shipping_Cost",
            percentageKey: "SHIPPING_COST_to_Gross_Amount",
          },
          { label: "Margin", itemKey: "Margin", percentageKey: "Margin_to_Gross_Amount" },
        ]);

        chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 2);
        chartDimension = getChartDimenion(dimensionKey, 2);
        scenario = 2;
      } else if (!includeCOGS && partition !== "None") {
        generatedChartData = scenario3(fetchedData, dimensionKey, measure);
        chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 3);
        chartDimension = getChartDimenion(dimensionKey, 3);
        scenario = 3;
      } else if (includeCOGS && partition !== "None") {
        // generatedChartData = scenario4(fetchedData, dimensionKey, measure, [
        //   // "Materials_Cost",
        //   // "Channel_Commission",
        //   // "Discounts",
        //   // "Supplies_Cost",
        //   // "Margin"
        //   { label: "Materials Cost", itemKey: "Materials_Cost" },
        //   { label: "Channel Commission", itemKey: "Channel_Commission" },
        //   { label: "Discounts", itemKey: "Discounts" },
        //   { label: "Supplies Cost", itemKey: "Supplies_Cost" },
        //   { label: "Margin", itemKey: "Margin" },
        // ]);

        generatedChartData = scenario4(fetchedData, dimensionKey, measure, [
          {
            label: "Materials Cost",
            itemKey: "Materials_Cost",
            percentageKey: "MATERIAL_COST_to_Gross_Amount",
          },
          {
            label: "Channel Commission",
            itemKey: "Channel_Commission",
            percentageKey: "CHANNEL_COMMISSION_to_Gross_Amount",
          },
          {
            label: "Discounts",
            itemKey: "Discounts",
            percentageKey: "DISCOUNT_COST_to_Gross_Amount",
          },
          {
            label: "Supplies Cost",
            itemKey: "Supplies_Cost",
            percentageKey: "SUPPLIES_COST_to_Gross_Amount",
          },
          {
            label: "Shipping Cost",
            itemKey: "Shipping_Cost",
            percentageKey: "SHIPPING_COST_to_Gross_Amount",
          },
          { label: "Margin", itemKey: "Margin", percentageKey: "Margin_to_Gross_Amount" },
        ]);
        chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 4);
        chartDimension = getChartDimenion(dimensionKey, 4);
        scenario = 4;
      }

      // console.log("Determined Scenario:", scenario);

      // Check for duplicates before adding
      if (generatedChartData) {


        const existingChart = chartDataList.find(
          (chart) => chart.title === generatedChartData.title
        );
        if (!existingChart) {
          generatedChartData.title = chartTitle;
          generatedChartData.dimension = chartDimension;
          generatedChartData.scenario = scenario;
          setChartDataList((prevDataList) => [...prevDataList, generatedChartData]);

          const labelsLength = generatedChartData.labels.length;
          const styles = getBarDivStyles(scenario, labelsLength);
          setBarDivStyles(styles);
          setDialogStyles(getDialogContentStyles(scenario));
        }
      }
    }
  };

  //  ===============++++++++++++okokok

  // const handleSubmit = async (data, receivedPayload) => {
  //   console.log("Data:", data);
  //   console.log("Received Payload:", receivedPayload);

  //   if (data) {
  //     setChartsData(data);
  //     setPanelOpen(false);
  //   }

  //   if (receivedPayload) {
  //     // Retrieve existing payload array from cookies
  //     const existingPayloads = Cookies.get('chartPayload');
  //     let payloadArray = [];

  //     if (existingPayloads) {
  //       try {
  //         // Parse existing payload array from cookies
  //         payloadArray = JSON.parse(existingPayloads);
  //       } catch (error) {
  //         console.error('Error parsing existing payloads:', error);
  //       }
  //     }

  //     // Ensure that payloadArray is an array
  //     if (!Array.isArray(payloadArray)) {
  //       payloadArray = [];
  //     }

  //     // Check if the payload is already saved in the cookies
  //     const isDuplicate = payloadArray.some(
  //       (payload) => JSON.stringify(payload) === JSON.stringify(receivedPayload)
  //     );

  //     if (!isDuplicate) {
  //       // Append the new payload to the payloadArray if not a duplicate
  //       payloadArray.push(receivedPayload);

  //       // Save the updated payload array to cookies
  //       Cookies.set('chartPayload', JSON.stringify(payloadArray), { expires: 7 }); // Store for 7 days

  //       // Fetch chart data from the backend with the new payload
  //       const fetchedData = await fetchChartData(receivedPayload);
  //       if (fetchedData) {
  //         processFetchedData(fetchedData, receivedPayload);
  //       }
  //     }
  //   }
  // };

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  // ===========================================

  // kokoko

  const handleSubmit = async (data, receivedPayload) => {
    console.log("Data:", data);
    console.log("Received Payload:", receivedPayload);
    setChartPayload(receivedPayload);
    const { start_date, end_date } = receivedPayload;

    setStartDate(start_date);
    setEndDate(end_date);
    // Create a new chart object
    const newChart = {
      id: Date.now(), // Unique ID for each chart
      data: data,
      startDate: start_date,
      endDate: end_date,
    };

    console.log(newChart, "newChart");

    const session = new SessionStorageService();
    const currentUser = session.getItem("currentUser");

    if (!currentUser) {
      console.error("No user found in session.");
      return;
    }

    const userChartsKey = `prsti_${currentUser}_charts`;

    if (data) {
      setChartsData(data);
      setPanelOpen(false);
    }

    if (receivedPayload) {
      // Retrieve existing payload array from cookies using the user-specific key
      const existingPayloads = Cookies.get(userChartsKey);
      let payloadArray = [];

      if (existingPayloads) {
        try {
          // Parse existing payload array from cookies
          payloadArray = JSON.parse(existingPayloads);
        } catch (error) {
          console.error("Error parsing existing payloads:", error);
        }
      }

      // Ensure that payloadArray is an array
      if (!Array.isArray(payloadArray)) {
        payloadArray = [];
      }

      // Check if the payload is already saved in the cookies
      const isDuplicate = payloadArray.some(
        (payload) => JSON.stringify(payload) === JSON.stringify(receivedPayload)
      );

      if (!isDuplicate) {
        // Append the new payload to the payloadArray if not a duplicate
        payloadArray.push(receivedPayload);

        // Save the updated payload array to cookies using the user-specific key
        Cookies.set(userChartsKey, JSON.stringify(payloadArray), { expires: 7 }); // Store for 7 days

        setLoadingStates((prev) => [...prev, true]); // Add a loading state for the new chart

        // Fetch chart data from the backend with the new payload
        const fetchedData = await fetchChartData(receivedPayload);
        if (fetchedData) {
          processFetchedData(fetchedData, receivedPayload);
        }

        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[newStates.length - 1] = false; // Set the last state to false
          return newStates;
        });
      }
    }
  };

  const processedPayloadsRef = useRef(new Set()); // Use a ref to persist across renders

  useEffect(() => {
    // Start loading
    const session = new SessionStorageService();
    const currentUser = session.getItem("currentUser");

    if (!currentUser) {
      console.error("No user found in session.");
      return;
    }

    const userChartsKey = `prsti_${currentUser}_charts`;

    // Retrieve the payload array from cookies using the user-specific key
    const cookiePayload = Cookies.get(userChartsKey);

    if (cookiePayload) {
      try {
        // Parse payload array from cookies
        const payloadArray = JSON.parse(cookiePayload);
        console.log("Received Payload Array from Cookies:", payloadArray);
        setChartPayload(payloadArray);
        payloadArray.forEach((item, index) => {
          console.log(`Item ${index + 1}:`, item);

          // If the object contains start_date and end_date, extract them
          const { start_date, end_date } = item;
          console.log(`Start Date: ${start_date}`);
          console.log(`End Date: ${end_date}`);
          setStartDate(start_date);
          setEndDate(end_date);
        });

        // Iterate through each payload and process it
        payloadArray.forEach((receivedPayload) => {
          const payloadString = JSON.stringify(receivedPayload);

          // Check if this payload has already been processed using the ref
          if (!processedPayloadsRef.current.has(payloadString)) {
            fetchChartData(receivedPayload).then((fetchedData) => {
              if (fetchedData) {
                // Process and render the fetched data
                processFetchedData(fetchedData, receivedPayload);
                // Add the stringified payload to the ref to prevent duplication
                processedPayloadsRef.current.add(payloadString);
              }
            });
          } else {
            console.log("Duplicate payload found, skipping:", payloadString);
          }
        });
      } catch (error) {
        console.error("Error parsing chart payload from cookies:", error);
      }
    } else {
      console.error("No payload found in cookies.");
    }
  }, []);

  // ok

  const handleDeleteChart = (index) => {
    // Confirm the deletion (optional)
    if (window.confirm("Are you sure you want to delete this chart?")) {
      const session = new SessionStorageService();
      const currentUser = session.getItem("currentUser");

      if (!currentUser) {
        console.error("No user found in session.");
        return;
      }

      const userChartsKey = `prsti_${currentUser}_charts`;

      // Retrieve existing payloads from cookies
      const existingPayloads = Cookies.get(userChartsKey);
      let payloadArray = [];

      if (existingPayloads) {
        try {
          // Parse the payload array from cookies
          payloadArray = JSON.parse(existingPayloads);
        } catch (error) {
          console.error("Error parsing existing payloads:", error);
        }
      }

      // Confirm the deletion of the correct chart
      console.log("Chart Data List Before Deletion:", chartDataList);
      console.log("Payload Array Before Deletion:", payloadArray);
      console.log("Index to Delete:", index);

      // Check if the index is valid
      if (index < 0 || index >= payloadArray.length) {
        console.error("Invalid index for deletion:", index);
        return;
      }

      // Remove the chart from the state
      setChartDataList((prevList) => {
        const updatedList = prevList.filter((_, i) => i !== index);
        console.log("Updated Chart Data List:", updatedList);
        return updatedList;
      });

      // Remove the chart from cookies
      try {
        // Remove the chart at the specified index from the payload array
        payloadArray.splice(index, 1); // Remove the specific chart using splice

        // Update the cookies with the modified payload array
        Cookies.set(userChartsKey, JSON.stringify(payloadArray), { expires: 7 });
        console.log("Updated Cookies After Deletion:", JSON.parse(Cookies.get(userChartsKey)));
      } catch (error) {
        console.error("Error updating chart payload in cookies:", error);
      }
    }
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
  };

  const formatValue = (value) => {
    // Check if the value is a number
    if (typeof value !== "number") {
      console.error("Value is not a number:", value);
      return value; // Return the original value for non-numeric inputs
    }

    const currentChartData = chartDataList[0];

    // Check if chart data and datasets are defined
    if (!currentChartData || !currentChartData.datasets) {
      console.error("Chart data or datasets are undefined:", currentChartData);
      return value; // Return the original value if datasets are undefined
    }

    const datasets = currentChartData.datasets;

    // Calculate the maximum value from all datasets
    const maxValue = datasets
      .flatMap((dataset) => dataset.data || [])
      .reduce((max, current) => Math.max(max, current), 0);

    console.log("Max Value:", maxValue);

    // Handle negative, zero, and positive values
    if (value >= 10000000) {
      // 10 million
      return (value / 10000000).toFixed(1).replace(/\.0$/, "") + "M"; // For millions
    } else if (value >= 100000) {
      // 1 lakh
      return (value / 100000).toFixed(1).replace(/\.0$/, "") + "L"; // For lakhs
    } else if (value >= 1000) {
      // 1 thousand
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K"; // For thousands
    } else if (value === 0) {
      return "0"; // Explicitly return "0" for zero values
    } else if (value <= -100000) {
      // Handle large negative values
      return (value / 10000000).toFixed(1).replace(/\.0$/, "") + "M"; // For negative millions
    } else if (value <= -100000) {
      // Handle negative lakhs
      return (value / 100000).toFixed(1).replace(/\.0$/, "") + "L"; // For negative lakhs
    } else if (value <= -1000) {
      // Handle negative thousands
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K"; // For negative thousands
    } else {
      return value.toFixed(1); // For smaller values, show one decimal place
    }
  };

  const handleCreateClick = () => {
    setPanelOpen(true);
  };

  // const chartOptions = (currentData) => ({
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: "", // Add dynamic title if needed
  //     },
  //     legend: {
  //       display: false,
  //     },
  //     datalabels: {
  //       display: false, // Disable data labels
  //     },
  //   },
  //   layout: {
  //     padding: {
  //       left: 0,
  //       right: 10,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       stacked: currentData.datasets.some((dataset) => dataset.label === "Gross Amount"), // Adjust based on your logic
  //       title: {
  //         display: true,
  //         text: "", // Add dynamic axis title if needed
  //         font: {
  //           size: 14,
  //           weight: "bold",
  //         },
  //       },
  //       ticks: {
  //         font: {
  //           weight: 900,
  //           size: 8,
  //         },
  //       },
  //       grid: {
  //         display: true, // Turn on grid lines on the x-axis
  //       },
  //     },
  //     y: {
  //       beginAtZero: false,
  //       type: "logarithmic", // Use logarithmic scale if necessary
  //       // type: 'symlog',
  //       ticks: {
  //         callback: formatValue, // Ensure this formats your y-axis ticks correctly
  //       },
  //       title: {
  //         display: true,
  //         text: "", // Add dynamic measure title if needed
  //         font: {
  //           size: 24,
  //           weight: "bold",
  //         },
  //       },
  //       grid: {
  //                   display: true,
  //                   color: "#ddd",
  //                   lineWidth: 1,
  //                 },
  //     },
  //   },
  //   elements: {
  //     bar: {
  //       // borderRadius: 4,
  //       // barThickness: 40, // Control thickness for clarity
  //       // maxBarThickness: 50, // Set max thickness
  //       // borderRadius: 4,
  //       barThickness: 30, // Adjust thickness as necessary
  //       maxBarThickness: 50,
  //       categoryPercentage: 0.8, // Control spacing between stacked bars
  //       barPercentage: 0.9, // Control the width of the bars
  //     },
  //   },
  // });

  // for big bar workngg

  const chartOptions = (currentData) => {
    // Determine if the chart is stacked
    const isStacked = currentData.datasets.some((dataset) => dataset.stack);

    // Calculate the maximum and minimum values dynamically
    const maxPositive = Math.max(
      ...currentData.datasets.flatMap((dataset) => dataset.data.filter((value) => value > 0))
    );
    const minNegative = Math.min(
      ...currentData.datasets.flatMap((dataset) => dataset.data.filter((value) => value < 0))
    );

    const yMin = minNegative < 0 ? minNegative * 2.5 : 0;
    const yMax = Math.max(maxPositive * 2.5);

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "", // Add dynamic title if needed
        },
        legend: {
          display: false, // Enable legend for clarity
        },
        datalabels: {
          display: function (context) {
            // Only display labels if the chart is stacked
            const dataset = context.dataset;
            return dataset.stack ? true : false;
          },
          formatter: (value, context) => {
            if (isStacked) {
              const percentage = context.dataset.percentageData[context.dataIndex];
              return percentage > 0 ? `${percentage.toFixed(1)}%` : null;
            } else {
              return formatValue(value, 0); // Fallback to the formatted value
            }
          },
          color: "#0000cc",
          anchor: "center", // Center the label on the bar
          align: "center", // Align label to the center of the bar
          font: {
            weight: "bold", // Make the font bold
            size: 10, // Set the font size
          },
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
          title: {
            display: true,
            text: "", // Add dynamic axis title if needed
            font: {
              size: 14,
              weight: "bold",
            },
          },
          ticks: {
            font: {
              weight: 900,
              size: 10,
            },
          },
          grid: {
            display: true, // Show grid lines
          },
        },
        y: {
          beginAtZero: false,
          type: "logarithmic", // Use logarithmic scale if necessary
          min: yMin,
          max: yMax,
          ticks: {
            callback: formatValue, // Use the formatValue function
            font: {
              size: 10,
              weight: 700,
            },
          },
          title: {
            display: true,
            text: "", // Add dynamic measure title if needed
            font: {
              size: 24,
              weight: "bold",
            },
          },
        },
      },
      elements: {
        bar: {
          barThickness: 35, // Adjust thickness for clarity
          maxBarThickness: 50,
          categoryPercentage: 0.8,
          barPercentage: 0.9,
        },
      },
    };
  };

  // const chartOptions = (currentData) => {
  //   // Calculate the maximum value dynamically to adjust y-axis range

  //   console.log("currentData:", currentData);

  //   const maxPositive = Math.max(
  //     ...currentData.datasets.flatMap((dataset) => dataset.data.filter((value) => value > 0))
  //   );
  //   const minNegative = Math.min(
  //     ...currentData.datasets.flatMap((dataset) => dataset.data.filter((value) => value < 0))
  //   );

  //   // console.log("minNegative:", minNegative, "maxPositive:", maxPositive);

  //   // Set y-axis limits based on data
  //   const yMin = minNegative < 0 ? minNegative * 2.5 : 0; // Extend the min for visibility
  //   const yMax = Math.max(maxPositive * 2.5); // Just slightly extend the max

  //   // console.log("yMin:", yMin, "yMax:", yMax);

  //   const isStacked = currentData.datasets.some((dataset) => dataset.label === "Gross Amount");

  //   return {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: {
  //       title: {
  //         display: true,
  //         text: "", // Add dynamic title if needed
  //       },
  //       legend: {
  //         display: false, // Enable legend for clarity
  //       },
  //       datalabels: {
  //         display: true, // Enable data labels
  //         // formatter: (value) => formatValue(value), // Use the formatValue function for data labels
  //         formatter: (value, context) => {
  //           // Safely check if percentageData exists and the current data index is defined
  //           const percentageData = context.dataset.percentageData;
  //           const percentage = percentageData && percentageData[context.dataIndex];

  //           // Return percentage data if available, otherwise use the raw value
  //           return percentage !== undefined ? `${percentage.toFixed(1)}%` : formatValue(value, 0);
  //         },

  //         color: "black", // Color of the labels
  //         anchor: "center", // Center the label on the bar
  //         align: "center", // Align label to the center of the bar
  //         font: {
  //           weight: "bold", // Make the font bold
  //           size: "8", // Set the font size
  //         },
  //       },
  //     },
  //     layout: {
  //       padding: {
  //         left: 0,
  //         right: 10,
  //       },
  //     },
  //     scales: {
  //       x: {
  //         // stacked: true,

  //         title: {
  //           display: true,
  //           text: "", // Add dynamic axis title if needed
  //           font: {
  //             size: 14,
  //             weight: "bold",
  //           },
  //         },
  //         ticks: {
  //           font: {
  //             weight: 900,
  //             size: 10,
  //           },
  //         },
  //         grid: {
  //           display: true, // Show grid lines
  //         },
  //       },
  //       y: {
  //         beginAtZero: false, // Allow y-axis to start below zero
  //         type: "logarithmic", // Use logarithmic scale if necessary
  //         min: yMin, // Use dynamically calculated min
  //         max: yMax, // Use dynamically calculated max
  //         ticks: {
  //           callback: formatValue, // Use the formatValue function
  //           font: {
  //             size: 10,
  //           },
  //         },
  //         title: {
  //           display: true,
  //           text: "", // Add dynamic measure title if needed
  //           font: {
  //             size: 24,
  //             weight: "bold",
  //           },
  //         },
  //         // grid: {
  //         //   display: true,
  //         //   color: "#ddd",
  //         //   lineWidth: 1,
  //         // },
  //       },
  //     },
  //     elements: {
  //       bar: {
  //         barThickness: 35, // Adjust thickness for clarity
  //         maxBarThickness: 50,
  //         categoryPercentage: 0.8,
  //         barPercentage: 0.9,
  //       },
  //     },
  //   };
  // };

  return (
    <>
      {/* <p style={{ fontSize: "13px", fontWeight: "bold"}}>
    Start Date: {startDate} &nbsp;&nbsp; End Date: {endDate}
  </p> */}
      <Grid item xs={12} md={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Create new graph" arrow>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            style={{
              marginBottom: "1%",
              backgroundColor: "#4d0099",
              color: "#fff",
              borderColor: "#b366ff",
              "&:hover": {
                backgroundColor: "#9a4fff",
                borderColor: "#9a4fff",
              },
            }}
          >
            Query
          </Button>
        </Tooltip>
      </Grid>
      {/* for delte */}
      <Grid container spacing={2}>
        {chartDataList.length > 0 &&
          chartDataList.map((chartData, index) => {
            {
              /* console.log("Current chartDataList:", chartData); */
            }
            {
              /* console.log("Current index:", index); */
            }
            const labelsLength = chartData.labels.length;
            const minWidth = getBarDivStyles(chartData.scenario, labelsLength).minWidth;

            const renderChartComponent = (chartData, index) => {
              // Using index to access loading state
              if (loadingStates[index]) {
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress color="success" />
                  </div>
                );
              }

              switch (chartData.scenario) {
                case 1:
                  return (
                    <GraphScenario1Chart
                      chartData={chartData}
                      receivedPayload={chartPayload}
                      startDate={startDate}
                      endDate={endDate}
                      index={index}
                    />
                  );
                case 2:
                  return (
                    <GraphScenario2Chart
                      chartData={chartData}
                      receivedPayload={chartPayload}
                      startDate={startDate}
                      endDate={endDate}
                      index={index}
                    />
                  );
                case 3:
                  return (
                    <GraphScenario3Chart
                      chartData={chartData}
                      receivedPayload={chartPayload}
                      startDate={startDate}
                      endDate={endDate}
                      index={index}
                    />
                  );
                case 4:
                  return (
                    <GraphScenario4Chart
                      chartData={chartData}
                      receivedPayload={chartPayload}
                      startDate={startDate}
                      endDate={endDate}
                      index={index}
                    />
                  );
                default:
                  return <DefaultComponent data={chartData} />;
              }
            };

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

                      boxShadow: "1px 2px 2px 1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h2 style={{ textAlign: "center", flex: 1, fontSize: "11px" }}>
                      {chartData.title || "Bar Charts"}
                    </h2>

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
                        // onClick={() => handleDeleteChart(chartData.id)}
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
                    style={{
                      minWidth: minWidth,
                      display: "flex",
                      flexDirection: "column",
                      height: "300px",
                    }}
                  >
                    {renderChartComponent(chartData, index)}
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
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div style={{ flex: 1, width: "300px" }}></div>

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
                // position: "absolute",
                position: "fixed",
                right: 150,
                top: 40,
                zIndex: 1000,
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <BsArrowsCollapse />
            </IconButton>
          </DialogTitle>
          {/* <DialogContent */}
          <DialogContent
            style={{ padding: 0, overflow: "hidden" }}
            // style={{ padding: 0, overflowX: "auto", overflowY: "auto", minWidth: "2000px" }}
            // Ankita Chnage style
            // style={dialogStyles}
          >
            {/* <p>
              Start Date: {startDate} &nbsp;&nbsp; End Date: {endDate}
            </p> */}
            <div style={{ width: "100%", height: "100%" }}>
              {currentData && (
                <>
                  {/* <p>
                    Start Date: {startDate} &nbsp;&nbsp; End Date: {endDate}
                  </p> */}

                  {/* <h3 style={{ marginLeft: "20px" }}>{currentData.title}</h3> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "20px",
                      width: "100%",
                    }}
                  >
                    <h3 style={{ marginLeft: "20px" }}>{currentData.title}</h3>
                  </div>

                  <div style={{ height: "100%", width: "100%" }}>
                    {" "}
                    {/* Adjust height as needed */}
                    <Bar
                      data={currentData}
                      options={chartOptions(currentData)} // Ensure correct passing
                    />
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Grid>

      <SlideOutPanel open={isPanelOpen} onClose={handleClosePanel} handleSubmit={handleSubmit} />
    </>
  );
};

// App.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
QueryAnalytics.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default QueryAnalytics;

const formatValue = (value) => {
  // Check if the value is a number
  if (typeof value !== "number") {
    console.error("Value is not a number:", value);
    return value; // Return the original value for non-numeric inputs
  }

  const currentChartData = chartDataList[0];

  // Check if chart data and datasets are defined
  if (!currentChartData || !currentChartData.datasets) {
    console.error("Chart data or datasets are undefined:", currentChartData);
    return value; // Return the original value if datasets are undefined
  }

  const datasets = currentChartData.datasets;

  // Calculate the maximum value from all datasets
  const maxValue = datasets
    .flatMap((dataset) => dataset.data || [])
    .reduce((max, current) => Math.max(max, current), 0);

  // console.log("Max Value:", maxValue);

  // Formatting based on the maximum value
  if (maxValue >= 1000000) {
    return value > 0
      ? `${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M` // For millions, no trailing .0
      : "0"; // Show just "0" for zero values
  } else if (maxValue >= 1000) {
    return value > 0
      ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K` // For thousands, no trailing .0
      : "0"; // Show just "0" for zero values
  } else {
    return value.toFixed(2); // For smaller values, show two decimal places
  }
};
