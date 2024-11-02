

import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import chart.js
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// import jsonData from "./allData";
import jsonData from "../components/charts/timeSeriesData";
import { DashboardLayout } from "src/components/dashboard-layout";



// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const TimeSeriesForecastChart = ({ data }) => {
  const labels = data.map((item) => item.Date);
  const actualSales = data.map((item) => item.Actual_Sales);
  const forecastedSales = data.map((item) => item.Forecasted_Sales);
  const lowerLimit = data.map((item) => item.Lower_Limit);
  const upperLimit = data.map((item) => item.Upper_Limit);
  const testSales = data.map((item) => item.Test_Sales);
  const rmse = data.map((item) => item.RMSE);
  const mape = data.map((item) => item.MAPE);
  const mae = data.map((item) => item.MAE);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Actual Sales",
        data: actualSales,
        fill: false,
        backgroundColor: "rgba(59, 70, 161, 0.6)", // Teal
        borderColor: "rgba(59, 70, 161,1)", // Darker teal
        pointBackgroundColor: "rgba(59, 70, 161)", // Same as border
        pointBorderColor: "#fff",
      },
      {
        label: "Forecasted Sales",
        data: forecastedSales,
        fill: false,
        backgroundColor: "rgba(250, 103, 5, 0.6)", // Pink
        borderColor: "rgba(250, 103, 5, 1)", // Darker pink
        pointBackgroundColor: "rgba(250, 103, 5, 1)", // Same as border
        pointBorderColor: "#fff",
      },
      {
        label: "Lower Limit",
        data: lowerLimit,
        fill: false,
        backgroundColor: "rgba(65, 158, 77, 0.6)", // Yellow
        borderColor: "rgba(65, 158, 77, 1)", // Darker yellow
        pointBackgroundColor: "rgba(255, 206, 86, 1)", // Same as border
        pointBorderColor: "#fff",
      },
      {
        label: "Upper Limit",
        data: upperLimit,
        fill: false,
        backgroundColor: "rgba(250, 5, 78, 0.6)", // Purple
        borderColor: "rgba(250, 5, 78, 1)", // Darker purple
        pointBackgroundColor: "rgba(250, 5, 78, 1)", // Same as border
        pointBorderColor: "#fff",
      },
      {
        label: "Test Sales",
        data: testSales,
        fill: false,
        backgroundColor: "rgba(127, 5, 250, 0.6)", // Purple
        borderColor: "rgba(127, 5, 250, 1)", // Darker purple
        pointBackgroundColor: "rgba(127, 5, 250, 1)", // Same as border
        pointBorderColor: "#fff",
      },
      // {
      //   label: "RMSE",
      //   data: rmse,
      //   fill: false,
      //   backgroundColor: "rgba(255, 159, 64, 0.6)", // Orange
      //   borderColor: "rgba(255, 159, 64, 1)", // Darker orange
      //   pointBackgroundColor: "rgba(255, 159, 64, 1)", // Same as border
      //   pointBorderColor: "#fff",
      // },
      // {
      //   label: "MAPE",
      //   data: mape,
      //   fill: false,
      //   backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue
      //   borderColor: "rgba(54, 162, 235, 1)", // Darker blue
      //   pointBackgroundColor: "rgba(54, 162, 235, 1)", // Same as border
      //   pointBorderColor: "#fff",
      // },
      // {
      //   label: "MAE",
      //   data: mae,
      //   fill: false,
      //   backgroundColor: "rgba(100, 255, 218, 0.6)", // Light Cyan
      //   borderColor: "rgba(100, 255, 218, 1)", // Darker Light Cyan
      //   pointBackgroundColor: "rgba(100, 255, 218, 1)", // Same as border
      //   pointBorderColor: "#fff",
      // },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales',
          font: {
            size: 16,
            weight: "bold",
          },
          color: "#333",
        },
        grid: {
          color: "#ddd",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 13,
            weight: "bold",
          },
          color: "#333",
        },
        grid: {
          color: "#ddd",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          // padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(
              2
            )}`;
          },
        },
      },

      
    },
  };

  return (
    <div
      style={{
        margin: "20px 0",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        width: "100%",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>Time Series Forecasting Chart</h2>
      <div style={{ width: "100%", height: "400px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

const App = () => {
  const [frequency, setFrequency] = useState("Weekly");
  const [channel, setChannel] = useState("POS");

  const filteredData = jsonData.filter(
    (item) => item.Frequency === frequency && item.Channel === channel
  );

  const columnDefs = useMemo(
    () => [
      { field: "Date", chartDataType: "time" },
      { field: "Actual_Sales", headerName: "Actual Sales" },
      { field: "Forecasted_Sales", headerName: "Forecasted Sales" },
      { field: "Category" },
      { field: "Franchise" },
      { field: "Channel" },
      { field: "Frequency" },
      { field: "Lower_Limit" },
      { field: "Upper_Limit" },
      { field: "RMSE" },
      // { field: "MAPE" },
      // { field: "MAE" },
    ],
    []
  );

  return (
    <div>
      {/* <h1>Sales Forecasting</h1> */}

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="frequency-select">Select Frequency: </label>
        <select
          id="frequency-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="Monthly">Monthly</option>
          <option value="Weekly">Weekly</option>
        </select>

        <label htmlFor="channel-select" style={{ marginLeft: "20px" }}>
          Select Channel:
        </label>
        <select
          id="channel-select"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          <option value="DotPe">DotPe</option>
          <option value="POS">POS</option>
        </select>
      </div>

      <TimeSeriesForecastChart data={filteredData} />

      <div
        style={{ height: "400px", width: "100%", overflow: "auto" }}
        className="ag-theme-quartz"
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={filteredData}
          domLayout="normal"
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

App.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default App;

