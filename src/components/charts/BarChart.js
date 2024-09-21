// import React, { useState, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { Dialog, Grid, DialogTitle, DialogContent } from "@mui/material";
// import { BeatLoader } from "react-spinners";
// import { BsArrowsFullscreen } from "react-icons/bs";
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function BarChart({ chartData, title }) {
//   console.log("chartDataaaaaaa", chartData);
//   console.log("title", title);
//   const [showPopupChart, setShowPopupChart] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [topTrendTitle, setTopTrendTitle] = useState(title);

//   // Use useEffect to update the title based on chartData when it changes
//   useEffect(() => {
//     if (chartData.datasets && chartData.datasets.length > 0) {
//       setTopTrendTitle(chartData.datasets[0].label); // Update title from dataset label
//     }
//   }, [chartData]); // Only run when chartData changes

//   const handleChartDoubleClick = () => {
//     setShowPopupChart(true);
//   };

//   // doubleGroup plugin block
//   const doubleGroup = {
//     id: "doubleGroup",
//     beforeDatasetsDraw(chart, args, pluginOptions) {
//       const {
//         ctx,
//         data,
//         chartArea: { top, bottom, left, right, width, height },
//       } = chart;

//       const segment = width / data.labels.length;
//       const quarter = segment / 4;
//       let VisibleCount = chart.getVisibleDatasetCount();
//       const obj = {
//         11: 9,
//         10: 8,
//         9: 5,
//         8: 5,
//         7: 6,
//         6: 6,
//       };

//       if (data.datasets.length > 0) {
//         data.datasets[0].categoryPercentage = obj[VisibleCount];

//         const coorX = chart.getDatasetMeta(0).data.map((datapoint, index) => {
//           return datapoint.x;
//         });
//         chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
//           datapoint.x = segment * index + left + quarter + 20;

//           // console.log(segment * index + left + quarter + 20);
//         });
//       }
//     },
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
//       {loading || !chartData?.datasets?.length || !chartData?.datasets[0].data?.length ? (
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
//           <Grid item xs={12} md={showPopupChart ? 6 : 12}>
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
//                     plugins: {
//                       title: {
//                         display: true,
//                         text: title,
//                       },
//                       legend: {
//                         display: true, // Set legend to false
//                       },
//                       tooltip: {
//                         callbacks: {
//                           label: function (tooltipItem) {
//                             const datasetLabel = tooltipItem.dataset.label || "";
//                             const value = tooltipItem.raw;
//                             // Format tooltip text with dataset label
//                             return `Gross Amount (${datasetLabel}): ₹${value.toLocaleString()}`;
//                           },
//                         },
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
//                       y: {
//                         beginAtZero: true,
//                         ticks: {
//                           callback: formatValue,
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </Grid>
//           {showPopupChart && (
//             <Grid item xs={12} md={6}>
//               <Dialog
//                 open={true}
//                 onClose={() => setShowPopupChart(false)}
//                 fullWidth={true}
//                 maxWidth="lg"
//                 sx={{
//                   "& .MuiDialog-paper": { maxWidth: "80%", width: "80%" },
//                   "& .MuiDialogContent-root": {
//                     overflow: "hidden",
//                   },
//                 }}
//               >
//                 <DialogTitle>
//                   <IconButton
//                     aria-label="close"
//                     onClick={() => setShowPopupChart(false)}
//                     sx={{
//                       position: "absolute",
//                       right: 8,
//                       top: 8,
//                       color: "grey",
//                     }}
//                   >
//                     <CloseIcon />
//                   </IconButton>
//                 </DialogTitle>
//                 <DialogContent>
//                   <PopupChart chartData={chartData} title={titleText} />
//                 </DialogContent>
//               </Dialog>
//             </Grid>
//           )}
//         </Grid>
//       )}
//     </>
//   );
// }

// function formatNumber(number) {
//   if (number >= 10000000) {
//     return (number / 10000000).toFixed(2) + " Cr";
//   } else if (number >= 100000) {
//     return (number / 100000).toFixed(2) + " Lakh";
//   } else if (number >= 1000) {
//     return (number / 1000).toFixed(2) + " K";
//   } else {
//     return number.toFixed(2);
//   }
// }

// function Modal({ children }) {
//   return (
//     <div className="modal">
//       <div className="modal-content">{children}</div>
//     </div>
//   );
// }

// function PopupChart({ chartData, title }) {
//   React.useEffect(() => {
//     const ctx = document.getElementById("popup-chart").getContext("2d");
//     new ChartJS(ctx, {
//       type: "bar",
//       data: chartData,
//       options: {
//         plugins: {
//           title: {
//             display: true,
//             text: title,
//           },
//           legend: {
//             display: true, // Set legend to false
//           },
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             ticks: {
//               callback: function (value, index, values) {
//                 if (value >= 10000000) {
//                   return value / 10000000;
//                 } else if (value >= 100000) {
//                   return value / 100000;
//                 } else if (value >= 1000) {
//                   return value / 1000;
//                 } else {
//                   return value;
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { IconButton, Dialog, Grid, DialogTitle, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BeatLoader } from "react-spinners";
import { BsArrowsFullscreen } from "react-icons/bs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function BarChart({ chartData, title }) {
  console.log("chartDataaaaaaa", chartData);
  console.log("title", title);
  const [showPopupChart, setShowPopupChart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topTrendTitle, setTopTrendTitle] = useState(title);

  useEffect(() => {
    if (chartData.datasets && chartData.datasets.length > 0) {
      setTopTrendTitle(chartData.datasets[0].label); // Update title from dataset label
    }
  }, [chartData]);

  const handleChartDoubleClick = () => {
    setShowPopupChart(true);
  };

  const doubleGroup = {
    id: "doubleGroup",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        chartArea: { top, bottom, left, right, width, height },
      } = chart;

      const segment = width / data.labels.length;
      const quarter = segment / 4;
      let VisibleCount = chart.getVisibleDatasetCount();
      const obj = {
        11: 9,
        10: 8,
        9: 5,
        8: 5,
        7: 6,
        6: 6,
      };

      if (data.datasets.length > 0) {
        data.datasets[0].categoryPercentage = obj[VisibleCount];

        const coorX = chart.getDatasetMeta(0).data.map((datapoint, index) => {
          return datapoint.x;
        });
        chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
          datapoint.x = segment * index + left + quarter + 20;
        });
      }
    },
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
            minHeight: "222px",
            marginLeft: "40%",
            alignContent: "center",
          }}
        >
          <BeatLoader color="#36D7B7" loading={true} size={10} />
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={showPopupChart ? 6 : 12}>
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
                    plugins: {
                      title: {
                        display: true,
                        text: title,
                      },
                      legend: {
                        display: true,
                      },
                      datalabels: {
                        display: false, // Disable data labels
                      },
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            const datasetLabel = tooltipItem.dataset.label || '';
                            const value = tooltipItem.raw;
                            // Format tooltip text with dataset label
                            return `Gross Amount (${datasetLabel}): ₹${value.toLocaleString()}`;
                          },
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
                      y: {
                        beginAtZero: true,
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
          {showPopupChart && (
            <Grid item xs={12} md={6}>
              <Dialog
                open={true}
                onClose={() => setShowPopupChart(false)}
                fullWidth={true}
                maxWidth="lg"
                sx={{
                  "& .MuiDialog-paper": { maxWidth: "80%", width: "80%" },
                  "& .MuiDialogContent-root": {
                    overflow: "hidden",
                  },
                }}
              >
                <DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={() => setShowPopupChart(false)}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: "grey",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <PopupChart chartData={chartData} title={titleText} />
                </DialogContent>
              </Dialog>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}

function PopupChart({ chartData, title }) {
  React.useEffect(() => {
    const ctx = document.getElementById("popup-chart").getContext("2d");
    new ChartJS(ctx, {
      type: "bar",
      data: chartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            display: true,
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value, index, values) {
                if (value >= 10000000) {
                  return value / 10000000;
                } else if (value >= 100000) {
                  return value / 100000;
                } else if (value >= 1000) {
                  return value / 1000;
                } else {
                  return value;
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

