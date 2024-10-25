// import { Margin } from "@mui/icons-material";
// import { ticks } from "d3";
// import { Bar } from "react-chartjs-2";

// const GraphScenario1Chart = ({ chartData }) => {
//   // console.log("GraphScenario1Chart :", chartData)

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
//       title: {
//         display: true,
//         // text: getDynamicTitle(currentData),
//         text: "",
//       },
//       legend: {
//         display: false,
//         position: "top",
//         marginTop: 10,
//       },
//       datalabels: {
//         display: false,
//       },
//     },
//     layout: {
//       padding: {
//         left: 10, // Adjust left padding
//         right: 0,
//         top: 10,
//         bottom: 10,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           display: false,
//         },
//         // ticks: {
//         //   autoSkip: true,
//         //   maxRotation: 35, // Rotate labels for better fit
//         //   minRotation: -10,
//         //   padding: 0, // Reduced padding
//         //   font: {
//         //     size: 10, // Smaller font size
//         //   },
//         // callback: function(value, index) {
//         //   return index % 2 === 0 ? value : ''; // Display every other label
//         // },
//         // },
//       },
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: formatValue,
//         },
//       },
//     },
//     elements: {
//       bar: {
//         // borderRadius: 4, // Optional: rounded corners
//       },
//     },
//   };

//   return <Bar data={chartData} options={options} />;
// };

// export default GraphScenario1Chart;

// for periodic dis  2nd tryingggg noe

const apiUrl = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import "chartjs-plugin-datalabels"; // Ensure the plugin is imported

const GraphScenario1Chart = ({ chartData, receivedPayload, index }) => {
  console.log('chartData', chartData)

  console.log('chartData', chartData);

// Check if chartData and datasets are valid
if (
  !chartData || 
  !chartData.labels || chartData.labels.length === 0 ||  // Check for labels
  !chartData.datasets || chartData.datasets.length === 0 || // Check for datasets
  !chartData.datasets[0].data || chartData.datasets[0].data.length === 0 // Check if data exists in datasets
) {
  return (
    <div>
      <p>No data available to display the chart.</p>
    </div>
  );
}

  console.log('g11111111111111',chartData)
  const [selectedBarData, setSelectedBarData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [timeWindow, setTimeWindow] = useState("M"); // Default time window
  const [dimensionName, setDimensionName] = useState(null);

  const chartRef = useRef(null);

 
  const formatValue = (value) => {
    const maxValue = Math.max(...(chartData?.datasets?.[0]?.data || [0]));  // Added optional chaining
  
    if (maxValue >= 10000000) return value / 10000000;
    if (maxValue >= 100000) return value / 100000;
    if (maxValue >= 1000) return value / 1000;
    
    return value;
  };
  

  // Fetch data based on selected payload and time window
  const fetchPeriodicData = async (requestPayload) => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data); // Add logging for fetched data

      setFetchedData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching periodic data:", error);
      setFetchedData([]);
    }
  };

  
 
 

  const handleBarClick = (event, elements) => {

    if (!chartData || !chartData.labels || elements.length === 0) return;

    console.log("chartData", chartData);
    console.log("Received payload:", receivedPayload);
    // Check if any element was clicked
    if (elements.length === 0) return;

    const element = elements[0];
    const clickedIndex = element.index;
    const clickedLabel = chartData.labels[clickedIndex];
    setDimensionName(clickedLabel)
    // const dimensionType = chartData.xLabel;
    const dimensionType = chartData.xLabel || "Unknown Dimension"; 
    console.log("Clicked index:", clickedIndex);
    console.log("Clicked label:", clickedLabel);
    console.log("Dimension type:", dimensionType);

    // Ensure receivedPayload is an array
    let payloadArray = Array.isArray(receivedPayload) ? receivedPayload : [receivedPayload];

    
    

    const correspondingPayload = payloadArray.find((item) => {
      return (
        item.partition === "None" && item.includeCOGS === false
        // item.partition.includes(clickedLabel) &&
        // item.dimension.includes(dimensionType)
      );
    });

   

    console.log("Corresponding Payload:", correspondingPayload); // Log the matching payload

    if (correspondingPayload) {
      const { bottomRank, topRank, measure, partition, includeCOGS, start_date, end_date } =
        correspondingPayload;

      const [prefix, currentValues] = partition.split(":");
      console.log(prefix);
      console.log(currentValues);

      const hitToUrl = {
        bottomRank,
        topRank,
        dimension: `${dimensionType}:${clickedLabel}`,
        measure,
        partition: "None",
        includeCOGS: false,
        start_date,
        end_date,
        time_window: timeWindow, // Include the current time window
      };

      console.log("Hit to URL:", hitToUrl); // Log the hitToUrl object

      fetchPeriodicData(hitToUrl);

     

      setSelectedBarData(hitToUrl);

      setIsDialogOpen(true);
    } else {
      console.log("No matching payload found for clicked bar.");
    }

    // ==========

   

    

    // Fetch data based on the constructed URL parameters
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

  // Bar chart options
  const options = {
    onClick: (event, elements) => handleBarClick(event, elements),
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      title: { display: true, text: "" },
      legend: { display: false },
      datalabels: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { display: false } },
      y: { beginAtZero: true, ticks: { callback: formatValue } },
    },
  };

  // Dialog styles
  const dialogStyles = {
    width: "800px",
    maxWidth: "90%",
  };
  // const baseValue = 10000000;
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

  return (
    <>
      <Bar data={chartData} options={options} ref={chartRef} />
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        PaperProps={{ style: dialogStyles }}
      >
        <DialogContent>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Data for {dimensionName || "Unknown"}</h3>
            <select
              onChange={(e) => handleTimeWindowChange(e.target.value)}
              value={timeWindow}
              style={{ padding: "8px", fontSize: "14px", width: "120px" }}
            >
              <option value="W">Weekly</option>
              <option value="M">Monthly</option>
              <option value="Q">Quarterly</option>
            </select>
          </div>
          {fetchedData && fetchedData.length > 0 ? (
            <Bar
              data={{
                labels: fetchedData.map(
                  (item) => item.Month || item.Quarter || item.Week || "Unknown"
                ), // Custom x-axis labels
                datasets: [
                  {
                    label: selectedBarData?.measure || "Data",
                    data: fetchedData.map((item) => item[selectedBarData?.measure] || 0),
                    // data: fetchedData.map((item) => {
                    //   const value = item[selectedBarData?.measure] || 0;
                    //   // Calculate the percentage value based on the base value
                    //   return ((value / baseValue) * 100).toFixed(0); // Get percentage and round to nearest whole number
                    // }),
                    datalabels: {
                      display: true, // Show data labels
                      color: "black", // Customize the color
                      formatter: (value) => {
                        return ((value / baseValue) * 100).toFixed(0);
                      },
                    },
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    // text: `Data for ${selectedBarData?.clickedLabel || "Unknown"}`,
                  },
                  legend: { display: false },
                  //           datalabels: {
                  //   display: true, // Show data labels
                  //   color: "black", // Customize the color
                  //   formatter: (value) => {
                  //     return value.toFixed(1); // Round to 2 decimal places
                  //   },
                  // },
                  datalabels: {
                    display: true, // Show data labels
                    color: "black", // Customize the color
                    formatter: (value) => {
                      console.log(value); // Check the value being passed
                      return Number(value).toFixed(2);
                    },
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: {
                      // Return the labels directly from the data provided
                      callback: (value, index) => {
                        return fetchedData[index]
                          ? fetchedData[index].Month ||
                              fetchedData[index].Quarter ||
                              fetchedData[index].Week ||
                              "Unknown"
                          : value;
                      },
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { callback: formatValue }, // Assuming formatValue is defined elsewhere
                  },
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

export default GraphScenario1Chart;
