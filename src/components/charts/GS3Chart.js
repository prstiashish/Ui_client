import { Bar } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



// const GraphScenario3Chart = ({ chartData }) => {

//   // console.log("GraphScenario3Chart :", chartData)

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
//   // const options = {
//   //   responsive: true,
//   //   maintainAspectRatio: false,
//   //   plugins: {
//   //     legend: {
//   //       display: false,
//   //     },
//   //     datalabels: {
//   //       display: false, // Disable data labels
//   //     },
//   //     title: {
//   //       display: true,
//   //       // text: getDynamicTitle(chartData), // If you have a dynamic title function
//   //     },
//   //   },
//   //   layout: {
//   //     padding: {
//   //       left: -4,
//   //       right: 0,
//   //     },
//   //   },
//   //   scales: {
//   //     x: {
//   //       offset: true,
//   //       grid: {
//   //         display: false,
//   //       },
//   //       ticks: {
//   //         autoSkip: false,
//   //         padding: 10,
//   //       },
//   //       afterFit: (scale) => {
//   //         scale.paddingLeft = 20;
//   //         scale.paddingRight = 20;
//   //       },
//   //     },
//   //     y: {
//   //       beginAtZero: true,
//   //       type: "logarithmic",
//   //       ticks: {
//   //         callback: formatValue, // Apply formatting function
//   //       },
//   //       title: {
//   //         display: true,
//   //         text: "Measure",
//   //         font: {
//   //           size: 14,
//   //           weight: "bold",
//   //         },
//   //       },
//   //     },
//   //   },
//   // };


//   const options = {

//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       datalabels: {
//         display: false, // Disable data labels
//       },
//       title: {
//         display: true,
//         // text: getDynamicTitle(chartData), // If you have a dynamic title function
//       },
//     },
//     layout: {
//       padding: {
//         left: 0,
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
//           autoSkip: false,
//           padding: 10,
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
//         // type: "logarithmic", // Keep logarithmic scaling if necessary
//         ticks: {
//           callback: formatValue, // Apply formatting function
//         },
//         // title: {
//         //   display: false,
//         //   text: "Measure",
//         //   font: {
//         //     size: 14,
//         //     weight: "bold",
//         //   },
//         // },
//       },
//     },
//   };



//   return <Bar data={chartData} options={options} />;
// };

// export default GraphScenario3Chart;



// susss

import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

const GraphScenario3Chart = ({ chartData, receivedPayload }) => {
  const [selectedBarData, setSelectedBarData] = useState(null);
  console.log('selectedBarData', selectedBarData)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [timeWindow, setTimeWindow] = useState("M");
  const [dimensionName, SetdimensionName] =  useState(null);

  const chartRef = useRef(null);

  const fetchPeriodicData = async (hitToUrl) => {
    console.log("Fetching periodic data with:", hitToUrl); // Log what is being sent to fetch
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

      if (typeof data !== "object" || data === null || Object.keys(data).length === 0) {
        throw new Error("No data found in the response");
      }

      const firstKey = Object.keys(data)[0];
      const responseData = data[firstKey] || []; // Ensure responseData is an array

      console.log("Fetched data:", responseData); // Log the fetched data
      setFetchedData(responseData); // Update fetched data state
    } catch (error) {
      console.error("Error fetching periodic data:", error);
      setFetchedData([]); // Reset fetched data on error
    }
  };

  const handleBarClick = (event, elements) => {
    console.log("Bar clicked. Elements:", elements); // Log clicked elements
    if (elements.length === 0) return; // No element clicked

    const element = elements[0];
    const clickedIndex = element.index;
    const clickedLabel = chartData.labels[clickedIndex];
    const dimensionType = chartData.dimension;
    const clickedDataSet = chartData.datasets[element.datasetIndex].label;
    const dimensionValue = clickedDataSet.split(" - ")[0];
    SetdimensionName(dimensionValue)


    console.log("Clicked Label:", clickedLabel); // Log the clicked label
    console.log("Dimension Type:", dimensionType); // Log the dimension type
    console.log("Clicked DataSet:", clickedDataSet); // Log the clicked dataset
    console.log("Dimension Value:", dimensionValue); // Log the dimension value

    const correspondingPayload = receivedPayload.find((item) => {
      return (
        item.partition !== "None" &&
        item.partition.includes(clickedLabel) &&
        item.dimension.includes(dimensionType)
      );
    });

    // console.log("Corresponding Payload:", correspondingPayload); // Log the matching payload

    if (correspondingPayload) {
      const { bottomRank, topRank, measure, partition, includeCOGS, start_date, end_date } =
        correspondingPayload;

        const [prefix, currentValues] = partition.split(':');
          console.log(prefix)
          console.log(currentValues)


      const hitToUrl = {
        bottomRank,
        topRank,
        dimension: `${dimensionType}:${dimensionValue}`,
        measure,
        partition: `${prefix}:${clickedLabel}`,
        includeCOGS,
        start_date,
        end_date,
        time_window: timeWindow, // Include the current time window
        
      };

      console.log("Hit to URL:", hitToUrl); // Log the hitToUrl object

      fetchPeriodicData(hitToUrl);


      // setSelectedBarData({
      //   dimensionValue,
      //   bottomRank,
      //   topRank,
      //   measure,
      //   includeCOGS,
      //   start_date,
      //   partition:`${partition}:${clickedLabel}`,
      //   end_date,
      //   dimension: `${dimensionType}:${dimensionValue}`,
      // });

      setSelectedBarData(hitToUrl)

      setIsDialogOpen(true);
    } else {
      console.log("No matching payload found for clicked bar.");
    }
  };

  // const handleTimeWindowChange = (newTimeWindow) => {
  //   setTimeWindow(newTimeWindow); // Update the time window state
  //   console.log("Time window changed to:", newTimeWindow); // Log time window change
  //   console.log("Selected Bar Data:", selectedBarData); // Log the selected bar
  //   const {
  //     bottomRank,
  //     topRank,
  //     measure,
  //     partition,
  //     includeCOGS,
  //     start_date,
  //     end_date,
  //     dimension,
  //   } = selectedBarData;

  //   if (selectedBarData) {
  //     const hitToUrl = {
  //       bottomRank,
  //       topRank,
  //       dimension: dimension,
  //       measure,
  //       partition: partition,
  //       includeCOGS,
  //       start_date,
  //       end_date,
  //       time_window: timeWindow, // Include the current time window
  //     };
  //     console.log("Fetching data with updated time window:", hitToUrl); // Log fetch with new time window
  //     fetchPeriodicData(hitToUrl); // Fetch data again with the updated time window
  //   }
  // };

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

  const formatValue = (value) => {
    const maxValue = Math.max(...(chartData.datasets[0]?.data || [0]));
    if (maxValue >= 10000000) return value / 10000000;
    if (maxValue >= 100000) return value / 100000;
    if (maxValue >= 1000) return value / 1000;
    return value;
  };

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
      legend: { display: false },
      datalabels: { display: false },
      title: { display: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: false },
      },
      y: { beginAtZero: true, ticks: { callback: formatValue } },
    },
  };

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

export default GraphScenario3Chart;
