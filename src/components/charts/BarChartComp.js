import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, Grid, DialogTitle, DialogContent } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { BsArrowsFullscreen } from "react-icons/bs";
import { Chart } from "chart.js/auto";

// Registering the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChartComp({ chartData, title }) {
  const [loading, setLoading] = useState(false);
  const [showStackedPopupChart, setStackedShowPopupChart] = useState(false);

  const handleChartDoubleClick = () => {
    setStackedShowPopupChart(true);
  };

  let titleText = title;
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

      if (maxValue >= 10000000) {
        titleText += " (in Crores)";
      } else if (maxValue >= 100000) {
        titleText += " (in Lakhs)";
      } else if (maxValue >= 1000) {
        titleText += " (in Thousands)";
      }
    } else {
      console.log("Data is empty.");
    }
  } else {
    console.log("chartData or its datasets are not properly initialized.");
  }
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [chartData]);
  return (
    <>
      {loading || !chartData?.datasets?.length || !chartData?.datasets[0].data?.length ? (
        <div
          style={{
            position: "relative",
            minHeight: "200px",
            marginLeft: "40%",
            alignContent: "center",
          }}
        >
          <BeatLoader color="#36D7B7" loading={true} size={10} />
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", right: 0 }}>
                <IconButton onClick={handleChartDoubleClick} size="small">
                  <BsArrowsFullscreen style={{ fontSize: "1.5rem" }} />
                </IconButton>
              </div>
              <div>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: titleText,
                      },
                      // tooltip: {
                      //   callbacks: {
                      //     label: function (context) {
                      //       debugger;
                      //       if (context.dataset.label != "") {
                      //         return (
                      //           "Sales Amount: " + context.dataset.salesData[context.dataIndex]
                      //         );
                      //       } else {
                      //         return "";
                      //       }
                      //     },
                      //   },
                      //   //position: "myCustomPositioner",
                      // },
                      //Ankita
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            // Ensure dataset and salesData are defined
                            const dataset = context.dataset;
                            const dataIndex = context.dataIndex;

                            // Check if dataset is defined and has salesData
                            if (
                              dataset &&
                              dataset.salesData &&
                              dataset.salesData[dataIndex] !== undefined
                            ) {
                              return `Sales Amount: ${dataset.salesData[dataIndex]}`;
                            } else {
                              return "Sales Amount: N/A"; // Provide a default value if data is missing
                            }
                          },
                        },
                      },

                      legend: {
                        display: chartData.datasets[1].ledgend > 0,
                        onClick: () => {},
                        labels: {
                          generateLabels: function (chart) {
                            var labels = [];

                            // Sales Down Legend Item
                            labels.push({
                              text: "Sales Decrease",
                              fillStyle: "#ff4d4d",
                              hidden: false,
                              index: 1,
                              lineWidth: 0,
                            });

                            // Sales Up Legend Item
                            labels.push({
                              text: "Sales Increase",
                              fillStyle: "#66d9ff",
                              hidden: false,
                              index: 0,
                              lineWidth: 0,
                            });

                            return labels;
                          },
                        },
                      },
                    },
                    layout: {
                      padding: {
                        left: 10,
                        right: 10,
                        // top: 10,
                        // bottom: 10,
                      },
                    },

                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                        ticks: {
                          callback: formatValue,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            {/* MuiDialogContent-root */}
            <Dialog
              open={showStackedPopupChart}
              onClose={() => setStackedShowPopupChart(false)}
              maxWidth="lg"
              fullWidth={true} // Ensure it takes the full width up to the max
              sx={{
                "& .MuiDialog-paper": { maxWidth: "80%", width: "80%" },
                "& .MuiDialogContent-root": {
                  overflow: "hidden",
                },
              }}
            >
              <DialogContent>
                <PopupChart
                  chartData={chartData}
                  title={titleText}
                  onClose={() => setStackedShowPopupChart(false)}
                />
                <IconButton
                  aria-label="close"
                  onClick={() => setStackedShowPopupChart(false)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      )}
    </>
  );
}

function Modal({ children }) {
  return (
    <div className="modal">
      <div className="modal-content">{children}</div>
    </div>
  );
}

function PopupChart({ chartData, title, onClose }) {
  React.useEffect(() => {
    const ctx = document.getElementById("popup-chart").getContext("2d");
    new ChartJS(ctx, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                debugger;
                if (context.dataset.label === "Margin Trend Analysis") {
                  return "Sales Amount: " + context.dataset.salesData[context.dataIndex];
                } else {
                  return "";
                }
              },
            },
          },
          legend: {
            display: chartData.datasets[1].ledgend > 0,
            onClick: () => {},
            labels: {
              generateLabels: function (chart) {
                var labels = [];

                // Sales Down Legend Item
                labels.push({
                  text: "Sales Down",
                  fillStyle: "#ff4d4d",
                  hidden: false,
                  index: 1,
                  lineWidth: 0,
                });

                // Sales Up Legend Item
                labels.push({
                  text: "Sales Up",
                  fillStyle: "#66d9ff",
                  hidden: false,
                  index: 0,
                  lineWidth: 0,
                });

                return labels;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: (value, index, values) => {
                if (value >= 10000000) {
                  return value / 10000000;
                } else if (value >= 100000) {
                  return value / 100000;
                } else if (value >= 1000) {
                  return value / 1000;
                } else {
                  return value.toFixed(2);
                }
              },
            },
          },
        },
      },
    });
  }, [chartData]);

  return (
    <div className="popup-chart">
      <canvas id="popup-chart"></canvas>
    </div>
  );
}





// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { Dialog, Grid, DialogContent } from "@mui/material";
// import { BeatLoader } from "react-spinners";
// import { BsArrowsFullscreen } from "react-icons/bs";

// // Register Chart.js components and ChartDataLabels plugin
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartDataLabels
// );

// const formatValue = (value) => {
//   if (value >= 10000000) {
//     return (value / 10000000).toFixed(2) + " Cr";
//   } else if (value >= 100000) {
//     return (value / 100000).toFixed(2) + " L";
//   } else if (value >= 1000) {
//     return (value / 1000).toFixed(2) + " K";
//   } else {
//     return value.toFixed(2);
//   }
// };

// export default function BarChartComp({ chartData, title }) {
//   const [loading, setLoading] = useState(false);
//   const [showStackedPopupChart, setStackedShowPopupChart] = useState(false);

//   const handleChartDoubleClick = () => {
//     setStackedShowPopupChart(true);
//   };

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   }, [chartData]);

//   return (
//     <>
//       {loading || !chartData?.datasets?.length || !chartData?.datasets[0]?.data?.length ? (
//         <div style={{ position: "relative", minHeight: "200px", marginLeft: "40%", alignContent: "center" }}>
//           <BeatLoader color="#36D7B7" loading={true} size={10} />
//         </div>
//       ) : (
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <div style={{ position: "relative" }}>
//               <div style={{ position: "absolute", right: 0 }}>
//                 <IconButton onClick={handleChartDoubleClick} size="small">
//                   <BsArrowsFullscreen style={{ fontSize: "1.5rem" }} />
//                 </IconButton>
//               </div>
//               <div>
//                 <Bar
//                   data={chartData}
//                   options={{
//                     responsive: true,
//                     plugins: {
//                       title: {
//                         display: true,
//                         text: title,
//                       },
//                       tooltip: {
//                         callbacks: {
//                           label: function (context) {
//                             // Return the raw value for the tooltip
//                             return `Sales Amount: ${context.raw}`;
//                           },
//                         },
//                       },
//                       datalabels: {
//                         color: "black",
//                         anchor: "end",
//                         align: "top",
//                         formatter: (value) => formatValue(value), // Format values displayed on bars
//                         font: {
//                           weight: "bold",
//                         },
//                       },
//                       legend: {
//                         display: chartData.datasets[1]?.ledgend > 0,
//                         onClick: () => {},
//                         labels: {
//                           generateLabels: function (chart) {
//                             return [
//                               {
//                                 text: "Sales Decrease",
//                                 fillStyle: "#ff4d4d",
//                                 hidden: false,
//                                 index: 1,
//                                 lineWidth: 0,
//                               },
//                               {
//                                 text: "Sales Increase",
//                                 fillStyle: "#66d9ff",
//                                 hidden: false,
//                                 index: 0,
//                                 lineWidth: 0,
//                               },
//                             ];
//                           },
//                         },
//                       },
//                     },
//                     scales: {
//                       x: {
//                         stacked: true,
//                       },
//                       y: {
//                         stacked: true,
//                         ticks: {
//                           callback: (value) => formatValue(value), // Format y-axis ticks
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </Grid>
//           <Grid item xs={12}>
//             <Dialog
//               open={showStackedPopupChart}
//               onClose={() => setStackedShowPopupChart(false)}
//               maxWidth="lg"
//               fullWidth={true}
//               sx={{
//                 "& .MuiDialog-paper": { maxWidth: "80%", width: "80%" },
//                 "& .MuiDialogContent-root": {
//                   overflow: "hidden",
//                 },
//               }}
//             >
//               <DialogContent>
//                 <PopupChart
//                   chartData={chartData}
//                   title={title}
//                   onClose={() => setStackedShowPopupChart(false)}
//                 />
//                 <IconButton
//                   aria-label="close"
//                   onClick={() => setStackedShowPopupChart(false)}
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     right: 0,
//                   }}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </DialogContent>
//             </Dialog>
//           </Grid>
//         </Grid>
//       )}
//     </>
//   );
// }

// function PopupChart({ chartData, title, onClose }) {
//   useEffect(() => {
//     const ctx = document.getElementById("popup-chart").getContext("2d");
//     new ChartJS(ctx, {
//       type: "bar",
//       data: chartData,
//       options: {
//         responsive: true,
//         plugins: {
//           title: {
//             display: true,
//             text: title,
//           },
//           tooltip: {
//             callbacks: {
//               label: function (context) {
//                 // Return the raw value for the tooltip
//                 return `Sales Amount: ${context.raw}`;
//               },
//             },
//           },
//           datalabels: {
//             color: "black",
//             anchor: "end",
//             align: "top",
//             formatter: (value) => formatValue(value), // Format values displayed on bars
//             font: {
//               weight: "bold",
//             },
//           },
//           legend: {
//             display: chartData.datasets[1]?.ledgend > 0,
//             onClick: () => {},
//             labels: {
//               generateLabels: function (chart) {
//                 return [
//                   {
//                     text: "Sales Down",
//                     fillStyle: "#ff4d4d",
//                     hidden: false,
//                     index: 1,
//                     lineWidth: 0,
//                   },
//                   {
//                     text: "Sales Up",
//                     fillStyle: "#66d9ff",
//                     hidden: false,
//                     index: 0,
//                     lineWidth: 0,
//                   },
//                 ];
//               },
//             },
//           },
//         },
//         scales: {
//           x: {
//             stacked: true,
//           },
//           y: {
//             stacked: true,
//             ticks: {
//               callback: (value) => formatValue(value), // Format y-axis ticks
//             },
//           },
//         },
//       },
//     });
//   }, [chartData, title]);

//   return <canvas id="popup-chart" />;
// }

// // import React, { useState, useEffect } from "react";
// // import { Bar } from "react-chartjs-2";
// // import ChartDataLabels from "chartjs-plugin-datalabels";
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Title,
// //   Tooltip,
// //   Legend,
// // } from "chart.js";
// // import { IconButton } from "@mui/material";
// // import CloseIcon from "@mui/icons-material/Close";
// // import { Dialog, Grid, DialogTitle, DialogContent } from "@mui/material";
// // import { BeatLoader } from "react-spinners";
// // import { BsArrowsFullscreen } from "react-icons/bs";
// // import { Chart } from "chart.js/auto";

// // // Registering the required Chart.js components
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // export default function BarChartComp({ chartData, title }) {
// //   const [loading, setLoading] = useState(false);
// //   const [showStackedPopupChart, setStackedShowPopupChart] = useState(false);

// //   const handleChartDoubleClick = () => {
// //     setStackedShowPopupChart(true);
// //   };

// //   let titleText = title;
// //   let formatValue;
// //   if (chartData && chartData.datasets && chartData.datasets.length > 0) {
// //     const data = chartData.datasets[0].data;

// //     if (data && data.length > 0) {
// //       let maxValue = Math.max(...data);
// //       formatValue = (value) => {
// //         if (maxValue >= 10000000) {
// //           return (value / 10000000).toFixed(2) + " Cr";
// //         } else if (maxValue >= 100000) {
// //           return (value / 100000).toFixed(2) + " L";
// //         } else if (maxValue >= 1000) {
// //           return (value / 1000).toFixed(2) + " K";
// //         } else {
// //           return value.toFixed(2);
// //         }
// //       };

// //       if (maxValue >= 10000000) {
// //         titleText += " (in Crores)";
// //       } else if (maxValue >= 100000) {
// //         titleText += " (in Lakhs)";
// //       } else if (maxValue >= 1000) {
// //         titleText += " (in Thousands)";
// //       }
// //     } else {
// //       console.log("Data is empty.");
// //     }
// //   } else {
// //     console.log("chartData or its datasets are not properly initialized.");
// //   }

// //   useEffect(() => {
// //     setLoading(true);
// //     setTimeout(() => {
// //       setLoading(false);
// //     }, 1000);
// //   }, [chartData]);

// //   return (
// //     <>
// //       {loading || !chartData?.datasets?.length || !chartData?.datasets[0].data?.length ? (
// //         <div
// //           style={{
// //             position: "relative",
// //             minHeight: "200px",
// //             marginLeft: "40%",
// //             alignContent: "center",
// //           }}
// //         >
// //           <BeatLoader color="#36D7B7" loading={true} size={10} />
// //         </div>
// //       ) : (
// //         <Grid container spacing={2}>
// //           <Grid item xs={12}>
// //             <div style={{ position: "relative" }}>
// //               <div style={{ position: "absolute", right: 0 }}>
// //                 <IconButton onClick={handleChartDoubleClick} size="small">
// //                   <BsArrowsFullscreen style={{ fontSize: "1.5rem" }} />
// //                 </IconButton>
// //               </div>
// //               <div>
// //                 <Bar
// //                   data={chartData}
// //                   options={{
// //                     responsive: true,
// //                     plugins: {
// //                       title: {
// //                         display: true,
// //                         text: titleText,
// //                       },
// //                       tooltip: {
// //                         callbacks: {
// //                           label: function (context) {
// //                             const dataset = context.dataset;
// //                             const dataIndex = context.dataIndex;
// //                             if (dataset && dataset.data[dataIndex] !== undefined) {
// //                               return `Value: ${dataset.data[dataIndex]}`;
// //                             } else {
// //                               return "Value: N/A";
// //                             }
// //                           },
// //                         },
// //                       },
// //                       datalabels: {
// //                         display: true,
// //                         formatter: (value) => {
// //                           // Show only if value is not 0 or N/A
// //                           return (value !== 0 && value !== null) ? value.toFixed(2) : '';
// //                         },
// //                         color: '#000',
// //                         anchor: 'end',
// //                         align: 'top',
// //                       },
// //                       legend: {
// //                         display: chartData.datasets[1].legend > 0,
// //                         onClick: () => {},
// //                         labels: {
// //                           generateLabels: function (chart) {
// //                             var labels = [];

// //                             // Sales Down Legend Item
// //                             labels.push({
// //                               text: "Sales Down",
// //                               fillStyle: "#ff4d4d",
// //                               hidden: false,
// //                               index: 1,
// //                               lineWidth: 0,
// //                             });

// //                             // Sales Up Legend Item
// //                             labels.push({
// //                               text: "Sales Up",
// //                               fillStyle: "#66d9ff",
// //                               hidden: false,
// //                               index: 0,
// //                               lineWidth: 0,
// //                             });

// //                             return labels;
// //                           },
// //                         },
// //                       },
// //                     },
// //                     layout: {
// //                       padding: {
// //                         left: 10,
// //                         right: 10,
// //                       },
// //                     },
// //                     scales: {
// //                       x: {
// //                         stacked: true,
// //                       },
// //                       y: {
// //                         stacked: true,
// //                         ticks: {
// //                           callback: formatValue,
// //                         },
// //                       },
// //                     },
// //                   }}
// //                 />
// //               </div>
// //             </div>
// //           </Grid>
// //           <Grid item xs={12}>
// //             <Dialog
// //               open={showStackedPopupChart}
// //               onClose={() => setStackedShowPopupChart(false)}
// //               maxWidth="lg"
// //               fullWidth={true}
// //               sx={{
// //                 "& .MuiDialog-paper": { maxWidth: "80%", width: "80%" },
// //                 "& .MuiDialogContent-root": {
// //                   overflow: "hidden",
// //                 },
// //               }}
// //             >
// //               <DialogContent>
// //                 <PopupChart
// //                   chartData={chartData}
// //                   title={titleText}
// //                   onClose={() => setStackedShowPopupChart(false)}
// //                 />
// //                 <IconButton
// //                   aria-label="close"
// //                   onClick={() => setStackedShowPopupChart(false)}
// //                   sx={{
// //                     position: "absolute",
// //                     top: 0,
// //                     right: 0,
// //                   }}
// //                 >
// //                   <CloseIcon />
// //                 </IconButton>
// //               </DialogContent>
// //             </Dialog>
// //           </Grid>
// //         </Grid>
// //       )}
// //     </>
// //   );
// // }

// // function PopupChart({ chartData, title, onClose }) {
// //   React.useEffect(() => {
// //     const ctx = document.getElementById("popup-chart").getContext("2d");
// //     new ChartJS(ctx, {
// //       type: "bar",
// //       data: chartData,
// //       options: {
// //         responsive: true,
// //         plugins: {
// //           title: {
// //             display: true,
// //             text: title,
// //           },
// //           tooltip: {
// //             callbacks: {
// //               label: function (context) {
// //                 if (context.dataset && context.dataset.data[context.dataIndex] !== undefined) {
// //                   return `Value: ${context.dataset.data[context.dataIndex]}`;
// //                 } else {
// //                   return "Value: N/A";
// //                 }
// //               },
// //             },
// //           },
// //           datalabels: {
// //             display: true,
// //             formatter: (value) => {
// //               return (value !== 0 && value !== null) ? value.toFixed(2) : '';
// //             },
// //             color: '#000',
// //             anchor: 'end',
// //             align: 'top',
// //           },
// //           legend: {
// //             display: chartData.datasets[1].legend > 0,
// //             onClick: () => {},
// //             labels: {
// //               generateLabels: function (chart) {
// //                 var labels = [];

// //                 // Sales Down Legend Item
// //                 labels.push({
// //                   text: "Sales Down",
// //                   fillStyle: "#ff4d4d",
// //                   hidden: false,
// //                   index: 1,
// //                   lineWidth: 0,
// //                 });

// //                 // Sales Up Legend Item
// //                 labels.push({
// //                   text: "Sales Up",
// //                   fillStyle: "#66d9ff",
// //                   hidden: false,
// //                   index: 0,
// //                   lineWidth: 0,
// //                 });

// //                 return labels;
// //               },
// //             },
// //           },
// //         },
// //         scales: {
// //           x: {
// //             stacked: true,
// //           },
// //           y: {
// //             stacked: true,
// //             ticks: {
// //               callback: (value) => {
// //                 if (value >= 10000000) {
// //                   return (value / 10000000).toFixed(2) + " Cr";
// //                 } else if (value >= 100000) {
// //                   return (value / 100000).toFixed(2) + " L";
// //                 } else if (value >= 1000) {
// //                   return (value / 1000).toFixed(2) + " K";
// //                 } else {
// //                   return value.toFixed(2);
// //                 }
// //               },
// //             },
// //           },
// //         },
// //       },
// //     });
// //   }, [chartData]);

// //   return (
// //     <div className="popup-chart">
// //       <canvas id="popup-chart" />
// //     </div>
// //   );
// // }
