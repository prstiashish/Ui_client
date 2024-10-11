import React, { useState, useEffect,useRef } from "react";
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

import GraphsScenario1Chart from "src/components/charts/GraphScenario1Chart";
import GraphsScenario2Chart from "src/components/charts/GraphScenario1Chart";
import GraphsScenario3Chart from "src/components/charts/GraphScenario1Chart";
import GraphsScenario4Chart from "src/components/charts/GraphScenario1Chart";

import SessionStorageService from "src/utils/browser-storage/session";
// import CookiesService from "src/utils/browser-storage/Cookies"; // Adjust the import path as necessary

import Cookies from "js-cookie";

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
          backgroundColor: "#003380",
          borderColor: "#FFFFFF",
          borderWidth: 1,
          hoverBackgroundColor: "#003380",
          hoverBorderColor: "#003380",
          barThickness: 40,
          maxBarThickness: 50,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
          data: values,
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

    // console.log(result, "result");
    // return result;
    return { ...result, title, xLabel, yLabel };
  }

  function scenario2(data, dimension, measure, itemsToStack) {
    // console.log(measure, "mmm");
    let labels = [];
    let dataSets = [];

    const colors = [
      "#003380",
      "#0052cc", // Darkest shade
      "#1a75ff", // Base shade
    ];
    console.log(itemsToStack, "itemsToStack");

    // Create a dataset for each stackable item
    itemsToStack.forEach((item, index) => {
      dataSets.push({
        label: item.label,
        // measure: item.measure,
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
      backgroundColor: "#66a3ff",
      borderColor: "#66a3ff",
      hoverBackgroundColor: "#66a3ff",
      hoverBorderColor: "#66a3ff",
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
        dataSets[idx].data.push(itemValue);
        cumulativeValue += itemValue;
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

  function scenario3(data, dimension, measure) {
    const topLabels = Object.keys(data);
    let allItems = [];
    let datasets = [];

    const colors = [
      "#002966",
      "#003380",
      "#003d99",
      "#0047b3",
      "#0052cc",
      "#005ce6",
      "#0066ff",
      "#1a75ff",
      "#3385ff",
      "#4d94ff",
      "#66a3ff",
      "#80b3ff",
      "#99c2ff",
      "#b3d1ff",
      "#cce0ff",
      "#e6f0ff",
    ]; // Customize as needed

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

  function scenario4(data, dimension, measure, itemsToStack) {
    const topLabels = Object.keys(data);

    let stacks = [];
    let datasets = [];
    let values = [];

    // Predefined color palette
    const colors = [
      "#002966",
      "#003380",
      "#003d99",
      "#0047b3",
      "#0052cc",
      "#005ce6",
      "#0066ff",
      "#1a75ff",
      "#3385ff",
      "#4d94ff",
      "#66a3ff",
      "#80b3ff",
      "#99c2ff",
      "#b3d1ff",
      "#cce0ff",
      "#e6f0ff",
    ]; // Customize as needed

    // Helper function to lighten a color
    function lightenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;
      return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)}`;
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
          totalCost += datasets[stackIdx]?.[itemIdx]?.[labelIdx] || 0;
        });

        marginValues[labelIdx] = totalSales - totalCost;
      });

      datasets[stackIdx].push(marginValues);

      itemsToStack.concat("Margin").forEach((item, itemIdx) => {
        const dataForItem = datasets[stackIdx]?.[itemIdx] || [];
        const hasNonZeroValue = dataForItem.some((value) => value !== 0);

        if (hasNonZeroValue) {
          const baseColor = colors[stackIdx % colors.length];
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

  // const handleSubmit = (data, receivedPayload) => {
  //   console.log("Data:", data);
  //   console.log("Received Payload:", receivedPayload);

  //   if (data) {
  //     setChartsData(data);
  //     setPanelOpen(false);
  //   }

  //   if (receivedPayload) {
  //     const { dimension, measure, includeCOGS, partition } = receivedPayload;
  //     let generatedChartData;
  //     let chartTitle = "";
  //     let chartDimension = "";

  //     // Determine the scenario for style scroll bar width
  //     let scenario = 1; // Default scenario

  //     if (dimension && measure) {
  //       const dimensionKey = dimension.split(":")[0];
  //       if (!includeCOGS && partition === "None") {
  //         generatedChartData = scenario1(data, dimensionKey, measure);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 1);
  //         chartDimension = getChartDimenion(dimensionKey, 1);
  //         scenario = 1;
  //       } else if (includeCOGS && partition === "None") {
  //         generatedChartData = scenario2(data, dimensionKey, measure, [
  //           { label: "Materials Cost", itemKey: "Materials_Cost" },
  //           { label: "Discounts", itemKey: "Discounts" },
  //           { label: "Supplies Cost", itemKey: "Supplies_Cost" },
  //         ]);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 2);
  //         chartDimension = getChartDimenion(dimensionKey, 2);
  //         scenario = 2;
  //       } else if (!includeCOGS && partition !== "None") {
  //         generatedChartData = scenario3(data, dimensionKey, measure);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 3);
  //         chartDimension = getChartDimenion(dimensionKey, 3);
  //         scenario = 3;
  //       } else if (includeCOGS && partition !== "None") {
  //         generatedChartData = scenario4(data, dimensionKey, measure, [
  //           "Materials_Cost",
  //           "Discounts",
  //           "Supplies_Cost",
  //         ]);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 4);
  //         chartDimension = getChartDimenion(dimensionKey, 4);
  //         scenario = 4;
  //       }
  //       console.log("Determined Scenario:", scenario); // Debugging
  //       if (generatedChartData) {
  //         generatedChartData.title = chartTitle;
  //         generatedChartData.dimension = chartDimension;
  //         generatedChartData.scenario = scenario;
  //         setChartDataList((prevDataList) => [...prevDataList, generatedChartData]);
  //       }
  //       console.log("Generated Chart Data:", generatedChartData); // Debugging
  //       const labelsLength = generatedChartData.labels.length;
  //       const styles = getBarDivStyles(scenario, labelsLength);
  //       setBarDivStyles(styles);
  //       setDialogStyles(getDialogContentStyles(scenario));

  //       // setBarDivStyles(getBarDivStyles(scenario, labelsLength));
  //     }

  //     setPayload(receivedPayload);
  //   }
  // };

  // for loged uder

  // ===========================================storing in the session storage

  // const handleSubmit = (data, receivedPayload) => {
  //   console.log("Data:", data);
  //   console.log("Received Payload:", receivedPayload);

  //   if (data) {
  //     setChartsData(data);
  //     setPanelOpen(false);
  //   }

  //   if (receivedPayload) {
  //     const { dimension, measure, includeCOGS, partition } = receivedPayload;
  //     let generatedChartData;
  //     let chartTitle = "";
  //     let chartDimension = "";

  //     let scenario = 1; // Default scenario

  //     if (dimension && measure) {
  //       const dimensionKey = dimension.split(":")[0];
  //       // Chart generation logic based on conditions
  //       if (!includeCOGS && partition === "None") {
  //         generatedChartData = scenario1(data, dimensionKey, measure);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 1);
  //         chartDimension = getChartDimenion(dimensionKey, 1);
  //         scenario = 1;
  //       } else if (includeCOGS && partition === "None") {
  //         generatedChartData = scenario2(data, dimensionKey, measure, [
  //           { label: "Materials Cost", itemKey: "Materials_Cost" },
  //           { label: "Discounts", itemKey: "Discounts" },
  //           { label: "Supplies Cost", itemKey: "Supplies_Cost" },
  //         ]);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 2);
  //         chartDimension = getChartDimenion(dimensionKey, 2);
  //         scenario = 2;
  //       } else if (!includeCOGS && partition !== "None") {
  //         generatedChartData = scenario3(data, dimensionKey, measure);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 3);
  //         chartDimension = getChartDimenion(dimensionKey, 3);
  //         scenario = 3;
  //       } else if (includeCOGS && partition !== "None") {
  //         generatedChartData = scenario4(data, dimensionKey, measure, [
  //           "Materials_Cost",
  //           "Discounts",
  //           "Supplies_Cost",
  //         ]);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 4);
  //         chartDimension = getChartDimenion(dimensionKey, 4);
  //         scenario = 4;
  //       }

  //       console.log("Determined Scenario:", scenario); // Debugging
  //       if (generatedChartData) {
  //         generatedChartData.title = chartTitle;
  //         generatedChartData.dimension = chartDimension;
  //         generatedChartData.scenario = scenario;

  //         // Save chart data associated with the logged-in user
  //         const session = new SessionStorageService();
  //         const currentUser = session.getItem("currentUser"); // Get current user info
  //         console.log("Current User:", currentUser); // Log the current user

  //         if (currentUser) {
  //           // Log the current user
  //           console.log("Logged-in User:", currentUser);

  //           // Get existing charts or initialize empty array
  //           const userCharts = JSON.parse(session.getItem(`${currentUser}_charts`) || "[]");
  //           userCharts.push(generatedChartData); // Add new chart to user's charts
  //           session.setItem(`${currentUser}_charts`, JSON.stringify(userCharts)); // Save back to session storage

  //           // Log the updated charts data
  //           console.log("Updated User Charts Data:", userCharts);
  //         }

  //         setChartDataList((prevDataList) => [...prevDataList, generatedChartData]);
  //       }
  //       console.log("Generated Chart Data:", generatedChartData); // Debugging
  //       const labelsLength = generatedChartData.labels.length;
  //       const styles = getBarDivStyles(scenario, labelsLength);
  //       setBarDivStyles(styles);
  //       setDialogStyles(getDialogContentStyles(scenario));
  //     }

  //     setPayload(receivedPayload);
  //   }
  // };

  // Function to load user-specific charts from session storage
  // const loadUserCharts = () => {
  //   const session = new SessionStorageService();
  //   const currentUser = session.getItem("currentUser");

  //   if (currentUser) {
  //     const userCharts = JSON.parse(session.getItem(`${currentUser}_charts`) || "[]");
  //     setChartDataList(userCharts); // Load the user's saved charts

  //     // Log the loaded user charts
  //     console.log("Loaded User Charts Data:", userCharts);
  //   }
  // };

  // Load user charts when component mounts or when user logs in
  // useEffect(() => {
  //   loadUserCharts();
  // }, []);

  // const handleDeleteChart = (index) => {
  //   // Confirm the deletion (optional)
  //   if (window.confirm("Are you sure you want to delete this chart?")) {
  //     setChartDataList((prevList) => prevList.filter((_, i) => i !== index));

  //     // Optionally, you can also remove the chart data from session storage
  //     const session = new SessionStorageService();
  //     const currentUser = session.getItem("currentUser");
  //     if (currentUser) {
  //       // Load existing charts
  //       const userCharts = JSON.parse(session.getItem(`${currentUser}_charts`) || "[]");
  //       // Remove the chart from the userCharts array
  //       const updatedUserCharts = userCharts.filter((_, i) => i !== index);
  //       // Update the session storage
  //       session.setItem(`${currentUser}_charts`, JSON.stringify(updatedUserCharts));
  //     }
  //   }
  // };

  // ==========================================================

  // storing in the cookies

  // Function to save chart data in cookies
  // const handleSubmit = (data, receivedPayload) => {

  //   console.log("Received Payload:", receivedPayload);
  //   if (data) {
  //     setChartsData(data);
  //     setPanelOpen(false);
  //   }

  //   if (receivedPayload) {
  //     const { dimension, measure, includeCOGS, partition } = receivedPayload;
  //     let generatedChartData;
  //     let chartTitle = "";
  //     let chartDimension = "";
  //     let scenario = 1; // Default scenario

  //     if (dimension && measure) {
  //       const dimensionKey = dimension.split(":")[0];

  //       // Chart generation logic based on conditions
  //       if (!includeCOGS && partition === "None") {
  //         generatedChartData = scenario1(data, dimensionKey, measure);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 1);
  //         chartDimension = getChartDimenion(dimensionKey, 1);
  //         scenario = 1;
  //       } else if (includeCOGS && partition === "None") {
  //         generatedChartData = scenario2(data, dimensionKey, measure, [
  //           { label: "Materials Cost", itemKey: "Materials_Cost" },
  //           { label: "Discounts", itemKey: "Discounts" },
  //           { label: "Supplies Cost", itemKey: "Supplies_Cost" },
  //         ]);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 2);
  //         chartDimension = getChartDimenion(dimensionKey, 2);
  //         scenario = 2;
  //       } else if (!includeCOGS && partition !== "None") {
  //         generatedChartData = scenario3(data, dimensionKey, measure);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 3);
  //         chartDimension = getChartDimenion(dimensionKey, 3);
  //         scenario = 3;
  //       } else if (includeCOGS && partition !== "None") {
  //         generatedChartData = scenario4(data, dimensionKey, measure, [
  //           "Materials_Cost",
  //           "Discounts",
  //           "Supplies_Cost",
  //         ]);
  //         chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 4);
  //         chartDimension = getChartDimenion(dimensionKey, 4);
  //         scenario = 4;
  //       }

  //       // Logging determined scenario
  //       console.log("Determined Scenario:", scenario);

  //       if (generatedChartData) {
  //         generatedChartData.title = chartTitle;
  //         generatedChartData.dimension = chartDimension;
  //         generatedChartData.scenario = scenario;

  //         // Get current user info from session storage
  //         const session = new SessionStorageService();
  //         const currentUser = session.getItem("currentUser"); // Get current user info

  //         if (currentUser) {
  //           console.log("Logged-in User from Session Storage:", currentUser);

  //           // Store user info in cookies
  //           Cookies.set("currentUser", currentUser, { expires: 7 });

  //           // Get existing charts from cookies
  //           const userChartsCookie = Cookies.getJSON(`prst_${currentUser}_charts`) || [];
  //           userChartsCookie.push(generatedChartData); // Add new chart to user's charts
  //           Cookies.set(`prst_${currentUser}_charts`, userChartsCookie, { expires: 7 }); // Save back to cookies with the new naming convention

  //           // Log the updated charts data
  //           console.log("Updated User Charts Data:", userChartsCookie);
  //         }

  //         setChartDataList((prevDataList) => [...prevDataList, generatedChartData]);
  //       }

  //       console.log("Generated Chart Data:", generatedChartData); // Debugging
  //       const labelsLength = generatedChartData.labels.length;
  //       const styles = getBarDivStyles(scenario, labelsLength);
  //       setBarDivStyles(styles);
  //       setDialogStyles(getDialogContentStyles(scenario));
  //     }

  //     setPayload(receivedPayload);
  //   }
  // };

  //get user from sesion
  // Function to load user-specific charts from cookies
  // const loadUserChartsFromCookies = () => {
  //   const session = new SessionStorageService();
  //   const currentUser = session.getItem("currentUser");

  //   if (currentUser) {
  //     const userCharts = Cookies.getJSON(`prst_${currentUser}_charts`) || [];
  //     setChartDataList(userCharts); // Load charts from cookies
  //     console.log("Loaded User Charts Data from Cookies:", userCharts);
  //   }
  // };

  // get user from cookies
  //   const loadUserChartsFromCookies = () => {
  //     // Get current user from cookies
  //     const currentUser = Cookies.get("currentUser");

  //     if (currentUser) {
  //         const userCharts = Cookies.getJSON(`prst_${currentUser}_charts`) || [];
  //         setChartDataList(userCharts); // Load charts from cookies
  //         console.log("Loaded User Charts Data from Cookies:", userCharts);
  //     }
  // };

  // Load user charts when component mounts
  // useEffect(() => {
  //   loadUserChartsFromCookies();
  // }, []);

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
        generatedChartData = scenario2(fetchedData, dimensionKey, measure, [
          { label: "Materials Cost", itemKey: "Materials_Cost" },
          { label: "Discounts", itemKey: "Discounts" },
          { label: "Supplies Cost", itemKey: "Supplies_Cost" },
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
        generatedChartData = scenario4(fetchedData, dimensionKey, measure, [
          "Materials_Cost",
          "Discounts",
          "Supplies_Cost",
        ]);
        chartTitle = getChartTitle(dimensionKey, measure, includeCOGS, partition, 4);
        chartDimension = getChartDimenion(dimensionKey, 4);
        scenario = 4;
      }

      console.log("Determined Scenario:", scenario);

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

  const handleSubmit = async (data, receivedPayload) => {
    console.log("Data:", data);
    console.log("Received Payload:", receivedPayload);

    const session = new SessionStorageService();
    const currentUser = session.getItem("currentUser");

    if (!currentUser) {
      console.error('No user found in session.');
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
          console.error('Error parsing existing payloads:', error);
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

        // Fetch chart data from the backend with the new payload
        const fetchedData = await fetchChartData(receivedPayload);
        if (fetchedData) {
          processFetchedData(fetchedData, receivedPayload);
        }
      }
    }
  };




  // useEffect(() => {
  //   // Retrieve the payload array from cookies when the component mounts
  //   const cookiePayload = Cookies.get('chartPayload');
  //   const alreadyRenderedCharts = new Set(); // Track the titles of already rendered charts to avoid duplication

  //   if (cookiePayload) {
  //     try {
  //       // Parse payload array from cookies
  //       const payloadArray = JSON.parse(cookiePayload);
  //       console.log("Received Payload Array from Cookies:", payloadArray);

  //       // Iterate through each payload and process it
  //       payloadArray.forEach((receivedPayload) => {
  //         fetchChartData(receivedPayload)
  //           .then((fetchedData) => {
  //             if (fetchedData) {
  //               // Use the new getChartTitleFromPayload function to generate a unique title
  //               const chartTitle = getChartTitleFromPayload(receivedPayload);
  //               if (!alreadyRenderedCharts.has(chartTitle)) {
  //                 // Only render the chart if it hasn’t been rendered yet
  //                 processFetchedData(fetchedData, receivedPayload);
  //                 alreadyRenderedCharts.add(chartTitle); // Mark this chart as rendered
  //               }
  //             }
  //           });
  //       });
  //     } catch (error) {
  //       console.error('Error parsing chart payload from cookies:', error);
  //     }
  //   } else {
  //     console.error('No payload found in cookies.');
  //   }
  // }, []);
  const processedPayloadsRef = useRef(new Set()); // Use a ref to persist across renders

  useEffect(() => {
    const session = new SessionStorageService();
    const currentUser = session.getItem("currentUser");

    if (!currentUser) {
      console.error('No user found in session.');
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

        // Iterate through each payload and process it
        payloadArray.forEach((receivedPayload) => {
          const payloadString = JSON.stringify(receivedPayload);

          // Check if this payload has already been processed using the ref
          if (!processedPayloadsRef.current.has(payloadString)) {
            fetchChartData(receivedPayload)
              .then((fetchedData) => {
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
        console.error('Error parsing chart payload from cookies:', error);
      }
    } else {
      console.error('No payload found in cookies.');
    }
  }, []);




  // const handleDeleteChart = (index) => {
  //   if (window.confirm("Are you sure you want to delete this chart?")) {
  //     // Remove the chart from the state
  //     setChartDataList((prevList) => prevList.filter((_, i) => i !== index));

  //     // Remove the chart from cookies
  //     const existingPayloads = Cookies.get('chartPayload');

  //     if (existingPayloads) {
  //       try {
  //         // Parse the payload array from cookies
  //         let payloadArray = JSON.parse(existingPayloads);

  //         // Remove the chart at the specified index
  //         payloadArray = payloadArray.filter((_, i) => i !== index);

  //         // Update the cookies with the modified payload array
  //         Cookies.set('chartPayload', JSON.stringify(payloadArray), { expires: 7 });
  //       } catch (error) {
  //         console.error('Error parsing or updating chart payload in cookies:', error);
  //       }
  //     }
  //   }
  // };

  const handleDeleteChart = (index) => {
    // Confirm the deletion (optional)
    if (window.confirm("Are you sure you want to delete this chart?")) {
      const session = new SessionStorageService();
      const currentUser = session.getItem("currentUser");

      if (!currentUser) {
        console.error('No user found in session.');
        return;
      }

      const userChartsKey = `prsti_${currentUser}_charts`;

      // Remove the chart from the state
      setChartDataList((prevList) => prevList.filter((_, i) => i !== index));

      // Remove the chart from cookies
      const existingPayloads = Cookies.get(userChartsKey);

      if (existingPayloads) {
        try {
          // Parse the payload array from cookies
          let payloadArray = JSON.parse(existingPayloads);

          // Remove the chart at the specified index
          payloadArray = payloadArray.filter((_, i) => i !== index);

          // Update the cookies with the modified payload array
          Cookies.set(userChartsKey, JSON.stringify(payloadArray), { expires: 7 });
        } catch (error) {
          console.error('Error parsing or updating chart payload in cookies:', error);
        }
      }
    }
  };


  // ===========================================

  const handleClosePanel = () => {
    setPanelOpen(false);
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
    } else if (maxValue >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`; // For millions
    } else if (maxValue >= 100000) {
      return `${(value / 1000).toFixed(1)}K`; // For thousands
    } else {
      return value.toFixed(2); // For smaller values
    }
  };

  const handleCreateClick = () => {
    setPanelOpen(true);
  };

  // const handleDeleteChart = (index) => {
  //   setChartDataList((prevList) => prevList.filter((_, i) => i !== index));
  // };

  // In your render method or functional component

  return (
    <>
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

            const renderChartComponent = (chartData) => {
              const { scenario } = chartData;

              switch (scenario) {
                case 1:
                  return <GraphsScenario1Chart chartData={chartData} />;
                case 2:
                  return <GraphsScenario2Chart chartData={chartData} />;
                case 3:
                  return <GraphsScenario3Chart chartData={chartData} />;
                case 4:
                  return <GraphsScenario4Chart chartData={chartData} />;
                // Handle other scenarios if needed
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
                      // borderBottom: "1px solid gray",
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
                    {/* <Bar
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
                          x: {
                            offset: true,
                            grid: {
                              display: false,
                            },
                            ticks: {
                              autoSkip: false,
                              padding: 10,
                            },
                            afterFit: (scale) => {
                              scale.paddingLeft = 20;
                              scale.paddingRight = 20;
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
                      }}
                    /> */}
                    {renderChartComponent(chartData)}
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
                <>
                  <h3 style={{ marginLeft: "20px" }}>{currentData.title}</h3>
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
                        datalabels: {
                          display: false, // Disable data labels
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

App.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default App;
