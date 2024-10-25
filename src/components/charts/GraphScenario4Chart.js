import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const apiUrl = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

const GraphScenario4Chart = ({ chartData, receivedPayload }) => {
  console.log("GraphScenario4Chart :", chartData);
  console.log("GraphScenario4Chart receivedPayload :", receivedPayload);

  const payloadArray = Array.isArray(receivedPayload) ? receivedPayload : [receivedPayload];

  console.log("Payload Array (Before Filter):", payloadArray);

  const [selectedBarData, setSelectedBarData] = useState(null);
  console.log("selectedBarData", selectedBarData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  console.log("fetchedData", fetchedData);
  const [timeWindow, setTimeWindow] = useState("M");
  const [dimensionName, SetdimensionName] = useState(null);

  const chartRef = useRef(null);

  let formatValue;
  if (chartData && chartData.datasets && chartData.datasets.length > 0) {
    const data = chartData.datasets[0].data;

    if (data && data.length > 0) {
      let maxValue = Math.max(...data.map(Math.abs)); // Consider absolute values for max calculation
      let minValue = Math.min(...data); // Get minimum value for range checking
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

      // Optional: Log the min and max values for debugging
      // console.log("Min Value:", minValue, "Max Value:", maxValue);
    } else {
      console.log("Data is empty.");
    }
  } else {
    console.log("chartData or its datasets are not properly initialized.");
  }

  // const handleBarClick = (event, elements) => {
  //   console.log("GraphScenario4Chart data:", chartData);
  //   console.log("GraphScenario4Chart receivedPayload:", receivedPayload);

  //   if (elements.length === 0) return; // No element clicked

  //   const element = elements[0];
  //   const clickedIndex = element.index;
  //   const clickedLabel = chartData.labels[clickedIndex];
  //   // SetdimensionName(clickedLabel)

  //   const dimensionType = chartData.dimension;
  //   const clickedDataSet = chartData.datasets[element.datasetIndex].label;
  //   const dimensionValue = clickedDataSet.split(" - ")[0];

  //   // const dataSetMappings = {
  //   //   "Materials Cost": "Materials_Cost",
  //   //   "Channel Commission": "Channel_Commission",
  //   //   Discounts: "Discounts",
  //   //   "Supplies Cost": "Supplies_Cost",
  //   //   Margin: "Margin",
  //   // };

  //   // Step 2: Use the mapping to get the corresponding measure
  //   // const measureValue = dataSetMappings[clickedDataSet] || clickedDataSet; // Fallback to clickedDataSet if not found

  //   console.log("Clicked Label:", clickedLabel); // Log the clicked label
  //   console.log("Dimension Type:", dimensionType); // Log the dimension type
  //   console.log("Clicked DataSet:", clickedDataSet); // Log the clicked dataset
  //   console.log("Dimension Value:", dimensionValue); // Log the dimension value

  //   const filteredItems = payloadArray.filter((item) => {
  //     console.log("Item being filtered:", item); // Check each item
  //     console.log("Partition:", item.partition);
  //     console.log("Measure:", item.measure);
  //     console.log("IncludeCOGS:", item.includeCOGS);

  //     return (
  //       item.partition !== "None" && // Ensure partition is not "None"
  //       item.measure === "Gross_Amount" && // Ensure the correct measure
  //       item.includeCOGS === true // Ensure COGS is includedh
  //     );
  //   });

  //   console.log("Filtered Items:", filteredItems); // Log the filtered items

  //   const correspondingPayload = filteredItems.find(item => {
  //     // Match the partition or dimension with the clicked label
  //     return item.partition === clickedLabel || item.dimension.includes(clickedLabel);
  //   });

  //   if (correspondingPayload) {
  //     console.log("Corresponding Payload:", correspondingPayload); // Log the corresponding payload for the clicked bar
  //   } else {
  //     console.log("No matching payload found for clicked bar.");
  //   }

  //   // console.log("Corresponding Payload:", filteredItems); // Log the filtered items

  //   // if (correspondingPayload) {
  //   //   const { bottomRank, topRank, measure, partition, includeCOGS, start_date, end_date } =
  //   //     correspondingPayload;

  //   //   const hitToUrl = {
  //   //     bottomRank,
  //   //     topRank,
  //   //     dimension: `${dimensionType}:${clickedLabel}`,
  //   //     measure: measureValue,
  //   //     partition,
  //   //     includeCOGS: false,
  //   //     start_date,
  //   //     end_date,
  //   //     time_window: timeWindow, // Include the current time window
  //   //   };

  //   //   console.log("Hit to URL:", hitToUrl); // Log the hitToUrl object

  //   //   // fetchPeriodicData(hitToUrl);

  //   //   // setSelectedBarData(hitToUrl)

  //   //   // setIsDialogOpen(true);
  //   // } else {
  //   //   console.log("No matching payload found for clicked bar.");
  //   // }
  // };

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
      // console.log("Fetched data:", data); // Log the fetched

      // setFetchedData(data);


      if (typeof data !== "object" || data === null || Object.keys(data).length === 0) {
        throw new Error("No data found in the response");
      }

      const firstKey = Object.keys(data)[0];
      const responseData = data[firstKey] || []; // Ensure responseData is an array

      console.log("Fetched data:", responseData);
      setFetchedData(responseData);

    } catch (error) {
      console.error("Error fetching periodic data:", error);
      setFetchedData([]); // Reset fetched data on error
    }
  };

  const handleBarClick = (event, elements) => {
    if (elements.length === 0) return; // No element clicked

    // const specificPayload = filteredItems.find((item) => {
    //   const partitionLabel = item.partition.split(":")[1];
    //   const dimensionLabel = item.dimension.split(":")[0];

    //   console.log("Partition Label:", partitionLabel); // E.g., "Hyderabad"
    //   console.log("Dimension Label:", dimensionLabel); // E
    //   // Match the clicked label (e.g., "Hyderabad") and dimension, excluding "All"
    //   return (
    //     dimensionLabel === dimensionType && // Ensure dimension matches
    //     partitionLabel === clickedLabel && // Ensure clicked label matches partition
    //     partitionLabel !== "All" // Exclude "All" for specific matches
    //   );
    // });

    // console.log("Specific Payload:", specificPayload); // Log the specific payload

    const element = elements[0]; // Get the clicked bar element
    const clickedIndex = element.index; // Get the index of the clicked bar
    const clickedLabel = chartData.labels[clickedIndex]; // Get the label of the clicked bar

    const dimensionType = chartData.dimension; // Example: "Franchise_Type"
    const clickedDataSet = chartData.datasets[element.datasetIndex].label; // Get the label of the clicked dataset

    const dimensionValue = clickedDataSet.split(" - ")[0]; // Extract the dimension value (e.g., "FOFO")
    SetdimensionName(dimensionValue)
    console.log("Clicked Label:", clickedLabel); // E.g., "POS"
    console.log("Dimension Type:", dimensionType); // E.g., "Franchise_Type"
    console.log("Clicked DataSet:", clickedDataSet); // E.g., "FOFO - Margin"
    console.log("Dimension Value:", dimensionValue); // E.g., "FOFO"

    const measureValue = clickedDataSet.split(" - ")[1].trim();

    console.log("Clicked measureValue:", measureValue); // E.g., "Margin"

    // Define the mapping object
    const dataSetMappings = {
      "Materials Cost": "Materials_Cost",
      "Channel Commission": "Channel_Commission",
      Discounts: "Discounts",
      "Supplies Cost": "Supplies_Cost",
      Margin: "Margin",
    };

    // Map the measureValue to the corresponding value in the dataSetMappings
    const mappedMeasureValue = dataSetMappings[measureValue] || measureValue; // Use the mapping or fallback to original

    // Step 2: Use the mapping to get the corresponding measure

    const correspondingPayload = payloadArray.filter((item) => {
      return (
        item.partition !== "None" && item.measure === "Gross_Amount" && item.includeCOGS === true
      );
    });
    console.log("correspondingPayload:", correspondingPayload);

    if (correspondingPayload) {
      const { bottomRank, topRank, measure, partition, includeCOGS, start_date, end_date } =
        correspondingPayload[0];

      console.log(partition);

      const [prefix, currentValues] = partition.split(":");
      console.log(prefix);
      console.log(currentValues);

      const hitToUrl = {
        bottomRank,
        topRank,
        dimension: `${dimensionType}:${dimensionValue}`, // Update dimension as needed
        measure: mappedMeasureValue, // Use the mapped measure value
        partition: `${prefix}: ${clickedLabel}`, // Modify partition if needed
        includeCOGS: false,
        start_date,
        end_date,
        time_window: timeWindow, // Include the current time window
      };

      console.log("Hit to URL:", hitToUrl); // Log the hitToUrl object

      fetchPeriodicData(hitToUrl);

      setSelectedBarData(hitToUrl);

      setIsDialogOpen(true);
    }
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
        // display: false, // Disable data labels
        display: true,
        color: "#0000cc",

        align: "center", // Align label to the center of the bar
        anchor: "center",
        formatter: (value, context) => {
          const dataset = context.dataset;
          const index = context.dataIndex;
          // Display percentage values if available
          return dataset.percentageData ? `${dataset.percentageData[index].toFixed(1)}%` : "";
        },
        font: {
          weight: "bold", // Make the font bold
          size: "7", // Set the font size (adjust as needed)
        },
      },
      title: {
        display: true,
        // text: getDynamicTitle(chartData), // If you have a dynamic title function
        padding: {
          top: 20, // Add padding to the title
        },
      },
    },
    layout: {
      padding: {
        left: 10, // Adjust left padding
        right: 10, // Adjust right padding
        top: 20, // Add some top padding
        bottom: 10, // Add some bottom padding
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
          maxRotation: 0, // Prevent excessive rotation of labels
          minRotation: 0,
        },
        afterFit: (scale) => {
          scale.paddingLeft = Math.max(10, scale.width * 0.05); // Dynamically adjust padding based on width
          scale.paddingRight = Math.max(10, scale.width * 0.05);
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        // type: "logarithmic", // Keep logarithmic scaling if necessary
        ticks: {
          callback: formatValue, // Apply formatting function
        },
        title: {
          display: false,
          text: "Measure",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };

  // return <Bar data={chartData} options={options} />;
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

export default GraphScenario4Chart;
