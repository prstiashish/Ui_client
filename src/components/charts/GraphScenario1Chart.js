// const apiUrl = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";
const apiUrl = "https://nqy17v7tdd.execute-api.ap-south-1.amazonaws.com/dev/data-insights";

import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import "chartjs-plugin-datalabels"; // Ensure the plugin is imported

const GraphScenario1Chart = ({ chartData, receivedPayload, index }) => {


  // Check if chartData and datasets are valid
  if (
    !chartData ||
    !chartData.labels ||
    chartData.labels.length === 0 || // Check for labels
    !chartData.datasets ||
    chartData.datasets.length === 0 || // Check for datasets
    !chartData.datasets[0].data ||
    chartData.datasets[0].data.length === 0 // Check if data exists in datasets
  ) {
    return (
      <div>
        <p>No data available to display the chart.</p>
      </div>
    );
  }

  const [selectedBarData, setSelectedBarData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [timeWindow, setTimeWindow] = useState("M"); // Default time window
  const [dimensionName, setDimensionName] = useState(null);

  const chartRef = useRef(null);

  const formatValue = (value) => {
    const maxValue = Math.max(...(chartData?.datasets?.[0]?.data || [0])); // Added optional chaining

    if (maxValue >= 10000000) return value / 10000000;
    if (maxValue >= 100000) return value / 100000;
    if (maxValue >= 1000) return value / 1000;

    return value;
  };




  const fetchPeriodicData = async (requestPayload) => {
    try {
      const token = sessionStorage.getItem("Access_Token");

      if (!token) {
        console.error("Access Token is missing");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("****************************************");

      const responseData = await response.text();

      // Replace single quotes with double quotes to ensure valid JSON
      const validJsonString = responseData.replace(/'/g, '"');
      const data = JSON.parse(validJsonString);

      // const data = await response.json();
      // console.log("Fetched Dataddddddddd:", data); // Logging for fetched data

      // Define the correct month order
      const monthOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Sort the data based on month order
      const sortedData = Array.isArray(data)
        ? data.sort((a, b) => monthOrder.indexOf(a.Month) - monthOrder.indexOf(b.Month))
        : [];

      setFetchedData(sortedData);
    } catch (error) {
      console.error("Error fetching periodic data:", error);
      setFetchedData([]);
    }
  };

  const handleBarClick = (event, elements) => {
    if (!chartData || !chartData.labels || elements.length === 0) return;

    // console.log("chartData", chartData);
    // console.log("Received payload:", receivedPayload);
    // Check if any element was clicked
    if (elements.length === 0) return;

    const element = elements[0];
    const clickedIndex = element.index;
    const clickedLabel = chartData.labels[clickedIndex];
    setDimensionName(clickedLabel);
    // const dimensionType = chartData.xLabel;
    const dimensionType = chartData.xLabel || "Unknown Dimension";
    // console.log("Clicked index:", clickedIndex);
    // console.log("Clicked label:", clickedLabel);
    // console.log("Dimension type:", dimensionType);

    // Ensure receivedPayload is an array
    let payloadArray = Array.isArray(receivedPayload) ? receivedPayload : [receivedPayload];

    const correspondingPayload = payloadArray.find((item) => {
      return (
        item.partition === "None" && item.includeCOGS === false
        // item.partition.includes(clickedLabel) &&
        // item.dimension.includes(dimensionType)
      );
    });


    if (correspondingPayload) {
      const { bottomRank, topRank, measure, partition, includeCOGS, start_date, end_date } =
        correspondingPayload;

      const [prefix, currentValues] = partition.split(":");
      // console.log(prefix);
      // console.log(currentValues);

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

      // console.log("Hit to URL:", hitToUrl); // Log the hitToUrl object

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
    // console.log("Time window changed to:", newTimeWindow); // Log time window change
    // console.log("Selected Bar Data:", selectedBarData); // Log the selected bar

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

      // console.log("Fetching data with updated time window:", hitToUrl); // Log fetch with new time window
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
      // console.log("Fetching data on dialog open with:", hitToUrl); // Log fetch on dialog open
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
                      // console.log(value); // Check the value being passed
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
