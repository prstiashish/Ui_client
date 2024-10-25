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
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";


const apiUrl = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

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

 

  const [selectedBarData, setSelectedBarData] = useState(null);
  // console.log('selectedBarData', selectedBarData)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  console.log('fetchedData', fetchedData)
  const [timeWindow, setTimeWindow] = useState("M");
  const [dimensionName, SetdimensionName] = useState(null);

  const fetchPeriodicData = async (hitToUrl) => {
    // Log what is being sent to fetch
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hitToUrl),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetcheddddddd data:", data); // Log the fetched

      setFetchedData(data);



    } catch (error) {
      console.error("Error fetching periodic data:", error);
      setFetchedData([]); // Reset fetched data on error
    }
  };

  const handleBarClick = (event, elements) => {
    console.log("GraphScenario2Chart data:", chartData);
    console.log("GraphScenario2Chart receivedPayload:", receivedPayload);

    if (elements.length === 0) return; // No element clicked

    const element = elements[0];
    const clickedIndex = element.index;
    const clickedLabel = chartData.labels[clickedIndex];
    SetdimensionName(clickedLabel)

    const dimensionType = chartData.dimension;
    const clickedDataSet = chartData.datasets[element.datasetIndex].label;
    const dimensionValue = clickedDataSet.split(" - ")[0];

   

    const dataSetMappings = {
      "Materials Cost": "Materials_Cost",
      "Channel Commission": "Channel_Commission",
      Discounts: "Discounts",
      "Supplies Cost": "Supplies_Cost",
      Margin: "Margin",
    };

    // Step 2: Use the mapping to get the corresponding measure
    const measureValue = dataSetMappings[clickedDataSet] || clickedDataSet; // Fallback to clickedDataSet if not found

    console.log("Clicked Label:", clickedLabel); // Log the clicked label
    console.log("Dimension Type:", dimensionType); // Log the dimension type
    console.log("Clicked DataSet:", clickedDataSet); // Log the clicked dataset
    console.log("Dimension Value:", dimensionValue); // Log the dimension value

    const payloadArray = Array.isArray(receivedPayload) ? receivedPayload : [receivedPayload];


    const correspondingPayload = payloadArray.find((item) => {
      return (
        item.partition === "None" &&
        item.measure === "Gross_Amount" &&
        item.includeCOGS === true &&
        item.dimension.includes(dimensionType)
      );
    });

    console.log("Corresponding Payload:", correspondingPayload); // Log the corresponding payload

    if (correspondingPayload) {
      const { bottomRank, topRank, measure, partition, includeCOGS, start_date, end_date } =
        correspondingPayload;

      const hitToUrl = {
        bottomRank,
        topRank,
        dimension: `${dimensionType}:${clickedLabel}`,
        measure: measureValue,
        partition,
        includeCOGS: false,
        start_date,
        end_date,
        time_window: timeWindow, // Include the current time window
      };

      console.log("Hit to URL:", hitToUrl); // Log the hitToUrl object

      fetchPeriodicData(hitToUrl);

      setSelectedBarData(hitToUrl)

      setIsDialogOpen(true);
    } else {
      console.log("No matching payload found for clicked bar.");
    }

    // const hitToUrl = {
    //   bottomRank: matchingPayload.bottomRank,
    //   topRank: matchingPayload.topRank,
    //   dimension: `${matchingPayload.dimension.split(":")[0]}:${clickedLabel}`,
    //   measure: matchingPayload.measure,
    //   partition: matchingPayload.partition,
    //   includeCOGS: matchingPayload.includeCOGS,
    //   start_date: matchingPayload.start_date,
    //   end_date: matchingPayload.end_date,
    //   // time_window: timeWindow, // Using the default time window here
    // };
    // console.log("hitToUrl:", hitToUrl);

    // Handle matching or non-matching payloads
    // if (matchingPayload) {
    //     console.log("Matched Payload:", matchingPayload);
    //     // Add further logic to handle matched payload
    //     const isCOGSIncluded = matchingPayload.includeCOGS;
    //     console.log("Include COGS:", isCOGSIncluded);
    //     // You can now use matchingPayload for your next steps
    // } else {
    //     console.error(`No matching payload found for clicked dataset label: "${clickedDatasetLabel}". Please ensure your measures in the payload match your dataset labels and additional criteria.`);
    // }
  };

  const handleTimeWindowChange = (newTimeWindow) => {
    setTimeWindow(newTimeWindow);
    console.log("Time window changed to:", newTimeWindow); // Log time window change
    console.log("Selected Bar Data:", selectedBarData); // Log the selected bar

    // Ensure selectedBarData is available before fetching
    if (selectedBarData) {
      const {
        bottomRank,
        topRank,
        measure,
        partition,
        includeCOGS,
        start_date,
        end_date,
        dimension,
      } = selectedBarData;

      const hitToUrl = {
        bottomRank,
        topRank,
        dimension,
        measure,
        partition,
        includeCOGS,
        start_date,
        end_date,
        time_window: newTimeWindow, // Use new time window directly
      };

      console.log("Fetching data with updated time window:", hitToUrl); // Log fetch with new time window
      fetchPeriodicData(hitToUrl); // Fetch data again with the updated time window
    }
  };

  // Fetch data when the dialog is opened and selectedBarData changes
  useEffect(() => {
    if (isDialogOpen && selectedBarData) {
      const hitToUrl = {
        ...selectedBarData,
        time_window: timeWindow, // Ensure the current time window is used
      };
      console.log("Fetching data on dialog open with:", hitToUrl); // Log fetch on dialog open
      fetchPeriodicData(hitToUrl);
    }
  }, [isDialogOpen, selectedBarData, timeWindow]);

  const getBaseValue = (data) => {
    // Check the maximum value in the selected measure
    const maxValue = Math.max(...data.map((item) => item[selectedBarData?.measure] || 0));

    // Set baseValue based on the maximum value found
    if (maxValue <= 100000) {
      return 100000; // Set to 100000 if the max value is less than or equal to 100000
    } else if (maxValue <= 1000000) {
      return 1000000; // Set to 1000000 if the max value is less than or equal to 1,000,000
    } else if (maxValue <= 10000000) {
      return 10000000; // Set to 10,000,000 if the max value is less than or equal to 10,000,000
    } else {
      return 100000000; // Set to 100,000,000 otherwise
    }
  };

  const baseValue = getBaseValue(fetchedData);


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

  // return <Bar data={chartData} options={options} ref={chartRef} />;
  return (
    <>
      <Bar data={chartData} options={options} ref={chartRef} />
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
        <DialogContent>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Data for {dimensionName || "Unknown"}</h3>
            <select
              onChange={(e) => handleTimeWindowChange(e.target.value)} // Call with the new value
              value={timeWindow} // Value controlled by the state
              style={{ padding: "8px", fontSize: "14px", width: "120px" }}
            >
              <option value="W">Weekly</option>
              <option value="M">Monthly</option>
              <option value="Q">Quarterly</option>
            </select>
          </div>

          {fetchedData.length > 0 ? (
            <Bar
              data={{
                labels: fetchedData.map(
                  (item) => item.Month || item.Quarter || item.Week || "Unknown"
                ),
                datasets: [
                  {
                    label: selectedBarData?.measure || "Data",
                    data: fetchedData.map((item) => item[selectedBarData?.measure] || 0),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    datalabels: {
                      display: true, // Show data labels
                      color: "black", // Customize the color
                      formatter: (value) => {
                        return ((value / baseValue) * 100).toFixed(0);
                      },
                    },
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { autoSkip: false },
                  },
                  y: { beginAtZero: true, ticks: { callback: formatValue } },
                },
              }}
            />
          ) : (
            <p>No data available for the selected time window.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GraphScenario2Chart;
