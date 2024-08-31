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





// newwww





import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import ChartJS from "chart.js/auto";
import { IconButton, Dialog, DialogTitle, DialogContent, Grid, Typography, Divider } from "@mui/material";
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

// Function to format numbers into M (Million), K (Thousand), or C (Crore)
const formatValue = (value) => {
  if (value >= 10000000) {
    return (value / 10000000).toFixed(2) + 'C'; // Convert to Crores
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M'; // Convert to Millions
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + 'K'; // Convert to Thousands
  } else {
    return value.toFixed(2); // Keep the value as is
  }
};

export default function DonutChart({ chartData, title }) {
  const [showPopupChart, setShowPopupChart] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate total sales and round off to 2 decimal places
  const totalSales = chartData.datasets[0].data.reduce((acc, value) => acc + value, 0).toFixed(2);

  // Function to prepare chart data with random colors
  const prepareChartData = (data) => {
    const colors = generateRandomColors(data.labels.length);
    return {
      ...data,
      datasets: [
        {
          ...data.datasets[0],
          backgroundColor: colors,
          // Adding the formatted values directly on the chart
          datalabels: {
            display: true,
            color: "#fff",
            formatter: (value) => formatValue(value),
            font: {
              weight: "bold",
              size: 12,
            },
          },
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
                            const originalValue = tooltipItem.raw.toFixed(2); // Show full value in tooltip
                            return `${tooltipItem.label}: ${originalValue}`;
                          },
                        },
                      },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "50%",
                  }}
                />
              </div>
            </div>
            {/* <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="center">
              Total Sales: {formatValue(parseFloat(totalSales))}
            </Typography> */}
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
                              const originalValue = tooltipItem.raw.toFixed(2); // Show full value in tooltip
                              return `${tooltipItem.label}: ${originalValue}`;
                            },
                          },
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
