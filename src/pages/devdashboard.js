import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios"; // or fetch API
import DevSlideOutPanel from "./devslidepannel"; // Ensure this path is correct
import SlideOutPanel from "./slideoutpannel"; // Ensure this path is correct

import { DashboardLayout } from "src/components/dashboard-layout";
import debounce from "lodash.debounce";

import StackedBarChart from "src/components/charts/StackedBarChart";
import BarChartComp from "src/components/charts/BarChartComp";
import  DonutChart from "src/components/charts/PieChart";
import BarChartWeekly from "src/components/charts/BarChartWeekly";

import BarChart from "src/components/charts/BarChart";
import dynamic from "next/dynamic";
import { useRouter } from "next/router"; // or use location from react-router
import { GetAuthToken } from "src/components/charts/AuthDetails";
import { GetSchema } from "src/components/charts/AuthDetails";
import { GetTokenExpiredTime, GetRefreshToken, baseURLs } from "src/components/charts/AuthDetails";

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
  Tooltip,
} from "@mui/material";

const DevDashboard = () => {
  // const [responseData, setResponseData] = useState(null);
  const [monthlyWiseSalesChart, setMonthWiseSalesChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Total Sales",
        backgroundColor: "rgba(73, 77, 140)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [],
      },
    ],
  });
  const [chartTitlemonthwise, setChartTitlemonthwise] = useState("Monthly Total Sales");

  const [taxesChart, setTaxesChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Taxes",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        data: [],
      },
    ],
  });
  const [chartTitleTaxes, setChartTitleTaxes] = useState("Monthly Taxes");

  const [chartTitleCostWise, setChartTitleCostWise] = useState("Monthly Cost Sales");

  const [YTDTotalSales, setYTDTotalSales] = useState(0);
  console.log(YTDTotalSales, "YTDTotalSalesYTDTotalSalesYTDTotalSales");
  const [YTDtotalCost, setYTDTotalCost] = useState(0);
  const [YTDtotalMargin, setYTDTotalMargin] = useState(0);

  const [MTDTotalSales, setMTDTotalSales] = useState(0);
  const [MTDtotalCost, setMTDTotalCost] = useState(0);
  const [MTDTotalMargin, setMTDTotalMargin] = useState(0);

  const [selectedFilter, setSelectedFilter] = useState(1);

  const baseURL = baseURLs();

  // State for Stacked Chart Data
  const [stackedMonthWiseInfo, setStackedMonthWiseInfo] = useState({
    labels: [],
    datasets: [],
    legendVisible: 1,
  });

  const [chartTitle, setChartTitle] = useState("Monthly Financial Breakdown");

  const [stackedSalesInfo, setStackedSalesInfo] = useState({
    labels: [],
    datasets: [
      {
        label: "Taxes",
        backgroundColor: "#51cda0",
        data: [],
      },
      {
        label: "Gross Amount",
        backgroundColor: "#f2a571",
        data: [],
      },
      {
        label: "Net Amount",
        backgroundColor: "#df7970",
        data: [],
      },
      // {
      //   label: "Taxes",
      //   backgroundColor: "#ffa31a",
      //   data: [],
      // },
      // {
      //   label: "Gross Amount",
      //   backgroundColor: "#ffb84d",
      //   data: [],
      // },
      // {
      //   label: "Net Amount",
      //   backgroundColor: "#ffcc80",
      //   data: [],
      // },
    ],
  });

  const [chartTitleFinancial, setChartTitleFinancial] = useState("Monthly Financial Breakdown");

  const router = useRouter();
  const { dimension, timeWindow } = router.query;

  const timeWindowMap = {
    M: "Month",
    Q: "Quarter",
    Y: "Year",
    W: "Week",
  };

  // Default payload for the API request
  const defaultPayload = useMemo(
    () => ({
      dimension: dimension || "none",
      view: "All",
      time_window: timeWindow || "M", // Default to "M" if no time window is provided
    }),
    [dimension, timeWindow]
  );

  // Memoize the payload for fetching yearly data
  const yearlyPayload = useMemo(
    () => ({
      dimension: dimension || "none",
      view: "All",
      time_window: "Y", // Set to "Y" for yearly data
    }),
    [dimension, timeWindow]
  );

  const [responseData, setResponseData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Total Sales",
        data: [],
        // backgroundColor: "rgba(73, 77, 140)",
        // backgroundColor: "rgba(73, 77, 140)", // Example color
        backgroundColor: "#197fc0"
      },
    ],
  });

  const url = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";

  const stableUrl = useMemo(() => url, [url]);
  const stablePayload = useMemo(() => defaultPayload, [defaultPayload]);

  // const fetchData = useCallback(async () => {
  //   if (!stableUrl || !stablePayload) return;

  //   try {
  //     const response = await axios.post(stableUrl, stablePayload);
  //     if (response.data && Array.isArray(response.data)) {
  //       setResponseData(response.data);
  //       console.log(response.data,'rrrrrrrrrrrrrrr')

  //     } else {
  //       console.error("Unexpected data format:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }, [stableUrl, stablePayload]);

  // for cards

  const fetchData = useCallback(async () => {
    if (!stableUrl || !stablePayload) return;

    try {
      // Fetch monthly data for graphs
      const response = await axios.post(stableUrl, stablePayload);
      if (response.data && Array.isArray(response.data)) {
        setResponseData(response.data);
        console.log(response.data, "Monthly Data");
        const yearData = response.data.find((item) => item.Year);

        if (yearData) {
          // Set YTD Total Sales if year data is found
          setYTDTotalSales(parseFloat(yearData.Total_Sales));

          const supplierCost = parseFloat(yearData.Supplies_Cost) || 0;
          const materialsCost = parseFloat(yearData.Materials_Cost) || 0;
          const discount = parseFloat(yearData.Discounts) || 0;

          const totalCost = supplierCost + materialsCost + discount;
          console.log(totalCost);

          setYTDTotalCost(totalCost);

          const margin = parseFloat(yearData.Margin) || 0;
          setYTDTotalMargin(margin);

        }
        console.log("hiii");
      } else {
        console.error("Unexpected data format:", response.data);
      }

      // Fetch yearly total sales
      // const yearlyResponse = await axios.post(stableUrl, yearlyPayload);
      // if (yearlyResponse.data && Array.isArray(yearlyResponse.data)) {
      //   const yearData = yearlyResponse.data.find(item => item.time_window === "Y");
      //   setYTDTotalSales(yearData ? parseFloat(yearData.Total_Sales) : 0);
      //   console.log(yearData, 'Yearly Data');
      // } else {
      //   console.error("Unexpected yearly data format:", yearlyResponse.data);
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [stableUrl, stablePayload, yearlyPayload]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // total sales   this is for only monthly
  // useEffect(() => {
  //   if (responseData) {
  //     const totalsalesData = getTotalSalesDataByMonth(responseData);

  //     const labels = totalsalesData.map((item) => item.month);
  //     const data = totalsalesData.map((item) => item.totalSales);

  //     setMonthWiseSalesChart((prevState) => {
  //       // Only update if there are actual changes
  //       if (
  //         JSON.stringify(prevState.labels) !== JSON.stringify(labels) ||
  //         JSON.stringify(prevState.datasets[0].data) !== JSON.stringify(data)
  //       ) {
  //         return {
  //           ...prevState,
  //           labels: labels,
  //           datasets: [
  //             {
  //               ...prevState.datasets[0],
  //               data: data,
  //             },
  //           ],
  //         };
  //       }
  //       return prevState;
  //     });

  //     updateChartTitle();
  //   }
  // }, [responseData]);

  // based on user time window

  // const getTotalSalesDataByMonth = (responseData) => {
  //   return responseData.map((item) => ({
  //     month: item.Month,
  //     totalSales: item.Total_Sales,
  //   }));
  // };

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

  const getTotalSalesDataByWeek = (responseData) => {
    return responseData.map((item) => ({
      week: item.Week,
      totalSales: item.Total_Sales,
    }));
  };

  const getTotalSalesDataByQuarter = (responseData) => {
    return responseData.map((item) => ({
      quarter: item.Quarter,
      totalSales: item.Total_Sales,
    }));
  };

  const getTotalSalesDataByYear = (responseData) => {
    return responseData.map((item) => ({
      year: item.Year,
      totalSales: item.Total_Sales,
    }));
  };
  useEffect(() => {
    if (responseData) {
      let processedData;

      switch (timeWindow) {
        case "W":
          processedData = getTotalSalesDataByWeek(responseData);
          break;
        case "Q":
          processedData = getTotalSalesDataByQuarter(responseData);
          break;
        case "Y":
          processedData = getTotalSalesDataByYear(responseData);
          break;
        case "M":
        default:
          processedData = getTotalSalesDataByMonth(responseData);
          break;
      }

      const labels = processedData.map((item) => {
        switch (timeWindow) {
          case "W":
            return item.week; // Ensure `item.week` matches your data
          case "Q":
            return item.quarter; // Ensure `item.quarter` matches your data
          case "Y":
            return item.year; // Ensure `item.year` matches your data
          case "M":
          default:
            return item.month; // Ensure `item.month` matches your data
        }
      });

      const data = processedData.map((item) => item.totalSales);
      console.log(labels, "ll");
      console.log(data, "dad");
      setChartData((prevState) => {
        if (
          JSON.stringify(prevState.labels) !== JSON.stringify(labels) ||
          JSON.stringify(prevState.datasets[0].data) !== JSON.stringify(data)
        ) {
          return {
            ...prevState,
            labels: labels,
            datasets: [
              {
                ...prevState.datasets[0],
                data: data,
              },
            ],
          };
        }
        return prevState;
      });
    }
  }, [responseData, timeWindow]);

  const updateChartTitle = () => {
    const isWeekEnable = false; // Replace with actual condition
    const isQuarterEnable = false; // Replace with actual condition

    if (isWeekEnable) {
      setChartTitlemonthwise("Week Wise Total Sales");
    } else if (isQuarterEnable) {
      setChartTitlemonthwise("Quarter Wise Total Sales");
    } else {
      setChartTitlemonthwise("Monthly Total Sales");
    }
  };

  const memoizedChartData = useMemo(() => monthlyWiseSalesChart, [monthlyWiseSalesChart]);
  const totalsalesData = responseData ? getTotalSalesDataByMonth(responseData) : [];

  // COGS this is rigth

  // useEffect(() => {
  //   if (responseData) {
  //     const labels = responseData.map((item) => item.Month);

  //     const suppliesCostData = responseData.map((item) => item.Supplies_Cost || 0);
  //     const materialsCostData = responseData.map((item) => item.Materials_Cost || 0);

  //     const discountsData = responseData.map((item) => item.Discounts || 0);

  //     // Check if chart data needs updating
  //     setStackedMonthWiseInfo((prevChart) => {
  //       const needsUpdate = !(
  //         JSON.stringify(prevChart.labels) === JSON.stringify(labels) &&
  //         JSON.stringify(prevChart.datasets[0].data) === JSON.stringify(suppliesCostData) &&
  //         JSON.stringify(prevChart.datasets[1].data) === JSON.stringify(materialsCostData) &&
  //         JSON.stringify(prevChart.datasets[2].data) === JSON.stringify(discountsData)
  //       );

  //       if (needsUpdate) {
  //         return {
  //           ...prevChart,
  //           labels: labels,
  //           datasets: [
  //             {
  //               label: "Supplies Cost",
  //               backgroundColor: "#df7970",
  //               data: suppliesCostData,
  //             },
  //             {
  //               label: "Materials Cost",
  //               backgroundColor: "#f7b381",
  //               data: materialsCostData,
  //             },

  //             {
  //               label: "Discounts",
  //               backgroundColor: "#51cda0",
  //               data: discountsData,
  //             },
  //           ],
  //         };
  //       }

  //       return prevChart;
  //     });

  //     // Update chart title based on conditions
  //     const isWeekEnable = false; // Replace with actual condition
  //     const isQuarterEnable = false; // Replace with actual condition

  //     if (isWeekEnable) {
  //       setChartTitleCostWise("Week Wise Cost Sales");
  //     } else if (isQuarterEnable) {
  //       setChartTitleCostWise("Quarter Wise Cost Sales");
  //     } else {
  //       setChartTitleCostWise("Monthly Cost Sales");
  //     }
  //   }
  // }, [responseData]);

  const getProcessedDataByMonth = (data) => {
    return data.map((item) => ({
      label: item.Month, // Assuming 'Month' exists in your data
      Supplies_Cost: item.Supplies_Cost,
      Materials_Cost: item.Materials_Cost,
      Discounts: item.Discounts,
    }));
  };

  const getProcessedDataByQuarter = (data) => {
    return data.map((item) => ({
      label: item.Quarter, // Assuming 'Quarter' exists in your data
      Supplies_Cost: item.Supplies_Cost,
      Materials_Cost: item.Materials_Cost,
      Discounts: item.Discounts,
    }));
  };

  const getProcessedDataByYear = (data) => {
    return data.map((item) => ({
      label: item.Year, // Assuming 'Year' exists in your data
      Supplies_Cost: item.Supplies_Cost,
      Materials_Cost: item.Materials_Cost,
      Discounts: item.Discounts,
    }));
  };

  const getProcessedDataByWeek = (data) => {
    return data.map((item) => ({
      label: item.Week, // Assuming 'Month' exists in your data
      Supplies_Cost: item.Supplies_Cost,
      Materials_Cost: item.Materials_Cost,
      Discounts: item.Discounts,
    }));
  };

  useEffect(() => {
    if (responseData) {
      let processedData;

      switch (timeWindow) {
        case "W":
          processedData = getProcessedDataByWeek(responseData);
          break;
        case "Q":
          processedData = getProcessedDataByQuarter(responseData);
          break;
        case "Y":
          processedData = getProcessedDataByYear(responseData);
          break;
        case "M":
        default:
          processedData = getProcessedDataByMonth(responseData);
          break;
      }

      const labels = processedData.map((item) => item.label);
      const suppliesCostData = processedData.map((item) => item.Supplies_Cost);
      const materialsCostData = processedData.map((item) => item.Materials_Cost);
      const discountsData = processedData.map((item) => item.Discounts);

      setStackedMonthWiseInfo((prevChart) => {
        const needsUpdate = !(
          JSON.stringify(prevChart.labels) === JSON.stringify(labels) &&
          JSON.stringify(prevChart.datasets?.[0]?.data) === JSON.stringify(suppliesCostData) &&
          JSON.stringify(prevChart.datasets?.[1]?.data) === JSON.stringify(materialsCostData) &&
          JSON.stringify(prevChart.datasets?.[2]?.data) === JSON.stringify(discountsData)
        );

        if (needsUpdate) {
          return {
            ...prevChart,
            labels: labels,
            datasets: [
              {
                label: "Supplies Cost",
                backgroundColor: "#df7970",
                data: suppliesCostData,
              },
              {
                label: "Materials Cost",
                backgroundColor: "#f7b381",
                data: materialsCostData,
              },
              {
                label: "Discounts",
                backgroundColor: "#51cda0",
                data: discountsData,
              },
            ],
            legendVisible: 1, // Keeping the legend visible
          };
        }

        return prevChart;
      });

      // const timeWindowLabel = timeWindowMap[timeWindow] || "Month";
      // const dimensionLabel = dimension || "Cost";
      // setChartTitleCostWise(`${timeWindowLabel} Wise ${dimensionLabel} Sales`);
      const timeWindowLabel = timeWindowMap[timeWindow] || "Monthly";
      setChartTitleCostWise(`${timeWindowLabel} Cost Sales`);
    }
  }, [responseData, timeWindow, dimension]);

  // const getTaxesDataByMonth = (responseData) => {
  //   if (!Array.isArray(responseData)) {
  //     console.error("Expected responseData to be an array.");
  //     return [];
  //   }

  //   return responseData.map((item) => ({
  //     month: item.Month,
  //     taxes: item.Taxes,
  //   }));
  // };

  // useEffect(() => {
  //   if (responseData) {
  //     const taxesData = getTaxesDataByMonth(responseData);

  //     const labels = taxesData.map((item) => item.month);
  //     const data = taxesData.map((item) => item.taxes);

  //     setTaxesChart((prevState) => {
  //       // Only update if there are changes
  //       if (
  //         JSON.stringify(prevState.labels) !== JSON.stringify(labels) ||
  //         JSON.stringify(prevState.datasets[0].data) !== JSON.stringify(data)
  //       ) {
  //         return {
  //           ...prevState,
  //           labels: labels,
  //           datasets: [
  //             {
  //               ...prevState.datasets[0],
  //               data: data,
  //             },
  //           ],
  //         };
  //       }
  //       return prevState;
  //     });

  //     // Update chart title
  //     setChartTitleTaxes("Monthly Taxes");
  //   }
  // }, [responseData]);

  // const taxesData = responseData ? getTaxesDataByMonth(responseData) : [];

  // 3rd tax
  // useEffect(() => {
  //   if (responseData && responseData.length > 0) {
  //     // Extract the data for Taxes, Gross Amount, and Net Amount
  //     const labels = responseData.map((item) => item.Month);
  //     const taxesData = responseData.map((item) => item.Taxes);
  //     const grossAmountData = responseData.map((item) => item.Gross_Amount);
  //     const netAmountData = responseData.map((item) => item.Net_Amount);

  //     // Only update the state if the data has changed to avoid unnecessary re-renders
  //     setStackedSalesInfo((prevState) => {
  //       const isDataSame =
  //         JSON.stringify(prevState.labels) === JSON.stringify(labels) &&
  //         JSON.stringify(prevState.datasets[0].data) === JSON.stringify(taxesData) &&
  //         JSON.stringify(prevState.datasets[1].data) === JSON.stringify(grossAmountData) &&
  //         JSON.stringify(prevState.datasets[2].data) === JSON.stringify(netAmountData);

  //       if (isDataSame) return prevState;

  //       return {
  //         ...prevState,
  //         labels: labels,
  //         datasets: [
  //           { ...prevState.datasets[0], data: taxesData },
  //           { ...prevState.datasets[1], data: grossAmountData },
  //           { ...prevState.datasets[2], data: netAmountData },
  //         ],
  //       };
  //     });

  //     // Update chart title based on your conditions
  //     const isWeekEnable = false; // Replace with actual condition
  //     const isQuarterEnable = false; // Replace with actual condition

  //     if (isWeekEnable) {
  //       setChartTitle("Week Wise Financial Breakdown");
  //     } else if (isQuarterEnable) {
  //       setChartTitle("Quarter Wise Financial Breakdown");
  //     } else {
  //       setChartTitle("Monthly Financial Breakdown");
  //     }
  //   }
  // }, [responseData]);

  const getTaxesDataByMonth = (data) => {
    return data.map((item) => ({
      label: item.Month,
      taxes: item.Taxes,
      grossAmount: item.Gross_Amount,
      netAmount: item.Net_Amount,
      disount: item.Discounts,

    }));
  };

  const getTaxesDataByWeek = (data) => {
    return data.map((item) => ({
      label: item.Week,
      taxes: item.Taxes,
      grossAmount: item.Gross_Amount,
      netAmount: item.Net_Amount,
      disount: item.Discounts,
    }));
  };
  const getTaxesDataByQuarter = (data) => {
    return data.map((item) => ({
      label: item.Quarter, // Assuming `Quarter` is a number 1-4
      taxes: item.Taxes,
      grossAmount: item.Gross_Amount,
      netAmount: item.Net_Amount,
      disount: item.Discounts,
    }));
  };
  const getTaxesDataByYear = (data) => {
    return data.map((item) => ({
      label: item.Year,
      taxes: item.Taxes,
      grossAmount: item.Gross_Amount,
      netAmount: item.Net_Amount,
      disount: item.Discounts,
    }));
  };



  useEffect(() => {
    if (responseData && responseData.length > 0) {
      let processedData;

      switch (timeWindow) {
        case "W":
          processedData = getTaxesDataByWeek(responseData);
          break;
        case "Q":
          processedData = getTaxesDataByQuarter(responseData);
          break;
        case "Y":
          processedData = getTaxesDataByYear(responseData);
          break;
        case "M":
        default:
          processedData = getTaxesDataByMonth(responseData);
          break;
      }

      // Extract labels and data
      const labels = processedData.map((item) => item.label);
      const grossAmountData = processedData.map((item) => item.grossAmount);
      const taxesData = processedData.map((item) => item.taxes);
      const netAmountData = processedData.map((item) => item.netAmount);
      const discountsData = processedData.map((item) => item.discount);


      // Only update the state if the data has changed to avoid unnecessary re-renders
      setStackedSalesInfo((prevState) => {
        const isDataSame =
          JSON.stringify(prevState.labels) === JSON.stringify(labels) &&
          JSON.stringify(prevState.datasets[0].data) === JSON.stringify(taxesData) &&
          JSON.stringify(prevState.datasets[1].data) === JSON.stringify(grossAmountData) &&
          JSON.stringify(prevState.datasets[2].data) === JSON.stringify(netAmountData);

        if (isDataSame) return prevState;

        return {
          ...prevState,
          labels: labels,
          datasets: [
            { ...prevState.datasets[0], data: taxesData },
            { ...prevState.datasets[1], data: grossAmountData },
            { ...prevState.datasets[2], data: netAmountData },
          ],
          // datasets: [
          //   {
          //     label: "Taxes",
          //     backgroundColor: "#ff835c",
          //     data: taxesData,
          //   },
          //   {
          //     label: "Gross Amount",
          //     backgroundColor: "#F5DD61",
          //     data: grossAmountData,
          //   },
          //   {
          //     label: "Net Amount",
          //     backgroundColor: "#4CB9E7",
          //     data: netAmountData,
          //   },
          //   {
          //     label: "Discounts",
          //     backgroundColor: "#9195F6",
          //     data: discountsData,
          //   },
          // ],
        };
      });

      // Update chart title based on the selected time window
      const titles = {
        W: "Weekly Financial Breakdown",
        Q: "Quarterly Financial Breakdown",
        Y: "Yearly Financial Breakdown",
        M: "Monthly Financial Breakdown",
      };
      setChartTitle(titles[timeWindow] || "Monthly Financial Breakdown");
    }
  }, [responseData, timeWindow]);

  // 4th margin

  // const getWaterfallDataByMonth = (responseData) => {
  //   let previousPv = 0;
  //   let previousUv = 0;

  //   return responseData.map((item, index) => {
  //     let uv, pv, actualuv, actualpv, sales;

  //     // Handle the first item
  //     if (index === 0) {
  //       uv = item.Margin || 0;
  //       pv = 0;
  //     } else {
  //       // Calculate the previous and current values
  //       pv = previousPv + previousUv;
  //       uv = (item.Margin || 0) - pv;
  //     }

  //     // Update actual values
  //     actualuv = uv;
  //     actualpv = pv;

  //     // Adjust for negative values
  //     if (uv < 0) {
  //       uv = Math.abs(uv);
  //       pv -= uv;
  //     }

  //     // Update previous values
  //     previousPv = actualpv;
  //     previousUv = actualuv;
  //     sales = actualpv + actualuv;

  //     return { month: item.Month || "Unknown", uv, pv, actualuv, sales };
  //   });
  // };


//   useEffect(() => {
//     if (responseData && responseData.length > 0) {
//       let processedData;
// let legendVisible = 0
//       switch (timeWindow) {
//         case "W":
//           processedData = getTaxesDataByWeek(responseData);
//           break;
//         case "Q":
//           processedData = getTaxesDataByQuarter(responseData);
//           break;
//         case "Y":
//           processedData = getTaxesDataByYear(responseData);
//           break;
//         case "M":
//         default:
//           processedData = getTaxesDataByMonth(responseData);
//           break;
//       }

//       // Extract labels and data
//       const labels = processedData.map((item) => item.label);
//       const grossAmountData = processedData.map((item) => item.grossAmount);
//       const taxesData = processedData.map((item) => item.taxes);
//       const netAmountData = processedData.map((item) => item.netAmount);

//       // Only update the state if the data has changed to avoid unnecessary re-renders
//       setStackedSalesInfo((prevState) => {
//         const isDataSame =
//           JSON.stringify(prevState.labels) === JSON.stringify(labels) &&
//           JSON.stringify(prevState.datasets[0].data) === JSON.stringify(taxesData) &&
//           JSON.stringify(prevState.datasets[1].data) === JSON.stringify(grossAmountData) &&
//           JSON.stringify(prevState.datasets[2].data) === JSON.stringify(netAmountData);

//         if (isDataSame) return prevState;

//         return {
//           ...prevState,
//           labels: labels,
//           legendVisible: legendVisible, // Ensure this value is appropriately set
//           datasets: [
//             { ...prevState.datasets[0], data: taxesData },
//             { ...prevState.datasets[1], data: grossAmountData },
//             { ...prevState.datasets[2], data: netAmountData },
//             {
//               label: "Taxes",
//               backgroundColor: "#ff835c",
//               data: taxesData,
//             },
//             {
//               label: "Gross Amount",
//               backgroundColor: "#F5DD61",
//               data: grossAmountData,
//             },
//             // {
//             //   label: "OtherCharge",
//             //   backgroundColor: "#4CB9E7",
//             //   data: responseData.TotalSalesSplitupInfo.map((item) => item.sales_otherchargeamount),
//             // },
//             // {
//             //   label: "Rounding",
//             //   backgroundColor: "#21c2c3",
//             //   data: responseData.TotalSalesSplitupInfo.map((item) => item.sales_rounding),
//             // },
//             // {
//             //   label: "Tip",
//             //   backgroundColor: "#f2a571",
//             //   data: responseData.TotalSalesSplitupInfo.map((item) => item.sales_tip),
//             // },
//             {
//               label: "Net Amount",
//               backgroundColor: "#9195F6",
//               data: netAmountData,
//             },
//           ],
//         };
//       });

//       // Update chart title based on the selected time window
//       const titles = {
//         W: "Weekly Financial Breakdown",
//         Q: "Quarterly Financial Breakdown",
//         Y: "Yearly Financial Breakdown",
//         M: "Monthly Financial Breakdown",
//       };
//       setChartTitle(titles[timeWindow] || "Monthly Financial Breakdown");
//     } else {
//       // If there's no responseData, reset the chart
//       setStackedSalesInfo((prevChart) => ({
//         ...prevChart,
//         legendVisible: 0,
//         datasets: prevChart.datasets.map((dataset) => ({
//           ...dataset,
//           data: Array(dataset.data.length).fill(0),
//         })),
//       }));
//     }
//   }, [responseData, timeWindow]);

  const [waterfallStackedBar, setWaterfallStackedBar] = useState({
    labels: [],

    datasets: [],
  });

  const [chartTitleMarginAnalysis, setChartTitleMarginAnalysis] = useState("");
  const prevDataRef = useRef();

  // useEffect(() => {
  //   if (responseData) {
  //     // Determine the chart title based on conditions
  //     setChartTitleMarginAnalysis("Margin Trend Analysis");

  //     // Get data for the waterfall chart
  //     const waterfallData = getWaterfallDataByMonth(responseData);

  //     // Prepare labels and data
  //     const labels = responseData.map((item) => item.Month || "Unknown");
  //     const uvData = waterfallData.map((entry) => entry.uv);
  //     const pvData = waterfallData.map((entry) => entry.pv);
  //     const actualSalesData = waterfallData.map((entry) => entry.sales);
  //     const actualUV = waterfallData.map((entry) => entry.actualuv);

  //     const newData = {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: "hiiii",
  //           backgroundColor: "transparent",
  //           stack: "a",
  //           data: pvData,
  //         },
  //         {
  //           label: "Margin Trend Analysis",
  //           backgroundColor: waterfallData.map((item) =>
  //             item.actualuv < 0 ? "#ff4d4d" : "#66d9ff"
  //           ),
  //           borderWidth: 1,
  //           data: uvData,
  //           stack: "a",
  //           salesData: actualSalesData,
  //           actualuv: actualUV,
  //         },
  //       ],
  //     };

  //     // Compare with previous data to avoid unnecessary updates
  //     if (JSON.stringify(prevDataRef.current) !== JSON.stringify(newData)) {
  //       setWaterfallStackedBar(newData);
  //       prevDataRef.current = newData;
  //     }
  //   } else {
  //     setWaterfallStackedBar((prevChart) => ({
  //       ...prevChart,
  //       datasets: prevChart.datasets.map((dataset) => ({
  //         ...dataset,
  //         data: Array(dataset.data.length).fill(0),
  //       })),
  //     }));
  //     console.log("Sales Margin: No data found or the data is empty");
  //   }
  // }, [responseData]);

  const getWaterfallDataByMonth = (responseData) => {
    let previousPv = 0;
    let previousUv = 0;

    return responseData.map((item, index) => {
      let uv, pv, actualuv, actualpv, sales;

      // Handle the first item
      if (index === 0) {
        uv = item.Margin || 0;
        pv = 0;
      } else {
        // Calculate the previous and current values
        pv = previousPv + previousUv;
        uv = (item.Margin || 0) - pv;
      }

      // Update actual values
      actualuv = uv;
      actualpv = pv;

      // Adjust for negative values
      if (uv < 0) {
        uv = Math.abs(uv);
        pv -= uv;
      }

      // Update previous values
      previousPv = actualpv;
      previousUv = actualuv;
      sales = actualpv + actualuv;

      return { period: item.Month || "Unknown", uv, pv, actualuv, sales };
    });
  };

  const getWaterfallDataByQuarter = (responseData) => {
    let previousPv = 0;
    let previousUv = 0;

    return responseData.map((item, index) => {
      let uv, pv, actualuv, actualpv, sales;

      // Handle the first item
      if (index === 0) {
        uv = item.Margin || 0;
        pv = 0;
      } else {
        // Calculate the previous and current values
        pv = previousPv + previousUv;
        uv = (item.Margin || 0) - pv;
      }

      // Update actual values
      actualuv = uv;
      actualpv = pv;

      // Adjust for negative values
      if (uv < 0) {
        uv = Math.abs(uv);
        pv -= uv;
      }

      // Update previous values
      previousPv = actualpv;
      previousUv = actualuv;
      sales = actualpv + actualuv;

      return { period: item.Quarter || "Unknown", uv, pv, actualuv, sales };
    });
  };

  const getWaterfallDataByYear = (responseData) => {
    let previousPv = 0;
    let previousUv = 0;

    return responseData.map((item, index) => {
      let uv, pv, actualuv, actualpv, sales;

      // Handle the first item
      if (index === 0) {
        uv = item.Margin || 0;
        pv = 0;
      } else {
        // Calculate the previous and current values
        pv = previousPv + previousUv;
        uv = (item.Margin || 0) - pv;
      }

      // Update actual values
      actualuv = uv;
      actualpv = pv;

      // Adjust for negative values
      if (uv < 0) {
        uv = Math.abs(uv);
        pv -= uv;
      }

      // Update previous values
      previousPv = actualpv;
      previousUv = actualuv;
      sales = actualpv + actualuv;

      return { period: item.Year || "Unknown", uv, pv, actualuv, sales };
    });
  };

  const getWaterfallDataByWeek = (responseData) => {
    let previousPv = 0;
    let previousUv = 0;

    return responseData.map((item, index) => {
      let uv, pv, actualuv, actualpv, sales;

      // Handle the first item
      if (index === 0) {
        uv = item.Margin || 0;
        pv = 0;
      } else {
        // Calculate the previous and current values
        pv = previousPv + previousUv;
        uv = (item.Margin || 0) - pv;
      }

      // Update actual values
      actualuv = uv;
      actualpv = pv;

      // Adjust for negative values
      if (uv < 0) {
        uv = Math.abs(uv);
        pv -= uv;
      }

      // Update previous values
      previousPv = actualpv;
      previousUv = actualuv;
      sales = actualpv + actualuv;

      return { period: item.Week || "Unknown", uv, pv, actualuv, sales };
    });
  };

  useEffect(() => {
    if (responseData && responseData.length > 0) {
      let waterfallData;

      switch (timeWindow) {
        case "W":
          waterfallData = getWaterfallDataByWeek(responseData);
          break;
        case "Q":
          waterfallData = getWaterfallDataByQuarter(responseData);
          break;
        case "Y":
          waterfallData = getWaterfallDataByYear(responseData);
          break;
        case "M":
        default:
          waterfallData = getWaterfallDataByMonth(responseData);
          break;
      }

      // Prepare labels and data
      const labels = waterfallData.map((entry) => entry.period);
      const uvData = waterfallData.map((entry) => entry.uv);
      const pvData = waterfallData.map((entry) => entry.pv);
      const actualSalesData = waterfallData.map((entry) => entry.sales);
      const actualUV = waterfallData.map((entry) => entry.actualuv);

      const newData = {
        labels: labels,
        datasets: [
          {
            label: "Previous Value",
            backgroundColor: "transparent",
            stack: "a",
            data: pvData,
          },
          {
            label: "Margin Trend Analysis",
            backgroundColor: labels.map((key) =>
              waterfallData.find((item) => item.period === key).actualuv < 0 ? "#ff4d4d" : "#66d9ff"
            ),
            borderWidth: 1,
            data: uvData,
            stack: "a",
            salesData: actualSalesData,
            actualuv: actualUV,
          },
        ],
      };

      setWaterfallStackedBar((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
          return newData;
        }
        return prevData;
      });

      const titles = {
        W: "Weekly Margin Trend Analysis",
        Q: "Quarterly Margin Trend Analysis",
        Y: "Yearly Margin Trend Analysis",
        M: "Monthly Margin Trend Analysis",
      };
      // setChartTitleMarginAnalysis("Margin Trend Analysis");
      setChartTitleMarginAnalysis(titles[timeWindow] || "Monthly Margin Trend Analysis");

      // setChartTitleMarginAnalysis(`Margin Trend Analysis (${timeWindowMap[timeWindow] || "Monthly"})`);
    } else {
      setWaterfallStackedBar({
        labels: [],
        datasets: [
          { label: "Previous Value", backgroundColor: "transparent", stack: "a", data: [] },
          {
            label: "Margin Trend Analysis",
            backgroundColor: [],
            borderWidth: 1,
            data: [],
            stack: "a",
            salesData: [],
            actualuv: [],
          },
        ],
      });
      console.log("No data found or data is empty.");
    }
  }, [responseData, timeWindow]);

  const [isPanelOpen, setPanelOpen] = useState(false);

  const handleCreateClick = () => {
    console.log("hiiiiiiiiiiiiiiiiiiiii");

    setPanelOpen(true);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
  };

  const handleSubmit = () => {
    console.log("helooo");
  };



  // ===================================code for line chartttt

  // const baseURL = () =>
  //   "https://sk5bgnkn3c.execute-api.ap-south-1.amazonaws.com/prod/salesdata/v1/";

const token = "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/refresh-token-auth"
  const checkTokenExpired = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const expTime = GetTokenExpiredTime();
    const remainingTime = expTime - currentTime;
    if (remainingTime <= 300) {
      var refreshTokenUrl = token ;
      const config = {
        headers: {
          "x-api-key": "xyz-abcd",
          "Content-Type": "application/json",
        },
      };
      const body = {
        refresh_token: GetRefreshToken(),
      };
      axios
        .post(refreshTokenUrl, body, config)
        .then((response) => {
          sessionStorage.setItem("IdToken", response.data.AuthenticationResult.IdToken);
        })
        .catch((error) => {
          console.log("RefreshToken:", error);
        });
    } else {
    }
  };
  const dimensionSetALL = () => {
    // if (selectedBranch == "All") {
    //   selectedBranch = "";
    // }
    // if (selectedBrand == "All") {
    //   selectedBrand = "";
    // }
    // if (selectedBranchLabel == "All") {
    //   selectedBranchLabel = "";
    // }
    // if (selectedChannel == "All") {
    //   selectedChannel = "";
    // }
    // if (selectedOrderSource == "All") {
    //   selectedOrderSource = "";
    // }
    // if (selectedMonth == "All") {
    //   selectedMonth = "";
    // }
    // if (selectedQuarter == "All") {
    //   selectedQuarter = "";
    // }
    // if (selectedWeek == "All") {
    //   selectedWeek = "";
    // }
  };

  const getConditions = () => {
    const conditions = {};

    // if (selectedBranch) {
    //   conditions.branchkey = selectedBranch;
    // }
    // if (selectedBrand) {
    //   conditions.BrandKey = selectedBrand;
    // }
    // if (selectedBranchLabel) {
    //   conditions.FranchiseTypeKey = selectedBranchLabel;
    // }
    // if (selectedChannel) {
    //   conditions.ChannelKey = selectedChannel;
    // }
    // if (selectedOrderSource) {
    //   conditions.OrderSourceKey = selectedOrderSource;
    // }
    // if (selectedMonth) {
    //   conditions.month = selectedMonth;
    // }
    // if (selectedQuarter) {
    //   conditions.quarter = selectedQuarter;
    // }
    // if (selectedWeek) {
    //   conditions.week = selectedWeek;
    // }
    // if (selectedYear) {
    //   conditions.year = selectedYear;
    // }

    return conditions;
  };
  const WeekWiseSalesData = async () => {
    try {
      dimensionSetALL();
      const conditions = getConditions();

      let isWeekEnable = false;
      let isQuarterEnable = false;
      if (selectedFilter === 4) {
        isWeekEnable = true;
      }
      if (selectedFilter === 3) {
        isQuarterEnable = true;
      }

      const whereClause = conditions;

      checkTokenExpired();

      var baseUrl = baseURL + "get-cost-sales-info";
      const config = {
        headers: {
          "x-api-key": "xyz-abcd",
          Authorization: GetAuthToken(),
          "Content-Type": "application/json",
        },
      };
      const body = {
        operation: "READ",
        schema: GetSchema(),
        function: "WeeklySalesMargin",
        filter_criteria: {
          where_clause: whereClause,
        },
      };

      axios
        .post(baseUrl, body, config)
        .then((response) => {
          if (response?.data?.WeeklySalesMarginInfo?.length > 0) {
            const { WeeklySalesMarginInfo } = response.data;
            const backgroundColorsWeekly = [
              "#19b091",
              "#f2a571",
              "#21c2c3",
              "#197fc0",
              "#e75361",
              "#758b98",
              "#ff835c",
            ];

            const weeks = [...new Set(WeeklySalesMarginInfo.map((item) => item.weeknumber))];
            const salPerday = {
              Monday: [],
              Tuesday: [],
              Wednesday: [],
              Thursday: [],
              Friday: [],
              Saturday: [],
              Sunday: [],
            };

            const totalSalesByWeek = WeeklySalesMarginInfo.reduce((acc, curr) => {
              if (!acc[curr.weeknumber]) {
                acc[curr.weeknumber] = 0;
              }
              acc[curr.weeknumber] += curr.salesperday;
              return acc;
            }, {});

            WeeklySalesMarginInfo.forEach((item) => {
              const dayOfWeek = item.dayofweek.trim();
              if (salPerday.hasOwnProperty(dayOfWeek)) {
                const weekIndex = weeks.indexOf(item.weeknumber); // Find the index of the week
                if (weekIndex !== -1) {
                  salPerday[dayOfWeek][weekIndex] = item.salesperday || 0; // Fill in salesperday for the respective week
                }
              }
            });

            Object.keys(salPerday).forEach((dayOfWeek) => {
              if (salPerday[dayOfWeek].length === 0) {
                // If sales data is not available for this weekday, fill it with zeros
                salPerday[dayOfWeek] = new Array(WeeklySalesMarginInfo.length).fill(0);
              }
            });

            const datasets = [
              {
                label: "Total Sales per Week",
                type: "line",
                // backgroundColor: "rgba(217, 88, 88,0.4)",
                borderColor: "#4E78A6",
                // pointBackgroundColor: "#000000",

                fill: false,
                data: Object.values(totalSalesByWeek),
                categoryPercentage: 1.0,
                barPercentage: 0.2,
                order: 2,
                ticks: false,
                pointStyle: "line",
                pointBorderWidth: 5,
                Legend: {
                  shape: "line",
                },
              },
              ...Object.keys(salPerday).map((dayOfWeek, index) => ({
                type: "bar",
                label: dayOfWeek,
                backgroundColor: backgroundColorsWeekly[index % backgroundColorsWeekly.length],
                data: salPerday[dayOfWeek],
                barPercentage: 1.0,
                categoryPercentage: 0.5,
                pointStyle: "rect",
              })),
            ];

            setWeeklyChartData({
              labels: weeks.map((weeknumber) => `Week ${weeknumber}`),
              datasets: datasets,
            });
          } else {
            setWeeklyChartData((prevChart) => ({
              ...prevChart,
              datasets: prevChart.datasets.map((dataset) => ({
                ...dataset,
                data: Array(dataset.data.length).fill(0),
                type: undefined,
              })),
            }));
            console.log("Weekly sales: No data found or the data is empty");
          }
        })
        .catch((error) => {
          console.error("Weekly sales Error:", error);
        });
    } catch (error) {
      console.error("Error fetching data or updating Weekly sales:", error);
    }
  };
  useEffect(() => {
    const authToken = GetAuthToken();

    if (!authToken || authToken.trim() === "") {
      router.push("/login");
    } else {
      WeekWiseSalesData();
    }
  }, []);



  const [WeeklyChartdata, setWeeklyChartData] = useState({
    labels: [],
    datasets: [],
    categoryPercentage: 0,
    plugins: [
      {
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: (value, context) => {
            if (context.dataset.label === "Total Sales per Week") {
              return value;
            } else {
              return "";
            }
          },
          color: "#000",
          font: {
            weight: "bold",
          },
        },
      },
    ],
  });

  const chartTitleWeeklywise = "Weekly Total Sales";
  const handleChartDoubleClick = () => {
    setShowPopupChart(true);
  };

  // ======================================================

  return (
    <>
      <Grid item xs={12} md={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Create new graph" arrow>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            style={{
              fontSize: "14px",
              marginBottom: "1%",
              backgroundColor: "#004792", // Button color
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
              color: "#fff", // Text color
              borderColor: "#b366ff", // Border color
              "&:hover": {
                backgroundColor: "#9a4fff", // Color on hover
                borderColor: "#9a4fff", // Border color on hover
              },
            }}
          >
            Query
          </Button>
        </Tooltip>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: "5px" }}>
        <Grid item xs>
          <Card
            className="dashboard-card"
            sx={{
              flex: "0",
              backgroundColor: "#19b091", // Dark blue card background color
              color: "#fff", // White font color
              className: "dashboard-card-shadow",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{
                  left: "-5px",
                  position: "relative",
                  top: "-10px",
                  fontSize: 9,
                }}
              >
                Total Sales YTD
              </Typography>
              <Typography
                variant="h3"
                component="div"
                style={{ fontSize: 14, textAlign: "Center" }}
              >
                {/* {YTDTotalSales} */}₹{YTDTotalSales.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs>
          <Card
            className={"dashboard-card"}
            sx={{
              flex: "1",
              backgroundColor: "#f2a571", // Dark blue card background color
              color: "#fff", // White font color
              className: "dashboard-card-shadow",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px", fontSize: 9 }}
              >
                Total Cost YTD
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 14, textAlign: "Center" }}
              >
                ₹{YTDtotalCost.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs>
          <Card
            className="dashboard-card"
            sx={{
              flex: "1",
              backgroundColor: "#21c2c3", // Dark blue card background color
              color: "#fff", // White font color
              className: "dashboard-card-shadow",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px", fontSize: 9 }}
              >
                Total Margin YTD
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 14, textAlign: "Center" }}
              >
                {/* ₹{totalProfit.toLocaleString()} */}
                                ₹{YTDtotalMargin.toLocaleString()}

              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs>
          <Card
            className="dashboard-card"
            sx={{
              flex: "1",
              backgroundColor: "#197fc0", // Dark blue card background color
              color: "#fff", // White font color
              className: "dashboard-card-shadow",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px", fontSize: 9 }}
              >
                Sales MTD
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 14, textAlign: "Center" }}
              >
                {/* ₹{MTDTotalSales.toLocaleString()} */}
                                ₹{MTDTotalSales.toLocaleString()}

              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs>
          <Card
            className="dashboard-card"
            sx={{
              flex: "1",
              backgroundColor: "#e75361", // Dark blue card background color
              color: "#fff", // White font color
              className: "dashboard-card-shadow",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px", fontSize: 9 }}
              >
                Cost MTD
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 14, textAlign: "Center" }}
              >
                ₹{MTDtotalCost.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs>
          <Card
            className="dashboard-card"
            sx={{
              flex: "1",
              backgroundColor: "#758b98", // Dark blue card background color
              color: "#fff", // White font color
              className: "dashboard-card-shadow",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px", fontSize: 9 }}
              >
                Margin MTD
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 14, textAlign: "Center" }}
              >
                ₹{MTDTotalMargin.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <div style={{ marginBottom: "0px", fontWeight: "bold", padding: "0px", fontSize: "15px",marginTop:"10px", fontFamily:"-moz-initial" }}>
        {dimension}
      </div>

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
            {/* <BarChart
              chartData={chartData}
              // title={chartTitlemonthwise}
              title={`Total Sales (${timeWindowMap[timeWindow] || "Month"})`}
              onDoubleClick={() => console.log("Chart clicked")}
            /> */}
            <DonutChart
              chartData={chartData}
              // title={chartTitlemonthwise}
              title={`Total Sales (${timeWindowMap[timeWindow] || "Month"})`}
              onDoubleClick={() => console.log("Chart clicked")}
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
            <StackedBarChart chartData={stackedMonthWiseInfo} title={chartTitleCostWise} />
          </div>
        </Grid>
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
              title={chartTitle}
              // onDoubleClick={handleChartDoubleClick}
              onDoubleClick={() => console.log("Financial Chart clicked")}
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
              // onDoubleClick={handleChartDoubleClick} // Ensure this function is defined elsewhere
              onDoubleClick={() => console.log("waterfall Chart clicked")}
            />
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: "1%" }}>
        <Grid item xs={12}>
          <div
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
              overflow: "hidden",
              height: "100%",
            }}
          >
            <BarChartWeekly
              chartData={WeeklyChartdata}
              title={chartTitleWeeklywise}
              onDoubleClick={handleChartDoubleClick}
            />
          </div>
        </Grid>
      </Grid>
      <DevSlideOutPanel open={isPanelOpen} onClose={handleClosePanel} handleSubmit={handleSubmit} />
    </>
  );
};
DevDashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DevDashboard;
