import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useState, useEffect } from "react";

import { Bar } from "react-chartjs-2";
import { IconButton, Dialog, Grid, DialogTitle, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BsArrowsFullscreen } from "react-icons/bs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function EDABarChart({ chartData }) {
  const [showPopupChart, setShowPopupChart] = useState(false);

  console.log("chartData", chartData);
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

  const handleChartDoubleClick = () => {
    setShowPopupChart(true);
  };

  console.log("chartData.datasets.labal", chartData.datasets[0].label);
  const options = {
    plugins: {
      title: {
        display: true,
        text: `Count of Business Date by ${chartData.datasets[0].label}`,
        font: {
          weight: "bold",
          size: 15,
        },
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
          callback: formatValue,
        },
        title: {
          display: true,
          text: "Count of Business Date",
          font: {
            weight: "bold",
            size: 15,
          },
          padding: {
            bottom: 10,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: chartData.datasets[0].label,
          font: {
            weight: "bold",
            size: 15,
          },

          padding: {
            top: 10,
          },
        },
      },
    },
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={showPopupChart ? 6 : 12}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", right: 0 }}>
              <IconButton onClick={handleChartDoubleClick}>
                <BsArrowsFullscreen />
              </IconButton>
            </div>
            <div>
              <Bar data={chartData} options={options} />
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
                "& .MuiDialog-paper": { maxWidth: "80%", width: "80%", maxheight: "140%" },
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
                <PopupChart chartData={chartData} />
              </DialogContent>
            </Dialog>
          </Grid>
        )}
      </Grid>
    </>
  );
}

function PopupChart({ chartData }) {
  let chartInstance = null;

  useEffect(() => {
    const ctx = document.getElementById("popup-chart").getContext("2d");

    // Destroy any existing chart before creating a new one
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create a new chart instance
    chartInstance = new ChartJS(ctx, {
      type: "bar",
      data: chartData,
      options: {
        plugins: {
          title: {
            display: true,
            text: `Count of Business Date by ${chartData.datasets[0].label}`,
            font: {
              weight: "bold",
              size: 15,
            },
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
            type: "logarithmic",
            ticks: {
              callback: function (value, index, values) {
                if (value >= 10000000) {
                  return value / 10000000 + "M";
                } else if (value >= 1000000) {
                  return value / 1000000 + "M";
                } else if (value >= 1000) {
                  return value / 1000 + "K";
                } else {
                  return value;
                }
              },
            },
            title: {
              display: true,
              text: "Count of Business Date",
              font: {
                weight: "bold",
                size: 15,
              },
            },
          },
          x: {
            title: {
              display: true,
              text: chartData.datasets[0].label,
              font: {
                weight: "bold",
                size: 15,
              },

              padding: {
                top: 10,
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="popup-chart">
      <canvas id="popup-chart"></canvas>
    </div>
  );
}
