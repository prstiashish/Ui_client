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
import { Bar, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, Grid, DialogTitle, DialogContent } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { BsArrowsFullscreen } from "react-icons/bs";
import plugin from "chartjs-plugin-datalabels";
// import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChartWeekly({ chartData, title }) {
  const [showPopupChart, setShowPopupChart] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChartDoubleClick = () => {
    setShowPopupChart(true);
  };

  // doubleGroup plugin block

  const doubleGroup = {
    id: "doubleGroup",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        data,
        chartArea: { top, bottom, left, right, width, height, barWidth, maxWidth, fullWidth },
      } = chart;

      console.log();
      console.log(width);
      const segment = width / data.labels.length;
      const quarter = segment / 5;
      let VisibleCount = chart.getVisibleDatasetCount();

      if (data.datasets.length > 0) {
        let totalWidth = width;
        let nWeeks = data.labels.length;
        let spacingPercent = 0.1;
        let weekWidth = totalWidth / nWeeks;
        let spacing = weekWidth * spacingPercent;
        let barWidth = weekWidth - weekWidth * (spacingPercent * 2);
        let weekStart;
        let barStart;
        let barEnd;
        let weekEnd;
        chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
          if (index === 0) {
            weekStart = 0;
            barStart = weekStart + spacing;
            barEnd = barStart + barWidth;
            weekEnd = barEnd + spacing;
          } else {
            weekStart = weekEnd;
            barStart = weekStart + spacing;
            barEnd = barStart + barWidth;
            weekEnd = barEnd + spacing;
          }

          // datapoint.x = barStart + barWidth / 2;
          datapoint.width = barWidth;

          console.log("weekStart", index, weekStart);
          console.log("Total Width", totalWidth);
          console.log(barStart);
          console.log(barEnd);
          console.log(datapoint.x);
          console.log("Bar Width", barWidth);

          //datapoint.x = segment * index + left + quarter + 20;
        });
      }
    },
  };

  // const doubleGroup = {
  //   id: "doubleGroup",
  //   beforeDatasetsDraw(chart, args, pluginOptions) {
  //     const {
  //       ctx,
  //       data,
  //       chartArea: { top, bottom, left, right, width, height },
  //     } = chart;
  //
  //     const segment = width / data.labels.length;
  //     const quarter = segment / 5;
  //     let VisibleCount = chart.getVisibleDatasetCount();

  //     if (data.datasets.length > 0) {
  //       const coorX = chart.getDatasetMeta(0).data.map((datapoint, index) => {
  //         return datapoint.x;
  //       });

  //       chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
  //
  //         // datapoint.x = segment * index + left + quarter + 20;
  //         datapoint.x = segment + 20;
  //         // console.log(segment * index + left + quarter + 20);
  //       });
  //     }
  //   },
  // };

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
          <Grid item xs={12} md={showPopupChart ? 6 : 12}>
            <div
              style={{
                position: "relative",
                overflowX: "scroll",
                overflowY: "hidden",
                maxWidth: "100%",
              }}
            >
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
                        text: titleText,
                      },
                      legend: {
                        display: chartData.datasets[0].data[0] > 0,
                        labels: {
                          usePointStyle: true,
                        },
                      },
                    },
                    layout: {
                      padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
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
                  //plugins={[doubleGroup]}
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

function formatNumber(number) {
  if (number >= 10000000) {
    return (number / 10000000).toFixed(2) + " Cr";
  } else if (number >= 100000) {
    return (number / 100000).toFixed(2) + " Lakh";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2) + " K";
  } else {
    return number.toFixed(2);
  }
}

function Modal({ children }) {
  return (
    <div className="modal">
      <div className="modal-content">{children}</div>
    </div>
  );
}

const doubleGroups = {
  id: "doubleGroups",
  beforeDatasetsDraw(chart, args, pluginOptions) {
    const {
      ctx,
      data,
      chartArea: { top, bottom, left, right, width, height },
    } = chart;

    const segment = width / data.labels.length;
    const quarter = segment / 5;
    let VisibleCount = chart.getVisibleDatasetCount();

    if (data.datasets.length > 0) {
      let totalWidth = width;
      let nWeeks = data.labels.length;
      let spacingPercent = 0.1;
      let weekWidth = totalWidth / nWeeks;
      let spacing = weekWidth * spacingPercent;
      let barWidth = weekWidth - weekWidth * (spacingPercent * 2);
      let weekStart;
      let barStart;
      let barEnd;
      let weekEnd;
      chart.getDatasetMeta(0).data.forEach((datapoint, index) => {
        if (index === 0) {
          weekStart = 0;
          barStart = weekStart + spacing;
          barEnd = barStart + barWidth;
          weekEnd = barEnd + spacing;
        } else {
          weekStart = weekEnd;
          barStart = weekStart + spacing;
          barEnd = barStart + barWidth;
          weekEnd = barEnd + spacing;
        }
        datapoint.x = weekStart;
        datapoint.width = barWidth;

        //datapoint.x = segment * index + left + quarter + 20;
      });
    }
  },
};

function PopupChart({ chartData, title }) {
  React.useEffect(() => {
    const ctx = document.getElementById("popup-chart").getContext("2d");
    // ChartJS.register(doubleGroups);
    new ChartJS(ctx, {
      type: "bar",
      data: chartData,
      // plugins: { doubleGroups },
      options: {
        plugins: {
          title: {
            display: true,
            text: title,
          },
          legend: {
            display: chartData.datasets[0].data[0] > 0,
            labels: {
              usePointStyle: true,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value, index, values) {
                if (value >= 10000000) {
                  return (value / 10000000).toFixed(2);
                } else if (value >= 100000) {
                  return (value / 100000).toFixed(2);
                } else if (value >= 1000) {
                  return (value / 1000).toFixed(2);
                } else {
                  return value.toFixed(2);
                }
              },
            },
          },
        },
        // plugins: [doubleGroups],
      },
    });

    return () => {
      // ChartJS.unregister(doubleGroups);
    };
  }, [chartData]);

  return (
    <div className="popup-chart">
      <canvas id="popup-chart"></canvas>
    </div>
  );
}
