// import React, { useState } from "react";
// import CanvasJSReact from "@canvasjs/react-charts";

// const { CanvasJSChart } = CanvasJSReact;

// export default function CanvasWaterfallChart({ chartData, title }) {
//   const [isPopUpOpen, setIsPopUpOpen] = useState(false);
//   const [popupOptions, setPopupOptions] = useState(null);

//   const options = {
//     animationEnabled: true,
//     title: {
//       text: title,
//       fontFamily: "Helvetica Neue",

//       fontSize: 12,
//     },
//     axisX: {
//       title: "",

//       titleFontColor: "#737474", // Set X axis title color
//       titleFontSize: 12, // Set X axis title font size
//       labelFontColor: "#737474", // Set X axis label color

//       gridColor: "#e0e1e2",
//       fontFamily: "Helvetica Neue",
//     },
//     axisY: {
//       title: "",
//       titleFontColor: "#737474", // Set X axis title color
//       titleFontSize: 12, // Set X axis title font size
//       labelFontColor: "#737474", // Set X axis label color

//       gridColor: "#e0e1e2",
//       fontFamily: "Helvetica Neue",
//     },
//     height: 250,
//     backgroundColor: "transparent",
//     zoomEnabled: true,
//     data: [
//       {
//         type: "waterfall",
//         dataPoints: chartData,
//       },
//     ],
//   };

//   const handleChartDoubleClick = (dataPoint) => {
//     // Extract data from dataPoint for popup chart
//     const newPopupOptions = {
//       animationEnabled: true,
//       title: {
//         text: title,
//         fontFamily: "Arial",
//         fontSize: 16,
//       },
//       axisX: {
//         title: "",
//         interval: 1,
//         titleFontColor: "red", // Set X axis title color
//         titleFontSize: 12, // Set X axis title font size
//         labelFontColor: "#909191", // Set X axis label color
//         labelFontSize: 10, // Set X axis label font size
//       },
//       axisY: {
//         title: "",
//         labelFontColor: "#909191",
//         fontSize: 12,
//       },
//       zoomEnabled: true,
//       data: [
//         {
//           type: "waterfall",
//           dataPoints: chartData,
//         },
//       ],
//     };
//     setPopupOptions(newPopupOptions);
//     setIsPopUpOpen(true);
//   };

//   const handleClosePopUp = (e) => {
//     if (e.target.className !== "popup") {
//       setIsPopUpOpen(false);
//       setPopupOptions(null); // Reset popup options on close
//     }
//   };

//   return (
//     <div>
//       <div onDoubleClick={handleChartDoubleClick}>
//         <CanvasJSChart options={options} />
//       </div>
//       {isPopUpOpen && (
//         <div className="popup" onClick={handleClosePopUp}>
//           {/* Your pop-up content goes here */}

//           {popupOptions && popupOptions.data[0].dataPoints && (
//             <CanvasJSChart options={popupOptions} />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
