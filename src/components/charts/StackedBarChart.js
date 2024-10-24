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
// import CloseIcon from "@mui/icons-material/Close";
// import { Dialog, Grid, DialogTitle, DialogContent, IconButton } from "@mui/material";
// import { BeatLoader } from "react-spinners";
// import { BsArrowsFullscreen } from "react-icons/bs";

// // Registering the required Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function StackedBarChart({ chartData, title }) {
//   const [showLoader, setShowLoader] = useState(true);
//   const [showStackedPopupChart, setStackedShowPopupChart] = useState(false);
//   const [loading, setLoading] = useState(false);

//   console.log(chartData, "chartDatas22222222222");

//   const handleChartDoubleClick = () => {
//     setStackedShowPopupChart(true);
//   };
//   let titleText = title;
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

//       if (maxValue >= 10000000) {
//         // titleText += " (in Crores)";
//       } else if (maxValue >= 100000) {
//         // titleText += " (in Lakhs)";
//       } else if (maxValue >= 1000) {
//         // titleText += " (in Thousands)";
//       }
//     } else {
//       console.log("Data is empty.");
//     }
//   } else {
//     console.log("chartData or its datasets are not properly initialized.");
//   }
//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   }, [chartData]);
//   return (
//     <>
//       {loading || !chartData?.datasets?.length || !chartData?.datasets[0].data?.length > 0 ? (
//         <div
//           style={{
//             position: "relative",
//             minHeight: "222px",
//             marginLeft: "40%",
//             alignContent: "center",
//           }}
//         >
//           <BeatLoader color="#36D7B7" loading={true} size={10} />
//         </div>
//       ) : (
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <div style={{ position: "relative" }}>
//               <div style={{ position: "absolute", right: 0 }}>
//                 <IconButton onClick={handleChartDoubleClick}>
//                   <BsArrowsFullscreen />
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
//                         text: titleText,
//                       },
//                       // legend: {
//                       //   display: chartData.legendVisible > 0,
//                       // },
//                       legend: {
//                         display: false, // Set legend to false
//                       },
//                     },
//                     layout: {
//                       padding: {
//                         left: 10,
//                         right: 10,
//                         // top: 10,
//                         // bottom: 10,
//                       },
//                     },
//                     scales: {
//                       x: {
//                         stacked: true,
//                       },
//                       y: {
//                         stacked: true,
//                         ticks: {
//                           callback: formatValue,
//                         },

//                       },
//                     },
//                   }}
//                   getElementAtEvent={() => setShowLoader(false)}
//                 />

//               </div>
//             </div>
//           </Grid>
//           <Grid item xs={12}>
//             <Dialog
//               open={showStackedPopupChart}
//               onClose={() => setStackedShowPopupChart(false)}
//               maxWidth="lg"
//               fullWidth={true} // Ensure it takes the full width up to the max
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
//                   title={titleText}
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

// function Modal({ children }) {
//   return (
//     <div className="modal">
//       <div className="modal-content">{children}</div>
//     </div>
//   );
// }

// function PopupChart({ chartData, title, onClose }) {
//   React.useEffect(() => {
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
//           // legend: {
//           //   display: chartData.legendVisible > 0,
//           // },
//           legend: {
//             display: true, // Set legend to false
//           },
//         },
//         scales: {
//           x: {
//             stacked: true,
//           },
//           y: {
//             stacked: true,
//             ticks: {
//               callback: (value, index, values) => {
//                 if (value >= 10000000) {
//                   return value / 10000000;
//                 } else if (value >= 100000) {
//                   return value / 100000;
//                 } else if (value >= 1000) {
//                   return value / 1000;
//                 } else {
//                   return value.toFixed(2);
//                 }
//               },
//             },
//           },
//         },
//       },
//     });
//   }, [chartData]);

//   return (
//     <div className="popup-chart">
//       <canvas id="popup-chart"></canvas>
//     </div>
//   );
// }

// // okok value works

import React, { useState, useEffect, useRef } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, Grid, DialogTitle, DialogContent, IconButton,Typography } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { BsArrowsFullscreen } from "react-icons/bs";

// Registering the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function StackedBarChart({ chartData, title,startDate, endDate }) {
  const chartRef = useRef(null);

  useEffect(() => {
    // Cleanup on component unmount or re-render to avoid "canvas already in use" error
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the chart instance
      }
    };
  }, [chartData]); // Re-run this effect when chartData changes

  const [showLoader, setShowLoader] = useState(true);
  const [showStackedPopupChart, setStackedShowPopupChart] = useState(false);
  const [loading, setLoading] = useState(false);

  let titleText = title;
  // let formatValue;
  // if (chartData && chartData.datasets && chartData.datasets.length > 0) {
  //   const data = chartData.datasets[0].data;

  //   if (data && data.length > 0) {
  //     let maxValue = Math.max(...data);
  //     formatValue = (value) => {
  //       if (maxValue >= 10000000) {
  //         return value / 10000000;
  //       } else if (maxValue >= 100000) {
  //         return value / 100000;
  //       } else if (maxValue >= 1000) {
  //         return value / 1000;
  //       } else {
  //         return value;
  //       }
  //     };

  //     if (maxValue >= 10000000) {
  //       // titleText += " (in Crores)";
  //     } else if (maxValue >= 100000) {
  //       // titleText += " (in Lakhs)";
  //     } else if (maxValue >= 1000) {
  //       // titleText += " (in Thousands)";
  //     }
  //   } else {
  //     console.log("Data is empty.");
  //   }
  // } else {
  //   console.log("chartData or its datasets are not properly initialized.");
  // }

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
        // titleText += " (in Crores)";
      } else if (maxValue >= 100000) {
        // titleText += " (in Lakhs)";
      } else if (maxValue >= 1000) {
        // titleText += " (in Thousands)";
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

  const getCosValue = (label, index) => {
    const cogsDataset = chartData.datasets.find((d) => d.label === label);
    return cogsDataset ? cogsDataset.data[index] : 0;
  };

  const dataLabels = {
    display: true,
    formatter: (value, context) => {
      const index = context.dataIndex;
      const datasetLabel = context.dataset.label;
      let cogsValue = 0;

      if (datasetLabel.includes("Materials Cost (Current Year)")) {
        cogsValue = getCosValue("Materials Cost Cogs (Current Year)", index);
      } else if (datasetLabel.includes("Supplies Cost (Current Year)")) {
        cogsValue = getCosValue("Supplies Cost Cogs (Current Year)", index);
      } else if (datasetLabel.includes("Materials Cost (Previous Year)")) {
        cogsValue = getCosValue("Materials Cost Cogs (Previous Year)", index);
      } else if (datasetLabel.includes("Supplies Cost (Previous Year)")) {
        cogsValue = getCosValue("Supplies Cost Cogs (Previous Year)", index);
      }

      // return cogsValue ? `${cogsValue.toFixed(1)}` : "";
      return cogsValue ? `${cogsValue}%` : "";
    },
    color: "#0000cc",
    anchor: "center",
    align: "center",
    rotation: -90,
    offset: 120,
    padding: 2,
    font: {
      size: 8,
    },
  };

  return (
    <>
      {loading || !chartData?.datasets?.length || !chartData?.datasets[0].data?.length > 0 ? (
        <div
          style={{
            position: "relative",
            minHeight: "222px",
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
                <IconButton onClick={() => setStackedShowPopupChart(true)}>
                  <BsArrowsFullscreen />
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
                        text: title,
                      },
                      legend: {
                        display: false,
                        filter: (item) => item.dataset && !item.dataset.hidden,

                      },
                      datalabels: dataLabels,
                    },
                    layout: {
                      padding: {
                        left: 10,
                        right: 10,
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
                    elements: {
                      bar: {
                        // borderRadius: 3, // Optional: rounded corners
                      },
                    },
                  }}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Dialog
              open={showStackedPopupChart}
              onClose={() => setStackedShowPopupChart(false)}
              maxWidth="lg"
              fullWidth={true}
              sx={{
                "& .MuiDialog-paper": { maxWidth: "80%", width: "80%" },
                "& .MuiDialogContent-root": {
                  overflow: "hidden",
                },
              }}
            >
              <DialogContent>
              <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Start Date: {startDate} &nbsp;&nbsp; End Date: {endDate}
                  </Typography>
                <PopupChart
                  chartData={chartData}
                  title={title}
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

// function PopupChart({ chartData, title, onClose }) {
//   const chartRef = useRef(null);

//   const getCosValue = (label, index) => {
//     const cosDataset = chartData.datasets.find((d) => d.label === label);
//     return cosDataset ? cosDataset.data[index] : 0;
//   };
//   const dataLabels = {
//     display: true,
//     formatter: (value, context) => {
//       const index = context.dataIndex;
//       const datasetLabel = context.dataset.label;
//       let cogsValue = 0;

//       if (datasetLabel.includes("Materials Cost (Current Year)")) {
//         cogsValue = getCosValue("Materials Cost Cogs (Current Year)", index);
//       } else if (datasetLabel.includes("Supplies Cost (Current Year)")) {
//         cogsValue = getCosValue("Supplies Cost Cogs (Current Year)", index);
//       } else if (datasetLabel.includes("Materials Cost (Previous Year)")) {
//         cogsValue = getCosValue("Materials Cost Cogs (Previous Year)", index);
//       } else if (datasetLabel.includes("Supplies Cost (Previous Year)")) {
//         cogsValue = getCosValue("Supplies Cost Cogs (Previous Year)", index);
//       }

//       // return cogsValue ? `${cogsValue.toFixed(1)}` : "";
//       return cogsValue ? `${cogsValue}%` : "";
//     },
//     color: "#0000cc",
//     anchor: "center",
//     align: "center",
//     rotation: -90,
//     offset: 120,
//     padding: 2,
//     font: {
//       size: 12,
//     },
//   };

//   useEffect(() => {
//     const ctx = document.getElementById("popup-chart").getContext("2d");

//     // If there is an existing chart instance, destroy it before creating a new one
//     if (chartRef.current) {
//       chartRef.current.destroy();
//     }

//     // Create a new chart instance and store it in the ref
//     chartRef.current = new ChartJS(ctx, {
//       type: "bar",
//       data: chartData,
//       options: {
//         responsive: true,
//         plugins: {
//           title: {
//             display: true,
//             text: title,
//           },
//           legend: {
//             display: true, // Hide the legend
//           },
//           datalabels: dataLabels,
//         },
//         scales: {
//           x: {
//             stacked: true,
//           },
//           y: {
//             stacked: true,
//             ticks: {
//               callback: (value) => {
//                 if (value >= 10000000) {
//                   return value / 10000000;
//                 } else if (value >= 100000) {
//                   return value / 100000;
//                 } else if (value >= 1000) {
//                   return value / 1000;
//                 } else {
//                   return value.toFixed(2);
//                 }
//               },
//             },
//           },
//         },
//         elements: {
//           bar: {
//             // borderRadius: 4, // Optional: rounded corners
//           },
//         },
//       },
//     });

//     // Cleanup function to destroy the chart instance on component unmount or re-render
//     return () => {
//       if (chartRef.current) {
//         chartRef.current.destroy();
//       }
//     };
//   }, [chartData]);

//   return (
//     <div className="popup-chart">
//       <canvas id="popup-chart"></canvas>
//     </div>
//   );
// }





function PopupChart({ chartData, title }) {
  const chartRef = useRef(null);

  const getCosValue = (label, index) => {
    const cosDataset = chartData.datasets.find((d) => d.label === label);
    return cosDataset ? cosDataset.data[index] : 0;
  };

  const dataLabels = {
    display: true,
    formatter: (value, context) => {
      const index = context.dataIndex;
      const datasetLabel = context.dataset.label;
      let cogsValue = 0;

      if (datasetLabel.includes("Materials Cost (Current Year)")) {
        cogsValue = getCosValue("Materials Cost Cogs (Current Year)", index);
      } else if (datasetLabel.includes("Supplies Cost (Current Year)")) {
        cogsValue = getCosValue("Supplies Cost Cogs (Current Year)", index);
      } else if (datasetLabel.includes("Materials Cost (Previous Year)")) {
        cogsValue = getCosValue("Materials Cost Cogs (Previous Year)", index);
      } else if (datasetLabel.includes("Supplies Cost (Previous Year)")) {
        cogsValue = getCosValue("Supplies Cost Cogs (Previous Year)", index);
      }

      return cogsValue ? `${cogsValue}%` : "";
    },
    color: "#0000cc",
    anchor: "center",
    align: "center",
    rotation: -90,
    offset: 120,
    padding: 2,
    font: {
      size: 12,
    },
  };

  useEffect(() => {
    const ctx = document.getElementById("popup-chart").getContext("2d");

    // If there is an existing chart instance, destroy it before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Filter out datasets that are hidden
    const filteredDatasets = chartData.datasets.filter(dataset => !dataset.hidden);

    // Create a new chart instance and store it in the ref
    chartRef.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        ...chartData,
        datasets: filteredDatasets, // Use the filtered datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            display: true,
          },
          datalabels: dataLabels,
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            ticks: {
              callback: (value) => {
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
        elements: {
          bar: {
            // borderRadius: 4, // Optional: rounded corners
          },
        },
      },
    });

    // Cleanup function to destroy the chart instance on component unmount or re-render
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="popup-chart">
      <canvas id="popup-chart" aria-label="Cost Chart" role="img"></canvas>
    </div>
  );
}


