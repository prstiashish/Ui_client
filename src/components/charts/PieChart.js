// import React from "react";
// import { Chart as ChartJS, Title, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { Tabs, Tab, Typography } from "@mui/material";

// ChartJS.register(Title, Tooltip, Legend);

// export default function DonutChart({ chartData,title }) {
//   return (
//     <div style={{ width: "300px", height: "200px", marginLeft: "20%", textAlign: "center" }}>
//       {" "}
//       {/* <Typography variant="h6" gutterBottom>
//         {"Average Sales Category"} Display the heading
//       </Typography> */}
//       <Doughnut
//         data={chartData}
//         options={{
//           plugins: {
//             title: {
//                         display: true,
//                         text: title,
//                       },
//             legend: {
//               display: false,
//               position: "top",
//               labels: {
//                 font: {
//                   size: 8, // Adjust font size as needed
//                 },
//                 itemMarginBottom: 2,
//               },
//             },
//             datalabels: {
//               display: true,
//               color: "white",
//               formatter: (value, context) => {
//                 return context.chart.data.labels[context.dataIndex] + ": " + value + "%";
//               },
//               align: "end",
//               anchor: "end",
//               offset: 5,
//               borderWidth: 1,
//               borderColor: "#aaa",
//               borderRadius: 4,
//               backgroundColor: "white",
//               padding: {
//                 top: 2,
//                 bottom: 2,
//                 left: 4,
//                 right: 4,
//               },
//               labels: {
//                 title: {
//                   font: {
//                     weight: "bold",
//                   },
//                 },
//               },
//             },
//           },
//           responsive: true,
//           maintainAspectRatio: false,
//           cutoutPercentage: 50,
//         }}
//       />
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { Chart as ChartJS, Title, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";
// import { IconButton, Dialog, DialogTitle, DialogContent, Grid } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { BeatLoader } from "react-spinners";
// import { BsArrowsFullscreen } from "react-icons/bs";

// ChartJS.register(Title, Tooltip, Legend);

// export default function DonutChart({ chartData, title }) {
//   const [showPopupChart, setShowPopupChart] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChartDoubleClick = () => {
//     setShowPopupChart(true);
//   };

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   }, [chartData]);

//   return (
//     <>
//       {loading || !chartData?.datasets?.length || !chartData?.datasets[0].data?.length ? (
//         <div style={{ position: "relative", minHeight: "222px", marginLeft: "40%", alignContent: "center" }}>
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
//               <div style={{ width: "100%", height: "200px" }}>
//                 <Doughnut
//                   data={chartData}
//                   options={{
//                     plugins: {
//                       title: {
//                         display: true,
//                         text: title,
//                       },
//                       legend: {
//                         display: false,
//                         position: "top",
//                         labels: {
//                           font: {
//                             size: 12,
//                           },
//                         },
//                       },
//                       tooltip: {
//                         callbacks: {
//                           label: function (tooltipItem) {
//                             return tooltipItem.label + ": " + tooltipItem.raw + "%";
//                           },
//                         },
//                       },
//                       datalabels: {
//                         display: false, // Hide data labels on chart segments
//                       },
//                     },
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     cutout: "50%", // Ensure it's a donut chart
//                   }}
//                 />
//               </div>
//             </div>
//           </Grid>
//           {showPopupChart && (
//             <Dialog
//               open={true}
//               onClose={() => setShowPopupChart(false)}
//               fullWidth={true}
//               maxWidth="lg"
//               sx={{
//                 "& .MuiDialog-paper": { width: "90%", maxWidth: "90%" },
//                 "& .MuiDialogContent-root": {
//                   overflow: "hidden",
//                   padding: 0,
//                 },
//               }}
//             >
//               <DialogTitle>
//                 <IconButton
//                   aria-label="close"
//                   onClick={() => setShowPopupChart(false)}
//                   sx={{
//                     position: "absolute",
//                     right: 8,
//                     top: 8,
//                     color: "grey",
//                   }}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </DialogTitle>
//               <DialogContent>
//                 <div style={{ width: "100%", height: "400px" }}>
//                   <Doughnut
//                     data={chartData}
//                     options={{
//                       plugins: {
//                         title: {
//                           display: true,
//                           text: title,
//                         },
//                         legend: {
//                           display: true,
//                           position: "top",
//                           labels: {
//                             font: {
//                               size: 14,
//                             },
//                           },
//                         },
//                         tooltip: {
//                           callbacks: {
//                             label: function (tooltipItem) {
//                               return tooltipItem.label + ": " + tooltipItem.raw + "%";
//                             },
//                           },
//                         },
//                         datalabels: {
//                           display: false, // Hide data labels on chart segments
//                         },
//                       },
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       cutout: "50%", // Ensure it's a donut chart
//                     }}
//                   />
//                 </div>
//               </DialogContent>
//             </Dialog>
//           )}
//         </Grid>
//       )}
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import ChartJS from "chart.js/auto";
import { IconButton, Dialog, DialogTitle, DialogContent, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BeatLoader } from "react-spinners";
import { BsArrowsFullscreen } from "react-icons/bs";

// Function to generate random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to generate an array of random colors
const generateRandomColors = (count) => {
  return Array.from({ length: count }, getRandomColor);
};

export default function DonutChart({ chartData, title }) {
  const [showPopupChart, setShowPopupChart] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to prepare chart data with random colors
  const prepareChartData = (data) => {
    const colors = generateRandomColors(data.labels.length);
    return {
      ...data,
      datasets: [
        {
          ...data.datasets[0],
          backgroundColor: colors,
        },
      ],
    };
  };

  // Prepare chart data with random colors on data change
  const preparedChartData = React.useMemo(() => prepareChartData(chartData), [chartData]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [chartData]);

  return (
    <>
      {loading || !preparedChartData?.datasets?.length || !preparedChartData?.datasets[0].data?.length ? (
        <div style={{ position: "relative", minHeight: "222px", marginLeft: "40%", alignContent: "center" }}>
          <BeatLoader color="#36D7B7" loading={true} size={10} />
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={showPopupChart ? 6 : 12}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", right: 0 }}>
                <IconButton onClick={() => setShowPopupChart(true)}>
                  <BsArrowsFullscreen />
                </IconButton>
              </div>
              <div style={{ width: "100%", height: "210px" }}>
                <Doughnut
                  data={preparedChartData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: title,
                      },
                      legend: {
                        display: false,
                        position: "top",
                        labels: {
                          font: {
                            size: 12,
                          },
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            return tooltipItem.label + ": " + tooltipItem.raw + "%";
                          },
                        },
                      },
                      datalabels: {
                        display: false,
                      },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "50%",
                  }}
                />
              </div>
            </div>
          </Grid>
          {showPopupChart && (
            <Dialog
              open={true}
              onClose={() => setShowPopupChart(false)}
              fullWidth={true}
              maxWidth="lg"
              sx={{
                "& .MuiDialog-paper": { width: "90%", maxWidth: "90%" },
                "& .MuiDialogContent-root": {
                  overflow: "hidden",
                  padding: 4,
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
                <div style={{ width: "100%", height: "400px" }}>
                  <Doughnut
                    data={preparedChartData}
                    options={{
                      plugins: {
                        title: {
                          display: true,
                          text: title,
                        },
                        legend: {
                          display: true,
                          position: "top",
                          labels: {
                            font: {
                              size: 14,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (tooltipItem) {
                              return tooltipItem.label + ": " + tooltipItem.raw + "%";
                            },
                          },
                        },
                        datalabels: {
                          display: false,
                        },
                      },
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "50%",
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </Grid>
      )}
    </>
  );
}