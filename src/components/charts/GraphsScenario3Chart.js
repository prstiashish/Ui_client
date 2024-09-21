import { Bar } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const GraphScenario3Chart = ({ chartData }) => {

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
  const formatValue = (value, index, values) => {
    // Get the maximum value from the dataset to decide the formatting
    const maxValue = Math.max(...values.map((v) => v.y));

    if (maxValue >= 10000000) {
      return `${(value / 10000000).toFixed(1)}Cr`; // For crores
    } else if (maxValue >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`; // For millions
    } else if (maxValue >= 100000) {
      return `${(value / 100000).toFixed(1)}L`; // For lakhs
    } else if (maxValue >= 1000) {
      return `${(value / 1000).toFixed(1)}K`; // For thousands
    } else {
      return value.toFixed(1); // For smaller values
    }
  };


  // Extract scenario specific options if needed
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        // text: getDynamicTitle(chartData), // If you have a dynamic title function
      },
    },
    layout: {
      padding: {
        left: -4,
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
        },
        afterFit: (scale) => {
          scale.paddingLeft = 20;
          scale.paddingRight = 20;
        },
      },
      y: {
        beginAtZero: true,
        type: "logarithmic",
        ticks: {
          callback: formatValue, // Apply formatting function
        },
        title: {
          display: true,
          text: "Measure",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default GraphScenario3Chart;
