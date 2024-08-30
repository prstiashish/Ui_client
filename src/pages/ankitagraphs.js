import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios"; // or fetch API
import { DashboardLayout } from "src/components/dashboard-layout";

import StackedBarChart from "src/components/charts/StackedBarChart";
import BarChartComp from "src/components/charts/BarChartComp";
import BarChartWeekly from "src/components/charts/BarChartWeekly";

import BarChart from "src/components/charts/BarChart";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

const AnkitaGraphs = () => {
  // "Month": "January",
  //   "Total_Sales": ,
  //   "Taxes": ,
  //   "Materials_Cost":,
  //   "Cogs": ,
  //   "Total_Sales_Cogs": ,
  //   "Discounts": ,
  //   "Gross_Amount": ,
  //   "Supplies_Cost":,
  //   "Net_Amount":,
  //   "Margin":
  // },
  const [responseData, setResponseData] = useState([]);

  const [chartTitlemonthwise, setChartTitlemonthwise] = useState("Monthly Total Sales");

  const defaultPayload = {
    dimension: "none",
    view: "All",
    time_window: "M",
  };
  console.log("defaultPayload", defaultPayload);

  const url = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.post(
  //        url,
  //         defaultPayload
  //       );
  //       // console.log(response.data, 'Fetched Data'); // Check the structure of response data
  //       setResponseData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [defaultPayload]); //

  // const getTotalSalesDataByMonth = (responseData) => {
  //   return responseData.map((item) => ({
  //     month: item.Month,
  //     totalSales: item.Total_Sales,
  //   }));
  // };

  // // Memoize chart data to avoid unnecessary re-renders

  // const [monthlyWiseSalesChart, setMonthWiseSalesChart] = useState({
  //   labels: [],
  //   datasets: [
  //     {
  //       label: "Monthly Total Sales",
  //       backgroundColor: [],
  //       borderColor: [],
  //       borderWidth: 1,
  //       data: [],
  //     },
  //   ],
  // });
  // const memoizedChartData = useMemo(() => monthlyWiseSalesChart, [monthlyWiseSalesChart]);

  // useEffect(() => {
  //   if (responseData) {
  //     // Process response data to fit chart requirements
  //     const totalsalesData = getTotalSalesDataByMonth(responseData);

  //     const labels = totalsalesData.map(item => item.month);
  //     const data = totalsalesData.map(item => item.totalSales);

  //     // Update the chart state
  //     setMonthWiseSalesChart(prevState => ({
  //       ...prevState,
  //       labels: labels,
  //       datasets: [{
  //         ...prevState.datasets[0],
  //         data: data,
  //       }],
  //     }));

  //     // Set the chart title based on your conditions (update as needed)
  //     const isWeekEnable = false; // Example condition, replace with actual logic
  //     const isQuarterEnable = false; // Example condition, replace with actual logic

  //     if (isWeekEnable) {
  //       setChartTitlemonthwise("Week Wise Total Sales");
  //     } else if (isQuarterEnable) {
  //       setChartTitlemonthwise("Quarter Wise Total Sales");
  //     } else {
  //       setChartTitlemonthwise("Monthly Total Sales");
  //     }
  //   }
  // }, [responseData]);

  // const totalsalesData = responseData ? getTotalSalesDataByMonth(responseData) : [];
  // console.log('totalsalesData', totalsalesData);

  // const getTaxesDataByMonth = (responseData) => {
  //   return responseData.map((item) => ({
  //     month: item.Month,
  //     totalSales: item.Taxes,
  //   }));
  // };
  // const getMarginDataByMonth = (responseData) => {
  //   return responseData.map((item) => ({
  //     month: item.Month,
  //     totalSales: item.Margin,
  //   }));
  // };

  // const taxesData = responseData ? getTaxesDataByMonth(responseData) : [];
  // console.log('taxesData', taxesData);
  // const marginData = responseData ? getMarginDataByMonth(responseData) : [];
  // console.log('marginData', marginData);

  const handleChartDoubleClick = () => {
    setShowPopupChart(true);
  };

  const [monthlyWiseSalesChart, setMonthWiseSalesChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Total Sales",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [],
      },
    ],
  });

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(url, defaultPayload);
        if (response.data && Array.isArray(response.data)) {
          setResponseData(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [url, defaultPayload]); // Ensure this array is correct

  // Update chart data based on responseData
  useEffect(() => {
    if (responseData) {
      const totalsalesData = getTotalSalesDataByMonth(responseData);

      const labels = totalsalesData.map((item) => item.month);
      const data = totalsalesData.map((item) => item.totalSales);

      setMonthWiseSalesChart((prevState) => ({
        ...prevState,
        labels: labels,
        datasets: [
          {
            ...prevState.datasets[0],
            data: data,
          },
        ],
      }));

      // Update the chart title based on conditions
      updateChartTitle();
    }
  }, [responseData]);

  // Function to update chart title based on conditions
  const updateChartTitle = () => {
    // Replace with actual logic to determine if week, quarter, or month view is enabled
    const isWeekEnable = false; // Example condition
    const isQuarterEnable = false; // Example condition

    if (isWeekEnable) {
      setChartTitlemonthwise("Week Wise Total Sales");
    } else if (isQuarterEnable) {
      setChartTitlemonthwise("Quarter Wise Total Sales");
    } else {
      setChartTitlemonthwise("Monthly Total Sales");
    }
  };

  // Function to process response data
  const getTotalSalesDataByMonth = (responseData) => {
    if (!Array.isArray(responseData)) {
      console.error("Expected responseData to be an array.");
      return [];
    }

    return responseData.map((item) => ({
      month: item.Month,
      totalSales: item.Total_Sales,
    }));
  };

  // Memoize chart data to avoid unnecessary re-renders
  const memoizedChartData = useMemo(() => monthlyWiseSalesChart, [monthlyWiseSalesChart]);

  return (
    <>
      <h1>heloo</h1>

      <Grid container spacing={2} style={{ marginTop: "1%" }}>
        <Grid item xs={12} md={6}>
          <div
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
              overflow: "hidden",
              paddingBottom: "16px",
              height: "100%",
            }}
          >
            <BarChart
              chartData={memoizedChartData}
              title={chartTitlemonthwise}
              onDoubleClick={handleChartDoubleClick}
            />
          </div>
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <div
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <StackedBarChart chartData={stackedMonthlyWisInfo} title={chartTitleCostWise} />
          </div>
        </Grid> */}
      </Grid>
      <Grid container spacing={2} style={{ marginTop: "1%" }}>
        <Grid item xs={12} md={6}>
          <div
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)  ",
              borderRadius: "5px",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <StackedBarChart
              chartData={stackedSalesInfo}
              title={chartTitleSalesSplitup}
              onDoubleClick={handleChartDoubleClick}
              style={{ height: "100px" }}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <BarChartComp
              chartData={waterfallStackedBar}
              title={chartTitleMarginAnalysis}
              onDoubleClick={handleChartDoubleClick}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

AnkitaGraphs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AnkitaGraphs;
