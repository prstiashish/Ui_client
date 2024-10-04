
import { Margin } from "@mui/icons-material";
import { ticks } from "d3";
import { Bar } from "react-chartjs-2";


const GraphScenario1Chart = ({ chartData }) => {

  console.log("GraphScenario1Chart :", chartData)

  // const formatValue = (value, index, values) => {
  //   // Get the maximum value from the dataset to decide the formatting
  //   const maxValue = Math.max(...values.map((v) => v.y));

  //   if (maxValue >= 10000000) {
  //     return `${(value / 10000000).toFixed(1)}Cr`; // For crores
  //   } else if (maxValue >= 1000000) {
  //     return `${(value / 1000000).toFixed(1)}M`; // For millions
  //   } else if (maxValue >= 100000) {
  //     return `${(value / 100000).toFixed(1)}L`; // For lakhs
  //   } else if (maxValue >= 1000) {
  //     return `${(value / 1000).toFixed(1)}K`; // For thousands
  //   } else {
  //     return value.toFixed(1); // For smaller values
  //   }
  // };


  // Extract scenario specific options if needed
  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //     datalabels: {
  //       display: false, // Disable data labels
  //     },
  //     title: {
  //       display: true,
  //       // text: getDynamicTitle(chartData), // If you have a dynamic title function
  //     },
  //   },
  //   layout: {
  //     padding: {
  //       left: -5,
  //       right: 0,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       offset: true,
  //       grid: {
  //         display: false,
  //       },
  //       ticks: {
  //         autoSkip: false,
  //         padding: 10,
  //       },
  //       afterFit: (scale) => {
  //         scale.paddingLeft = 20;
  //         scale.paddingRight = 20;
  //       },
  //     },
  //     y: {
  //       beginAtZero: true,
  //       type: "logarithmic",
  //       ticks: {
  //         callback: formatValue, // Apply formatting function
  //       },
  //       title: {
  //         display: true,
  //         text: "Measure",
  //         font: {
  //           size: 14,
  //           weight: "bold",
  //         },
  //       },
  //     },
  //   },
  // };



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
  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: false, // Hide the legend
  //     },
  //     title: {
  //       display: true,
  //       text: 'Bar Chart Title',
  //       font: {
  //         size: 16,
  //         weight: 'bold',
  //       },
  //     },
  //   },
  //   layout: {
  //     padding: {
  //       left: 0,
  //       right: 0,
  //       top: 10,
  //       bottom: 10,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false, // Hide grid lines
  //       },
  //       ticks: {
  //         autoSkip: false, // Show all ticks
  //         padding: 5, // Minimal tick padding
  //       },
  //       // categoryPercentage: 1.0, // Full width for each category
  //       // barPercentage: 0.9, // Bars take up 90% of the category width
  //     },
  //     y: {
  //       beginAtZero: true,
  //       grid: {
  //         color: 'rgba(200, 200, 200, 0.3)', // Light grid lines
  //       },
  //       // ticks: {
  //       //   beginAtZero: true,
  //       // },
  //       ticks: {
  //         callback: formatValue,
  //       },
  //     },
  //   },
  //   elements: {
  //     bar: {
  //       borderWidth: 1, // Border thickness to help see small bars
  //       borderColor: 'black', // Color of the border
  //       backgroundColor: 'rgba(0, 123, 255, 0.5)', // Background color of the bars
  //       borderRadius: 0, // Sharp edges for clear separation
  //     },
  //   },
  // };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        // text: getDynamicTitle(currentData),
        text: "",
      },
      legend: {
        display: false,
        position: 'top',
        marginTop: 10,
      },
      datalabels: {
        display: false,
      },
    },
    layout: {
      padding: {
        left: 10, // Adjust left padding
        right: 0,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
         display: false,
        },
        // ticks: {
        //   autoSkip: true,
        //   maxRotation: 35, // Rotate labels for better fit
        //   minRotation: -10,
        //   padding: 0, // Reduced padding
        //   font: {
        //     size: 10, // Smaller font size
        //   },
          // callback: function(value, index) {
          //   return index % 2 === 0 ? value : ''; // Display every other label
          // },
        // },


      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: formatValue,
        },
      },

    },
    elements: {
      bar: {
          // borderRadius: 4, // Optional: rounded corners
      },
  },
  };






  return <Bar data={chartData} options={options} />;
};

export default GraphScenario1Chart;


