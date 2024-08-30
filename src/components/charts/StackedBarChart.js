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
// import { Dialog, Grid, DialogTitle, DialogContent } from "@mui/material";
// import { BeatLoader } from "react-spinners";
// import { BsArrowsFullscreen } from "react-icons/bs";

// // Registering the required Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function StackedBarChart({ chartData, title }) {
//   const [showLoader, setShowLoader] = useState(true);
//   const [showStackedPopupChart, setStackedShowPopupChart] = useState(false);
//   const [loading, setLoading] = useState(false);

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
//         titleText += " (in Crores)";
//       } else if (maxValue >= 100000) {
//         titleText += " (in Lakhs)";
//       } else if (maxValue >= 1000) {
//         titleText += " (in Thousands)";
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
//                       legend: {
//                         display: chartData.legendVisible > 0,
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
//           legend: {
//             display: chartData.legendVisible > 0,
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
import { IconButton, Dialog, Grid, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BeatLoader } from "react-spinners";
import { BsArrowsFullscreen } from "react-icons/bs";

// Registering the required Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function StackedBarChart({ chartData, title }) {
  const [showLoader, setShowLoader] = useState(true);
  const [showStackedPopupChart, setStackedShowPopupChart] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChartDoubleClick = () => {
    setStackedShowPopupChart(true);
  };

  const formatValue = (value) => {
    if (value >= 10000000) {
      return (value / 10000000).toFixed(2) + ' Cr';
    } else if (value >= 100000) {
      return (value / 100000).toFixed(2) + ' L';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2) + ' K';
    } else {
      return value.toFixed(2);
    }
  };
//  const formatValue = (value) => {
//             if (value >= 10000000) {
//               return value / 10000000;
//             } else if (value >= 100000) {
//               return value / 100000;
//             } else if (value >= 1000) {
//               return value / 1000;
//             } else {
//               return value;
//             }
//           };

  const formatLabel = (value, context) => {
    // Calculate the total value for each stack
    const total = context.chart.data.datasets.reduce((acc, dataset) => acc + dataset.data[context.dataIndex], 0);
    return formatValue(total); // Format the total value
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [chartData]);

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
                <IconButton onClick={handleChartDoubleClick}>
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
                        display: chartData.legendVisible > 0,

                      },
                      datalabels: {
                        display: true,
                        anchor: 'end', // Position labels at the end of each bar
                        align: 'top',
                        formatter: formatLabel,
                        font: {
                          weight: 'bold',
                          size: 12,
                        },
                        color: '#333',
                        offset: 4, // Space above the bar
                        // Display the total value only once for each bar stack
                        display: (context) => {
                          const dataIndex = context.dataIndex;
                          const datasetIndex = context.datasetIndex;

                          // Display the label only if it's the last dataset in the stack
                          return datasetIndex === context.chart.data.datasets.length - 1;
                        },
                      },
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
                  }}
                  getElementAtEvent={() => setShowLoader(false)}
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
          legend: {
            display: chartData.legendVisible > 0,
          },
          datalabels: {
            display: true,
            anchor: 'end', // Position labels at the end of each bar
            align: 'top',
            formatter: formatLabel,
            font: {
              weight: 'bold',
              size: 12,
            },
            color: '#333',
            offset: 4, // Space above the bar
            // Display the total value only once for each bar stack
            display: (context) => {
              const dataIndex = context.dataIndex;
              const datasetIndex = context.datasetIndex;

              // Display the label only if it's the last dataset in the stack
              return datasetIndex === context.chart.data.datasets.length - 1;
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
              callback: formatValue,
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
