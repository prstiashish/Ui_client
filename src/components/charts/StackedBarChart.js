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
import { Dialog, Grid, DialogTitle, DialogContent, IconButton, Typography } from "@mui/material";
import { BeatLoader } from "react-spinners";
import { BsArrowsFullscreen } from "react-icons/bs";

// Registering the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function StackedBarChart({ chartData, title, startDate, endDate }) {
  const [currentLegendIndex, setCurrentLegendIndex] = React.useState(0);
  const legendsPerPage = 2; // Number of legends to show at a time

  // Calculate the total number of pages
  const totalLegends = chartData.datasets.length;
  const totalPages = Math.ceil(totalLegends / legendsPerPage);

  // Determine the legends to show for the current page
  const visibleLegends = chartData.datasets.slice(
    currentLegendIndex * legendsPerPage,
    currentLegendIndex * legendsPerPage + legendsPerPage
  );

  // console.log("chartDataStackedBarChart", chartData);
  const { datasets, labels } = chartData;

  // console.log("Datasets:", datasets);
  // console.log("Labels:", labels);

  const chartRef = useRef(null);

  useEffect(() => {
    // Cleanup on component unmount or re-render to avoid "canvas already in use" error
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  const [showLoader, setShowLoader] = useState(true);
  const [showStackedPopupChart, setStackedShowPopupChart] = useState(false);
  const [loading, setLoading] = useState(false);

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
  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // }, [chartData]);
  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    setLoading(true);
    setTimeout(() => {
      if (isMounted) {
        setLoading(false); // Only update loading state if component is still mounted
      }
    }, 1000);

    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
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
                {/* <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: title,
                      },
                      legend: {
                        display: true,
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
                /> */}
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
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            const dataset = tooltipItem.dataset;
                            const value = tooltipItem.raw;
                            const percentage = dataset.percentage[tooltipItem.dataIndex]; // Get the precomputed percentage
                            return `${dataset.label}: ${value} (${percentage}%)`;
                          },
                        },
                      },
                      datalabels: {
                        display: true,
                        formatter: (value, context) => {
                          const dataset = context.dataset;
                          const percentage = dataset.percentage[context.dataIndex]; // Get the precomputed percentage
                          if (percentage === 0) {
                            return ""; // Return an empty string to hide the label
                            // Or return a custom message: return "No Data";
                          }
                          return `${percentage}%`;
                        },
                        color: "blue", // White text for contrast
                        anchor: "center", // Center the label vertically
                        align: "center", // Center the label horizontally
                        rotation: "-90",
                        font: {
                          // weight: "bold",
                          size: 8, // Adjust font size for better readability
                        },
                        clip: true, // Ensure labels are clipped within the bar
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
                  // plugins={[ChartDataLabels]}
                />
                {/* <div style={{ position: "relative", width: "80%", margin: "0 auto" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "18px",
                    }}
                  >
                    <button
                      disabled={currentLegendIndex === 0}
                      onClick={() => setCurrentLegendIndex((prev) => Math.max(prev - 1, 0))}
                      style={{
                        marginRight: "10px",
                        cursor: "pointer",
                        padding: "5px",
                      }}
                    >
                      ⬅️
                    </button>
                    {visibleLegends.map((legend, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginRight: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: legend.backgroundColor,
                            marginRight: "5px",
                          }}
                        ></div>
                        <span>{legend.label}</span>
                      </div>
                    ))}
                    <button
                      disabled={currentLegendIndex === totalPages - 1}
                      onClick={() =>
                        setCurrentLegendIndex((prev) => Math.min(prev + 1, totalPages - 1))
                      }
                      style={{
                        marginLeft: "10px",
                        cursor: "pointer",
                        padding: "5px",
                      }}
                    >
                      ➡️
                    </button>
                  </div>
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: title,
                        },
                        datalabels: {
                          display: true,
                          formatter: (value, context) => {
                            const dataset = context.dataset;
                            const percentage = dataset.percentage[context.dataIndex]; // Get the precomputed percentage
                            return `${percentage}%`;
                          },
                          color: "blue", // White text for contrast
                          anchor: "center", // Center the label vertically
                          align: "center", // Center the label horizontally
                          rotation: "-90",
                          font: {
                            // weight: "bold",
                            size: 8, // Adjust font size for better readability
                          },
                          clip: true, // Ensure labels are clipped within the bar
                        },
                        legend: {
                          display: false,
                          labels: {
                            generateLabels: (chart) => {
                              return visibleLegends.map((dataset, index) => ({
                                text: dataset.label,
                                fillStyle: dataset.backgroundColor,
                                hidden: false,
                              }));
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (tooltipItem) {
                              const dataset = tooltipItem.dataset;
                              const value = tooltipItem.raw;
                              const percentage = dataset.percentage[tooltipItem.dataIndex]; // Precomputed percentage
                              return `${dataset.label}: ${value} (${percentage}%)`;
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
                            callback: formatValue,
                          },
                        },
                      },
                    }}
                  />


                </div> */}
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

  // useEffect(() => {
  //   const ctx = document.getElementById("popup-chart").getContext("2d");

  //   // If there is an existing chart instance, destroy it before creating a new one
  //   if (chartRef.current) {
  //     chartRef.current.destroy();
  //   }

  //   // Filter out datasets that are hidden
  //   const filteredDatasets = chartData.datasets.filter((dataset) => !dataset.hidden);

  //   // Create a new chart instance and store it in the ref
  //   chartRef.current = new ChartJS(ctx, {
  //     type: "bar",
  //     data: {
  //       ...chartData,
  //       datasets: filteredDatasets, // Use the filtered datasets
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         title: {
  //           display: true,
  //           text: title,
  //         },
  //         legend: {
  //           display: true,
  //         },
  //         tooltip: {
  //           callbacks: {
  //             label: function (tooltipItem) {
  //               const dataset = tooltipItem.dataset;
  //               const value = tooltipItem.raw;
  //               const percentage = dataset.percentage[tooltipItem.dataIndex];
  //               return `${dataset.label}: ${value} (${percentage}%)`;
  //             },
  //           },
  //         },
  //         datalabels: {
  //           display: true,
  //           formatter: (value, context) => {
  //             const dataset = context.dataset;
  //             const percentage = dataset.percentage[context.dataIndex];
  //             if (percentage === 0) {
  //               return ""; // Return an empty string to hide the label
  //               // Or return a custom message: return "No Data";
  //             }
  //             return `${percentage}%`;
  //           },
  //           color: "blue",
  //           anchor: "center",
  //           align: "center",
  //           rotation: -90,
  //           font: {
  //             // weight: "bold",
  //             size: 10,
  //           },
  //           clip: true,
  //         },
  //       },
  //       scales: {
  //         x: {
  //           stacked: true,
  //         },
  //         y: {
  //           stacked: true,
  //           ticks: {
  //             callback: (value) => {
  //               if (value >= 10000000) {
  //                 return value / 10000000;
  //               } else if (value >= 100000) {
  //                 return value / 100000;
  //               } else if (value >= 1000) {
  //                 return value / 1000;
  //               } else {
  //                 return value.toFixed(0);
  //               }
  //             },
  //           },
  //         },
  //       },
  //       elements: {
  //         bar: {
  //           // borderRadius: 4, // Optional: rounded corners
  //         },
  //       },
  //     },
  //   });

  //   // Cleanup function to destroy the chart instance on component unmount or re-render
  //   return () => {
  //     if (chartRef.current) {
  //       chartRef.current.destroy();
  //     }
  //   };
  // }, [chartData]);
  const [isMounted, setIsMounted] = useState(true); // State to track mounting status

  useEffect(() => {
    const ctx = document.getElementById("popup-chart").getContext("2d");

    // Flag to track if the component is mounted
    let isMountedFlag = true;

    // If the component is still mounted, proceed with chart creation
    if (isMountedFlag) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Filter out datasets that are hidden
      const filteredDatasets = chartData.datasets.filter((dataset) => !dataset.hidden);

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
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const dataset = tooltipItem.dataset;
                  const value = tooltipItem.raw;
                  const percentage = dataset.percentage[tooltipItem.dataIndex];
                  return `${dataset.label}: ${value} (${percentage}%)`;
                },
              },
            },
            datalabels: {
              display: true,
              formatter: (value, context) => {
                const dataset = context.dataset;
                const percentage = dataset.percentage[context.dataIndex];
                if (percentage === 0) {
                  return ""; // Return an empty string to hide the label
                }
                return `${percentage}%`;
              },
              color: "blue",
              anchor: "center",
              align: "center",
              rotation: -90,
              font: {
                size: 10,
              },
              clip: true,
            },
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
                    return value.toFixed(0);
                  }
                },
              },
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart instance when the component unmounts or when chartData changes
    return () => {
      isMountedFlag = false; // Set to false if the component unmounts
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData, title]); // Dependency array includes chartData and title

  return (
    <div className="popup-chart">
      <canvas id="popup-chart" aria-label="Cost Chart" role="img"></canvas>
    </div>
  );
}
