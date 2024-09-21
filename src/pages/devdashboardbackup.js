import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios"; // or fetch API
import DevSlideOutPanel from "./devslidepannel"; // Ensure this path is correct

import { DashboardLayout } from "src/components/dashboard-layout";
import debounce from "lodash.debounce";

import StackedBarChart from "src/components/charts/StackedBarChart";
import BarChartComp from "src/components/charts/BarChartComp";
import DonutChart from "src/components/charts/PieChart";
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
import DevVisualization from "./devvisualization";

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

  const [chartTitleCostWise, setChartTitleCostWise] = useState("Cost of Goods Sold");

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

  // const [chartTitle, setChartTitle] = useState("Monthly Financial Breakdown");
  const [chartTitle, setChartTitle] = useState("Cost of sales");


  // const [stackedSalesInfo, setStackedSalesInfo] = useState({
  //   labels: [],
  //   datasets: [
  //     {
  //       label: "Taxes",
  //       backgroundColor: "#51cda0",
  //       data: [],
  //     },
  //     {
  //       label: "Gross Amount",
  //       backgroundColor: "#f2a571",
  //       data: [],
  //     },
  //     {
  //       label: "Net Amount",
  //       backgroundColor: "#df7970",
  //       data: [],
  //     },

  //   ],
  // });

  const [stackedSalesInfo, setStackedSalesInfo] = useState({
    labels: [],
    datasets: [],
  });

  const [chartTitleFinancial, setChartTitleFinancial] = useState("Monthly Financial Breakdown");

  const router = useRouter();
  console.log(router.query, "router.query");
  const { dimension, timeWindow, startDate, endDate, isChecked } = router.query;

  const [includePrevYear, setIncludePrevYear] = useState(false);

  useEffect(() => {
    setIncludePrevYear(isChecked === "true" ? true : false);
  }, [isChecked]);

  const url = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";

  // for cards
  const [totalSales, setTotalSales] = useState(0);

  const [cogs, setCogs] = useState(0);

  const [margin, setMargin] = useState(0);

  useEffect(() => {
    const urls = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";

    const url = urls; // Replace with your actual URL
    const defaultCardPayload = {
      view: "measures-ytd-mtd",
    };

    const fetchCardData = async () => {
      try {
        const response = await axios.post(url, defaultCardPayload);
        const data = response.data;
        console.log(response.data, "cc");
        if (data.YTD && data.YTD.length > 0) {
          const ytdData = data.YTD[0]; // Assuming YTD data is at index 0

          // Extract values
          setTotalSales(ytdData.Total_Sales);
          setCogs(ytdData.Cogs);
          setMargin(ytdData.Margin);
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchCardData();
  }, []);

  const timeWindowMap = {
    M: "Monthly",
    Q: "Quarterly",
    Y: "Yearly",
    W: "Weekly",
  };

  // Default payload for the API request
  // const defaultPayload = useMemo(
  //   () => ({
  //     dimension: dimension || "none",
  //     view: "All",
  //     time_window: timeWindow || "M", // Default to "M" if no time window is provided
  //   }),
  //   [dimension, timeWindow]
  // );

  // const [chartData, setChartData] = useState({
  //   labels: [],
  //   datasets: [
  //     {
  //       label: "Total Sales",
  //       data: [],
  //       backgroundColor: "#197fc0",
  //     },
  //   ],
  // });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const [responseData, setResponseData] = useState([]);
  console.log(responseData, "responseData");

  const defaultPayload = useMemo(
    () => ({
      dimension: dimension || "none",
      view: "All",
      start_date: startDate || "",
      end_date: endDate || "",
      include_prev_year: includePrevYear, // Use state value
      time_window: timeWindow || "M",
    }),
    [dimension, timeWindow, includePrevYear, startDate, endDate]
  );

  useEffect(() => {
    // Ensure defaultPayload is updated whenever `isChecked` changes
    console.log("Updated defaultPayload:", defaultPayload);
  }, [defaultPayload]); // Dependency on `defaultPayload`

  const stableUrl = useMemo(() => url, [url]);
  const stablePayload = useMemo(() => defaultPayload, [defaultPayload]);

  const fetchData = useCallback(async () => {
    if (!stableUrl || !stablePayload) return;

    try {
      console.log("Fetching data with URL:", stableUrl);
      console.log("Payload:", stablePayload);

      const response = await axios.post(stableUrl, stablePayload);
      const responseData = response.data;

      console.log("Fetched data:", responseData);

      if (responseData) {
        if (stablePayload.include_prev_year) {
          // Handle case when include_prev_year is true
          if (responseData["Current Fiscal Year"] && responseData["Previous Fiscal Year"]) {
            setResponseData({
              currentYearData: responseData["Current Fiscal Year"],
              previousYearData: responseData["Previous Fiscal Year"],
            });
          } else {
            console.error("Expected fields not found in response data.");
          }
        } else {
          // Handle case when include_prev_year is false
          if (Array.isArray(responseData)) {
            setResponseData({
              currentYearData: responseData,
            });
          } else {
            console.error("Unexpected data format:", responseData);
          }
        }
      } else {
        console.error("No data available.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [stableUrl, stablePayload]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTotalSalesDataByWeek = ({ currentYearData, previousYearData }) => {
    console.log("currentYearData:", currentYearData);
    console.log("previousYearData:", previousYearData);

    const currentYearDataset = Array.isArray(currentYearData)
      ? currentYearData.map((item) => ({
          week: item.Week, // Ensure this field name matches your data
          totalSales: item.Total_Sales,
        }))
      : [];

    const previousYearDataset = Array.isArray(previousYearData)
      ? previousYearData.map((item) => ({
          week: item.Week, // Ensure this field name matches your data
          totalSales: item.Total_Sales,
        }))
      : [];

    return { currentYearDataset, previousYearDataset };
  };

  const getTotalSalesDataByQuarter = ({ currentYearData, previousYearData }) => {
    console.log("currentYearData:", currentYearData);
    console.log("previousYearData:", previousYearData);

    const currentYearDataset = Array.isArray(currentYearData)
      ? currentYearData.map((item) => ({
          quarter: item.Quarter, // Ensure these fields are correct
          totalSales: item.Total_Sales,
        }))
      : [];

    const previousYearDataset = Array.isArray(previousYearData)
      ? previousYearData.map((item) => ({
          quarter: item.Quarter, // Ensure these fields are correct
          totalSales: item.Total_Sales,
        }))
      : [];

    return { currentYearDataset, previousYearDataset };
  };

  const getTotalSalesDataByYear = ({ currentYearData, previousYearData }) => {
    console.log("currentYearData:", currentYearData);
    console.log("previousYearData:", previousYearData);

    const currentYearDataset = Array.isArray(currentYearData)
      ? currentYearData.map((item) => ({
          year: item.Year, // Ensure these fields are correct
          totalSales: item.Total_Sales,
        }))
      : [];

    const previousYearDataset = Array.isArray(previousYearData)
      ? previousYearData.map((item) => ({
          year: item.Year, // Ensure these fields are correct
          totalSales: item.Total_Sales,
        }))
      : [];

    return { currentYearDataset, previousYearDataset };
  };

  const getTotalSalesDataByMonth = ({ currentYearData, previousYearData }) => {
    console.log("currentYearData:", currentYearData);
    console.log("previousYearData:", previousYearData);

    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        month: item.Month,
        totalSales: item.Total_Sales,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        month: item.Month,
        totalSales: item.Total_Sales,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  useEffect(() => {
    if (responseData) {
      console.log("responseData:", responseData);
      console.log("timeWindow:", timeWindow);

      let currentYearData = [];
      let previousYearData = [];
      let processedData = [];

      // Extract data based on the time window
      switch (timeWindow) {
        case "W":
          const weekData = getTotalSalesDataByWeek(responseData);
          currentYearData = weekData.currentYearDataset;
          previousYearData = weekData.previousYearDataset;
          break;
        case "Q":
          const quarterData = getTotalSalesDataByQuarter(responseData);
          currentYearData = quarterData.currentYearDataset;
          previousYearData = quarterData.previousYearDataset;
          break;
        case "Y":
          const yearData = getTotalSalesDataByYear(responseData);
          currentYearData = yearData.currentYearDataset;
          previousYearData = yearData.previousYearDataset;
          break;
        case "M":
        default:
          const monthData = getTotalSalesDataByMonth(responseData);
          currentYearData = monthData.currentYearDataset;
          previousYearData = monthData.previousYearDataset;
          break;
      }

      // Combine current and previous year data
      processedData = [
        ...currentYearData.map((item) => ({
          ...item,
          year: "Current Year",
        })),
        ...previousYearData.map((item) => ({
          ...item,
          year: "Previous Year",
        })),
      ];

      // Prepare labels and data
      let labels = [];
      if (timeWindow === "W") {
        labels = [...new Set(processedData.map((item) => item.week))];
      } else if (timeWindow === "Q") {
        labels = [...new Set(processedData.map((item) => item.quarter))];
      } else if (timeWindow === "Y") {
        labels = [...new Set(processedData.map((item) => item.year))];
      } else {
        labels = [...new Set(processedData.map((item) => item.month))];
      }
      let labelType;
      if (timeWindow === "W") {
        labelType = "week";
      } else if (timeWindow === "Q") {
        labelType = "quarter";
      } else if (timeWindow === "Y") {
        labelType = "year";
      } else {
        labelType = "month";
      }
      const data = labels.map((label) => {
        const currentYearDataPoint = processedData.find(
          (item) => item[labelType] === label && item.year === "Current Year"
        );
        const previousYearDataPoint = processedData.find(
          (item) => item[labelType] === label && item.year === "Previous Year"
        );
        return {
          currentYear: currentYearDataPoint ? currentYearDataPoint.totalSales : 0,
          previousYear: previousYearDataPoint ? previousYearDataPoint.totalSales : 0,
        };
      });

      console.log("Labels:", labels);
      console.log("Data:", data);

      setChartData((prevState) => {
        const currentYearDataset = data.map((d) => d.currentYear);
        const previousYearDataset = data.map((d) => d.previousYear);

        return {
          labels: labels,
          datasets: [
            {
              label: "Current Year",
              data: currentYearDataset.filter((value) => typeof value === "number"), // Ensure only numbers are included
              backgroundColor: "rgba(25, 127, 192)",
              borderColor: "rgba(25, 127, 192)",
              borderWidth: 1,
            },
            {
              label: "Previous Year",
              data: previousYearDataset.filter((value) => typeof value === "number"), // Ensure only numbers are included
              backgroundColor: "rgba(25, 127, 192,0.16)",
              borderColor: "rgba(25, 127, 192,0.16)",
              borderWidth: 1,
            },
          ],
        };
      });
    } else {
      console.error("Response data or timeWindow is missing.");
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

  // const memoizedChartData = useMemo(() => monthlyWiseSalesChart, [monthlyWiseSalesChart]);
  // const totalsalesData = responseData ? getTotalSalesDataByMonth(responseData) : [];

  // COGS this is rigth
  // ++++++++++++++++++++++++++++++

  const getProcessedDataByMonth = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        month: item.Month,
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        month: item.Month,
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  const getProcessedDataByQuarter = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        quarter: item.Quarter, // Assuming quarter information is stored in `item.Quarter`
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        quarter: item.Quarter, // Assuming quarter information is stored in `item.Quarter`
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  const getProcessedDataByYear = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        year: item.Year,
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        year: item.Year,
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  const getProcessedDataByWeek = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        week: item.Week,
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        week: item.Week,
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  // const getTaxesDataByMonth = (data) => {
  //   return data.map((item) => ({
  //     label: item.Month,
  //     taxes: item.Taxes,
  //     grossAmount: item.Gross_Amount,
  //     netAmount: item.Net_Amount,
  //     disount: item.Discounts,
  //   }));
  // };

  // const getTaxesDataByWeek = (data) => {
  //   return data.map((item) => ({
  //     label: item.Week,
  //     taxes: item.Taxes,
  //     grossAmount: item.Gross_Amount,
  //     netAmount: item.Net_Amount,
  //     disount: item.Discounts,
  //   }));
  // };
  // const getTaxesDataByQuarter = (data) => {
  //   return data.map((item) => ({
  //     label: item.Quarter, // Assuming `Quarter` is a number 1-4
  //     taxes: item.Taxes,
  //     grossAmount: item.Gross_Amount,
  //     netAmount: item.Net_Amount,
  //     disount: item.Discounts,
  //   }));
  // };
  // const getTaxesDataByYear = (data) => {
  //   return data.map((item) => ({
  //     label: item.Year,
  //     taxes: item.Taxes,
  //     grossAmount: item.Gross_Amount,
  //     netAmount: item.Net_Amount,
  //     disount: item.Discounts,
  //   }));
  // };

  // useEffect(() => {
  //   if (responseData && responseData.length > 0) {
  //     let processedData;

  //     switch (timeWindow) {
  //       case "W":
  //         processedData = getTaxesDataByWeek(responseData);
  //         break;
  //       case "Q":
  //         processedData = getTaxesDataByQuarter(responseData);
  //         break;
  //       case "Y":
  //         processedData = getTaxesDataByYear(responseData);
  //         break;
  //       case "M":
  //       default:
  //         processedData = getTaxesDataByMonth(responseData);
  //         break;
  //     }

  //     // Extract labels and data
  //     const labels = processedData.map((item) => item.label);
  //     const grossAmountData = processedData.map((item) => item.grossAmount);
  //     const taxesData = processedData.map((item) => item.taxes);
  //     const netAmountData = processedData.map((item) => item.netAmount);
  //     const discountsData = processedData.map((item) => item.discount);

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
  //         // datasets: [
  //         //   {
  //         //     label: "Taxes",
  //         //     backgroundColor: "#ff835c",
  //         //     data: taxesData,
  //         //   },
  //         //   {
  //         //     label: "Gross Amount",
  //         //     backgroundColor: "#F5DD61",
  //         //     data: grossAmountData,
  //         //   },
  //         //   {
  //         //     label: "Net Amount",
  //         //     backgroundColor: "#4CB9E7",
  //         //     data: netAmountData,
  //         //   },
  //         //   {
  //         //     label: "Discounts",
  //         //     backgroundColor: "#9195F6",
  //         //     data: discountsData,
  //         //   },
  //         // ],
  //       };
  //     });

  //     // Update chart title based on the selected time window
  //     const titles = {
  //       W: "Cost of Sales (Weekly)",
  //       Q: "Cost of Sales (Quarterly)",
  //       Y: "Cost of Sales (Yearly)",
  //       M: "Cost of Sales (Monthly)",
  //     };
  //     setChartTitle(titles[timeWindow] || "Cost of Sales (Monthly )");
  //   }
  // }, [responseData, timeWindow]);

  const [waterfallBar, setWaterfallBar] = useState({
    labels: [],

    datasets: [],
  });

  console.log(waterfallBar,'wwwwwwwwwww')

  const [chartTitleMarginAnalysis, setChartTitleMarginAnalysis] = useState("Margin Trend Analysis");
  // const prevDataRef = useRef();

  

  // +++++++++++++++++++++++++++++

  useEffect(() => {
    if (responseData) {
      console.log("responseData:", responseData);
      console.log("timeWindow:", timeWindow);

      let currentYearData = [];
      let previousYearData = [];
      let processedData = [];

      // Extract data based on the time window
      switch (timeWindow) {
        case "W":
          const weekData = getProcessedDataByWeek(responseData);
          currentYearData = weekData.currentYearDataset;
          previousYearData = weekData.previousYearDataset;
          break;
        case "Q":
          const quarterData = getProcessedDataByQuarter(responseData);
          currentYearData = quarterData.currentYearDataset;
          previousYearData = quarterData.previousYearDataset;
          break;
        case "Y":
          const yearData = getProcessedDataByYear(responseData);
          currentYearData = yearData.currentYearDataset;
          previousYearData = yearData.previousYearDataset;
          break;
        case "M":
        default:
          const monthData = getProcessedDataByMonth(responseData);
          currentYearData = monthData.currentYearDataset;
          previousYearData = monthData.previousYearDataset;
          break;
      }

      // Combine current and previous year data
      processedData = [
        ...currentYearData.map((item) => ({
          ...item,
          year: "Current Year",
        })),
        ...previousYearData.map((item) => ({
          ...item,
          year: "Previous Year",
        })),
      ];

      let labelType;
      if (timeWindow === "W") {
        labelType = "week";
      } else if (timeWindow === "Q") {
        labelType = "quarter";
      } else if (timeWindow === "Y") {
        labelType = "year";
      } else {
        labelType = "month";
      }

      // Prepare labels and data
      let labels = [];
      if (timeWindow === "W") {
        labels = [...new Set(processedData.map((item) => item.week))];
      } else if (timeWindow === "Q") {
        labels = [...new Set(processedData.map((item) => item.quarter))];
      } else if (timeWindow === "Y") {
        labels = [...new Set(processedData.map((item) => item.year))];
      } else {
        labels = [...new Set(processedData.map((item) => item.month))];
      }

      const data = labels.map((label) => {
        const currentYearDataPoint = processedData.find(
          (item) => item[labelType] === label && item.year === "Current Year"
        );
        const previousYearDataPoint = processedData.find(
          (item) => item[labelType] === label && item.year === "Previous Year"
        );
        return {
          Supplies_Cost_CurrentYear: currentYearDataPoint ? currentYearDataPoint.Supplies_Cost : 0,
          Materials_Cost_CurrentYear: currentYearDataPoint
            ? currentYearDataPoint.Materials_Cost
            : 0,
          Discounts_CurrentYear: currentYearDataPoint ? currentYearDataPoint.Discounts : 0,
          Supplies_Cost_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.Supplies_Cost
            : 0,
          Materials_Cost_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.Materials_Cost
            : 0,
          Discounts_PreviousYear: previousYearDataPoint ? previousYearDataPoint.Discounts : 0,
        };
      });

      console.log("Labels:", labels);
      console.log("Data:", data);

      setStackedMonthWiseInfo({
        labels: labels,
        datasets: [
          {
            label: "Supplies Cost (Current Year)",
            data: data.map((d) => d.Supplies_Cost_CurrentYear),
            backgroundColor: "rgba(223,121,112)",
            stack: "currentYear",
          },
          {
            label: "Materials Cost (Current Year)",
            data: data.map((d) => d.Materials_Cost_CurrentYear),
            backgroundColor: "rgba(247,179,129)",
            stack: "currentYear",
          },
          {
            label: "Discounts (Current Year)",
            data: data.map((d) => d.Discounts_CurrentYear),
            backgroundColor: "rgba(81,205,160)",
            stack: "currentYear",
          },
          {
            label: "Supplies Cost (Previous Year)",
            data: data.map((d) => d.Supplies_Cost_PreviousYear),
            backgroundColor: "rgba(223,121,112,0.3)",
            stack: "previousYear",
          },
          {
            label: "Materials Cost (Previous Year)",
            data: data.map((d) => d.Materials_Cost_PreviousYear),
            backgroundColor: "rgba(247,179,129,0.3)",
            stack: "previousYear",
          },
          {
            label: "Discounts (Previous Year)",
            data: data.map((d) => d.Discounts_PreviousYear),
            backgroundColor: "rgba(81,205,160,0.3)",
            stack: "previousYear",
          },
        ],
      });
    } else {
      console.error("Response data or timeWindow is missing.");
    }
  }, [responseData, timeWindow]);

  // 3rd chart

  const getTaxesDataByMonth = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        month: item.Month,
        taxes: item.Taxes,
        grossAmount: item.Gross_Amount,
        netAmount: item.Net_Amount,
        discount: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        month: item.Month,
        taxes: item.Taxes,
        grossAmount: item.Gross_Amount,
        netAmount: item.Net_Amount,
        discount: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  const getTaxesDataByQuarter = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        quarter: item.Quarter,
        taxes: item.Taxes,
        grossAmount: item.Gross_Amount,
        netAmount: item.Net_Amount,
        discount: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        quarter: item.Quarter,
        taxes: item.Taxes,
        grossAmount: item.Gross_Amount,
        netAmount: item.Net_Amount,
        discount: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  const getTaxesDataByYear = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        year: item.Year,
        taxes: item.Taxes,
        grossAmount: item.Gross_Amount,
        netAmount: item.Net_Amount,
        discount: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        year: item.Year,
        taxes: item.Taxes,
        grossAmount: item.Gross_Amount,
        netAmount: item.Net_Amount,
        discount: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  const getTaxesDataByWeek = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        week: item.Week,
        taxes: item.Taxes,
        grossAmount: item.Gross_Amount,
        netAmount: item.Net_Amount,
        discount: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        week: item.Week,
        taxes: item.Taxes,
        grossAmount: item.Gross_Amount,
        netAmount: item.Net_Amount,
        discount: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  useEffect(() => {
    if (responseData) {
      console.log("responseData:", responseData);
      console.log("timeWindow:", timeWindow);

      let currentYearData = [];
      let previousYearData = [];
      let processedData = [];

      // Extract data based on the time window
      switch (timeWindow) {
        case "W":
          const weekData = getTaxesDataByWeek(responseData);
          currentYearData = weekData.currentYearDataset;
          previousYearData = weekData.previousYearDataset;
          break;
        case "Q":
          const quarterData = getTaxesDataByQuarter(responseData);
          currentYearData = quarterData.currentYearDataset;
          previousYearData = quarterData.previousYearDataset;
          break;
        case "Y":
          const yearData = getTaxesDataByYear(responseData);
          currentYearData = yearData.currentYearDataset;
          previousYearData = yearData.previousYearDataset;
          break;
        case "M":
        default:
          const monthData = getTaxesDataByMonth(responseData);
          currentYearData = monthData.currentYearDataset;
          previousYearData = monthData.previousYearDataset;
          break;
      }

      // Combine current and previous year data
      processedData = [
        ...currentYearData.map((item) => ({
          ...item,
          year: "Current Year",
        })),
        ...previousYearData.map((item) => ({
          ...item,
          year: "Previous Year",
        })),
      ];

      console.log("Processed Data:", processedData);

      let labelType;
      if (timeWindow === "W") {
        labelType = "week";
      } else if (timeWindow === "Q") {
        labelType = "quarter";
      } else if (timeWindow === "Y") {
        labelType = "year";
      } else {
        labelType = "month";
      }

      // Prepare labels and data
      let labels = [];
      if (timeWindow === "W") {
        labels = [...new Set(processedData.map((item) => item.week))];
      } else if (timeWindow === "Q") {
        labels = [...new Set(processedData.map((item) => item.quarter))];
      } else if (timeWindow === "Y") {
        labels = [...new Set(processedData.map((item) => item.year))];
      } else {
        labels = [...new Set(processedData.map((item) => item.month))];
      }

      const data = labels.map((label) => {
        const currentYearDataPoint =
          processedData.find((item) => item[labelType] === label && item.year === "Current Year") ||
          {};
        const previousYearDataPoint =
          processedData.find(
            (item) => item[labelType] === label && item.year === "Previous Year"
          ) || {};

        return {
          Taxes_CurrentYear: currentYearDataPoint.taxes || 0,
          Gross_Amount_CurrentYear: currentYearDataPoint.grossAmount || 0,
          Net_Amount_CurrentYear: currentYearDataPoint.netAmount || 0,
          Discounts_CurrentYear: currentYearDataPoint.discount || 0,
          Taxes_PreviousYear: previousYearDataPoint.taxes || 0,
          Gross_Amount_PreviousYear: previousYearDataPoint.grossAmount || 0,
          Net_Amount_PreviousYear: previousYearDataPoint.netAmount || 0,
          Discounts_PreviousYear: previousYearDataPoint.discount || 0,
        };
      });

      console.log("Labels:", labels);
      console.log("Data:", data);

      setStackedSalesInfo({
        labels: labels,
        datasets: [
          {
            label: "Taxes (Current Year)",
            data: data.map((d) => d.Taxes_CurrentYear),
            backgroundColor: "rgba(223,121,112)",
            stack: "currentYear",
          },
          {
            label: "Gross Amount (Current Year)",
            data: data.map((d) => d.Gross_Amount_CurrentYear),
            backgroundColor: "rgba(247,179,129)",
            stack: "currentYear",
          },
          {
            label: "Net Amount (Current Year)",
            data: data.map((d) => d.Net_Amount_CurrentYear),
            backgroundColor: "rgba(81,205,160)",
            stack: "currentYear",
          },
          {
            label: "Discounts (Current Year)",
            data: data.map((d) => d.Discounts_CurrentYear),
            // backgroundColor: "rgba(81,205,160,0.6)",
            backgroundColor: "rgba(75,192,192,0.6)",
            stack: "currentYear",
          },
          {
            label: "Taxes (Previous Year)",
            data: data.map((d) => d.Taxes_PreviousYear),
            backgroundColor: "rgba(223,121,112,0.3)",
            stack: "previousYear",
          },
          {
            label: "Gross Amount (Previous Year)",
            data: data.map((d) => d.Gross_Amount_PreviousYear),
            backgroundColor: "rgba(247,179,129,0.3)",
            stack: "previousYear",
          },
          {
            label: "Net Amount (Previous Year)",
            data: data.map((d) => d.Net_Amount_PreviousYear),
            backgroundColor: "rgba(81,205,160,0.3)",
            stack: "previousYear",
          },
          {
            label: "Discounts (Previous Year)",
            data: data.map((d) => d.Discounts_PreviousYear),
            // backgroundColor: "rgba(81,205,160,0.3)",
            backgroundColor: "rgba(75,192,192,0.3)",
            stack: "previousYear",
          },
        ],
      });
    }
  }, [responseData, timeWindow]);

  // 4th waterfall


// Function to process data by month
const getWaterfallDataByMonth = ({ currentYearData = [], previousYearData = [] }) => {
  let currentYearDataset = [];
  let previousYearDataset = [];
  let previousPvCurrent = 0;
  let previousUvCurrent = 0;
  let previousPvPrevious = 0;
  let previousUvPrevious = 0;

  // Process current year data
  console.log("Current Yearrrrrrrr Data:", currentYearData); // Log the data being processed
  if (Array.isArray(currentYearData)) {
    currentYearData.forEach((item, index) => {
      let uv, pv, actualuv, actualpv, sales;

      console.log("Processing current year item:", item); // Log each item
      if (index === 0) {
        uv = item?.Margin ?? 0; // Default to 0 if undefined
        pv = 0;
      } else {
        pv = previousPvCurrent + previousUvCurrent;
        uv = (item?.Margin ?? 0) - pv; // Default to 0 if undefined
      }

      actualuv = uv;
      actualpv = pv;

      if (uv < 0) {
        uv = Math.abs(uv);
        pv -= uv;
      }

      previousPvCurrent = actualpv;
      previousUvCurrent = actualuv;
      sales = actualpv + actualuv;

      currentYearDataset.push({
        period: item?.Month || "Unknown",
        uv,
        pv,
        actualuv,
        sales,
      });
    });
  }

  // Process previous year data
  console.log("Previous Year Data:", previousYearData); // Log the data being processed
  if (Array.isArray(previousYearData)) {
    previousYearData.forEach((item, index) => {
      let uv, pv, actualuv, actualpv, sales;

      console.log("Processing previous year item:", item); // Log each item
      if (index === 0) {
        uv = item?.Margin ?? 0; // Default to 0 if undefined
        pv = 0;
      } else {
        pv = previousPvPrevious + previousUvPrevious;
        uv = (item?.Margin ?? 0) - pv; // Default to 0 if undefined
      }

      actualuv = uv;
      actualpv = pv;

      if (uv < 0) {
        uv = Math.abs(uv);
        pv -= uv;
      }

      previousPvPrevious = actualpv;
      previousUvPrevious = actualuv;
      sales = actualpv + actualuv;

      previousYearDataset.push({
        period: item?.Month || "Unknown",
        uv,
        pv,
        actualuv,
        sales,
      });
    });
  }

  console.log("Current Year Dataset:", currentYearDataset); // Log final datasets
  console.log("Previous Year Dataset:", previousYearDataset);

  return { currentYearDataset, previousYearDataset };
};


// Function to process data by year
const getWaterfallDataByYear = ({ currentYearData, previousYearData }) => {
  let currentYearDataset = [];
  let previousYearDataset = [];
  let previousPv = 0;
  let previousUv = 0;

  // Process current year data
  if (Array.isArray(currentYearData)) {
    currentYearDataset = currentYearData.map((item, index) => {
      let uv, pv, actualuv, actualpv, sales;

      if (index === 0) {
        uv = item.Margin || 0;
        pv = 0;
      } else {
        pv = previousPv + previousUv;
        uv = (item.Margin || 0) - pv;
      }

      actualuv = uv;
      actualpv = pv;

      if (uv < 0) {
        uv = Math.abs(uv);
        pv -= uv;
      }

      previousPv = actualpv;
      previousUv = actualuv;
      sales = actualpv + actualuv;

      return {
        period: item.Year || "Unknown",
        uv: uv,
        pv: pv,
        actualuv: actualuv,
        sales: sales,
        margin: item.Margin || 0,
      };
    });
  }

  // Reset previous values
  previousPv = 0;
  previousUv = 0;

  // Process previous year data
  if (Array.isArray(previousYearData)) {
    previousYearDataset = previousYearData.map((item, index) => {
      let uv, pv, actualuv, actualpv, sales;

      if (index === 0) {
        uv = item.Margin || 0;
        pv = 0;
      } else {
        pv = previousPv + previousUv;
        uv = (item.Margin || 0) - pv;
      }

      actualuv = uv;
      actualpv = pv;

      if (uv < 0) {
        uv = Math.abs(uv);
        pv -= uv;
      }

      previousPv = actualpv;
      previousUv = actualuv;
      sales = actualpv + actualuv;

      return {
        period: item.Year || "Unknown",
        uv: uv,
        pv: pv,
        actualuv: actualuv,
        sales: sales,
        margin: item.Margin || 0,
      };
    });
  }

  return { currentYearDataset, previousYearDataset };
};

 
  const getWaterfallDataByQuarter = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];
    let previousPv = 0;
    let previousUv = 0;
  
    // Process current year data
    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item, index) => {
        let uv, pv, actualuv, actualpv, sales;
  
        if (index === 0) {
          uv = item.Margin || 0;
          pv = 0;
        } else {
          pv = previousPv + previousUv;
          uv = (item.Margin || 0) - pv;
        }
  
        actualuv = uv;
        actualpv = pv;
  
        if (uv < 0) {
          uv = Math.abs(uv);
          pv -= uv;
        }
  
        previousPv = actualpv;
        previousUv = actualuv;
        sales = actualpv + actualuv;
  
        return {
          period: item.Quarter || "Unknown",
          uv: uv,
          pv: pv,
          actualuv: actualuv,
          sales: sales,
          margin: item.Margin || 0,
        };
      });
    }
  
    // Reset previous values
    previousPv = 0;
    previousUv = 0;
  
    // Process previous year data
    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item, index) => {
        let uv, pv, actualuv, actualpv, sales;
  
        if (index === 0) {
          uv = item.Margin || 0;
          pv = 0;
        } else {
          pv = previousPv + previousUv;
          uv = (item.Margin || 0) - pv;
        }
  
        actualuv = uv;
        actualpv = pv;
  
        if (uv < 0) {
          uv = Math.abs(uv);
          pv -= uv;
        }
  
        previousPv = actualpv;
        previousUv = actualuv;
        sales = actualpv + actualuv;
  
        return {
          period: item.Quarter || "Unknown",
          uv: uv,
          pv: pv,
          actualuv: actualuv,
          sales: sales,
          margin: item.Margin || 0,
        };
      });
    }
  
    return { currentYearDataset, previousYearDataset };
  };

  

  // const getWaterfallDataByWeek = ({ currentYearData, previousYearData }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];
  //   let previousPv = 0;
  //   let previousUv = 0;
  
  //   // Process current year data
  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item, index) => {
  //       let uv, pv, actualuv, actualpv, sales;
  
  //       if (index === 0) {
  //         uv = item.Margin || 0;
  //         pv = 0;
  //       } else {
  //         pv = previousPv + previousUv;
  //         uv = (item.Margin || 0) - pv;
  //       }
  
  //       actualuv = uv;
  //       actualpv = pv;
  
  //       if (uv < 0) {
  //         uv = Math.abs(uv);
  //         pv -= uv;
  //       }
  
  //       previousPv = actualpv;
  //       previousUv = actualuv;
  //       sales = actualpv + actualuv;
  
  //       return {
  //         period: item.Week || "Unknown",
  //         uv: uv,
  //         pv: pv,
  //         actualuv: actualuv,
  //         sales: sales,
  //         margin: item.Margin || 0,
  //       };
  //     });
  //   }
  
  //   // Reset previous values
  //   previousPv = 0;
  //   previousUv = 0;
  
  //   // Process previous year data
  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item, index) => {
  //       let uv, pv, actualuv, actualpv, sales;
  
  //       if (index === 0) {
  //         uv = item.Margin || 0;
  //         pv = 0;
  //       } else {
  //         pv = previousPv + previousUv;
  //         uv = (item.Margin || 0) - pv;
  //       }
  
  //       actualuv = uv;
  //       actualpv = pv;
  
  //       if (uv < 0) {
  //         uv = Math.abs(uv);
  //         pv -= uv;
  //       }
  
  //       previousPv = actualpv;
  //       previousUv = actualuv;
  //       sales = actualpv + actualuv;
  
  //       return {
  //         period: item.Weelk || "Unknown",
  //         uv: uv,
  //         pv: pv,
  //         actualuv: actualuv,
  //         sales: sales,
  //         margin: item.Margin || 0,
  //       };
  //     });
  //   }
  
  //   return { currentYearDataset, previousYearDataset };
  // };


  const getWaterfallDataByWeek = ({ currentYearData = [], previousYearData = [] }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];
    let previousPvCurrent = 0;
    let previousUvCurrent = 0;
    let previousPvPrevious = 0;
    let previousUvPrevious = 0;
  
    // Process current year data
    console.log("Current Yearrrrrrrr Data:", currentYearData); // Log the data being processed
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item, index) => {
        let uv, pv, actualuv, actualpv, sales;
  
        console.log("Processing current year item:", item); // Log each item
        if (index === 0) {
          uv = item?.Margin ?? 0; // Default to 0 if undefined
          pv = 0;
        } else {
          pv = previousPvCurrent + previousUvCurrent;
          uv = (item?.Margin ?? 0) - pv; // Default to 0 if undefined
        }
  
        actualuv = uv;
        actualpv = pv;
  
        if (uv < 0) {
          uv = Math.abs(uv);
          pv -= uv;
        }
  
        previousPvCurrent = actualpv;
        previousUvCurrent = actualuv;
        sales = actualpv + actualuv;
  
        currentYearDataset.push({
          period: item?.Week || "Unknown",
          uv,
          pv,
          actualuv,
          sales,
        });
      });
    }
  
    // Process previous year data
    console.log("Previous Year Data:", previousYearData); // Log the data being processed
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item, index) => {
        let uv, pv, actualuv, actualpv, sales;
  
        console.log("Processing previous year item:", item); // Log each item
        if (index === 0) {
          uv = item?.Margin ?? 0; // Default to 0 if undefined
          pv = 0;
        } else {
          pv = previousPvPrevious + previousUvPrevious;
          uv = (item?.Margin ?? 0) - pv; // Default to 0 if undefined
        }
  
        actualuv = uv;
        actualpv = pv;
  
        if (uv < 0) {
          uv = Math.abs(uv);
          pv -= uv;
        }
  
        previousPvPrevious = actualpv;
        previousUvPrevious = actualuv;
        sales = actualpv + actualuv;
  
        previousYearDataset.push({
          period: item?.Week || "Unknown",
          uv,
          pv,
          actualuv,
          sales,
        });
      });
    }
  
    console.log("Current Year Dataset:", currentYearDataset); // Log final datasets
    console.log("Previous Year Dataset:", previousYearDataset);
  
    return { currentYearDataset, previousYearDataset };
  };
  useEffect(() => {
    if (responseData) {
      console.log("responseData:", responseData);
      console.log("timeWindow:", timeWindow);
  
      let currentYearData = [];
      let previousYearData = [];
      let processedData = [];
  
      // Extract data based on the time window
      switch (timeWindow) {
        case "W":
          const weekData = getWaterfallDataByWeek(responseData);
          currentYearData = weekData.currentYearDataset;
          previousYearData = weekData.previousYearDataset;
          break;
        case "Q":
          const quarterData = getWaterfallDataByQuarter(responseData);
          currentYearData = quarterData.currentYearDataset;
          previousYearData = quarterData.previousYearDataset;
          break;
        case "Y":
          const yearData = getWaterfallDataByYear(responseData);
          currentYearData = yearData.currentYearDataset;
          previousYearData = yearData.previousYearDataset;
          break;
        case "M":
        default:
          const monthData = getWaterfallDataByMonth(responseData);
          currentYearData = monthData.currentYearDataset;
          previousYearData = monthData.previousYearDataset;
          break;
      }
  
      console.log("Current Year Data:", currentYearData);
      console.log("Previous Year Data:", previousYearData);
  
      // Prepare labels (periods) from both datasets
      const currentYearLabels = [...new Set(currentYearData.map((item) => item.period))];
      const previousYearLabels = [...new Set(previousYearData.map((item) => item.period))];
      const labels = [...new Set([...currentYearLabels, ...previousYearLabels])];
      console.log("Labels:", labels);
  
      // Prepare data for chart
      const pvData = labels.map((label) => {
        const currentYearPoint = currentYearData.find((item) => item.period === label);
        const previousYearPoint = previousYearData.find((item) => item.period === label);
        return {
          currentYear: currentYearPoint ? currentYearPoint.pv : 0,
          previousYear: previousYearPoint ? previousYearPoint.pv : 0,
        };
      });
  
      const uvData = labels.map((label) => {
        const currentYearPoint = currentYearData.find((item) => item.period === label);
        const previousYearPoint = previousYearData.find((item) => item.period === label);
        return {
          currentYear: currentYearPoint ? currentYearPoint.uv : 0,
          previousYear: previousYearPoint ? previousYearPoint.uv : 0,
        };
      });
  
      const actualSalesData = labels.map((label) => {
        const currentYearPoint = currentYearData.find((item) => item.period === label);
        const previousYearPoint = previousYearData.find((item) => item.period === label);
        return {
          currentYear: currentYearPoint ? currentYearPoint.sales : 0,
          previousYear: previousYearPoint ? previousYearPoint.sales : 0,
        };
      });
  
      const actualUV = labels.map((label) => {
        const currentYearPoint = currentYearData.find((item) => item.period === label);
        const previousYearPoint = previousYearData.find((item) => item.period === label);
        return {
          currentYear: currentYearPoint ? currentYearPoint.actualuv : 0,
          previousYear: previousYearPoint ? previousYearPoint.actualuv : 0,
        };
      });
  
      // Map colors based on actualUV values (positive = blue, negative = red)
      const backgroundColorCurrentYear = actualUV.map((uv) =>
        uv.currentYear >= 0 ? "rgb(102, 217, 255)" : "rgb(255, 77, 77)"
      );
      const backgroundColorPreviousYear = actualUV.map((uv) =>
        uv.previousYear >= 0 ? "rgb(102, 217, 255,0.18)" : "rgb(255, 77, 77, 0.18)"
      );
  
      // Create new data object
      const newData = {
        labels: labels,
        datasets: [
          {
            label: "Current Year PV",
            data: pvData.map((data) => data.currentYear),
            // backgroundColor: "#66d9ff",
            backgroundColor: "transparent",

            // borderWidth: 1,
            stack: "a",
          },
          {
            label: "Previous Year PV",
            data: pvData.map((data) => data.previousYear),
            backgroundColor: "transparent",
            // borderWidth: 1,
            stack: "b",
          },
          {
            label: "Current Year UV",
            data: uvData.map((data) => data.currentYear),
            backgroundColor: backgroundColorCurrentYear,
            // borderWidth: 1,
            stack: "a",
          },
          {
            label: "Previous Year UV",
            data: uvData.map((data) => data.previousYear),
            backgroundColor: backgroundColorPreviousYear,
            // borderWidth: 1,
            stack: "b",
          },
          // {
          //   label: "Current Year Sales",
          //   data: actualSalesData.map((data) => data.currentYear),
          //   backgroundColor: "rgba(102, 217, 255, 0.2)",
          //   borderColor: "#66d9ff",
          //   borderWidth: 1,
          //   // type: "line", // Change type to 'line' if needed
          // },
          // {
          //   label: "Previous Year Sales",
          //   data: actualSalesData.map((data) => data.previousYear),
          //   backgroundColor: "rgba(179, 179, 179, 0.2)",
          //   borderColor: "#b3b3b3",
          //   borderWidth: 1,
          //   // type: "line", // Change type to 'line' if needed
          // }
        ],
      };
  
      // Update the chart data only if it has changed
      setWaterfallBar((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
          return newData;
        }
        return prevData;
      });
    } else {
      console.error("Response data or timeWindow is missing.");
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

  const token = "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/refresh-token-auth";
  const checkTokenExpired = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const expTime = GetTokenExpiredTime();
    const remainingTime = expTime - currentTime;
    if (remainingTime <= 300) {
      var refreshTokenUrl = token;
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
      <p>Start Date: {startDate || "Not selected"}</p>
      <p>End Date: {endDate || "Not selected"}</p>
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
                {/* {YTDTotalSales} */}₹{totalSales.toLocaleString()}
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
                ₹{cogs.toLocaleString()}
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
                {/* ₹{totalProfit.toLocaleString()} */}₹{margin.toLocaleString()}
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
                {/* ₹{MTDTotalSales.toLocaleString()} */}₹{MTDTotalSales.toLocaleString()}
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
      <div
        style={{
          marginBottom: "0px",
          fontWeight: "bold",
          padding: "0px",
          fontSize: "15px",
          marginTop: "10px",
          fontFamily: "-moz-initial",
        }}
      >
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
            <BarChart
              chartData={chartData}
              // title={chartTitlemonthwise}
              title={`Total Sales (${timeWindowMap[timeWindow] || "Monthly"})`}
              onDoubleClick={() => console.log("Chart clicked")}
            />
            {/* <DonutChart
              chartData={chartData}
              // title={chartTitlemonthwise}
              title={`Total Sales (${timeWindowMap[timeWindow] || "Month"})`}
              onDoubleClick={() => console.log("Chart clicked")}
            /> */}
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
              chartData={waterfallBar}
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
