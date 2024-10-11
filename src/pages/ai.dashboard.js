import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios"; // or fetch API
import DevSlideOutPanel from "./devslidepannel"; // Ensure this path is correct

import { DashboardLayout } from "src/components/dashboard-layout";
// import debounce from "lodash.debounce";

import StackedBarChart from "src/components/charts/StackedBarChart";
import StackedBarChart2 from "src/components/charts/StackedBarChart2";

import BarChartComp from "src/components/charts/BarChartComp";
// import DonutChart from "src/components/charts/PieChart";
import BarChartWeekly from "src/components/charts/BarChartWeekly";

import BarChart from "src/components/charts/BarChart";
// import dynamic from "next/dynamic";
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

const AIDashboard = () => {
  // const [responseData, setResponseData] = useState(null);


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

  const [stackedSalesInfo, setStackedSalesInfo] = useState({
    labels: [],
    datasets: [],
  });

  const router = useRouter();

  const { dimension, timeWindow, startDate, endDate, isChecked } = router.query;

  const [includePrevYear, setIncludePrevYear] = useState(false);

  // useEffect(() => {
  //   // Ensure isChecked is always treated as a boolean
  //   setIncludePrevYear(isChecked === "true" || isChecked === true);
  // }, [isChecked]);

  // const url = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";
  const url = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

  // for cards
  const [totalSales, setTotalSales] = useState(0);

  const [cogs, setCogs] = useState(0);

  const [margin, setMargin] = useState(0);

  // for cards

  useEffect(() => {
    // const urls = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";
    const urls = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

    const url = urls; // Replace with your actual URL
    const defaultCardPayload = {
      view: "measures-ytd-mtd",
    };

    const fetchCardData = async () => {
      try {
        const response = await axios.post(url, defaultCardPayload);
        const data = response.data;
        // console.log(response.data, "cardsssssssssssssssssss");
        if (data.YTD && data.YTD.length > 0) {
          const ytdData = data.YTD[0]; // Assuming YTD data is at index 0

          // Extract values
          setTotalSales(ytdData.Gross_Amount);
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

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const [responseData, setResponseData] = useState([]);
  // console.log(responseData, "responseData");

  const defaultStartDate = "2024-04-01"; // Default start date
  const currentDate = new Date().toISOString().split("T")[0];

  console.log("Include Prev Year:", includePrevYear);
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  // const defaultPayload = useMemo(
  //   () => ({
  //     dimension: dimension || "none",
  //     view: "All",
  //     start_date:  startDate || "",
  //     end_date: endDate || "",
  //     include_prev_year: includePrevYear, // Use state value
  //     time_window: timeWindow || "M",

  //   }),
  //   [dimension, timeWindow, includePrevYear, startDate, endDate]
  // );

  useEffect(() => {
    // Ensure isChecked is always treated as a boolean
    if (isChecked) {
      setIncludePrevYear(isChecked === "true");
    }
  }, [isChecked]);

  const defaultPayload = useMemo(() => {
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const defaultStartDate = "2024-04-01"; // Your default start date

    return {
      dimension: dimension || "none",
      view: "All",
      start_date: includePrevYear && !startDate && !endDate ? defaultStartDate : startDate || "",
      end_date: includePrevYear && !startDate && !endDate ? currentDate : endDate || "",
      include_prev_year: includePrevYear,
      time_window: timeWindow || "M",
    };
  }, [dimension, timeWindow, includePrevYear, startDate, endDate]);

  console.log("defaultPayload:", defaultPayload);

  const stableUrl = useMemo(() => url, [url]);
  const stablePayload = useMemo(() => defaultPayload, [defaultPayload]);

  useEffect(() => {
    console.log("Updated defaultPayload:", defaultPayload);
  }, [defaultPayload]); // Dependency on `defaultPayload`

  useEffect(() => {
    const fetchData = async () => {
      if (!stableUrl || !stablePayload) return;

      try {
        // console.log("Fetching data with URL:", stableUrl);
        // console.log("Payload:", stablePayload);

        const response = await axios.post(stableUrl, stablePayload);
        const responseData = response.data;

        // console.log("Fetched data:", responseData);

        // Process response data
        const currentYearData = responseData["Current Fiscal Year"];
        if (stablePayload.include_prev_year) {
          const previousYearData = responseData["Previous Fiscal Year"];
          setResponseData({
            currentYearData,
            previousYearData,
          });
        } else {
          setResponseData({
            currentYearData,
            previousYearData: [],
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call fetch data whenever payload changes
  }, [stableUrl, stablePayload]); // React to changes in URL and payload

  useEffect(() => {
    if (responseData) {
      // console.log("Graph data updated with:", responseData);
    }
  }, [responseData]);

  const getTotalSalesDataByWeek = ({ currentYearData, previousYearData }) => {
    // console.log("currentYearData:", currentYearData);
    // console.log("previousYearData:", previousYearData);

    const currentYearDataset = Array.isArray(currentYearData)
      ? currentYearData.map((item) => ({
          week: item.Week, // Ensure this field name matches your data
          //  week: `${item.Fiscal_Year} ${item.Week}`,
          totalSales: item.Gross_Amount,
        }))
      : [];

    const previousYearDataset = Array.isArray(previousYearData)
      ? previousYearData.map((item) => ({
          week: item.Week, // Ensure this field name matches your data
          //  week: `${item.Fiscal_Year} ${item.Week}`,
          totalSales: item.Gross_Amount,
        }))
      : [];

    return { currentYearDataset, previousYearDataset };
  };

  const getTotalSalesDataByQuarter = ({ currentYearData, previousYearData }) => {
    // console.log("currentYearData:", currentYearData);
    // console.log("previousYearData:", previousYearData);

    const currentYearDataset = Array.isArray(currentYearData)
      ? currentYearData.map((item) => ({
          quarter: item.Quarter, // Ensure these fields are correct
          totalSales: item.Gross_Amount,
        }))
      : [];

    const previousYearDataset = Array.isArray(previousYearData)
      ? previousYearData.map((item) => ({
          quarter: item.Quarter, // Ensure these fields are correct
          totalSales: item.Gross_Amount,
        }))
      : [];

    return { currentYearDataset, previousYearDataset };
  };

  const getTotalSalesDataByYear = ({ currentYearData, previousYearData }) => {
    // console.log("currentYearDatayyyyyyyyyyyy:", currentYearData);
    // console.log("previousYearDatayyyyyyyyyyyyy:", previousYearData);

    const currentYearDataset = Array.isArray(currentYearData)
      ? currentYearData.map((item) => ({
          year: item.Year, // Ensure these fields are correct
          totalSales: item.Gross_Amount,
        }))
      : [];

    const previousYearDataset = Array.isArray(previousYearData)
      ? previousYearData.map((item) => ({
          year: item.Year, // Ensure these fields are correct
          totalSales: item.Gross_Amount,
        }))
      : [];

    // console.log("currentYearDataset:", currentYearDataset);
    // console.log("previousYearDataset:", previousYearDataset);
    return { currentYearDataset, previousYearDataset };
  };

  const getTotalSalesDataByMonth = ({ currentYearData, previousYearData }) => {
    // console.log("currentYearData:", currentYearData);
    // console.log("previousYearData:", previousYearData);

    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        month: item.Month,
        totalSales: item.Gross_Amount,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        month: item.Month,
        totalSales: item.Gross_Amount,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  //working coreclty all
  useEffect(() => {
    if (responseData) {
      // console.log("responseData1111111111:", responseData);
      // console.log("timeWindow:", timeWindow);

      let currentYearData = [];
      let previousYearData = [];
      let processedData = [];

      // Determine the labelType based on the timeWindow
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

      // console.log("currentYearDatasetmmm:", currentYearData);
      // console.log("previousYearDatasetmmm:", previousYearData);

      // Ensure labels are extracted correctly
      const allLabels = [
        ...new Set([
          ...currentYearData.map((item) => item[labelType]), // Use labelType here
          ...previousYearData.map((item) => item[labelType]),
        ]),
      ];

      // console.log("All Labels:", allLabels);

      // Prepare the data for each label
      const data = allLabels.map((label) => {
        // Find the matching data point for the current year
        const currentYearDataPoint = currentYearData.find((item) => item[labelType] === label);
        // Find the matching data point for the previous year
        const previousYearDataPoint = previousYearData.find((item) => item[labelType] === label);

        // Return data points for both years, or 0 if missing
        return {
          currentYear: currentYearDataPoint ? currentYearDataPoint.totalSales : 0,
          previousYear: previousYearDataPoint ? previousYearDataPoint.totalSales : 0,
        };
      });

      // console.log("Processed data:", data);

      // Update chart data
      setChartData((prevState) => {
        const currentYearDataset = data.map((d) => d.currentYear);
        const previousYearDataset = data.map((d) => d.previousYear);

        return {
          labels: allLabels, // Use the combined labels
          datasets: [
            {
              label: "Current FY",
              data: currentYearDataset,
              backgroundColor: "rgba(25, 127, 192)",
              borderColor: "rgba(25, 127, 192)",
              borderWidth: 1,
            },
            {
              label: "Corresponding Previous FY",
              data: previousYearDataset,
              backgroundColor: "rgba(25, 127, 192, 0.16)",
              borderColor: "rgba(25, 127, 192, 0.16)",
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

  // for value
  const getProcessedDataByMonth = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        month: item.Month,
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"], // Added field
        Materials_Cost_Cogs: item["Materials_Cost/Cogs"], // Added field
        // Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        month: item.Month,
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"], // Added field
        Materials_Cost_Cogs: item["Materials_Cost/Cogs"], // Added field
        // Discounts: item.Discounts,
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
        Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"], // Added field
        Materials_Cost_Cogs: item["Materials_Cost/Cogs"], // Added field
        // Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        quarter: item.Quarter, // Assuming quarter information is stored in `item.Quarter`
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"], // Added field
        Materials_Cost_Cogs: item["Materials_Cost/Cogs"], // Added field
        // Discounts: item.Discounts,
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
        Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"], // Added field
        Materials_Cost_Cogs: item["Materials_Cost/Cogs"], // Added field
        // Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        year: item.Year,
        Supplies_Cost: item.Supplies_Cost,
        Materials_Cost: item.Materials_Cost,
        Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"], // Added field
        Materials_Cost_Cogs: item["Materials_Cost/Cogs"], // Added field
        // Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    // console.log("currentYearDataset2222:", currentYearDataset);
    // console.log("previousYearDataset222:", previousYearDataset);

    return { currentYearDataset, previousYearDataset };
  };

  const getProcessedDataByWeek = ({ currentYearData, previousYearData }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];

    if (Array.isArray(currentYearData)) {
      currentYearDataset = currentYearData.map((item) => ({
        week: item.Week,
        // week: `${item.Fiscal_Year} ${item.Week}`,
        Supplies_Cost: item.Supplies_Cost,

        Materials_Cost: item.Materials_Cost,
        Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"], // Added field
        Materials_Cost_Cogs: item["Materials_Cost/Cogs"], // Added field
        // Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        week: item.Week,

        // week: `${item.Fiscal_Year} ${item.Week}`,
        Supplies_Cost: item.Supplies_Cost,

        Materials_Cost: item.Materials_Cost,
        Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"], // Added field
        Materials_Cost_Cogs: item["Materials_Cost/Cogs"], // Added field
        // Discounts: item.Discounts,
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  const [waterfallBar, setWaterfallBar] = useState({
    labels: [],

    datasets: [],
  });

  // console.log(waterfallBar, "wwwwwwwwwww");

  const [chartTitleMarginAnalysis, setChartTitleMarginAnalysis] = useState("Margin Trend Analysis");
  // const prevDataRef = useRef();

  // +++++++++++++++++++++++++++++

  useEffect(() => {
    if (responseData) {
      // console.log("responseData:", responseData);
      // console.log("timeWindow:", timeWindow);

      let currentYearData = [];
      let previousYearData = [];

      // Determine the labelType based on the timeWindow
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

      // Ensure labels are extracted correctly
      const allLabels = [
        ...new Set([
          ...currentYearData.map((item) => item[labelType]),
          ...previousYearData.map((item) => item[labelType]),
        ]),
      ];

      // console.log("All Labels:", allLabels);

      // Prepare the data for each label
      const data = allLabels.map((label) => {
        const currentYearDataPoint = currentYearData.find((item) => item[labelType] === label);
        const previousYearDataPoint = previousYearData.find((item) => item[labelType] === label);

        // console.log("Current Year Data Point22222:", currentYearDataPoint);

        return {
          Supplies_Cost_CurrentYear: currentYearDataPoint ? currentYearDataPoint.Supplies_Cost : 0,
          Materials_Cost_CurrentYear: currentYearDataPoint
            ? currentYearDataPoint.Materials_Cost
            : 0,
          Supplies_Cost_Cogs_CurrentYear: currentYearDataPoint
            ? currentYearDataPoint.Supplies_Cost_Cogs
            : 0,
          Materials_Cost_Cogs_CurrentYear: currentYearDataPoint
            ? currentYearDataPoint.Materials_Cost_Cogs
            : 0,
          Supplies_Cost_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.Supplies_Cost
            : 0,
          Materials_Cost_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.Materials_Cost
            : 0,
          Supplies_Cost_Cogs_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.Supplies_Cost_Cogs
            : 0,
          Materials_Cost_Cogs_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.Materials_Cost_Cogs
            : 0,
        };
      });

      // console.log("Processed data22222:", data);

      // Update chart data
      setStackedMonthWiseInfo({
        labels: allLabels,
        datasets: [
          {
            label: "Supplies Cost (Current Year)",
            data: data.map((d) => d.Supplies_Cost_CurrentYear),
            backgroundColor: "rgba(223,121,112)",
            stack: "currentYear",
            hidden: false,
          },
          {
            label: "Materials Cost (Current Year)",
            data: data.map((d) => d.Materials_Cost_CurrentYear),
            backgroundColor: "rgba(247,179,129)",
            stack: "currentYear",
            hidden: false,
          },
          {
            label: "Supplies Cost (Previous Year)",
            data: data.map((d) => d.Supplies_Cost_PreviousYear),
            backgroundColor: "rgba(223,121,112,0.3)",
            stack: "previousYear",
            hidden: false,
          },
          {
            label: "Materials Cost (Previous Year)",
            data: data.map((d) => d.Materials_Cost_PreviousYear),
            backgroundColor: "rgba(247,179,129,0.3)",
            stack: "previousYear",
            hidden: false,
          },
          // Adding the `Cogs %` for data labels
          {
            label: "Supplies Cost Cogs (Current Year)",
            data: data.map((d) => d.Supplies_Cost_Cogs_CurrentYear),
            type: "bar",
            backgroundColor: "rgba(255,255,255,0.5)", // Color for cogs data label
            stack: "currentYear",
            hidden: true, // Hide this dataset but use it for labels
          },
          {
            label: "Materials Cost Cogs (Current Year)",
            data: data.map((d) => d.Materials_Cost_Cogs_CurrentYear),
            type: "bar",
            backgroundColor: "rgba(255,255,255,0.5)", // Color for cogs data label
            stack: "currentYear",
            hidden: true, // Hide this dataset but use it for labels
          },
          {
            label: "Supplies Cost Cogs (Previous Year)",
            data: data.map((d) => d.Supplies_Cost_Cogs_PreviousYear),
            type: "bar",
            backgroundColor: "rgba(255,255,255,0.5)", // Color for cogs data label
            stack: "previousYear",
            hidden: true, // Hide this dataset but use it for labels
          },
          {
            label: "Materials Cost Cogs (Previous Year)",
            data: data.map((d) => d.Materials_Cost_Cogs_PreviousYear),
            type: "bar",
            backgroundColor: "rgba(255,255,255,0.5)", // Color for cogs data label
            stack: "previousYear",
            hidden: true, // Hide this dataset but use it for labels
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
        // taxes: item.Taxes,
        // grossAmount: item.Gross_Amount,
        // netAmount: item.Net_Amount,
        ChannelCommission: item.Channel_Commission,
        ShippingCost: item.Shipping_Cost,
        discount: item.Discounts,
        ChannelCommissionCos: item["Channel_Commission/Cos"],
        ShippingCostCos: item["Shipping_Cost/Cos"],
        discountCos: item["Discounts/Cos"],
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        month: item.Month,
        // taxes: item.Taxes,
        // grossAmount: item.Gross_Amount,
        // netAmount: item.Net_Amount,
        ChannelCommission: item.Channel_Commission,
        ShippingCost: item.Shipping_Cost,
        discount: item.Discounts,
        ChannelCommissionCos: item["Channel_Commission/Cos"],
        ShippingCostCos: item["Shipping_Cost/Cos"],
        discountCos: item["Discounts/Cos"],
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
        // taxes: item.Taxes,
        // grossAmount: item.Gross_Amount,
        // netAmount: item.Net_Amount,
        ChannelCommission: item.Channel_Commission,
        ShippingCost: item.Shipping_Cost,
        discount: item.Discounts,
        ChannelCommissionCos: item["Channel_Commission/Cos"],
        ShippingCostCos: item["Shipping_Cost/Cos"],
        discountCos: item["Discounts/Cos"],
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        quarter: item.Quarter,
        // taxes: item.Taxes,
        // grossAmount: item.Gross_Amount,
        // netAmount: item.Net_Amount,
        ChannelCommission: item.Channel_Commission,
        ShippingCost: item.Shipping_Cost,
        discount: item.Discounts,
        ChannelCommissionCos: item["Channel_Commission/Cos"],
        ShippingCostCos: item["Shipping_Cost/Cos"],
        discountCos: item["Discounts/Cos"],
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
        // taxes: item.Taxes,
        // grossAmount: item.Gross_Amount,
        // netAmount: item.Net_Amount,
        ChannelCommission: item.Channel_Commission,
        ShippingCost: item.Shipping_Cost,
        discount: item.Discounts,
        ChannelCommissionCos: item["Channel_Commission/Cos"],
        ShippingCostCos: item["Shipping_Cost/Cos"],
        discountCos: item["Discounts/Cos"],
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        year: item.Year,
        // taxes: item.Taxes,
        // grossAmount: item.Gross_Amount,
        // netAmount: item.Net_Amount,
        ChannelCommission: item.Channel_Commission,
        ShippingCost: item.Shipping_Cost,
        discount: item.Discounts,
        ChannelCommissionCos: item["Channel_Commission/Cos"],
        ShippingCostCos: item["Shipping_Cost/Cos"],
        discountCos: item["Discounts/Cos"],
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
        // taxes: item.Taxes,
        // gr
        // week: `${item.Fiscal_Year} ${item.Week}`,
        grossAmount: item.Gross_Amount,
        // netAmount: item.Net_Amount,
        ChannelCommission: item.Channel_Commission,
        ShippingCost: item.Shipping_Cost,
        discount: item.Discounts,
        ChannelCommissionCos: item["Channel_Commission/Cos"],
        ShippingCostCos: item["Shipping_Cost/Cos"],
        discountCos: item["Discounts/Cos"],
      }));
    } else {
      console.error("Expected currentYearData to be an array.");
    }

    if (Array.isArray(previousYearData)) {
      previousYearDataset = previousYearData.map((item) => ({
        week: item.Week,
        // taxes: item.Taxes,
        // gr
        // week: `${item.Fiscal_Year} ${item.Week}`,
        grossAmount: item.Gross_Amount,
        // netAmount: item.Net_Amount,
        ChannelCommission: item.Channel_Commission,
        ShippingCost: item.Shipping_Cost,
        discount: item.Discounts,
        ChannelCommissionCos: item["Channel_Commission/Cos"],
        ShippingCostCos: item["Shipping_Cost/Cos"],
        discountCos: item["Discounts/Cos"],
      }));
    } else {
      console.error("Expected previousYearData to be an array.");
    }

    return { currentYearDataset, previousYearDataset };
  };

  // 4th waterfall
  useEffect(() => {
    if (responseData) {
      // console.log("responseData:", responseData);
      // console.log("timeWindow:", timeWindow);

      let currentYearData = [];
      let previousYearData = [];
      let processedData = [];

      // Determine the labelType based on the timeWindow
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

      // Extract data based on the time window using the corresponding function
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

      // console.log("currentYearDataset33333333333333:", currentYearData);
      // console.log("previousYearDataset33333333333:", previousYearData);

      // Ensure labels are extracted correctly
      const allLabels = [
        ...new Set([
          ...currentYearData.map((item) => item[labelType]),
          ...previousYearData.map((item) => item[labelType]),
        ]),
      ];

      // console.log("All Labels:", allLabels);

      // Prepare the data for each label
      const data = allLabels.map((label) => {
        // Find the matching data point for the current year
        const currentYearDataPoint = currentYearData.find((item) => item[labelType] === label);
        // Find the matching data point for the previous year
        const previousYearDataPoint = previousYearData.find((item) => item[labelType] === label);

        // Return data points for both years, or 0 if missing
        return {
          Channel_Commission_CurrentYear: currentYearDataPoint
            ? currentYearDataPoint.ChannelCommission
            : 0,
          Shipping_Cost_CurrentYear: currentYearDataPoint ? currentYearDataPoint.ShippingCost : 0,
          Discounts_CurrentYear: currentYearDataPoint ? currentYearDataPoint.discount : 0,
          Channel_Commission_Cos_CurrentYear: currentYearDataPoint
            ? currentYearDataPoint.ChannelCommissionCos
            : 0,
          Shipping_Cost_Cos_CurrentYear: currentYearDataPoint
            ? currentYearDataPoint.ShippingCostCos
            : 0,
          Discounts_Cos_CurrentYear: currentYearDataPoint ? currentYearDataPoint.discountCos : 0,

          Channel_Commission_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.ChannelCommission
            : 0,
          Shipping_Cost_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.ShippingCost
            : 0,
          Discounts_PreviousYear: previousYearDataPoint ? previousYearDataPoint.discount : 0,
          Channel_Commission_Cos_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.ChannelCommissionCos
            : 0,
          Shipping_Cost_Cos_PreviousYear: previousYearDataPoint
            ? previousYearDataPoint.ShippingCostCos
            : 0,
          Discounts_Cos_PreviousYear: previousYearDataPoint ? previousYearDataPoint.discountCos : 0,
        };
      });

      // console.log("Processed data333333333333:", data);

      // Update chart data
      setStackedSalesInfo({
        labels: allLabels, // Use the combined labels
        datasets: [
          {
            label: "Channel Commission (Current Year)",
            data: data.map((d) => d.Channel_Commission_CurrentYear),
            backgroundColor: "rgba(223,121,112)",
            stack: "currentYear",
            hidden: false,
          },
          {
            label: "Shipping Cost (Current Year)",
            data: data.map((d) => d.Shipping_Cost_CurrentYear),
            backgroundColor: "rgba(247,179,129)",
            stack: "currentYear",
            hidden: false,
          },
          {
            label: "Discounts (Current Year)",
            data: data.map((d) => d.Discounts_CurrentYear),
            backgroundColor: "rgba(75,192,192,0.6)",
            stack: "currentYear",
            hidden: false,
          },
          {
            label: "Channel Commission (Previous Year)",
            data: data.map((d) => d.Channel_Commission_PreviousYear),
            backgroundColor: "rgba(223,121,112,0.3)",
            stack: "previousYear",
            hidden: false,
          },
          {
            label: "Shipping Cost (Previous Year)",
            data: data.map((d) => d.Shipping_Cost_PreviousYear),
            backgroundColor: "rgba(247,179,129,0.3)",
            stack: "previousYear",
            hidden: false,
          },
          {
            label: "Discounts (Previous Year)",
            data: data.map((d) => d.Discounts_PreviousYear),
            backgroundColor: "rgba(75,192,192,0.3)",
            stack: "previousYear",
            hidden: false,
          },
          // Adding the Cos` for data labels
          {
            label: "Channel Commission Cos (Current Year)",
            data: data.map((d) => d.Channel_Commission_Cos_CurrentYear),
            backgroundColor: "rgba(223,121,112)",
            stack: "currentYear",
            hidden: true,
          },
          {
            label: "Shipping Cost Cos (Current Year)",
            data: data.map((d) => d.Shipping_Cost_Cos_CurrentYear),
            backgroundColor: "rgba(247,179,129)",
            stack: "currentYear",
            hidden: true,
          },
          {
            label: "Discounts Cos (Current Year)",
            data: data.map((d) => d.Discounts_Cos_CurrentYear),
            backgroundColor: "rgba(75,192,192)",
            stack: "currentYear",
            hidden: true,
          },
          {
            label: "Channel Commission Cos (Previous Year)",
            data: data.map((d) => d.Channel_Commission_Cos_PreviousYear),
            backgroundColor: "rgba(223,121,112,0.3)",
            stack: "previousYear",
            hidden: true,
          },
          {
            label: "Shipping Cost Cos (Previous Year)",
            data: data.map((d) => d.Shipping_Cost_Cos_PreviousYear),
            backgroundColor: "rgba(247,179,129,0.3)",
            stack: "previousYear",
            hidden: true,
          },
          {
            label: "Discounts Cos (Previous Year)",
            data: data.map((d) => d.Discounts_Cos_PreviousYear),
            backgroundColor: "rgba(75,192,192,0.3)",
            stack: "previousYear",
            hidden: true,
          },
        ],
      });
    } else {
      console.error("Response data or timeWindow is missing.");
    }
  }, [responseData, timeWindow]);

  const getWaterfallDataByMonth = ({ currentYearData = [], previousYearData = [] }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];
    let previousPvCurrent = 0;
    let previousUvCurrent = 0;
    let previousPvPrevious = 0;
    let previousUvPrevious = 0;

    // Process current year data
    // console.log("Current Yearrrrrrrr Data:", currentYearData); // Log the data being processed
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item, index) => {
        let uv, pv, actualuv, actualpv, sales;

        // console.log("Processing current year item:", item); // Log each item
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
    // console.log("Previous Year Data:", previousYearData); // Log the data being processed
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item, index) => {
        let uv, pv, actualuv, actualpv, sales;

        // console.log("Processing previous year item:", item); // Log each item
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

    // console.log("Current Year Dataset:", currentYearDataset); // Log final datasets
    // console.log("Previous Year Dataset:", previousYearDataset);

    return { currentYearDataset, previousYearDataset };
  };

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

  const getWaterfallDataByWeek = ({ currentYearData = [], previousYearData = [] }) => {
    let currentYearDataset = [];
    let previousYearDataset = [];
    let previousPvCurrent = 0;
    let previousUvCurrent = 0;
    let previousPvPrevious = 0;
    let previousUvPrevious = 0;

    // Process current year data
    // console.log("Current Yearrrrrrrr Data:", currentYearData); // Log the data being processed
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item, index) => {
        let uv, pv, actualuv, actualpv, sales;

        // console.log("Processing current year item:", item); // Log each item
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
    // console.log("Previous Year Data:", previousYearData); // Log the data being processed
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item, index) => {
        let uv, pv, actualuv, actualpv, sales;

        // console.log("Processing previous year item:", item); // Log each item
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

    // console.log("Current Year Dataset:", currentYearDataset); // Log final datasets
    // console.log("Previous Year Dataset:", previousYearDataset);

    return { currentYearDataset, previousYearDataset };
  };

  useEffect(() => {
    if (responseData) {
      // console.log("responseData:", responseData);
      // console.log("timeWindow:", timeWindow);

      let currentYearData = [];
      let previousYearData = [];
      let processedData = [];

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

      // console.log("Current Year Data:", currentYearData);
      // console.log("Previous Year Data:", previousYearData);

      // Prepare labels (periods) from both datasets
      const currentYearLabels = [...new Set(currentYearData.map((item) => item.period))];
      const previousYearLabels = [...new Set(previousYearData.map((item) => item.period))];
      const labels = [...new Set([...currentYearLabels, ...previousYearLabels])];
      // console.log("Labels:", labels);

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
    // console.log("hiiiiiiiiiiiiiiiiiiiii");

    setPanelOpen(true);
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
  };

  const handleSubmit = () => {
    console.log("helooo");
  };

  // ===================================code for line chartttt




  // myyyyyyyyy

  const urlForDaywise = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";









  const [WeeklyChartdata, setWeeklyChartData] = useState({
    labels: [], // Week labels will go here (e.g., ['Week 04', 'Week 05', ...])
    datasets: [], // Data for daily sales and total sales per week will be populated here
    plugins: [
      {
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: (value, context) => {
            // Show the value only for the "Total Sales per Week" line
            return context.dataset.label === "Gross Amount per Week" ? value : "";
          },
          color: "#000", // Set the label color to black
          font: {
            weight: "bold", // Make the labels bold
          },
        },
      },
    ],
  });

  // In your useEffect, you will update this state with new data:
  useEffect(() => {
    const url = urlForDaywise; // Replace with your actual URL
    const defaultCardPayload = {
      view: "weekly-gmv-measure",
    };

    const fetchCardData = async () => {
      try {
        const response = await axios.post(url, defaultCardPayload);
        const WeeklySalesMarginInfo = response.data;
        console.log(WeeklySalesMarginInfo, "dayyyyyyyyyyyyyss");
        const backgroundColorsWeekly = [
                      "#19b091",
                      "#f2a571",
                      "#21c2c3",
                      "#197fc0",
                      "#e75361",
                      "#758b98",
                      "#ff835c",
                    ];

        if (WeeklySalesMarginInfo.length > 0) {
          const weeks = WeeklySalesMarginInfo.map((item) => Object.keys(item)[0]);
          const salPerday = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
          };

          console.log(salPerday,'salPerdaysalPerday')

          WeeklySalesMarginInfo.forEach((weekData) => {
            const weekKey = Object.keys(weekData)[0];
            const weekInfo = weekData[weekKey];

            Object.keys(salPerday).forEach((day) => {
              salPerday[day].push(weekInfo[day] || 0);
            });
          });

          const datasets = [
            {
              label: "Gross Amount per Week",
              type: "line",
              borderColor: "#4E78A6",
              fill: false,
              data: weeks.map((weekKey) =>
                WeeklySalesMarginInfo.find((weekData) => weekKey in weekData)[weekKey][
                  "Gross_Amount_Per_Week"
                ]
              ),
              categoryPercentage: 1.0,
              barPercentage: 0.2,
            },
            ...Object.keys(salPerday).map((dayOfWeek, index) => ({
              type: "bar",
              label: dayOfWeek,
              backgroundColor: backgroundColorsWeekly[index % backgroundColorsWeekly.length],
              data: salPerday[dayOfWeek],
              barPercentage: 1.0,
              categoryPercentage: 0.5,
            })),
          ];


          console.log(datasets, 'datasettttttttttts')

          setWeeklyChartData({
            labels: weeks.map((week) => `${week}`),
            datasets: datasets,
            plugins: WeeklyChartdata.plugins, // Retain the data labels plugin
          });
        } else {
          console.log("No weekly sales data found.");
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchCardData();
  }, []);




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
      {/* <p style={{ fontWeight: "bold" }} >Start Date: {startDate || defaultStartDate}</p>
      <p style={{ fontWeight: "bold" }}>End Date: {endDate || currentDate}</p> */}
      <p style={{ fontWeight: "bold" }}>
        Start Date: {startDate || defaultStartDate} &nbsp;&nbsp; End Date: {endDate || currentDate}
      </p>

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
                  fontWeight: "bold",
                }}
              >
                {/* Total Sales YTD */}
                Total GMV YTD in ('000)
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
                style={{
                  left: "-5px",
                  position: "relative",
                  top: "-10px",
                  fontSize: 9,
                  fontWeight: "bold",
                }}
              >
                Total Cost YTD in ('000)
                {/* Total COGS YTD */}
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
                style={{
                  left: "-5px",
                  position: "relative",
                  top: "-10px",
                  fontSize: 9,
                  fontWeight: "bold",
                }}
              >
                Total Margin YTD in ('000)
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
                style={{
                  left: "-5px",
                  position: "relative",
                  top: "-10px",
                  fontSize: 9,
                  fontWeight: "bold",
                }}
              >
              Total Sales MTD in ('000)
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
                style={{
                  left: "-5px",
                  position: "relative",
                  top: "-10px",
                  fontSize: 9,
                  fontWeight: "bold",
                }}
              >
              Total Cost MTD in ('000)
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
                style={{ left: "-5px", position: "relative", top: "-10px", fontSize: 9,                  fontWeight: "bold",
                }}
              >
              Total Margin MTD in ('000)
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
              title={`Gross Amount (${timeWindowMap[timeWindow] || "Monthly"})`}
              onDoubleClick={() => console.log("Chart clicked")}
              startDate={startDate || defaultStartDate} // Pass startDate
              endDate={endDate || currentDate} // Pass endDate
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
            // title={chartTitleCostWise}
          >
            <StackedBarChart
              chartData={stackedMonthWiseInfo}
              title={`Cost of Goods Sold (${timeWindowMap[timeWindow] || "Monthly"})`}
              startDate={startDate || defaultStartDate} // Pass startDate
              endDate={endDate || currentDate} // Pass endDate
            />
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
            <StackedBarChart2
              chartData={stackedSalesInfo}
              // title={chartTitle}
              title={`Cost of Sales (${timeWindowMap[timeWindow] || "Monthly"})`}
              // onDoubleClick={handleChartDoubleClick}
              onDoubleClick={() => console.log("Financial Chart clicked")}
              style={{ height: "100px" }}
              startDate={startDate || defaultStartDate} // Pass startDate
              endDate={endDate || currentDate} // Pass endDate
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
              // title={chartTitleMarginAnalysis}
              title={`Margin Trend Analysis (${timeWindowMap[timeWindow] || "Monthly"})`}
              // onDoubleClick={handleChartDoubleClick} // Ensure this function is defined elsewhere
              onDoubleClick={() => console.log("waterfall Chart clicked")}
              startDate={startDate || defaultStartDate} // Pass startDate
              endDate={endDate || currentDate} // Pass endDate
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
AIDashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AIDashboard;
