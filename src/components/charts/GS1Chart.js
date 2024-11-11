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

// all ok lccik

// import React, { useState, useEffect, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
// import "chart.js/auto"; // Make sure chart.js is installed
// import axios from "axios";

// // Main Component
// const GraphScenario1Chart = ({ chartData, receivedPayload, index }) => {
//   console.log("chartData", chartData);
//   console.log("Received Payloaddddddddd:", receivedPayload);
//   console.log("index", index);
//   const [selectedBarData, setSelectedBarData] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [fetchedData, setFetchedData] = useState([]);
//   const [timeWindow, setTimeWindow] = useState("M"); // Default time window

//   // Format value for y-axis
//   const formatValue = (value) => {
//     const maxValue = Math.max(...(chartData.datasets[0]?.data || [0]));
//     if (maxValue >= 10000000) return value / 10000000;
//     if (maxValue >= 100000) return value / 100000;
//     if (maxValue >= 1000) return value / 1000;
//     return value;
//   };

//   const chartRef = useRef(null);

//   const handleBarClick = (event) => {
//     const chart = event.chart;
//     const elements = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, false);

//     if (elements.length === 0) return;

//     elements.forEach((element) => {
//       const clickedIndex = element.index; // Get the index of the clicked bar
//       const clickedValue = chartData.datasets[0].data[clickedIndex];
//       const clickedLabel = chartData.labels[clickedIndex];

//       const dimensionType = chartData.xLabel; // This should give you "Product"
//       const dimensionKey = `${dimensionType}:${clickedLabel}`;

//       console.log("Clicked Label:", clickedLabel);
//       console.log("Dimension Key:", dimensionKey);
//       console.log("Received Payload:", receivedPayload);

//       const correspondingPayload = receivedPayload.find((item) => {
//         console.log("Checking against:", item.dimension);
//         return item.dimension === dimensionKey;
//       });

//       // Fallback logic
//       const finalPayload =
//         correspondingPayload ||
//         receivedPayload.find((item) => item.dimension.includes(dimensionType));

//       const dataForPopup = {
//         clickedIndex,
//         clickedValue,
//         clickedLabel,
//         additionalData: finalPayload ? finalPayload : null,
//       };

//       console.log("finalPayload", finalPayload);
//       console.log("Data for Popup:", dataForPopup);

//       // const {bottomRank,topRank, dimension, measure, partition, includeCOGS,start_date,end_date,} = finalPayload

//       // const hitToUrl = {
//       //   bottomRank,
//       //     topRank,
//       //     dimension: finalPayload.dimension.replace('All', clickedLabel),
//       //     measure,
//       //     partition,
//       //     includeCOGS,
//       //     start_date,
//       //     end_date,

//       // };
//       const hitToUrl = {
//         bottomRank: finalPayload.bottomRank,
//         topRank: finalPayload.topRank,
//         dimension: `${finalPayload.dimension.split(":")[0]}:${clickedLabel}`, // Manually create the new dimension with clickedLabel
//         measure: finalPayload.measure,
//         partition: finalPayload.partition,
//         includeCOGS: finalPayload.includeCOGS,
//         start_date: finalPayload.start_date,
//         end_date: finalPayload.end_date,
//       };
//       console.log("hitToUrl", hitToUrl);

//       fetchPeriodicData(hitToUrl);
//     });
//   };

//   // Fetch data based on selected payload and time window
//   const fetchPeriodicData = async (requestPayload) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestPayload),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Fetched Data:", data);
//       setFetchedData(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching periodic data:", error);
//       setFetchedData([]);
//     }
//   };

//   // Bar chart options
//   const options = {
//     onClick: handleBarClick,
//     responsive: true,
//     maintainAspectRatio: false,

//     plugins: {
//       title: { display: true, text: "" },
//       legend: { display: false },
//       datalabels: { display: false },
//     },
//     scales: {
//       x: { grid: { display: false }, ticks: { display: false } },
//       y: { beginAtZero: true, ticks: { callback: formatValue } },
//     },
//   };

//   // Dialog styles
//   const dialogStyles = {
//     width: "800px",
//     maxWidth: "90%",
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
//           <TimeWindowSelector
//             selectedTimeWindow={timeWindow}
//             onSelect={setTimeWindow}
//             onClose={() => setIsDialogOpen(false)}
//           />
//           {fetchedData.length > 0 ? (
//             <Bar
//               data={{
//                 labels: fetchedData.map((item) => item.Month || item.Quarter || item.Week),
//                 datasets: [
//                   {
//                     label: selectedBarData?.measure || "",
//                     data: fetchedData.map((item) => item[selectedBarData?.measure]),
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
//                     text: `Data for ${selectedBarData?.label || ""}`,
//                   },
//                   legend: { display: false },
//                 },
//                 scales: {
//                   x: {
//                     grid: { display: false },
//                     ticks: { callback: (value) => value.Month || value.Quarter || value.Week },
//                   },
//                   y: { beginAtZero: true, ticks: { callback: formatValue } },
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

// // TimeWindowSelector Component
// const TimeWindowSelector = ({ selectedTimeWindow, onSelect, onClose }) => {
//   const handleSelect = (e) => {
//     onSelect(e.target.value);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         gap: "8px",
//         padding: "8px",
//       }}
//     >
//       <h3 style={{ margin: 0 }}>Select Time Window</h3>
//       <select
//         onChange={handleSelect}
//         style={{ padding: "8px", fontSize: "14px", width: "120px" }}
//         value={selectedTimeWindow}
//       >
//         <option value="">Select</option>
//         <option value="W">Weekly</option>
//         <option value="M">Monthly</option>
//         <option value="Q">Quarterly</option>
//       </select>
//       <Button variant="contained" color="secondary" onClick={onClose}>
//         Close
//       </Button>
//     </div>
//   );
// };

// export default GraphScenario1Chart;

// Import statements

// perfect respnse

// import React, { useState, useEffect, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
// import "chart.js/auto"; // Make sure chart.js is installed
// import axios from "axios";

// // Main Component
// const GraphScenario1Chart = ({ chartData, receivedPayload, index }) => {
//   console.log("chartData", chartData);
//   console.log("Received Payloaddddddddd:", receivedPayload);
//   console.log("index", index);
//   const [selectedBarData, setSelectedBarData] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [fetchedData, setFetchedData] = useState([]);
//   const [timeWindow, setTimeWindow] = useState("M"); // Default time window

//   // Format value for y-axis
//   const formatValue = (value) => {
//     const maxValue = Math.max(...(chartData.datasets[0]?.data || [0]));
//     if (maxValue >= 10000000) return value / 10000000;
//     if (maxValue >= 100000) return value / 100000;
//     if (maxValue >= 1000) return value / 1000;
//     return value;
//   };

//   const chartRef = useRef(null);

//   const handleBarClick = (event) => {
//     const chart = event.chart;
//     const elements = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, false);

//     if (elements.length === 0) return;

//     elements.forEach((element) => {
//       const clickedIndex = element.index; // Get the index of the clicked bar
//       const clickedValue = chartData.datasets[0].data[clickedIndex];
//       const clickedLabel = chartData.labels[clickedIndex];

//       const dimensionType = chartData.xLabel; // This should give you "Product"
//       const dimensionKey = `${dimensionType}:${clickedLabel}`;

//       console.log("Clicked Label:", clickedLabel);
//       console.log("Dimension Key:", dimensionKey);
//       console.log("Received Payload:", receivedPayload);

//       const correspondingPayload = receivedPayload.find((item) => {
//         console.log("Checking against:", item.dimension);
//         return item.dimension === dimensionKey;
//       });

//       // Fallback logic
//       const finalPayload =
//         correspondingPayload ||
//         receivedPayload.find((item) => item.dimension.includes(dimensionType));

//       const dataForPopup = {
//         clickedIndex,
//         clickedValue,
//         clickedLabel,
//         additionalData: finalPayload ? finalPayload : null,
//       };

//       console.log("finalPayload", finalPayload);
//       console.log("Data for Popup:", dataForPopup);

//       const hitToUrl = {
//         bottomRank: finalPayload.bottomRank,
//         topRank: finalPayload.topRank,
//         dimension: `${finalPayload.dimension.split(":")[0]}:${clickedLabel}`, // Manually create the new dimension with clickedLabel
//         measure: finalPayload.measure,
//         partition: finalPayload.partition,
//         includeCOGS: finalPayload.includeCOGS,
//         start_date: finalPayload.start_date,
//         end_date: finalPayload.end_date,
//         time_window: timeWindow, // Add the selected time window to the request
//       };
//       console.log("hitToUrl", hitToUrl);

//       fetchPeriodicData(hitToUrl);
//     });
//   };

//   // Fetch data based on selected payload and time window
//   const fetchPeriodicData = async (requestPayload) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestPayload),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Fetched Data:", data);
//       setFetchedData(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching periodic data:", error);
//       setFetchedData([]);
//     }
//   };

//   // Bar chart options
//   const options = {
//     onClick: handleBarClick,
//     responsive: true,
//     maintainAspectRatio: false,

//     plugins: {
//       title: { display: true, text: "" },
//       legend: { display: false },
//       datalabels: { display: false },
//     },
//     scales: {
//       x: { grid: { display: false }, ticks: { display: false } },
//       y: { beginAtZero: true, ticks: { callback: formatValue } },
//     },
//   };

//   // Dialog styles
//   const dialogStyles = {
//     width: "800px",
//     maxWidth: "90%",
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
//           <TimeWindowSelector
//             selectedTimeWindow={timeWindow}
//             onSelect={setTimeWindow}
//             onClose={() => setIsDialogOpen(false)}
//           />
//           {fetchedData.length > 0 ? (
//             <Bar
//               data={{
//                 labels: fetchedData.map((item) => item.Month || item.Quarter || item.Week),
//                 datasets: [
//                   {
//                     label: selectedBarData?.measure || "",
//                     data: fetchedData.map((item) => item[selectedBarData?.measure]),
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
//                     text: `Data for ${selectedBarData?.label || ""}`,
//                   },
//                   legend: { display: false },
//                 },
//                 scales: {
//                   x: {
//                     grid: { display: false },
//                     ticks: { callback: (value) => value.Month || value.Quarter || value.Week },
//                   },
//                   y: { beginAtZero: true, ticks: { callback: formatValue } },
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

// // TimeWindowSelector Component
// const TimeWindowSelector = ({ selectedTimeWindow, onSelect, onClose }) => {
//   const handleSelect = (e) => {
//     onSelect(e.target.value);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         gap: "8px",
//         padding: "8px",
//       }}
//     >
//       <h3 style={{ margin: 0 }}>Select Time Window</h3>
//       <select
//         onChange={handleSelect}
//         style={{ padding: "8px", fontSize: "14px", width: "120px" }}
//         value={selectedTimeWindow}
//       >
//         <option value="">Select</option>
//         <option value="W">Weekly</option>
//         <option value="M">Monthly</option>
//         <option value="Q">Quarterly</option>
//       </select>
//       <Button variant="contained" color="secondary" onClick={onClose}>
//         Close
//       </Button>
//     </div>
//   );
// };

// export default GraphScenario1Chart;

// too good
// import React, { useState, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
// } from "@mui/material";

// // Main Component
// const GraphScenario1Chart = ({ chartData, receivedPayload, index }) => {
//   const [selectedBarData, setSelectedBarData] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [fetchedData, setFetchedData] = useState([]);
//   const [timeWindow, setTimeWindow] = useState("M"); // Default time window

//   const chartRef = useRef(null);

//   // Format value for y-axis
//   const formatValue = (value) => {
//     const maxValue = Math.max(...(chartData.datasets[0]?.data || [0]));
//     if (maxValue >= 10000000) return value / 10000000;
//     if (maxValue >= 100000) return value / 100000;
//     if (maxValue >= 1000) return value / 1000;
//     return value;
//   };

//   const handleBarClick = (event) => {
//     const chart = event.chart;
//     const elements = chart.getElementsAtEventForMode(event, "nearest", { intersect: true }, false);

//     if (elements.length === 0) return;

//     elements.forEach((element) => {
//       const clickedIndex = element.index;
//       const clickedLabel = chartData.labels[clickedIndex];
//       const dimensionType = chartData.xLabel;
//       const dimensionKey = `${dimensionType}:${clickedLabel}`;

//       const correspondingPayload = receivedPayload.find(
//         (item) => item.dimension === dimensionKey
//       );

//       const finalPayload =
//         correspondingPayload ||
//         receivedPayload.find((item) => item.dimension.includes(dimensionType));

//       if (finalPayload) {
//         setSelectedBarData({
//           clickedIndex,
//           clickedLabel,
//           measure: finalPayload.measure,
//         });

//         const hitToUrl = {
//           bottomRank: finalPayload.bottomRank,
//           topRank: finalPayload.topRank,
//           dimension: `${finalPayload.dimension.split(":")[0]}:${clickedLabel}`,
//           measure: finalPayload.measure,
//           partition: finalPayload.partition,
//           includeCOGS: finalPayload.includeCOGS,
//           start_date: finalPayload.start_date,
//           end_date: finalPayload.end_date,
//           time_window: timeWindow,
//         };

//         fetchPeriodicData(hitToUrl);
//         setIsDialogOpen(true); // Open the dialog
//       }
//     });
//   };

//   const fetchPeriodicData = async (requestPayload) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestPayload),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setFetchedData(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching periodic data:", error);
//       setFetchedData([]);
//     }
//   };

//   const dialogStyles = {
//     width: "800px",
//     maxWidth: "90%",
//   };

//   return (
//     <>
//       <Bar data={chartData} options={{ onClick: handleBarClick, responsive: true, maintainAspectRatio: false }} ref={chartRef} />

//       <Dialog
//         open={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         fullWidth
//         PaperProps={{ style: dialogStyles }}
//       >
//         <DialogContent>
//           <TimeWindowSelector
//             selectedTimeWindow={timeWindow}
//             onSelect={setTimeWindow}
//             onClose={() => setIsDialogOpen(false)}
//           />

//           {fetchedData.length > 0 ? (
//             <Bar
//               data={{
//                 labels: fetchedData.map((item) => item.Month || item.Quarter || item.Week),
//                 datasets: [
//                   {
//                     label: selectedBarData?.measure || "",
//                     data: fetchedData.map((item) => item[selectedBarData?.measure]),
//                     backgroundColor: "rgba(75, 192, 192, 0.6)",
//                   },
//                 ],
//               }}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                   title: { display: true, text: `Data for ${selectedBarData?.clickedLabel || ""}` },
//                   legend: { display: false },
//                 },
//                 scales: {
//                   x: { grid: { display: false } },
//                   y: { beginAtZero: true, ticks: { callback: formatValue } },
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

// // Time Window Selector Component
// const TimeWindowSelector = ({ selectedTimeWindow, onSelect, onClose }) => {
//   const handleSelect = (e) => {
//     onSelect(e.target.value);
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px", padding: "8px" }}>
//       <h3 style={{ margin: 0 }}>Select Time Window</h3>
//       <select
//         onChange={handleSelect}
//         style={{ padding: "8px", fontSize: "14px", width: "120px" }}
//         value={selectedTimeWindow}
//       >
//         <option value="">Select</option>
//         <option value="W">Weekly</option>
//         <option value="M">Monthly</option>
//         <option value="Q">Quarterly</option>
//       </select>
//       <Button variant="contained" color="secondary" onClick={onClose}>
//         Close
//       </Button>
//     </div>
//   );
// };

// export default GraphScenario1Chart;

// finally  working...

// import React, { useState, useRef } from "react";
// import { Bar } from "react-chartjs-2";
// import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

// const GraphScenario1Chart = ({ chartData, receivedPayload, index }) => {
//   const [selectedBarData, setSelectedBarData] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [fetchedData, setFetchedData] = useState([]);
//   const [timeWindow, setTimeWindow] = useState("M"); // Default time window

//   const chartRef = useRef(null);

//   // Format value for y-axis
//   const formatValue = (value) => {
//     const maxValue = Math.max(...(chartData.datasets[0]?.data || [0]));
//     if (maxValue >= 10000000) return value / 10000000;
//     if (maxValue >= 100000) return value / 100000;
//     if (maxValue >= 1000) return value / 1000;
//     return value;
//   };

//   // Handle bar click event
//   const handleBarClick = (event, elements) => {
//     if (elements.length === 0) return;

//     const element = elements[0];
//     const clickedIndex = element.index;
//     const clickedLabel = chartData.labels[clickedIndex];
//     const dimensionType = chartData.xLabel;

//     const correspondingPayload = receivedPayload.find(
//       (item) => item.dimension === `${dimensionType}:${clickedLabel}`
//     );

//     const finalPayload = correspondingPayload || receivedPayload.find(
//       (item) => item.dimension.includes(dimensionType)
//     );

//     if (!finalPayload) {
//       console.error("No matching payload found for clicked bar.");
//       return;
//     }

//     setSelectedBarData({
//       clickedIndex,
//       clickedLabel,
//       measure: finalPayload.measure,
//       additionalData: finalPayload,
//     });

//     setIsDialogOpen(true); // Open the dialog

//     const hitToUrl = {
//       bottomRank: finalPayload.bottomRank,
//       topRank: finalPayload.topRank,
//       dimension: `${finalPayload.dimension.split(":")[0]}:${clickedLabel}`,
//       measure: finalPayload.measure,
//       partition: finalPayload.partition,
//       includeCOGS: finalPayload.includeCOGS,
//       start_date: finalPayload.start_date,
//       end_date: finalPayload.end_date,
//       time_window: timeWindow,  // Using the default time window here
//     };

//     fetchPeriodicData(hitToUrl);
//   };

//   // Fetch data based on selected payload and time window
//   const fetchPeriodicData = async (requestPayload) => {
//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestPayload),
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

//   // Handle the time window change and fetch new data immediately
//   const handleTimeWindowChange = (newTimeWindow) => {
//     setTimeWindow(newTimeWindow);

//     if (selectedBarData) {
//       const hitToUrl = {
//         bottomRank: selectedBarData.additionalData.bottomRank,
//         topRank: selectedBarData.additionalData.topRank,
//         dimension: `${selectedBarData.additionalData.dimension.split(":")[0]}:${selectedBarData.clickedLabel}`,
//         measure: selectedBarData.additionalData.measure,
//         partition: selectedBarData.additionalData.partition,
//         includeCOGS: selectedBarData.additionalData.includeCOGS,
//         start_date: selectedBarData.additionalData.start_date,
//         end_date: selectedBarData.additionalData.end_date,
//         time_window: newTimeWindow,  // New time window is set here
//       };

//       fetchPeriodicData(hitToUrl);
//     }
//   };

//   // Bar chart options
//   const options = {
//     onClick: (event, elements) => handleBarClick(event, elements),
//     responsive: true,
//     maintainAspectRatio: false,

//     plugins: {
//       title: { display: true, text: "" },
//       legend: { display: false },
//       datalabels: { display: false },
//     },
//     scales: {
//       x: { grid: { display: false }, ticks: { display: false } },
//       y: { beginAtZero: true, ticks: { callback: formatValue } },
//     },
//   };

//   // Dialog styles
//   const dialogStyles = {
//     width: "800px",
//     maxWidth: "90%",
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
//           {/* <TimeWindowSelector
//             selectedTimeWindow={timeWindow}
//             onSelect={handleTimeWindowChange}  // Handle time window change here
//             onClose={() => setIsDialogOpen(false)}
//           /> */}
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
//                 labels: fetchedData.map((item) => item.Month || item.Quarter || item.Week || "Unknown"),
//                 datasets: [
//                   {
//                     label: selectedBarData?.measure || "Data",
//                     data: fetchedData.map((item) => item[selectedBarData?.measure] || 0),
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
//                     text: `Data for ${selectedBarData?.clickedLabel || "Unknown"}`,
//                   },
//                   legend: { display: false },
//                 },
//                 scales: {
//                   x: {
//                     grid: { display: false },
//                     ticks: { callback: (value) => value },
//                   },
//                   y: { beginAtZero: true, ticks: { callback: formatValue } },
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

// // TimeWindowSelector Component
// // const TimeWindowSelector = ({ selectedTimeWindow, onSelect, onClose }) => {
// //   const handleSelect = (e) => {
// //     onSelect(e.target.value);
// //   };

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "flex-start",
// //         gap: "8px",
// //         padding: "8px",
// //       }}
// //     >
// //       <h3 style={{ margin: 0 }}>Select Time Window</h3>
// //       <select
// //         onChange={handleSelect}
// //         style={{ padding: "8px", fontSize: "14px", width: "120px" }}
// //         value={selectedTimeWindow}
// //       >
// //         <option value="W">Weekly</option>
// //         <option value="M">Monthly</option>
// //         <option value="Q">Quarterly</option>
// //       </select>
// //       <Button variant="contained" color="secondary" onClick={onClose}>
// //         Close
// //       </Button>
// //     </div>
// //   );
// // };

// export default GraphScenario1Chart;

import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import "chartjs-plugin-datalabels"; // Ensure the plugin is imported

const GraphScenario1Chart = ({ chartData, receivedPayload, index }) => {
  const [selectedBarData, setSelectedBarData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [timeWindow, setTimeWindow] = useState("M"); // Default time window

  const chartRef = useRef(null);

  // Format value for y-axis
  const formatValue = (value) => {
    const maxValue = Math.max(...(chartData.datasets[0]?.data || [0]));
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

  // Handle bar click event
  const handleBarClick = (event, elements) => {
    if (elements.length === 0) return;

    const element = elements[0];
    const clickedIndex = element.index;
    const clickedLabel = chartData.labels[clickedIndex];
    const dimensionType = chartData.xLabel;

    const correspondingPayload = receivedPayload.find(
      (item) => item.dimension === `${dimensionType}:${clickedLabel}`
    );

    const finalPayload =
      correspondingPayload ||
      receivedPayload.find((item) => item.dimension.includes(dimensionType));

    if (!finalPayload) {
      console.error("No matching payload found for clicked bar.");
      return;
    }

    setSelectedBarData({
      clickedIndex,
      clickedLabel,
      measure: finalPayload.measure,
      additionalData: finalPayload,
    });

    setIsDialogOpen(true); // Open the dialog

    // Fetch initial data right away when the dialog opens
    const hitToUrl = {
      bottomRank: finalPayload.bottomRank,
      topRank: finalPayload.topRank,
      dimension: `${finalPayload.dimension.split(":")[0]}:${clickedLabel}`,
      measure: finalPayload.measure,
      partition: finalPayload.partition,
      includeCOGS: finalPayload.includeCOGS,
      start_date: finalPayload.start_date,
      end_date: finalPayload.end_date,
      time_window: timeWindow, // Using the default time window here
    };

    fetchPeriodicData(hitToUrl);
  };

  // Handle the time window change and fetch new data immediately
  const handleTimeWindowChange = (newTimeWindow) => {
    setTimeWindow(newTimeWindow);

    if (selectedBarData) {
      const hitToUrl = {
        bottomRank: selectedBarData.additionalData.bottomRank,
        topRank: selectedBarData.additionalData.topRank,
        dimension: `${selectedBarData.additionalData.dimension.split(":")[0]}:${
          selectedBarData.clickedLabel
        }`,
        measure: selectedBarData.additionalData.measure,
        partition: selectedBarData.additionalData.partition,
        includeCOGS: selectedBarData.additionalData.includeCOGS,
        start_date: selectedBarData.additionalData.start_date,
        end_date: selectedBarData.additionalData.end_date,
        time_window: newTimeWindow, // New time window is set here
      };

      fetchPeriodicData(hitToUrl);
    }
  };

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
            <h3>Data for {selectedBarData?.clickedLabel || "Unknown"}</h3>
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
          {fetchedData.length > 0 ? (
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

