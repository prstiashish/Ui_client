import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios"; // or fetch API
import DevSlideOutPanel from "./devslidepannel"; // Ensure this path is correct

import { DashboardLayout } from "src/components/dashboard-layout";

import StackedBarChart from "src/components/charts/StackedBarChart";
import StackedBarChart2 from "src/components/charts/StackedBarChart2";

import BarChartComp from "src/components/charts/BarChartComp";
import BarChartWeekly from "src/components/charts/BarChartWeekly";

import BarChart from "src/components/charts/BarChart";
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

import { useData } from "../contexts/DataContext"; // Import the useData hook

const AIDashboard = () => {
  // const [responseData, setResponseData] = useState(null);

  const [accessTokens, setAccessToken] = useState("");
  // console.log("ttttttttttttt", accessTokens);

  const [MTDTotalSales, setMTDTotalSales] = useState(0);
  const [MTDtotalCost, setMTDTotalCost] = useState(0);
  const [MTDTotalMargin, setMTDTotalMargin] = useState(0);

  const [selectedFilter, setSelectedFilter] = useState(1);

  const baseURL = baseURLs();

  // State for Stacked Chart Data
  const [stackedMonthWiseInfo, setStackedMonthWiseInfo] = useState({
    labels: [],
    datasets: [],
    // legendVisible: 1,
  });

  // const [chartTitle, setChartTitle] = useState("Monthly Financial Breakdown");

  const [stackedSalesInfo, setStackedSalesInfo] = useState({
    labels: [],
    datasets: [],
  });

  const router = useRouter();

  const { data } = useData();
  // console.log(data, "daadadadadadadad");

  // const { dimension, timeWindow, startDate, endDate, isChecked } = router.query;

  const { dimension, timeWindow, startDate, endDate, isChecked } = data || {};

  const [includePrevYear, setIncludePrevYear] = useState(false);
  // console.log(includePrevYear, "includePrevYear");

  // const url = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";
  const url = "https://nqy17v7tdd.execute-api.ap-south-1.amazonaws.com/dev/data-insights";

  // for cards
  const [totalSales, setTotalSales] = useState(0);

  const [cogs, setCogs] = useState(0);

  const [margin, setMargin] = useState(0);



  useEffect(() => {
    let isMounted = true;

    const defaultCardPayload = {
      view: "measures-ytd-mtd",
    };

    const fetchCardData = async () => {
      try {
        const token = sessionStorage.getItem("Access_Token");

        if (!token) {
          console.error("Access Token is missing");
          return;
        }

        // console.log("Using Access Token:", token);
        // Configure headers with the Authorization Bearer token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(url, defaultCardPayload, config); // Pass headers as the third argument
        const responseData = response.data;

        // Replace single quotes with double quotes to ensure valid JSON
        const validJsonString = responseData.replace(/'/g, '"');
        const data = JSON.parse(validJsonString);

        // Only update state if the component is still mounted
        if (isMounted && data.YTD && data.YTD.length > 0) {
          const ytdData = data.YTD[0];

          setTotalSales(ytdData.Gross_Amount);
          setCogs(ytdData.Cogs);
          setMargin(ytdData.Margin);
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchCardData();

    // Cleanup function: set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  const timeWindowMap = {
    M: "Monthly",
    Q: "Quarterly",
    Y: "Yearly",
    W: "Weekly",
  };

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const [responseData, setResponseData] = useState([]);

  const defaultStartDate = "2024-04-01";
  const currentDate = new Date().toISOString().split("T")[0];

  // console.log("Include Prev Year:", includePrevYear);
  // console.log("Start Date:", startDate);
  // console.log("End Date:", endDate);

  useEffect(() => {
    if (isChecked) {
      setIncludePrevYear(isChecked === true);
    }
  }, [isChecked]);

  const defaultPayload = useMemo(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    const defaultStartDate = "2024-04-01";

    return {
      dimension: dimension || "none",
      view: "All",
      start_date: includePrevYear && !startDate && !endDate ? defaultStartDate : startDate || "",
      end_date: includePrevYear && !startDate && !endDate ? currentDate : endDate || "",
      include_prev_year: includePrevYear,
      time_window: timeWindow || "M",
    };
  }, [dimension, timeWindow, includePrevYear, startDate, endDate]);

  const stableUrl = useMemo(() => url, [url]);
  const stablePayload = useMemo(() => defaultPayload, [defaultPayload]);

  // useEffect(() => {
  //   console.log("Updated defaultPayload:", defaultPayload);
  // }, [defaultPayload]);



  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchData = async () => {
      if (!stableUrl || !stablePayload) return;
      const token = sessionStorage.getItem("Access_Token");

      if (!token) {
        console.error("Access Token is missing");
        return;
      }

      // console.log("Using Access Token:", token);

      try {
        // console.log("Fetching data with URL:", url);

        // Configure headers with Bearer token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Replace `yourBearerToken` with the actual token
          },
        };

        const response = await axios.post(stableUrl, stablePayload, config);
        const resData = response.data;

        const validJsonString = resData.replace(/'/g, '"');
        const responseData = JSON.parse(validJsonString);

        // console.log("Fetched data:", responseData);

        const currentYearData = responseData["Current Fiscal Year"];
        if (stablePayload.include_prev_year) {
          const previousYearData = responseData["Previous Fiscal Year"];
          if (isMounted) {
            setResponseData({
              currentYearData,
              previousYearData,
            });
          }
        } else {
          if (isMounted) {
            setResponseData({
              currentYearData,
              previousYearData: [],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup: set isMounted to false when the component unmounts
    };
  }, [stableUrl, stablePayload]);




  const getSalesDataByTimeWindow = ({ currentYearData, previousYearData, timeWindow }) => {
    let timeWindowDataset = {};

    const getDataByTimeWindow = (timeWindow) => {
      switch (timeWindow) {
        case "W":
          return getTotalSalesDataByWeek;
        case "Q":
          return getTotalSalesDataByQuarter;
        case "Y":
          return getTotalSalesDataByYear;
        default:
          return getTotalSalesDataByMonth; // Default to monthly
      }
    };

    const getTotalSalesData = getDataByTimeWindow(timeWindow);

    const timeWindowData = getTotalSalesData({
      currentYearData,
      previousYearData,
    });

    return timeWindowData;
  };

  const getTotalSalesDataByMonth = ({ currentYearData, previousYearData }) => {
    let monthDataset = {};

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        const { Month, Fiscal_Year, Gross_Amount } = item;
        if (!monthDataset[Month]) {
          monthDataset[Month] = {};
        }
        monthDataset[Month][Fiscal_Year] = Gross_Amount;
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        const { Month, Fiscal_Year, Gross_Amount } = item;
        if (!monthDataset[Month]) {
          monthDataset[Month] = {};
        }
        monthDataset[Month][Fiscal_Year] = Gross_Amount;
      });
    }

    return monthDataset;
  };

  const getTotalSalesDataByWeek = ({ currentYearData, previousYearData }) => {
    let weekDataset = {};

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        const { Week, Fiscal_Year, Gross_Amount } = item;
        if (!weekDataset[Week]) {
          weekDataset[Week] = {};
        }
        weekDataset[Week][Fiscal_Year] = Gross_Amount;
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        const { Week, Fiscal_Year, Gross_Amount } = item;
        if (!weekDataset[Week]) {
          weekDataset[Week] = {};
        }
        weekDataset[Week][Fiscal_Year] = Gross_Amount;
      });
    }

    return weekDataset;
  };

  const getTotalSalesDataByQuarter = ({ currentYearData, previousYearData }) => {
    let quarterDataset = {};

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        const { Quarter, Fiscal_Year, Gross_Amount } = item;
        if (!quarterDataset[Quarter]) {
          quarterDataset[Quarter] = {};
        }
        quarterDataset[Quarter][Fiscal_Year] = Gross_Amount;
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        const { Quarter, Fiscal_Year, Gross_Amount } = item;
        if (!quarterDataset[Quarter]) {
          quarterDataset[Quarter] = {};
        }
        quarterDataset[Quarter][Fiscal_Year] = Gross_Amount;
      });
    }

    return quarterDataset;
  };

  const getTotalSalesDataByYear = ({ currentYearData, previousYearData }) => {
    let yearDataset = {};

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        const { Year, Fiscal_Year, Gross_Amount } = item;
        if (!yearDataset[Year]) {
          yearDataset[Year] = {};
        }
        yearDataset[Year][Fiscal_Year] = Gross_Amount;
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        const { Year, Fiscal_Year, Gross_Amount } = item;
        if (!yearDataset[Year]) {
          yearDataset[Year] = {};
        }
        yearDataset[Year][Fiscal_Year] = Gross_Amount;
      });
    }

    return yearDataset;
  };

  useEffect(() => {
    if (responseData) {
      const currentYearData = responseData.currentYearData || [];
      const previousYearData = responseData.previousYearData || [];

      const timeWindowData = getSalesDataByTimeWindow({
        currentYearData,
        previousYearData,
        timeWindow,
      });

      const allLabels = Object.keys(timeWindowData);
      // console.log("All Labels:", allLabels);

      const allYears = [
        ...new Set([
          ...currentYearData.map((item) => item.Fiscal_Year),
          ...previousYearData.map((item) => item.Fiscal_Year),
        ]),
      ];
      // console.log("All Fiscal Years:", allYears);

      const colorPalette = [
        "#004D99",
        "#AFDC8F", // Blue
        // '#00b300', // Green
        "#92C5F9",
        // '#c68c53', // Orange
        "#F8AE54",
        "#A3A3A3", // Gray
        // Add more colors here if needed for additional years
      ];

      const datasets = allYears.map((year, index) => {
        const colorIndex = index % colorPalette.length;
        const backgroundColor = colorPalette[colorIndex];

        return {
          label: `${year} FY`,
          data: allLabels.map((label) => timeWindowData[label]?.[year] || 0),
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1,
        };
      });

      function darkenColor(hex, percent) {
        const num = parseInt(hex.slice(1), 16); // Convert hex to RGB
        const r = (num >> 16) - percent;
        const g = ((num >> 8) & 0x00ff) - percent;
        const b = (num & 0x0000ff) - percent;

        // Ensure the RGB values are within bounds (0-255)
        const newR = Math.max(0, Math.min(255, r));
        const newG = Math.max(0, Math.min(255, g));
        const newB = Math.max(0, Math.min(255, b));

        // Convert back to hex and return
        return `#${(1 << 24) + (newR << 16) + (newG << 8) + newB}.toString(16).slice(1)}`;
      }

      // console.log("Datasets:", datasets);

      setChartData({
        labels: allLabels,
        datasets,
      });

      // console.log("Chart Data:", { labels: allLabels, datasets });
    } else {
      console.error("Response data is missing.");
    }
  }, [responseData, timeWindow]);

  // 2222222222222222222222222222222222222222222222222

  const getProcessedDataByTimeWindow = ({ currentYearData, previousYearData, timeWindow }) => {
    let timeWindowDataset = {};

    const getDataByTimeWindow = (timeWindow) => {
      switch (timeWindow) {
        case "W":
          return getProcessedDataByWeek;
        case "Q":
          return getProcessedDataByQuarter;
        case "Y":
          return getProcessedDataByYear;
        default:
          return getProcessedDataByMonth; // Default to monthly
      }
    };

    const getTotalSalesData = getDataByTimeWindow(timeWindow);

    const timeWindowData = getTotalSalesData({
      currentYearData,
      previousYearData,
    });

    return timeWindowData;
  };

  const getProcessedDataByMonth = ({ currentYearData, previousYearData }) => {
    let monthDataset = {};
    // console.log("monthDataset", monthDataset);

    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Month,
        Supplies_Cost: Supplies_Cost,
        Materials_Cost: Materials_Cost,
        "Supplies_Cost/Cogs": Supplies_Cost_Cogs,
        "Materials_Cost/Cogs": Materials_Cost_Cogs,
      } = item;

      if (!dataset[Month]) {
        dataset[Month] = {};
      }

      if (!dataset[Month][Fiscal_Year]) {
        dataset[Month][Fiscal_Year] = {
          Supplies_Cost: 0,
          Materials_Cost: 0,
          Supplies_Cost_Cogs: 0,
          Materials_Cost_Cogs: 0,
        };
      }

      dataset[Month][Fiscal_Year].Supplies_Cost += Supplies_Cost || 0;
      dataset[Month][Fiscal_Year].Materials_Cost += Materials_Cost || 0;
      dataset[Month][Fiscal_Year].Supplies_Cost_Cogs += Supplies_Cost_Cogs || 0;
      dataset[Month][Fiscal_Year].Materials_Cost_Cogs += Materials_Cost_Cogs || 0;
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, monthDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, monthDataset);
      });
    }

    // console.log("monthDataset", monthDataset);
    return monthDataset;
  };

  const getProcessedDataByQuarter = ({ currentYearData, previousYearData }) => {
    let quarterDataset = {};

    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Quarter,
        Supplies_Cost: Supplies_Cost,
        Materials_Cost: Materials_Cost,
        "Supplies_Cost/Cogs": Supplies_Cost_Cogs,
        "Materials_Cost/Cogs": Materials_Cost_Cogs,
      } = item;

      if (!dataset[Quarter]) {
        dataset[Quarter] = {};
      }

      if (!dataset[Quarter][Fiscal_Year]) {
        dataset[Quarter][Fiscal_Year] = {
          Supplies_Cost: 0,
          Materials_Cost: 0,
          Supplies_Cost_Cogs: 0,
          Materials_Cost_Cogs: 0,
        };
      }

      dataset[Quarter][Fiscal_Year].Supplies_Cost += Supplies_Cost || 0;
      dataset[Quarter][Fiscal_Year].Materials_Cost += Materials_Cost || 0;
      dataset[Quarter][Fiscal_Year].Supplies_Cost_Cogs += Supplies_Cost_Cogs || 0;
      dataset[Quarter][Fiscal_Year].Materials_Cost_Cogs += Materials_Cost_Cogs || 0;
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, quarterDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, quarterDataset);
      });
    }

    // console.log("quarterDataset", quarterDataset);
    return quarterDataset;
  };

  const getProcessedDataByYear = ({ currentYearData, previousYearData }) => {
    let yearDataset = {};

    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Year,
        Supplies_Cost: Supplies_Cost,
        Materials_Cost: Materials_Cost,
        "Supplies_Cost/Cogs": Supplies_Cost_Cogs,
        "Materials_Cost/Cogs": Materials_Cost_Cogs,
      } = item;

      if (!dataset[Year]) {
        dataset[Year] = {};
      }

      if (!dataset[Year][Fiscal_Year]) {
        dataset[Year][Fiscal_Year] = {
          Supplies_Cost: 0,
          Materials_Cost: 0,
          Supplies_Cost_Cogs: 0,
          Materials_Cost_Cogs: 0,
        };
      }

      dataset[Year][Fiscal_Year].Supplies_Cost += Supplies_Cost || 0;
      dataset[Year][Fiscal_Year].Materials_Cost += Materials_Cost || 0;
      dataset[Year][Fiscal_Year].Supplies_Cost_Cogs += Supplies_Cost_Cogs || 0;
      dataset[Year][Fiscal_Year].Materials_Cost_Cogs += Materials_Cost_Cogs || 0;
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, yearDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, yearDataset);
      });
    }

    return yearDataset;
  };

  const getProcessedDataByWeek = ({ currentYearData, previousYearData }) => {
    let weekDataset = {};

    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Week,
        Supplies_Cost: Supplies_Cost,
        Materials_Cost: Materials_Cost,
        "Supplies_Cost/Cogs": Supplies_Cost_Cogs,
        "Materials_Cost/Cogs": Materials_Cost_Cogs,
      } = item;

      if (!dataset[Week]) {
        dataset[Week] = {};
      }

      if (!dataset[Week][Fiscal_Year]) {
        dataset[Week][Fiscal_Year] = {
          Supplies_Cost: 0,
          Materials_Cost: 0,
          Supplies_Cost_Cogs: 0,
          Materials_Cost_Cogs: 0,
        };
      }

      dataset[Week][Fiscal_Year].Supplies_Cost += Supplies_Cost || 0;
      dataset[Week][Fiscal_Year].Materials_Cost += Materials_Cost || 0;
      dataset[Week][Fiscal_Year].Supplies_Cost_Cogs += Supplies_Cost_Cogs || 0;
      dataset[Week][Fiscal_Year].Materials_Cost_Cogs += Materials_Cost_Cogs || 0;
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, weekDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, weekDataset);
      });
    }

    // console.log("weekDataset:", weekDataset);
    return weekDataset;
  };

  // 3rd chart

  useEffect(() => {
    if (responseData) {
      const currentYearData = responseData.currentYearData || [];
      const previousYearData = responseData.previousYearData || [];

      const timeWindowData = getProcessedDataByTimeWindow({
        currentYearData,
        previousYearData,
        timeWindow,
      });

      // console.log("Time Window Data:", timeWindowData);

      const allLabels = Object.keys(timeWindowData);
      // console.log("All Labels:", allLabels);

      const allYears = [
        ...new Set([
          ...currentYearData.map((item) => item.Fiscal_Year),
          ...previousYearData.map((item) => item.Fiscal_Year),
        ]),
      ];
      // console.log("All Fiscal2222 Years:", allYears);

      const generateYearColors = (years) => {
        const baseColors = [
          ["rgba(223,121,112,1)", "rgba(247,179,129,1)"],
          // ["rgba(223,121,112,1)", "rgba(247,179,129,1)"],

          ["rgb(0, 153, 204)", "rgb(0, 204, 204)"], // Base color for Supplies, Materials
          ["rgba(134,200,185,1)", "rgba(255,99,132,1)"],
        ];

        return years.reduce((acc, year, index) => {
          acc[year] = baseColors[index % baseColors.length];
          return acc;
        }, {});
      };

      const yearColors = generateYearColors(allYears);

      const generateColorForYearAndCategory = (year, category) => {
        const colors = yearColors[year] || ["rgba(0,0,0,0)", "rgba(0,0,0,0)"]; // Fallback if year is unknown

        return category === "Supplies_Cost" ? colors[0] : colors[1];
      };

      const datasets = allYears
        .map((year) => [
          // Supplies_Cost dataset for each year and month

          // Materials_Cost dataset for each year and month
          {
            label: `${year} Materials Cost`,
            data: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Materials_Cost || 0;
            }),
            backgroundColor: generateColorForYearAndCategory(year, "Materials_Cost"),
            stack: `year-${year}`,
            hidden: false,

            // Pass the precomputed percentage
            percentage: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Materials_Cost_Cogs || 0; // Precomputed percentage for Materials Cost
            }),
          },
          {
            label: `${year} Supplies Cost`,
            data: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Supplies_Cost || 0;
            }),
            backgroundColor: generateColorForYearAndCategory(year, "Supplies_Cost"),
            stack: `year-${year}`,
            hidden: false,

            // Pass the precomputed percentage
            percentage: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Supplies_Cost_Cogs || 0; // Precomputed percentage for Supplies Cost
            }),
          },
        ])
        .flat();

      setStackedMonthWiseInfo({
        labels: allLabels,
        datasets,
      });

      // console.log("Chart Data:", { labels: allLabels, datasets });
    } else {
      console.error("Response data is missing.");
    }
  }, [responseData, timeWindow]);

  // ========================================

  // 33333333333333333333333333333333333333333333

  const getTaxesDataByTimeWindow = ({ currentYearData, previousYearData, timeWindow }) => {
    let timeWindowDataset = {};

    const getDataByTimeWindow = (timeWindow) => {
      switch (timeWindow) {
        case "W":
          return getTaxesDataByWeek;
        case "Q":
          return getTaxesDataByQuarter;
        case "Y":
          return getTaxesDataByYear;
        default:
          return getTaxesDataByMonth; // Default to monthly
      }
    };

    const getTotalSalesData = getDataByTimeWindow(timeWindow);

    const timeWindowData = getTotalSalesData({
      currentYearData,
      previousYearData,
    });

    return timeWindowData;
  };

  const getTaxesDataByMonth = ({ currentYearData, previousYearData }) => {
    let monthDataset = {};

    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Month,
        Channel_Commission: Channel_Commission,
        Discounts: Discounts,
        Shipping_Cost: Shipping_Cost,
        "Channel_Commission/Cos": Channel_Commission_Cos,
        "Discounts/Cos": Discounts_Cos,
        "Shipping_Cost/Cos": Shipping_Cost_Cos,
      } = item;

      if (!dataset[Month]) {
        dataset[Month] = {};
      }

      if (!dataset[Month][Fiscal_Year]) {
        dataset[Month][Fiscal_Year] = {
          Channel_Commission: 0,
          Discounts: 0,
          Shipping_Cost: 0,
          Channel_Commission_Cos: 0,
          Discounts_Cos: 0,
          Shipping_Cost_Cos: 0,
        };
      }

      dataset[Month][Fiscal_Year].Channel_Commission += Channel_Commission || 0;
      dataset[Month][Fiscal_Year].Discounts += Discounts || 0;
      dataset[Month][Fiscal_Year].Shipping_Cost += Shipping_Cost || 0;
      dataset[Month][Fiscal_Year].Channel_Commission_Cos += Channel_Commission_Cos || 0;
      dataset[Month][Fiscal_Year].Discounts_Cos += Discounts_Cos || 0;
      dataset[Month][Fiscal_Year].Shipping_Cost_Cos += Shipping_Cost_Cos || 0;
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, monthDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, monthDataset);
      });
    }

    // console.log("monthDatasettaxxxxxxxxxxxxxxxxxxxxx", monthDataset);
    return monthDataset;
  };

  const getTaxesDataByQuarter = ({ currentYearData, previousYearData }) => {
    let quarterDataset = {};
    // console.log("monthDataset", quarterDataset);

    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Quarter,
        Channel_Commission: Channel_Commission,
        Discounts: Discounts,
        Shipping_Cost: Shipping_Cost,
        "Channel_Commission/Cos": Channel_Commission_Cos,
        "Discounts/Cos": Discounts_Cos,
        "Shipping_Cost/Cos": Shipping_Cost_Cos,
      } = item;

      if (!dataset[Quarter]) {
        dataset[Quarter] = {};
      }

      if (!dataset[Quarter][Fiscal_Year]) {
        dataset[Quarter][Fiscal_Year] = {
          Channel_Commission: 0,
          Discounts: 0,
          Shipping_Cost: 0,
          Channel_Commission_Cos: 0,
          Discounts_Cos: 0,
          Shipping_Cost_Cos: 0,
        };
      }

      dataset[Quarter][Fiscal_Year].Channel_Commission += Channel_Commission || 0;
      dataset[Quarter][Fiscal_Year].Discounts += Discounts || 0;
      dataset[Quarter][Fiscal_Year].Shipping_Cost += Shipping_Cost || 0;
      dataset[Quarter][Fiscal_Year].Channel_Commission_Cos += Channel_Commission_Cos || 0;
      dataset[Quarter][Fiscal_Year].Discounts_Cos += Discounts_Cos || 0;
      dataset[Quarter][Fiscal_Year].Shipping_Cost_Cos += Shipping_Cost_Cos || 0;
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, quarterDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, quarterDataset);
      });
    }

    // console.log("monthDataset", quarterDataset);
    return quarterDataset;
  };

  const getTaxesDataByYear = ({ currentYearData, previousYearData }) => {
    let yearDataset = {};
    // console.log("monthDataset", yearDataset);

    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Year,
        Channel_Commission: Channel_Commission,
        Discounts: Discounts,
        Shipping_Cost: Shipping_Cost,
        "Channel_Commission/Cos": Channel_Commission_Cos,
        "Discounts/Cos": Discounts_Cos,
        "Shipping_Cost/Cos": Shipping_Cost_Cos,
      } = item;

      if (!dataset[Year]) {
        dataset[Year] = {};
      }

      if (!dataset[Year][Fiscal_Year]) {
        dataset[Year][Fiscal_Year] = {
          Channel_Commission: 0,
          Discounts: 0,
          Shipping_Cost: 0,
          Channel_Commission_Cos: 0,
          Discounts_Cos: 0,
          Shipping_Cost_Cos: 0,
        };
      }

      dataset[Year][Fiscal_Year].Channel_Commission += Channel_Commission || 0;
      dataset[Year][Fiscal_Year].Discounts += Discounts || 0;
      dataset[Year][Fiscal_Year].Shipping_Cost += Shipping_Cost || 0;
      dataset[Year][Fiscal_Year].Channel_Commission_Cos += Channel_Commission_Cos || 0;
      dataset[Year][Fiscal_Year].Discounts_Cos += Discounts_Cos || 0;
      dataset[Year][Fiscal_Year].Shipping_Cost_Cos += Shipping_Cost_Cos || 0;
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, yearDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, yearDataset);
      });
    }

    // console.log("monthDataset", yearDataset);
    return yearDataset;
  };

  const getTaxesDataByWeek = ({ currentYearData, previousYearData }) => {
    let weekDataset = {};
    // console.log("monthDataset", weekDataset);

    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Week,
        Channel_Commission: Channel_Commission,
        Discounts: Discounts,
        Shipping_Cost: Shipping_Cost,
        "Channel_Commission/Cos": Channel_Commission_Cos,
        "Discounts/Cos": Discounts_Cos,
        "Shipping_Cost/Cos": Shipping_Cost_Cos,
      } = item;

      if (!dataset[Week]) {
        dataset[Week] = {};
      }

      if (!dataset[Week][Fiscal_Year]) {
        dataset[Week][Fiscal_Year] = {
          Channel_Commission: 0,
          Discounts: 0,
          Shipping_Cost: 0,
          Channel_Commission_Cos: 0,
          Discounts_Cos: 0,
          Shipping_Cost_Cos: 0,
        };
      }

      dataset[Week][Fiscal_Year].Channel_Commission += Channel_Commission || 0;
      dataset[Week][Fiscal_Year].Discounts += Discounts || 0;
      dataset[Week][Fiscal_Year].Shipping_Cost += Shipping_Cost || 0;
      dataset[Week][Fiscal_Year].Channel_Commission_Cos += Channel_Commission_Cos || 0;
      dataset[Week][Fiscal_Year].Discounts_Cos += Discounts_Cos || 0;
      dataset[Week][Fiscal_Year].Shipping_Cost_Cos += Shipping_Cost_Cos || 0;
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, weekDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, weekDataset);
      });
    }

    // console.log("weekDataset", weekDataset);
    return weekDataset;
  };

  useEffect(() => {
    if (responseData) {
      const currentYearData = responseData.currentYearData || [];
      const previousYearData = responseData.previousYearData || [];

      const timeWindowData = getTaxesDataByTimeWindow({
        currentYearData,
        previousYearData,
        timeWindow,
      });

      // console.log("Time333333333333 Window Data:", timeWindowData);

      const allLabels = Object.keys(timeWindowData);
      // console.log("All Labels:", allLabels);

      const allYears = [
        ...new Set([
          ...currentYearData.map((item) => item.Fiscal_Year),
          ...previousYearData.map((item) => item.Fiscal_Year),
        ]),
      ];
      // console.log("All Fiscal2222 Years:", allYears);

      const generateYearColors = (years) => {
        const baseColors = [
          ["rgba(223,121,112,1)", "rgba(134,200,185,1)", "rgba(201,203,207,1)"],
          ["rgb(255, 159, 128,1)", "rgba(247,109,129,1)", "rgba(255,205,86,1)"], // Supplies, Materials, Channel
          ["rgba(75,192,192,1)", "rgba(255,99,132,1)", "rgba(54,162,235,1)"],
        ];

        return years.reduce((acc, year, index) => {
          acc[year] = baseColors[index % baseColors.length];
          return acc;
        }, {});
      };

      const yearColors = generateYearColors(allYears);
      // console.log("Year Colors:", yearColors);

      const generateColorForYearAndCategory = (year, category) => {
        const colors = yearColors[year] || ["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0)"]; // Fallback for unknown year

        // Map each category to its corresponding color index
        switch (category) {
          case "Channel_Commission":
            return colors[0];
          case "Discounts":
            return colors[1];
          case "Shipping_Cost":
            return colors[2];
          default:
            return "rgba(0,0,0,0)"; // Fallback for unknown category
        }
      };

      const datasets = allYears
        .map((year) => [
          {
            label: `${year} Channel Commission`,
            data: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Channel_Commission || 0;
            }),
            backgroundColor: generateColorForYearAndCategory(year, "Channel_Commission"),
            stack: `year-${year}`,
            hidden: false,

            percentage: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Channel_Commission_Cos || 0; // Precomputed percentage for Materials Cost
            }),
          },
          {
            label: `${year} Discounts`,
            data: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Discounts || 0;
            }),
            backgroundColor: generateColorForYearAndCategory(year, "Discounts"),
            stack: `year-${year}`,
            hidden: false,

            percentage: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Discounts_Cos || 0; // Precomputed percentage for Supplies Cost
            }),
          },

          {
            label: `${year} Shipping Cost`,
            data: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Shipping_Cost || 0;
            }),
            backgroundColor: generateColorForYearAndCategory(year, "Shipping_Cost"),
            stack: `year-${year}`,
            hidden: false,

            percentage: allLabels.map((month) => {
              const dataForMonth = timeWindowData[month]?.[year] || {};
              return dataForMonth.Shipping_Cost_Cos || 0; // Precomputed percentage for Supplies Cost
            }),
          },
        ])
        .flat();

      setStackedSalesInfo({
        labels: allLabels,
        datasets,
      });

      // console.log("Chart Data:", { labels: allLabels, datasets });
    } else {
      console.error("Response data is missing.");
    }
  }, [responseData, timeWindow]);

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++

  // 4th margin chart

  const [waterfallBar, setWaterfallBar] = useState({
    labels: [],

    datasets: [],
  });

  const getWaterfallDataByTimeWindow = ({ currentYearData, previousYearData, timeWindow }) => {
    let timeWindowDataset = {};

    const getDataByTimeWindow = (timeWindow) => {
      switch (timeWindow) {
        case "W":
          return getWaterfallDataByWeek;
        case "Q":
          return getWaterfallDataByQuarter;
        case "Y":
          return getWaterfallDataByYear;
        default:
          return getWaterfallDataByMonth; // Default to monthly
      }
    };

    const getTotalSalesData = getDataByTimeWindow(timeWindow);

    const timeWindowData = getTotalSalesData({
      currentYearData,
      previousYearData,
    });

    return timeWindowData;
  };

  const getWaterfallDataByMonth = ({ currentYearData, previousYearData }) => {
    let monthDataset = {};

    const addMarginData = (item, dataset) => {
      const { Fiscal_Year, Month, Margin } = item;

      if (!dataset[Month]) {
        dataset[Month] = {}; // Initialize data for the month
        // console.log(`Initializing dataset for Month: ${Month}`);
      }

      if (!dataset[Month][Fiscal_Year]) {
        dataset[Month][Fiscal_Year] = {
          uv: 0,
          pv: 0,
          actualuv: 0,
          sales: 0,
        };
        // console.log(`Initializing dataset for Fiscal Year: ${Fiscal_Year} under Month: ${Month}`);
      }

      const monthKeys = Object.keys(dataset); // No sorting, just as added
      const currentMonthIndex = monthKeys.indexOf(Month);
      const prevMonth = currentMonthIndex > 0 ? monthKeys[currentMonthIndex - 1] : null;
      const prevData = prevMonth ? dataset[prevMonth][Fiscal_Year] || { sales: 0 } : { sales: 0 };

      // Calculate UV, PV, and Sales
      const uv = prevMonth ? Margin - prevData.sales : Margin || 0; // Difference from previous month's sales
      const pv = prevData.sales; // Carry forward previous month's sales
      const sales = prevData.sales + uv; // Cumulative sales
      const actualuv = uv;

      // Store calculated values in the dataset
      dataset[Month][Fiscal_Year] = { uv: actualuv, pv, actualuv, sales };

      // Log for debugging
      // console.log(`Processed Month: ${Month}, Fiscal Year: ${Fiscal_Year}`);
      // console.log(`UV: ${uv}, PV: ${pv}, Sales: ${sales}`);
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addMarginData(item, monthDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addMarginData(item, monthDataset);
      });
    }

    // console.log("\nFinal4444444444 Processed Dataset:", monthDataset);
    return monthDataset;
  };

  const getWaterfallDataByYear = ({ currentYearData, previousYearData }) => {
    let yearDataset = {};

    const addMarginData = (item, dataset) => {
      const { Fiscal_Year, Year, Margin } = item;

      if (!dataset[Year]) {
        dataset[Year] = {};
        // console.log(`Initializing dataset for Month: ${Year}`);
      }

      if (!dataset[Year][Fiscal_Year]) {
        dataset[Year][Fiscal_Year] = {
          uv: 0,
          pv: 0,
          actualuv: 0,
          sales: 0,
        };
        // console.log(`Initializing dataset for Fiscal Year: ${Fiscal_Year} under Month: ${Year}`);
      }

      const monthKeys = Object.keys(dataset); // No sorting, just as added
      const currentMonthIndex = monthKeys.indexOf(Year);
      const prevMonth = currentMonthIndex > 0 ? monthKeys[currentMonthIndex - 1] : null;
      const prevData = prevMonth ? dataset[prevMonth][Fiscal_Year] || { sales: 0 } : { sales: 0 };

      // Calculate UV, PV, and Sales
      const uv = prevMonth ? Margin - prevData.sales : Margin || 0; // Difference from previous month's sales
      const pv = prevData.sales; // Carry forward previous month's sales
      const sales = prevData.sales + uv; // Cumulative sales
      const actualuv = uv;

      // Store calculated values in the dataset
      dataset[Year][Fiscal_Year] = { uv: actualuv, pv, actualuv, sales };

      // Log for debugging
      // console.log(`Processed Month: ${Year}, Fiscal Year: ${Fiscal_Year}`);
      // console.log(`UV: ${uv}, PV: ${pv}, Sales: ${sales}`);
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addMarginData(item, yearDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addMarginData(item, yearDataset);
      });
    }

    // console.log("\nFinal4444444444 Processed Dataset:", yearDataset);
    return yearDataset;
  };

  const getWaterfallDataByQuarter = ({ currentYearData, previousYearData }) => {
    let quarterDataset = {}; // Initialize an empty dataset to hold the processed data

    const addMarginData = (item, dataset) => {
      const { Fiscal_Year, Quarter, Margin } = item;

      if (!dataset[Quarter]) {
        dataset[Quarter] = {}; // Initialize data for the quarter
        console.log(`Initializing dataset for Quarter: ${Quarter}`);
      }

      if (!dataset[Quarter][Fiscal_Year]) {
        dataset[Quarter][Fiscal_Year] = {
          uv: 0,
          pv: 0,
          actualuv: 0,
          sales: 0,
        };
        // console.log(
        //   `Initializing dataset for Fiscal Year: ${Fiscal_Year} under Quarter: ${Quarter}`
        // );
      }

      const quarterKeys = Object.keys(dataset); // No sorting, just as added
      const currentQuarterIndex = quarterKeys.indexOf(Quarter);
      const prevQuarter = currentQuarterIndex > 0 ? quarterKeys[currentQuarterIndex - 1] : null;
      const prevData = prevQuarter
        ? dataset[prevQuarter][Fiscal_Year] || { sales: 0 }
        : { sales: 0 };

      // Calculate UV, PV, and Sales
      const uv = prevQuarter ? Margin - prevData.sales : Margin || 0; // Difference from previous quarter's sales
      const pv = prevData.sales; // Carry forward previous quarter's sales
      const sales = prevData.sales + uv; // Cumulative sales
      const actualuv = uv;

      // Store calculated values in the dataset
      dataset[Quarter][Fiscal_Year] = { uv: actualuv, pv, actualuv, sales };

      // Log for debugging
      // console.log(`Processed Quarter: ${Quarter}, Fiscal Year: ${Fiscal_Year}`);
      // console.log(`UV: ${uv}, PV: ${pv}, Sales: ${sales}`);
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addMarginData(item, quarterDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addMarginData(item, quarterDataset);
      });
    }

    // console.log("\nFinal Processed Dataset by Quarter:", quarterDataset);
    return quarterDataset;
  };

  const getWaterfallDataByWeek = ({ currentYearData, previousYearData }) => {
    let weekDataset = {}; // Initialize an empty dataset to hold the processed data

    const addMarginData = (item, dataset) => {
      const { Fiscal_Year, Week, Margin } = item;

      if (!dataset[Week]) {
        dataset[Week] = {}; // Initialize data for the week
        console.log(`Initializing dataset for Week: ${Week}`);
      }

      if (!dataset[Week][Fiscal_Year]) {
        dataset[Week][Fiscal_Year] = {
          uv: 0,
          pv: 0,
          actualuv: 0,
          sales: 0,
        };
        // console.log(`Initializing dataset for Fiscal Year: ${Fiscal_Year} under Week: ${Week}`);
      }

      const weekKeys = Object.keys(dataset); // No sorting, just as added
      const currentWeekIndex = weekKeys.indexOf(Week);
      const prevWeek = currentWeekIndex > 0 ? weekKeys[currentWeekIndex - 1] : null;
      const prevData = prevWeek ? dataset[prevWeek][Fiscal_Year] || { sales: 0 } : { sales: 0 };

      // Calculate UV, PV, and Sales
      const uv = prevWeek ? Margin - prevData.sales : Margin || 0; // Difference from previous week's sales
      const pv = prevData.sales; // Carry forward previous week's sales
      const sales = prevData.sales + uv; // Cumulative sales
      const actualuv = uv;

      // Store calculated values in the dataset
      dataset[Week][Fiscal_Year] = { uv: actualuv, pv, actualuv, sales };

      // Log for debugging
      // console.log(`Processed Week: ${Week}, Fiscal Year: ${Fiscal_Year}`);
      // console.log(`UV: ${uv}, PV: ${pv}, Sales: ${sales}`);
    };

    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addMarginData(item, weekDataset);
      });
    }

    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addMarginData(item, weekDataset);
      });
    }

    // console.log("\nFinal Processed Dataset by Week:", weekDataset);
    return weekDataset;
  };

  useEffect(() => {
    if (responseData) {
      const timeWindowData = getWaterfallDataByTimeWindow({
        currentYearData: responseData.currentYearData || [],
        previousYearData: responseData.previousYearData || [],
        timeWindow,
      });

      const months = Object.keys(timeWindowData); // ['April', 'May', 'June', 'July']
      const years = [...new Set(months.flatMap((month) => Object.keys(timeWindowData[month])))]; // ['2025', '2024']
      // console.log(years, "yyyyyyyyyyyyyyyyyyyyyyyyyy");

      const datasets = [];

      years.forEach((year) => {
        // Get Sales and UV data
        let salesData = months.map((month) => timeWindowData[month]?.[year]?.sales || 0);
        let uvData = months.map((month) => timeWindowData[month]?.[year]?.uv || 0);

        // Set the first value of UV to 0
        if (uvData.length > 0) {
          uvData[0] = 0;
        }

        // console.log(salesData, "Sales Data");
        // console.log(uvData, "UV Data");

        // Dataset for Sales
        datasets.push({
          label: `${year} Sales`,
          data: salesData, // Sales data
          backgroundColor: salesData.map(
            (_, index) => (index === 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(0, 0, 0, 0)") // Blue for first value, transparent for others
          ),
          borderColor: salesData.map(
            (_, index) => (index === 0 ? "rgba(54, 162, 235, 1)" : "rgba(0, 0, 0, 0)") // Blue border for first value, transparent for others
          ),
          borderWidth: 1,
        });

        // Dataset for UV (convert negative values to positive for stacking)
        const uvStackedData = uvData.map((value) => Math.abs(value)); // Take absolute value of UV data

        // Add UV dataset
        datasets.push({
          label: `${year} UV`,
          data: uvStackedData,
          backgroundColor: uvData.map(
            (value) => (value < 0 ? "rgba(255, 99, 132, 0.6)" : "rgba(54, 162, 235, 0.6)") // Red for negative, blue for positive
          ),

          borderColor: uvData.map(
            (value) => (value < 0 ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)") // Red for negative, blue for positive
          ),
          borderWidth: 1,
        });
      });

      // console.log(datasets, "Datasets");

      // Set the chart data
      setWaterfallBar({
        labels: months, // Month labels
        datasets,
      });
    } else {
      console.error("Response data is missing.");
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

  // for weekly days wise chart


  const [WeeklyChartdata, setWeeklyChartData] = useState({
    labels: [], // Week labels go here
    datasets: [], // Data for sales per day and total sales per week
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              // console.log(tooltipItem, "Tooltip Item");

              // Get the day (e.g., Monday, Tuesday, etc.) from the tooltipItem dataset label
              const day = tooltipItem.dataset.label;
              // Get the index of the specific week or day for the current tooltip
              const weekIndex = tooltipItem.dataIndex;

              // Access the sales data and event for that day and week
              const salesData = salPerday[day][weekIndex];

              // Create the tooltip label with the sales value
              let label = `${day}: $${salesData.value.toFixed(2)}`;

              if (salesData.event) {
                label += ` - ${salesData.event}`; // Add event details if present
              }

              // console.log(label, "Label");

              return label; // Return the final label to be shown in the tooltip
            },
          },
        },
      },
    },
  });



  useEffect(() => {
    let isMounted = true; // Flag to track if the component is still mounted

    const defaultCardPayload = {
      view: "weekly-gmv-measure",
    };

    const fetchCardData = async () => {
      try {
        const token = sessionStorage.getItem("Access_Token");

        if (!token) {
          console.error("Access Token is missing");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token here
          },
        };

        const response = await axios.post(url, defaultCardPayload, config); // Pass headers in the third argument
        const responseData = response.data;

        const validJsonString = responseData.replace(/'/g, '"');
        const WeeklySalesMarginInfo = JSON.parse(validJsonString);

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

          WeeklySalesMarginInfo.forEach((weekData) => {
            const weekKey = Object.keys(weekData)[0];
            const weekInfo = weekData[weekKey];

            Object.keys(salPerday).forEach((day) => {
              const [value, event] = (weekInfo[day] || "0").split(" - ").map((str) => str.trim());
              salPerday[day].push({
                value: parseFloat(value) || 0,
                event: event || null,
              });
            });
          });

          const datasets = [
            {
              label: "Gross Amount per Week",
              type: "line",
              backgroundColor: "#4E78A6",
              borderColor: "#4E78A6",
              fill: false,
              data: weeks.map(
                (weekKey) =>
                  parseFloat(
                    WeeklySalesMarginInfo.find((weekData) => weekKey in weekData)[weekKey][
                      "Gross_Amount_Per_Week"
                    ]
                  ) || 0
              ),
              categoryPercentage: 1.0,
              barPercentage: 0.2,
            },
            ...Object.keys(salPerday).map((dayOfWeek, index) => ({
              label: dayOfWeek,
              backgroundColor: backgroundColorsWeekly[index % backgroundColorsWeekly.length],
              borderColor: backgroundColorsWeekly[index % backgroundColorsWeekly.length],
              data: salPerday[dayOfWeek].map((entry) => entry.value),
              barPercentage: 1.0,
              categoryPercentage: 0.5,
            })),
          ];

          if (isMounted) {
            setWeeklyChartData({
              labels: weeks.map((week) => `${week}`),
              datasets: datasets,
              options: {
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => {
                        const datasetLabel = tooltipItem.dataset.label;

                        if (datasetLabel === "Gross Amount per Week") {
                          const value = tooltipItem.raw || 0;
                          return `${datasetLabel}: ${value.toFixed(2)}`;
                        }

                        if (salPerday[datasetLabel]) {
                          const weekIndex = tooltipItem.dataIndex;
                          const salesData = salPerday[datasetLabel][weekIndex];
                          if (salesData) {
                            let label = `${datasetLabel}: ${salesData.value.toFixed(2)}`;
                            if (salesData.event) {
                              label += `  **${salesData.event}`;
                            }

                            return label;
                          }
                        }

                        return datasetLabel;
                      },
                    },
                  },
                },
              },
            });
          }
        } else {
          console.log("No weekly sales data found.");
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchCardData();

    return () => {
      isMounted = false;
    };
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
              backgroundColor: "#004792",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
              color: "#fff",
              borderColor: "#b366ff",
              "&:hover": {
                backgroundColor: "#9a4fff",
                borderColor: "#9a4fff",
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
              backgroundColor: "#19b091",
              color: "#fff",
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
              backgroundColor: "#f2a571",
              color: "#fff",
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
              backgroundColor: "#21c2c3",
              color: "#fff",
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
              backgroundColor: "#197fc0",
              color: "#fff",
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
              backgroundColor: "#e75361",
              color: "#fff",
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
              backgroundColor: "#758b98",
              color: "#fff",
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
              startDate={startDate || defaultStartDate}
              endDate={endDate || currentDate}
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
            // title={chartTitleCostWise}
          >
            <StackedBarChart
              chartData={stackedMonthWiseInfo}
              title={`Cost of Goods Sold (${timeWindowMap[timeWindow] || "Monthly"})`}
              startDate={startDate || defaultStartDate}
              endDate={endDate || currentDate}
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
              startDate={startDate || defaultStartDate}
              endDate={endDate || currentDate}
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
              // onDoubleClick={handleChartDoubleClick}
              onDoubleClick={() => console.log("waterfall Chart clicked")}
              startDate={startDate || defaultStartDate}
              endDate={endDate || currentDate}
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
              options={WeeklyChartdata.options}
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
