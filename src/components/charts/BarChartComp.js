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
