// import { Bar } from "react-chartjs-2";
// import React, { useState, useRef, useEffect } from "react";
// import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
// import "chartjs-plugin-datalabels"; // Ensure the plugin is imported

// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const apiUrl = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

// const GraphScenario3Chart = ({ chartData, receivedPayload }) => {
//   console.log("GraphScenario3Chart :", chartData);
//   console.log("GraphScenario3Chart :", receivedPayload);

//   const [selectedBarData, setSelectedBarData] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [fetchedData, setFetchedData] = useState([]);
//   const [timeWindow, setTimeWindow] = useState("M");

//   const chartRef = useRef(null);

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

//   const fetchPeriodicData = async (hitToUrl) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(hitToUrl),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Fetched Data:", data); // Add logging for fetched data

//       setFetchedData(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching periodic data:", error);
//       setFetchedData([]);
//     }
//   };

//   // const handleBarClick = (event, elements) => {
//   //   console.log("GraphScenario3Chart data:", chartData);
//   //   console.log("GraphScenario3Chart receivedPayload:", receivedPayload);
//   //   const filteredPayload = receivedPayload.filter((item) => {
//   //     return item.includeCOGS === false && item.partition !== 'None';
//   // });

//   // console.log("Filtered Payload:", filteredPayload);

//   //   if (elements.length === 0) return;

//   //   const element = elements[0];
//   //   const clickedIndex = element.index;
//   //   const clickedLabel = chartData.labels[clickedIndex];
//   //   const dimensionType = chartData.dimension;

//   //   console.log("Clicked index:", clickedIndex);
//   //   console.log("Clicked label:", clickedLabel);
//   //   console.log("Dimension type:", dimensionType);

//   //   const clickedDataSet = chartData.datasets[element.datasetIndex].label; // Use datasetIndex to get the correct dataset
//   //   console.log("Clicked dataset:", clickedDataSet);

//   //   const dimensionValue = clickedDataSet.split(' - ')[0];
//   //   console.log("Dimension value:", dimensionValue);

//   //   if (!Array.isArray(receivedPayload)) {
//   //     console.error("Expected receivedPayload to be an array:", receivedPayload);
//   //     return; // Exit if it's not an array
//   //   }

//   //   const correspondingPayload = receivedPayload.find((item) => {
//   //     // Ensure that the partition is not "None" and includes the clicked label
//   //     if (item.partition && item.partition !== 'None' && item.partition.includes(clickedLabel)) {
//   //         // Ensure that the dimension matches the provided dimensionType
//   //         if (item.dimension && item.dimension.includes(dimensionType)) {
//   //             return true; // Return the first match
//   //         }
//   //     }
//   //     return false;
//   // });

//   // const  {bottomRank, dimension, end_date, includeCOGS, measure, partition, start_date, topRank } =  correspondingPayload
//   // const [prefix, currentValues] = partition.split(':');
//   // console.log(prefix)
//   // console.log(currentValues)

//   // // Log the result
//   // if (correspondingPayload) {
//   //     console.log("Matching Payload:", correspondingPayload);
//   //     const hitToUrl = {
//   //       bottomRank: bottomRank,
//   //       topRank: topRank,
//   //       dimension: `${dimensionType}:${dimensionValue}`, // Update dimension with clicked label
//   //       measure: measure,
//   //       partition: `${prefix}:${clickedLabel}`, // Use the updated partition here
//   //       includeCOGS: includeCOGS,
//   //       start_date: start_date,
//   //       end_date: end_date,
//   //       // time_window: timeWindow, // If needed, uncomment and include this
//   //     };
//   //     console.log("hitUrl:", hitToUrl);

//   //     fetchPeriodicData(hitToUrl);

//   // } else {
//   //     console.log("No matching payload found for clicked bar.");
//   // }

//   //   // console.log("Corresponding Payload:", correspondingPayload);

//   //   // const finalPayload =
//   //   //   correspondingPayload ||
//   //   //   receivedPayload.find((item) => item.dimension.includes(dimensionType));

//   //   // if (!finalPayload) {
//   //   //   console.error("No matching payload found for clicked bar.");
//   //   //   return;
//   //   // }

//   //   // console.log("Final Payload:", finalPayload);

//   // };

//   const handleBarClick = (event, elements) => {
//     console.log("GraphScenario3Chart data:", chartData);
//     console.log("GraphScenario3Chart receivedPayload:", receivedPayload);

//     // Filter payload to exclude those with includeCOGS === true or partition === 'None'
//     const filteredPayload = receivedPayload.filter((item) => {
//       return item.includeCOGS === false && item.partition !== "None";
//     });

//     console.log("Filtered Payload:", filteredPayload);

//     // If no bar is clicked, exit early
//     if (elements.length === 0) return;

//     const element = elements[0];
//     const clickedIndex = element.index;
//     const clickedLabel = chartData.labels[clickedIndex];
//     const dimensionType = chartData.dimension;

//     console.log("Clicked index:", clickedIndex);
//     console.log("Clicked label:", clickedLabel);
//     console.log("Dimension type:", dimensionType);

//     // Get the clicked dataset label to extract the dimension value
//     const clickedDataSet = chartData.datasets[element.datasetIndex].label; // Use datasetIndex to get the correct dataset
//     console.log("Clicked dataset:", clickedDataSet);

//     const dimensionValue = clickedDataSet.split(" - ")[0];
//     console.log("Dimension value:", dimensionValue);

//     // Ensure that the receivedPayload is an array
//     if (!Array.isArray(receivedPayload)) {
//       console.error("Expected receivedPayload to be an array:", receivedPayload);
//       return; // Exit if receivedPayload is not an array
//     }

//     // Find the corresponding payload based on partition and dimensionType
//     const correspondingPayload = receivedPayload.find((item) => {
//       // Check if partition includes the clicked label and is not 'None'
//       if (item.partition && item.partition !== "None" && item.partition.includes(clickedLabel)) {
//         // Ensure dimension includes the clicked dimensionType
//         if (item.dimension && item.dimension.includes(dimensionType)) {
//           return true; // Return first matching payload
//         }
//       }
//       return false; // Continue searching
//     });

//     // If a matching payload is found, extract its values
//     if (correspondingPayload) {
//       console.log("Matching Payload:", correspondingPayload);

//       // Destructure values from the matching payload
//       const {
//         bottomRank,
//         dimension,
//         end_date,
//         includeCOGS,
//         measure,
//         partition,
//         start_date,
//         topRank,
//       } = correspondingPayload;

//       // Split the partition into prefix and values
//       const [prefix, currentValues] = partition.split(":");
//       console.log("Partition Prefix:", prefix);
//       console.log("Partition Values:", currentValues);

//       // Prepare the data to be sent in the API call (hitToUrl)
//       const hitToUrl = {
//         bottomRank: bottomRank,
//         topRank: topRank,
//         dimension: `${dimensionType}:${dimensionValue}`, // Update dimension with clicked label
//         measure: measure,
//         partition: `${prefix}:${clickedLabel}`, // Update partition with the clicked label
//         includeCOGS: includeCOGS,
//         start_date: start_date,
//         end_date: end_date,
//         time_window: timeWindow, // Uncomment if needed
//       };

//       console.log("hitUrl:", hitToUrl);

//       // Make the API call with the constructed URL
//       fetchPeriodicData(hitToUrl);
//       setSelectedBarData({
//         clickedLabel,
//         measure,
//         partition: `${prefix}:${clickedLabel}`,
//         dimension: `${dimensionType}:${dimensionValue}`,
//       });
//       console.log('selectedBarData', selectedBarData)
//       setIsDialogOpen(true); // Open the dialog
//     } else {
//       // If no matching payload is found, log the message
//       console.log("No matching payload found for clicked bar.");
//     }
//   };

//   // const handleTimeWindowChange = (newTimeWindow) => {
//   //   setTimeWindow(newTimeWindow);
//   // };
//   const handleTimeWindowChange = (newTimeWindow) => {
//     setTimeWindow(newTimeWindow);
//     // Fetch data again based on new time window
//     if (selectedBarData) {
//       const hitToUrl = {
//         ...selectedBarData,
//         time_window: newTimeWindow,
//       };
//       fetchPeriodicData(hitToUrl);
//     }
//   };

//   const dialogStyles = {
//     width: "800px",
//     maxWidth: "90%",
//   };

//   const options = {
//     onClick: (event, elements) => handleBarClick(event, elements),

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

//   // return <Bar data={chartData} options={options} />;
//   return (
//     <>
//       <Bar data={chartData} options={options} ref={chartRef} />
//       <Dialog
//         open={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         fullWidth
//         PaperProps={{ style: dialogStyles }}
//       >
//         <DialogContent>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <h3>Data for {selectedBarData?.clickedLabel || "Unknown"}</h3>
//             <select
//               onChange={(e) => handleTimeWindowChange(e.target.value)}
//               value={timeWindow}
//               style={{ padding: "8px", fontSize: "14px", width: "120px" }}
//             >
//               <option value="W">Weekly</option>
//               <option value="M">Monthly</option>
//               <option value="Q">Quarterly</option>
//             </select>
//           </div>
//           {fetchedData.length > 0 ? (
//             <Bar
//               data={{
//                 labels: fetchedData.map(
//                   (item) => item.Month || item.Quarter || item.Week || "Unknown"
//                 ), // Custom x-axis labels
//                 datasets: [
//                   {
//                     label: selectedBarData?.measure || "Data",
//                     data: fetchedData.map((item) => item[selectedBarData?.measure] || 0),
//                     // data: fetchedData.map((item) => {
//                     //   const value = item[selectedBarData?.measure] || 0;
//                     //   // Calculate the percentage value based on the base value
//                     //   return ((value / baseValue) * 100).toFixed(0); // Get percentage and round to nearest whole number
//                     // }),
//                     datalabels: {
//                       display: true, // Show data labels
//                       color: "black", // Customize the color
//                       formatter: (value) => {
//                         return ((value / baseValue) * 100).toFixed(0);
//                       },
//                     },
//                     backgroundColor: "rgba(75, 192, 192, 0.6)",
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   title: {
//                     display: true,
//                     // text: `Data for ${selectedBarData?.clickedLabel || "Unknown"}`,
//                   },
//                   legend: { display: false },
//                   //           datalabels: {
//                   //   display: true, // Show data labels
//                   //   color: "black", // Customize the color
//                   //   formatter: (value) => {
//                   //     return value.toFixed(1); // Round to 2 decimal places
//                   //   },
//                   // },
//                   datalabels: {
//                     display: true, // Show data labels
//                     color: "black", // Customize the color
//                     formatter: (value) => {
//                       console.log(value); // Check the value being passed
//                       return Number(value).toFixed(2);
//                     },
//                   },
//                 },
//                 scales: {
//                   x: {
//                     grid: { display: false },
//                     ticks: {
//                       // Return the labels directly from the data provided
//                       callback: (value, index) => {
//                         return fetchedData[index]
//                           ? fetchedData[index].Month ||
//                               fetchedData[index].Quarter ||
//                               fetchedData[index].Week ||
//                               "Unknown"
//                           : value;
//                       },
//                     },
//                   },
//                   y: {
//                     beginAtZero: true,
//                     ticks: { callback: formatValue }, // Assuming formatValue is defined elsewhere
//                   },
//                 },
//               }}
//             />
//           ) : (
//             <p>No data available for the selected time window.</p>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default GraphScenario3Chart;

// //ok for monthly only once Month

// import React, { useState, useRef } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Dialog, DialogContent } from '@mui/material';

// const GraphScenario3Chart = ({ chartData, receivedPayload }) => {
//   console.log("GraphScenario3Chart:", chartData);
//   console.log("GraphScenario3Chart:", receivedPayload);

//   const [selectedBarData, setSelectedBarData] = useState(null);
//   console.log("selectedBarData:", selectedBarData);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [fetchedData, setFetchedData] = useState([]);
//   const [timeWindow, setTimeWindow] = useState("M");
//   const chartRef = useRef(null);

//   let formatValue;
//   if (chartData?.datasets?.length > 0) {
//     const data = chartData.datasets[0].data;
//     if (data.length > 0) {
//       const maxValue = Math.max(...data);
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
//     }
//   }

//   const fetchPeriodicData = async (hitToUrl) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(hitToUrl),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Fetched Data:", data);

//       if (typeof data !== 'object' || data === null || Object.keys(data).length === 0) {
//         throw new Error('No data found in the response');
//       }

//       const firstKey = Object.keys(data)[0];
//       const responseData = data[firstKey];
//       setFetchedData(responseData); // Store fetched data

//     } catch (error) {
//       console.error("Error fetching periodic data:", error);
//       setFetchedData([]); // Clear data on error
//     }
//   };

//   const handleBarClick = (event, elements) => {
//     if (elements.length === 0) return;

//     const element = elements[0];
//     const clickedIndex = element.index;
//     const clickedLabel = chartData.labels[clickedIndex];
//     const dimensionType = chartData.dimension;
//     const clickedDataSet = chartData.datasets[element.datasetIndex].label;
//     const dimensionValue = clickedDataSet.split(" - ")[0];

//     const correspondingPayload = receivedPayload.find((item) => {
//       return item.partition && item.partition.includes(clickedLabel) &&
//              item.dimension.includes(dimensionType);
//     });

//     if (correspondingPayload) {
//       const { bottomRank, measure, partition, includeCOGS, start_date, end_date } = correspondingPayload;
//       const [prefix] = partition.split(":");

//       const hitToUrl = {
//         bottomRank,
//         topRank: 10, // Adjust if you have topRank in your state
//         dimension: `${dimensionType}:${dimensionValue}`,
//         measure,
//         partition: `${prefix}:${clickedLabel}`,
//         includeCOGS,
//         start_date,
//         end_date,
//         time_window: timeWindow,
//       };

//       console.log("hitUrl:", hitToUrl);
//       fetchPeriodicData(hitToUrl); // Fetch new data based on clicked bar
//       setSelectedBarData({ clickedLabel, measure, partition: `${prefix}:${clickedLabel}`, dimension: `${dimensionType}:${dimensionValue}` });
//       setIsDialogOpen(true);
//     } else {
//       console.log("No matching payload found for clicked bar.");
//     }
//   };

//   const handleTimeWindowChange = (newTimeWindow) => {
//     setTimeWindow(newTimeWindow);
//     if (selectedBarData) {
//       const hitToUrl = {
//         ...selectedBarData,
//         time_window: newTimeWindow,
//       };
//       fetchPeriodicData(hitToUrl); // Fetch data based on new time window
//     }
//   };

//   const options = {
//     onClick: (event, elements) => handleBarClick(event, elements),
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: true,
//         text: 'Chart based on Product Gross_Amount and grouped by Region',
//       },
//     },
//     scales: {
//       x: {
//         offset: true,
//         grid: { display: false },
//         ticks: {
//           autoSkip: false,
//           padding: 10,
//           maxRotation: 0,
//           minRotation: 0,
//         },
//       },
//       y: {
//         beginAtZero: true,
//         ticks: { callback: formatValue },
//       },
//     },
//   };

//   return (
//     <>
//       <Bar data={chartData} options={options} ref={chartRef} />
//       <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
//         <DialogContent>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <h3>Data for {selectedBarData?.dimensionValue || "Unknown"}</h3>
//             <select
//               onChange={(e) => handleTimeWindowChange(e.target.value)}
//               value={timeWindow}
//               style={{ padding: "8px", fontSize: "14px", width: "120px" }}
//             >
//               <option value="W">Weekly</option>
//               <option value="M">Monthly</option>
//               <option value="Q">Quarterly</option>
//             </select>
//           </div>
//           {fetchedData.length > 0 ? (
//             <Bar
//               data={{
//                 labels: fetchedData.map(item => item.Month || item.Quarter || item.Week || "Unknown"),
//                 datasets: [
//                   {
//                     label: selectedBarData?.measure || "Data",
//                     data: fetchedData.map(item => item[selectedBarData?.measure] || 0),
//                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1,
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: { display: true },
//                 },
//               }}
//             />
//           ) : (
//             <p>No data available for the selected time window.</p>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default GraphScenario3Chart;

// stl not geting popup but no bars

// import React, { useState, useRef } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Dialog, DialogContent } from '@mui/material';

// const GraphScenario3Chart = ({ chartData, receivedPayload }) => {
//   console.log("GraphScenario3Chart:", chartData);
//   console.log("GraphScenario3Chart:", receivedPayload);

//   const [selectedBarData, setSelectedBarData] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [fetchedData, setFetchedData] = useState([]);
//   console.log(fetchedData, 'fetchedData')
//   const [timeWindow, setTimeWindow] = useState("M");

//   const chartRef = useRef(null);

//   let formatValue;
//   if (chartData?.datasets?.length > 0) {
//     const data = chartData.datasets[0].data;
//     if (data.length > 0) {
//       const maxValue = Math.max(...data);
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
//     }
//   }

//   const fetchPeriodicData = async (hitToUrl) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(hitToUrl),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Fetcheddddddddddddddddd Data:", data);

//       if (typeof data !== 'object' || data === null || Object.keys(data).length === 0) {
//         throw new Error('No data found in the response');
//       }

//       // Get the first key from the response data
//       const firstKey = Object.keys(data)[0];
//       console.log("First Key:", firstKey); // Log the first key for debugging

//       // Access the specific dataset using the first key
//       const responseData = data[firstKey];
//       console.log(responseData, 'fetchedData'); // Log the dataset for debugging

//     } catch (error) {
//       console.error("Error fetching periodic data:", error);
//       setFetchedData([]);
//     }
//   };

//   const handleBarClick = (event, elements) => {
//     console.log("GraphScenario3Chart data:", chartData);
//     console.log("GraphScenario3Chart receivedPayload:", receivedPayload);

//     const filteredPayload = receivedPayload.filter((item) => {
//       return item.includeCOGS === false && item.partition !== "None";
//     });

//     if (elements.length === 0) return;

//     const element = elements[0];
//     const clickedIndex = element.index;
//     const clickedLabel = chartData.labels[clickedIndex];
//     const dimensionType = chartData.dimension;

//     const clickedDataSet = chartData.datasets[element.datasetIndex].label;
//     const dimensionValue = clickedDataSet.split(" - ")[0];

//     if (!Array.isArray(receivedPayload)) {
//       console.error("Expected receivedPayload to be an array:", receivedPayload);
//       return;
//     }

//     const correspondingPayload = receivedPayload.find((item) => {
//       if (item.partition && item.partition !== "None" && item.partition.includes(clickedLabel)) {
//         return item.dimension && item.dimension.includes(dimensionType);
//       }
//       return false;
//     });

//     if (correspondingPayload) {
//       console.log("Matching Payload:", correspondingPayload);

//       const {
//         bottomRank,
//         dimension,
//         end_date,
//         includeCOGS,
//         measure,
//         partition,
//         start_date,
//         topRank,
//       } = correspondingPayload;

//       const [prefix] = partition.split(":");

//       const hitToUrl = {
//         bottomRank,
//         topRank,
//         dimension: `${dimensionType}:${dimensionValue}`,
//         measure,
//         partition: `${prefix}:${clickedLabel}`,
//         includeCOGS,
//         start_date,
//         end_date,
//         time_window: timeWindow,
//       };

//       console.log("hitUrl:", hitToUrl);
//       fetchPeriodicData(hitToUrl);
//       setSelectedBarData({
//         clickedLabel,
//         measure,
//         partition: `${prefix}:${clickedLabel}`,
//         dimension: `${dimensionType}:${dimensionValue}`,
//       });
//       setIsDialogOpen(true);
//     } else {
//       console.log("No matching payload found for clicked bar.");
//     }
//   };

//   const handleTimeWindowChange = (newTimeWindow) => {
//     setTimeWindow(newTimeWindow);
//     if (selectedBarData) {
//       const hitToUrl = {
//         ...selectedBarData,
//         time_window: newTimeWindow,
//       };
//       fetchPeriodicData(hitToUrl);
//     }
//   };

//   const dialogStyles = {
//     width: "800px",
//     maxWidth: "90%",
//   };

//   const options = {
//     onClick: (event, elements) => handleBarClick(event, elements),
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       datalabels: {
//         display: false,
//       },
//       title: {
//         display: true,
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
//           maxRotation: 0,
//           minRotation: 0,
//         },
//       },
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: formatValue,
//         },
//       },
//     },
//   };

//   return (
//     <>
//       <Bar data={chartData} options={options} ref={chartRef} />
//       <Dialog
//         open={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         fullWidth
//         PaperProps={{ style: dialogStyles }}
//       >
//         <DialogContent>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <h3>Data for {selectedBarData?.clickedLabel || "Unknown"}</h3>
//             <select
//               onChange={(e) => handleTimeWindowChange(e.target.value)}
//               value={timeWindow}
//               style={{ padding: "8px", fontSize: "14px", width: "120px" }}
//             >
//               <option value="W">Weekly</option>
//               <option value="M">Monthly</option>
//               <option value="Q">Quarterly</option>
//             </select>
//           </div>
//           {fetchedData.length > 0 ? (

//             <Bar
//               data={{
//                 labels: fetchedData.map(item => item.Month || item.Quarter || item.Week || "Unknown"),

//                 datasets: [
//                   {
//                     label: selectedBarData?.measure || "Data",
//                     data: fetchedData.map(item => item[selectedBarData?.measure] || 0),
//                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1,
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: {
//                     display: true,
//                   },
//                 },
//               }}
//             />
//           ) : (
//             <p>No data available for the selected time window.</p>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default GraphScenario3Chart;

// inchninggetting TW error

// import React, { useState, useRef, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';
// import Dialog from '@mui/material/Dialog';
// import DialogContent from '@mui/material/DialogContent';

// const GraphScenario3Chart = ({ chartData, receivedPayload }) => {
//   const [selectedBarData, setSelectedBarData] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [fetchedData, setFetchedData] = useState([]);
//   const [timeWindow, setTimeWindow] = useState("M");
//   const chartRef = useRef(null);

//   const fetchPeriodicData = async (hitToUrl) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(hitToUrl),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (typeof data !== 'object' || data === null || Object.keys(data).length === 0) {
//         throw new Error('No data found in the response');
//       }

//       const firstKey = Object.keys(data)[0];
//       const responseData = data[firstKey] || []; // Ensure responseData is an array

//       setFetchedData(responseData); // Update fetched data state
//     } catch (error) {
//       console.error("Error fetching periodic data:", error);
//       setFetchedData([]); // Reset fetched data on error
//     }
//   };

//   const handleBarClick = (event, elements) => {
//     if (elements.length === 0) return; // No element clicked

//     const element = elements[0];
//     const clickedIndex = element.index;
//     const clickedLabel = chartData.labels[clickedIndex];
//     const dimensionType = chartData.dimension;
//     const clickedDataSet = chartData.datasets[element.datasetIndex].label;
//     const dimensionValue = clickedDataSet.split(" - ")[0];

//     const correspondingPayload = receivedPayload.find(item => {
//       return item.partition !== "None" && item.partition.includes(clickedLabel) && item.dimension.includes(dimensionType);
//     });

//     if (correspondingPayload) {
//       const { bottomRank, topRank, measure, partition, includeCOGS, start_date, end_date } = correspondingPayload;

//       const hitToUrl = {
//         bottomRank,
//         topRank,
//         dimension: `${dimensionType}:${dimensionValue}`,
//         measure,
//         partition: `${partition}:${clickedLabel}`,
//         includeCOGS,
//         start_date,
//         end_date,
//         time_window: timeWindow, // Include the current time window
//       };

//       fetchPeriodicData(hitToUrl);
//       setSelectedBarData({ clickedLabel, measure, partition, dimension: `${dimensionType}:${dimensionValue}` });
//       setIsDialogOpen(true);
//     } else {
//       console.log("No matching payload found for clicked bar.");
//     }
//   };

//   const handleTimeWindowChange = (newTimeWindow) => {
//     setTimeWindow(newTimeWindow); // Update the time window state
//     if (selectedBarData) {
//       const hitToUrl = {
//         ...selectedBarData,
//         time_window: newTimeWindow, // Include the new time window in the fetch
//       };
//       fetchPeriodicData(hitToUrl); // Fetch data again with the updated time window
//     }
//   };

//   // Fetch data when the dialog is opened and selectedBarData changes
//   useEffect(() => {
//     if (isDialogOpen && selectedBarData) {
//       const hitToUrl = {
//         ...selectedBarData,
//         time_window: timeWindow, // Ensure the current time window is used
//       };
//       fetchPeriodicData(hitToUrl);
//     }
//   }, [isDialogOpen, selectedBarData, timeWindow]);

//   const options = {
//     onClick: (event, elements) => handleBarClick(event, elements),
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       datalabels: { display: false },
//       title: { display: true },
//     },
//     scales: {
//       x: {
//         grid: { display: false },
//         ticks: { autoSkip: false },
//       },
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <>
//       <Bar data={chartData} options={options} ref={chartRef} />
//       <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
//         <DialogContent>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <h3>Data for {selectedBarData?.clickedLabel || "Unknown"}</h3>
//             <select
//               onChange={(e) => handleTimeWindowChange(e.target.value)}
//               value={timeWindow}
//               style={{ padding: "8px", fontSize: "14px", width: "120px" }}
//             >
//               <option value="W">Weekly</option>
//               <option value="M">Monthly</option>
//               <option value="Q">Quarterly</option>
//             </select>
//           </div>
//           {fetchedData.length > 0 ? (
//             <Bar
//               data={{
//                 labels: fetchedData.map(item => item.Month || item.Quarter || item.Week || "Unknown"),
//                 datasets: [{
//                   label: selectedBarData?.measure || "Data",
//                   data: fetchedData.map(item => item[selectedBarData?.measure] || 0),
//                   backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                   borderColor: 'rgba(75, 192, 192, 1)',
//                   borderWidth: 1,
//                 }],
//               }}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: { display: true },
//                 },
//               }}
//             />
//           ) : (
//             <p>No data available for the selected time window.</p>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default GraphScenario3Chart;

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
