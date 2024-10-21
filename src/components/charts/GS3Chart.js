import { Bar } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const GraphScenario3Chart = ({ chartData }) => {

  // console.log("GraphScenario3Chart :", chartData)

  // const formatValue = (value, index, values) => {
  //   // Get the maximum value from the dataset to decide the formatting
  //   const maxValue = Math.max(...values.map((v) => v.y));

  //   if (maxValue >= 1000000) {
  //     return `${(value / 1000000).toFixed(1)}M`; // For millions
  //   } else if (maxValue >= 1000) {
  //     return `${(value / 1000).toFixed(1)}K`; // For thousands
  //   } else {
  //     return value.toFixed(1); // For smaller values
  //   }
  // };
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
  //       left: -4,
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


  const options = {

    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false, // Disable data labels
      },
      title: {
        display: true,
        // text: getDynamicTitle(chartData), // If you have a dynamic title function
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    scales: {
      x: {
        offset: true,
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          padding: 10,
          maxRotation: 0, // Prevent excessive rotation of labels
          minRotation: 0,
        },
        afterFit: (scale) => {
          scale.paddingLeft = Math.max(10, scale.width * 0.05); // Dynamically adjust padding based on width
          scale.paddingRight = Math.max(10, scale.width * 0.05);
        },
      },
      y: {
        beginAtZero: true,
        // type: "logarithmic", // Keep logarithmic scaling if necessary
        ticks: {
          callback: formatValue, // Apply formatting function
        },
        // title: {
        //   display: false,
        //   text: "Measure",
        //   font: {
        //     size: 14,
        //     weight: "bold",
        //   },
        // },
      },
    },
  };



  return <Bar data={chartData} options={options} />;
};

export default GraphScenario3Chart;
