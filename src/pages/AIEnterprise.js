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

// import SessionStorageService from "src/utils/browser-storage/session";

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
  console.log("ttttttttttttt", accessTokens);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const token = sessionStorage.getItem("Access_Token");
  //     console.log("Retrieved Token from sessionStorage:", token);
  //     setAccessToken(token);

  //     if (token) {
  //       console.log("Token exists in sessionStorage:", token);
  //     } else {
  //       console.log("No Access Token found in sessionStorage.");
  //     }
  //   }
  // }, []);

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

  const { data } = useData();
  console.log(data, "daadadadadadadad");

  // const { dimension, timeWindow, startDate, endDate, isChecked } = router.query;

  const { dimension, timeWindow, startDate, endDate, isChecked } = data || {};

  const [includePrevYear, setIncludePrevYear] = useState(false);
  console.log(includePrevYear, "includePrevYear");

  // const url = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";
  const url = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

  // for cards
  const [totalSales, setTotalSales] = useState(0);

  const [cogs, setCogs] = useState(0);

  const [margin, setMargin] = useState(0);

  // for cards

  useEffect(() => {
    // const urls = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";
    // const urls = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

    // const url = urls; // Replace with your actual URL
    const defaultCardPayload = {
      view: "measures-ytd-mtd",
    };

    const fetchCardData = async () => {
      try {
        const response = await axios.post(url, defaultCardPayload);
        const data = response.data;

        // console.log(response.data, "cardsssssssssssssssssss");
        if (data.YTD && data.YTD.length > 0) {
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

  // console.log("defaultPayload:", defaultPayload);

  const stableUrl = useMemo(() => url, [url]);
  const stablePayload = useMemo(() => defaultPayload, [defaultPayload]);

  useEffect(() => {
    console.log("Updated defaultPayload:", defaultPayload);
  }, [defaultPayload]);

  // acces token

  useEffect(() => {
    const fetchData = async () => {
      if (!stableUrl || !stablePayload) return;

      try {
        console.log("Fetching data with URL:", stableUrl);
        console.log("Payload:", stablePayload);

        const response = await axios.post(stableUrl, stablePayload);
        const responseData = response.data;

        console.log("Fetched dataaaaaaaaaaaaaaaaaaa:", responseData);

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

    fetchData();
  }, [stableUrl, stablePayload]);

  const authPostURL = "https://nqy17v7tdd.execute-api.ap-south-1.amazonaws.com/dev/data-insights";

  //  useEffect(() => {
  //     const fetchData = async () => {
  //       if (!stableUrl || !stablePayload) return;

  //       // Retrieve the Access Token from sessionStorage directly
  //       const token = sessionStorage.getItem("Access_Token");

  //       if (!token) {
  //         console.error("Access Token is missing");
  //         return;
  //       }

  //       console.log("Using Access Token:", token);

  //       const authHeader = `Bearer ${token}`;
  //       console.log("Authorization Header:", authHeader); // Log the header value

  //       try {
  //         console.log("Fetching data with URL:", authPostURL);
  //         console.log("Payload:", stablePayload);

  //         // Make the API call with the Authorization header
  //         const response = await axios.post(authPostURL, stablePayload, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });

  //         const responseData = response.data;

  //         console.log("Fetched data:", responseData);

  //         // Process the response data
  //         const currentYearData = responseData["Current Fiscal Year"];
  //         if (stablePayload.include_prev_year) {
  //           const previousYearData = responseData["Previous Fiscal Year"];
  //           setResponseData({
  //             currentYearData,
  //             previousYearData,
  //           });
  //         } else {
  //           setResponseData({
  //             currentYearData,
  //             previousYearData: [],
  //           });
  //         }
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, [stableUrl, stablePayload]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!stableUrl || !stablePayload) return;
  //     const token = sessionStorage.getItem("Access_Token");
  //     console.log("AccessToken:", token);  // This will print the stored token in the console

  //     // Retrieve the Access Token from sessionStorage
  //     if (!token) {
  //       console.error("Access Token is missing");
  //       return;
  //     }

  //     const authPostURL =
  //       "https://nqy17v7tdd.execute-api.ap-south-1.amazonaws.com/dev/data-insights";

  //     try {

  //       console.log("Fetching data with URL:", authPostURL);
  //       console.log("Payload:", stablePayload);
  //       console.log("Accessssssss Token:", token);
  //       // Make the API call with the Authorization header
  //       const response = await axios.post(authPostURL, stablePayload, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           // 'Content-Type': 'application/json', // Uncomment if needed
  //         },
  //       });

  //       const responseData = response.data;

  //       console.log("Fetched data:", responseData);

  //       // Process the response data
  //       const currentYearData = responseData["Current Fiscal Year"];
  //       if (stablePayload.include_prev_year) {
  //         const previousYearData = responseData["Previous Fiscal Year"];
  //         setResponseData({
  //           currentYearData,
  //           previousYearData,
  //         });
  //       } else {
  //         setResponseData({
  //           currentYearData,
  //           previousYearData: [],
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Response Status:", error.response.status);
  //       console.error("Response Data:", error.response.data); // This will give more details
  //     }
  //   };

  //   fetchData();
  // }, [stableUrl, stablePayload]);

  useEffect(() => {
    if (responseData) {
      // console.log("Graph data updated with:", responseData);
    }
  }, [responseData]);

  // const getTotalSalesDataByWeek = ({ currentYearData, previousYearData }) => {
  //   // console.log("currentYearData:", currentYearData);
  //   // console.log("previousYearData:", previousYearData);

  //   const currentYearDataset = Array.isArray(currentYearData)
  //     ? currentYearData.map((item) => ({
  //         week: item.Week,
  //         //  week: `${item.Fiscal_Year} ${item.Week}`,
  //         totalSales: item.Gross_Amount,
  //       }))
  //     : [];

  //   const previousYearDataset = Array.isArray(previousYearData)
  //     ? previousYearData.map((item) => ({
  //         week: item.Week,
  //         //  week: `${item.Fiscal_Year} ${item.Week}`,
  //         totalSales: item.Gross_Amount,
  //       }))
  //     : [];

  //   return { currentYearDataset, previousYearDataset };
  // };

  // const getTotalSalesDataByQuarter = ({ currentYearData, previousYearData }) => {
  //   // console.log("currentYearData:", currentYearData);
  //   // console.log("previousYearData:", previousYearData);

  //   const currentYearDataset = Array.isArray(currentYearData)
  //     ? currentYearData.map((item) => ({
  //         quarter: item.Quarter,
  //         totalSales: item.Gross_Amount,
  //       }))
  //     : [];

  //   const previousYearDataset = Array.isArray(previousYearData)
  //     ? previousYearData.map((item) => ({
  //         quarter: item.Quarter,
  //         totalSales: item.Gross_Amount,
  //       }))
  //     : [];

  //   return { currentYearDataset, previousYearDataset };
  // };

  // const getTotalSalesDataByYear = ({ currentYearData, previousYearData }) => {
  //   // console.log("currentYearDatayyyyyyyyyyyy:", currentYearData);
  //   // console.log("previousYearDatayyyyyyyyyyyyy:", previousYearData);

  //   const currentYearDataset = Array.isArray(currentYearData)
  //     ? currentYearData.map((item) => ({
  //         year: item.Year,
  //         totalSales: item.Gross_Amount,
  //       }))
  //     : [];

  //   const previousYearDataset = Array.isArray(previousYearData)
  //     ? previousYearData.map((item) => ({
  //         year: item.Year,
  //         totalSales: item.Gross_Amount,
  //       }))
  //     : [];

  //   // console.log("currentYearDataset:", currentYearDataset);
  //   // console.log("previousYearDataset:", previousYearDataset);
  //   return { currentYearDataset, previousYearDataset };
  // };

  // mainn

  // const getTotalSalesDataByMonth = ({ currentYearData, previousYearData }) => {
  //   console.log("currentYearData:", currentYearData);
  //   console.log("previousYearData:", previousYearData);

  //   let currentYearDataset = [];
  //   let previousYearDataset = [];

  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item) => ({
  //       month: item.Month,
  //       // month: `${item.Month} ${item.Fiscal_Year}`,
  //       // year: item.Fiscal_Year,

  //       totalSales: item.Gross_Amount,
  //     }));
  //   } else {
  //     console.error("Expected currentYearData to be an array.");
  //   }

  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item) => ({
  //       month: item.Month,
  //       // month: `${item.Month} ${item.Fiscal_Year}`,
  //       // year: item.Fiscal_Year,

  //       totalSales: item.Gross_Amount,
  //     }));
  //   } else {
  //     console.error("Expected previousYearData to be an array.");
  //   }

  //   return { currentYearDataset, previousYearDataset };
  // };

  // useEffect(() => {
  //   if (responseData) {
  //     // console.log("responseData1111111111:", responseData);
  //     // console.log("timeWindow:", timeWindow);

  //     let currentYearData = [];
  //     let previousYearData = [];
  //     let processedData = [];

  //     let labelType;
  //     if (timeWindow === "W") {
  //       labelType = "week";
  //     } else if (timeWindow === "Q") {
  //       labelType = "quarter";
  //     } else if (timeWindow === "Y") {
  //       labelType = "year";
  //     } else {
  //       labelType = "month";
  //     }

  //     switch (timeWindow) {
  //       case "W":
  //         const weekData = getTotalSalesDataByWeek(responseData);
  //         currentYearData = weekData.currentYearDataset;
  //         previousYearData = weekData.previousYearDataset;
  //         break;
  //       case "Q":
  //         const quarterData = getTotalSalesDataByQuarter(responseData);
  //         currentYearData = quarterData.currentYearDataset;
  //         previousYearData = quarterData.previousYearDataset;
  //         break;
  //       case "Y":
  //         const yearData = getTotalSalesDataByYear(responseData);
  //         currentYearData = yearData.currentYearDataset;
  //         previousYearData = yearData.previousYearDataset;
  //         break;
  //       case "M":
  //       default:
  //         const monthData = getTotalSalesDataByMonth(responseData);
  //         currentYearData = monthData.currentYearDataset;
  //         previousYearData = monthData.previousYearDataset;
  //         break;
  //     }

  //     console.log("currentYearDatasetmmm:", currentYearData);
  //     console.log("previousYearDatasetmmm:", previousYearData);

  //     // const allLabels = [
  //     //   ...new Set([
  //     //     ...currentYearData.map((item) => item[labelType]),
  //     //     ...previousYearData.map((item) => item[labelType]),
  //     //   ]),
  //     // ];Fiscal_Year

  //      const allLabels = [
  //       ...new Set([
  //         ...currentYearData.map((item) => item.Fiscal_Year),
  //         ...previousYearData.map((item) => item.Fiscal_Year),
  //       ]),
  //     ];

  //     console.log("All Labels:", allLabels);

  //     const data = allLabels.map((label) => {
  //       const currentYearDataPoint = currentYearData.find((item) => item[labelType] === label);

  //       const previousYearDataPoint = previousYearData.find((item) => item[labelType] === label);

  //       return {
  //         currentYear: currentYearDataPoint ? currentYearDataPoint.totalSales : 0,
  //         previousYear: previousYearDataPoint ? previousYearDataPoint.totalSales : 0,
  //       };
  //     });

  //     // console.log("Processed data:", data);

  //     // Update chart data
  //     setChartData((prevState) => {
  //       const currentYearDataset = data.map((d) => d.currentYear);
  //       const previousYearDataset = data.map((d) => d.previousYear);

  //       return {
  //         labels: allLabels,
  //         datasets: [
  //           {
  //             label: "Current FY",
  //             data: currentYearDataset,
  //             backgroundColor: "rgba(25, 127, 192)",
  //             borderColor: "rgba(25, 127, 192)",
  //             borderWidth: 1,
  //           },
  //           {
  //             label: "Corresponding Previous FY",
  //             data: previousYearDataset,
  //             backgroundColor: "rgba(25, 127, 192, 0.16)",
  //             borderColor: "rgba(25, 127, 192, 0.16)",
  //             borderWidth: 1,
  //           },
  //         ],
  //       };
  //     });
  //   } else {
  //     console.error("Response data or timeWindow is missing.");
  //   }
  // }, [responseData, timeWindow]);

  // good++++++++++++++newww==================== working seprately

  // ------------------------------------------------------------

  // agfn new tryyyyyyyy

  const getSalesDataByTimeWindow = ({ currentYearData, previousYearData, timeWindow }) => {
    let timeWindowDataset = {};

    // Helper function to get the correct time window function
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

    // Get the function based on selected time window (Week, Month, Quarter, Year)
    const getTotalSalesData = getDataByTimeWindow(timeWindow);

    // Call the appropriate function to process data
    const timeWindowData = getTotalSalesData({
      currentYearData,
      previousYearData,
    });

    return timeWindowData;
  };

  const getTotalSalesDataByMonth = ({ currentYearData, previousYearData }) => {
    let monthDataset = {};

    // Processing current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        const { Month, Fiscal_Year, Gross_Amount } = item;
        if (!monthDataset[Month]) {
          monthDataset[Month] = {};
        }
        monthDataset[Month][Fiscal_Year] = Gross_Amount;
      });
    }

    // Processing previous year data
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

    // Processing current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        const { Week, Fiscal_Year, Gross_Amount } = item;
        if (!weekDataset[Week]) {
          weekDataset[Week] = {};
        }
        weekDataset[Week][Fiscal_Year] = Gross_Amount;
      });
    }

    // Processing previous year data
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

    // Processing current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        const { Quarter, Fiscal_Year, Gross_Amount } = item;
        if (!quarterDataset[Quarter]) {
          quarterDataset[Quarter] = {};
        }
        quarterDataset[Quarter][Fiscal_Year] = Gross_Amount;
      });
    }

    // Processing previous year data
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

    // Processing current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        const { Year, Fiscal_Year, Gross_Amount } = item;
        if (!yearDataset[Year]) {
          yearDataset[Year] = {};
        }
        yearDataset[Year][Fiscal_Year] = Gross_Amount;
      });
    }

    // Processing previous year data
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

      // Get time window data (by Week, Month, Quarter, or Year)
      const timeWindowData = getSalesDataByTimeWindow({
        currentYearData,
        previousYearData,
        timeWindow,
      });

      // Extract unique time labels (Months, Weeks, Quarters, or Fiscal Years)
      const allLabels = Object.keys(timeWindowData);
      console.log("All Labels:", allLabels);

      // Extract all fiscal years (for both current and previous data)
      const allYears = [
        ...new Set([
          ...currentYearData.map((item) => item.Fiscal_Year),
          ...previousYearData.map((item) => item.Fiscal_Year),
        ]),
      ];
      console.log("All Fiscal Years:", allYears);

      // Map datasets for each year across all time periods (Months, Weeks, etc.)
      const datasets = allYears.map((year, index) => ({
        label: `${year} FY`,
        data: allLabels.map(
          (label) => timeWindowData[label]?.[year] || 0 // Default to 0 if no data
        ),
        backgroundColor: `rgba(${(index * 150) % 255}, ${(index * 150) % 255}, ${
          (index * 50) % 255
        }, 0.5)`,
        borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
          (index * 150) % 255
        }, 1)`,
        borderWidth: 1,
      }));
      console.log("Datasets:", datasets);

      // Update chart data
      setChartData({
        labels: allLabels, // Use dynamic time labels (Week, Month, Quarter, Fiscal Year)
        datasets,
      });

      console.log("Chart Data:", { labels: allLabels, datasets });
    } else {
      console.error("Response data is missing.");
    }
  }, [responseData, timeWindow]);

  // 2222222222222222222222222222222222222222222222222

  const getProcessedDataByTimeWindow = ({ currentYearData, previousYearData, timeWindow }) => {
    let timeWindowDataset = {};

    // Helper function to get the correct time window function
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

    // Get the function based on selected time window (Week, Month, Quarter, Year)
    const getTotalSalesData = getDataByTimeWindow(timeWindow);

    // Call the appropriate function to process data
    const timeWindowData = getTotalSalesData({
      currentYearData,
      previousYearData,
    });

    return timeWindowData;
  };

  // const getProcessedDataByMonth = ({ currentYearData, previousYearData }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];

  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item) => ({
  //       month: item.Month,
  //       Supplies_Cost: item.Supplies_Cost,
  //       Materials_Cost: item.Materials_Cost,
  //       Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"],
  //       Materials_Cost_Cogs: item["Materials_Cost/Cogs"],
  //       // Discounts: item.Discounts,
  //     }));
  //   } else {
  //     console.error("Expected currentYearData to be an array.");
  //   }

  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item) => ({
  //       month: item.Month,
  //       Supplies_Cost: item.Supplies_Cost,
  //       Materials_Cost: item.Materials_Cost,
  //       Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"],
  //       Materials_Cost_Cogs: item["Materials_Cost/Cogs"],
  //       // Discounts: item.Discounts,
  //     }));
  //   } else {
  //     console.error("Expected previousYearData to be an array.");
  //   }

  //   return { currentYearDataset, previousYearDataset };
  // };

  const getProcessedDataByMonth = ({ currentYearData, previousYearData }) => {
    let monthDataset = {};
    console.log("monthDataset", monthDataset);

    // Helper function to add cost data for the month
    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Month,
        Supplies_Cost: Supplies_Cost,
        Materials_Cost: Materials_Cost,
        "Supplies_Cost/Cogs": Supplies_Cost_Cogs,
        "Materials_Cost/Cogs": Materials_Cost_Cogs,
      } = item;

      // Initialize the dataset for the month if not already created
      if (!dataset[Month]) {
        dataset[Month] = {};
      }

      // Initialize the Fiscal Year data if it doesn't exist for the month
      if (!dataset[Month][Fiscal_Year]) {
        dataset[Month][Fiscal_Year] = {
          Supplies_Cost: 0,
          Materials_Cost: 0,
          Supplies_Cost_Cogs: 0,
          Materials_Cost_Cogs: 0,
        };
      }

      // Add the costs to the dataset for the current month and fiscal year
      dataset[Month][Fiscal_Year].Supplies_Cost += Supplies_Cost || 0;
      dataset[Month][Fiscal_Year].Materials_Cost += Materials_Cost || 0;
      dataset[Month][Fiscal_Year].Supplies_Cost_Cogs += Supplies_Cost_Cogs || 0;
      dataset[Month][Fiscal_Year].Materials_Cost_Cogs += Materials_Cost_Cogs || 0;
    };

    // Process current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, monthDataset);
      });
    }

    // Process previous year data
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, monthDataset);
      });
    }

    console.log("monthDataset", monthDataset);
    return monthDataset;
  };

  // const getProcessedDataByQuarter = ({ currentYearData, previousYearData }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];

  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item) => ({
  //       quarter: item.Quarter,
  //       Supplies_Cost: item.Supplies_Cost,
  //       Materials_Cost: item.Materials_Cost,
  //       Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"],
  //       Materials_Cost_Cogs: item["Materials_Cost/Cogs"],
  //       // Discounts: item.Discounts,
  //     }));
  //   } else {
  //     console.error("Expected currentYearData to be an array.");
  //   }

  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item) => ({
  //       quarter: item.Quarter,
  //       Supplies_Cost: item.Supplies_Cost,
  //       Materials_Cost: item.Materials_Cost,
  //       Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"],
  //       Materials_Cost_Cogs: item["Materials_Cost/Cogs"],
  //       // Discounts: item.Discounts,
  //     }));
  //   } else {
  //     console.error("Expected previousYearData to be an array.");
  //   }

  //   return { currentYearDataset, previousYearDataset };
  // };

  const getProcessedDataByQuarter = ({ currentYearData, previousYearData }) => {
    let quarterDataset = {};

    // Helper function to add cost data for the Quarter
    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Quarter,
        Supplies_Cost: Supplies_Cost,
        Materials_Cost: Materials_Cost,
        "Supplies_Cost/Cogs": Supplies_Cost_Cogs,
        "Materials_Cost/Cogs": Materials_Cost_Cogs,
      } = item;

      // Initialize the dataset for the Quarter if not already created
      if (!dataset[Quarter]) {
        dataset[Quarter] = {};
      }

      // Initialize the Fiscal Year data if it doesn't exist for the Quarter
      if (!dataset[Quarter][Fiscal_Year]) {
        dataset[Quarter][Fiscal_Year] = {
          Supplies_Cost: 0,
          Materials_Cost: 0,
          Supplies_Cost_Cogs: 0,
          Materials_Cost_Cogs: 0,
        };
      }

      // Add the costs to the dataset for the current Quarter and fiscal year
      dataset[Quarter][Fiscal_Year].Supplies_Cost += Supplies_Cost || 0;
      dataset[Quarter][Fiscal_Year].Materials_Cost += Materials_Cost || 0;
      dataset[Quarter][Fiscal_Year].Supplies_Cost_Cogs += Supplies_Cost_Cogs || 0;
      dataset[Quarter][Fiscal_Year].Materials_Cost_Cogs += Materials_Cost_Cogs || 0;
    };

    // Process current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, quarterDataset);
      });
    }

    // Process previous year data
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, quarterDataset);
      });
    }

    console.log("quarterDataset", quarterDataset);
    return quarterDataset;
  };

  // const getProcessedDataByYear = ({ currentYearData, previousYearData }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];

  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item) => ({
  //       year: item.Year,
  //       Supplies_Cost: item.Supplies_Cost,
  //       Materials_Cost: item.Materials_Cost,
  //       Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"],
  //       Materials_Cost_Cogs: item["Materials_Cost/Cogs"],
  //       // Discounts: item.Discounts,
  //     }));
  //   } else {
  //     console.error("Expected currentYearData to be an array.");
  //   }

  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item) => ({
  //       year: item.Year,
  //       Supplies_Cost: item.Supplies_Cost,
  //       Materials_Cost: item.Materials_Cost,
  //       Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"],
  //       Materials_Cost_Cogs: item["Materials_Cost/Cogs"],
  //       // Discounts: item.Discounts,
  //     }));
  //   } else {
  //     console.error("Expected previousYearData to be an array.");
  //   }

  //   // console.log("currentYearDataset2222:", currentYearDataset);
  //   // console.log("previousYearDataset222:", previousYearDataset);

  //   return { currentYearDataset, previousYearDataset };
  // };

  const getProcessedDataByYear = ({ currentYearData, previousYearData }) => {
    let yearDataset = {};

    // Helper function to add cost data for the Quarter
    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Year,
        Supplies_Cost: Supplies_Cost,
        Materials_Cost: Materials_Cost,
        "Supplies_Cost/Cogs": Supplies_Cost_Cogs,
        "Materials_Cost/Cogs": Materials_Cost_Cogs,
      } = item;

      // Initialize the dataset for the Quarter if not already created
      if (!dataset[Year]) {
        dataset[Year] = {};
      }

      // Initialize the Fiscal Year data if it doesn't exist for the Quarter
      if (!dataset[Year][Fiscal_Year]) {
        dataset[Year][Fiscal_Year] = {
          Supplies_Cost: 0,
          Materials_Cost: 0,
          Supplies_Cost_Cogs: 0,
          Materials_Cost_Cogs: 0,
        };
      }

      // Add the costs to the dataset for the current Quarter and fiscal year
      dataset[Year][Fiscal_Year].Supplies_Cost += Supplies_Cost || 0;
      dataset[Year][Fiscal_Year].Materials_Cost += Materials_Cost || 0;
      dataset[Year][Fiscal_Year].Supplies_Cost_Cogs += Supplies_Cost_Cogs || 0;
      dataset[Year][Fiscal_Year].Materials_Cost_Cogs += Materials_Cost_Cogs || 0;
    };

    // Process current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, yearDataset);
      });
    }

    // Process previous year data
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, yearDataset);
      });
    }

    return yearDataset;
  };

  // const getProcessedDataByWeek = ({ currentYearData, previousYearData }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];

  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item) => ({
  //       week: item.Week,
  //       // week: `${item.Fiscal_Year} ${item.Week}`,
  //       Supplies_Cost: item.Supplies_Cost,

  //       Materials_Cost: item.Materials_Cost,
  //       Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"],
  //       Materials_Cost_Cogs: item["Materials_Cost/Cogs"],
  //       // Discounts: item.Discounts,
  //     }));
  //   } else {
  //     console.error("Expected currentYearData to be an array.");
  //   }

  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item) => ({
  //       week: item.Week,

  //       // week: `${item.Fiscal_Year} ${item.Week}`,
  //       Supplies_Cost: item.Supplies_Cost,

  //       Materials_Cost: item.Materials_Cost,
  //       Supplies_Cost_Cogs: item["Supplies_Cost/Cogs"],
  //       Materials_Cost_Cogs: item["Materials_Cost/Cogs"],
  //       // Discounts: item.Discounts,
  //     }));
  //   } else {
  //     console.error("Expected previousYearData to be an array.");
  //   }

  //   return { currentYearDataset, previousYearDataset };
  // };

  const getProcessedDataByWeek = ({ currentYearData, previousYearData }) => {
    let weekDataset = {};

    // Helper function to add cost data for the Quarter
    const addCostData = (item, dataset) => {
      const {
        Fiscal_Year,
        Week,
        Supplies_Cost: Supplies_Cost,
        Materials_Cost: Materials_Cost,
        "Supplies_Cost/Cogs": Supplies_Cost_Cogs,
        "Materials_Cost/Cogs": Materials_Cost_Cogs,
      } = item;

      // Initialize the dataset for the Quarter if not already created
      if (!dataset[Week]) {
        dataset[Week] = {};
      }

      // Initialize the Fiscal Year data if it doesn't exist for the Quarter
      if (!dataset[Week][Fiscal_Year]) {
        dataset[Week][Fiscal_Year] = {
          Supplies_Cost: 0,
          Materials_Cost: 0,
          Supplies_Cost_Cogs: 0,
          Materials_Cost_Cogs: 0,
        };
      }

      // Add the costs to the dataset for the current Quarter and fiscal year
      dataset[Week][Fiscal_Year].Supplies_Cost += Supplies_Cost || 0;
      dataset[Week][Fiscal_Year].Materials_Cost += Materials_Cost || 0;
      dataset[Week][Fiscal_Year].Supplies_Cost_Cogs += Supplies_Cost_Cogs || 0;
      dataset[Week][Fiscal_Year].Materials_Cost_Cogs += Materials_Cost_Cogs || 0;
    };

    // Process current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, weekDataset);
      });
    }

    // Process previous year data
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, weekDataset);
      });
    }

    console.log("weekDataset:", weekDataset);
    return weekDataset;
  };

  // useEffect(() => {
  //   if (responseData) {
  //     // console.log("responseData:", responseData);
  //     // console.log("timeWindow:", timeWindow);

  //     let currentYearData = [];
  //     let previousYearData = [];

  //     let labelType;
  //     if (timeWindow === "W") {
  //       labelType = "week";
  //     } else if (timeWindow === "Q") {
  //       labelType = "quarter";
  //     } else if (timeWindow === "Y") {
  //       labelType = "year";
  //     } else {
  //       labelType = "month";
  //     }

  //     switch (timeWindow) {
  //       case "W":
  //         const weekData = getProcessedDataByWeek(responseData);
  //         currentYearData = weekData.currentYearDataset;
  //         previousYearData = weekData.previousYearDataset;
  //         break;
  //       case "Q":
  //         const quarterData = getProcessedDataByQuarter(responseData);
  //         currentYearData = quarterData.currentYearDataset;
  //         previousYearData = quarterData.previousYearDataset;
  //         break;
  //       case "Y":
  //         const yearData = getProcessedDataByYear(responseData);
  //         currentYearData = yearData.currentYearDataset;
  //         previousYearData = yearData.previousYearDataset;
  //         break;
  //       case "M":
  //       default:
  //         const monthData = getProcessedDataByMonth(responseData);
  //         currentYearData = monthData.currentYearDataset;
  //         previousYearData = monthData.previousYearDataset;
  //         break;
  //     }

  //     // Ensure labels are extracted correctly
  //     const allLabels = [
  //       ...new Set([
  //         ...currentYearData.map((item) => item[labelType]),
  //         ...previousYearData.map((item) => item[labelType]),
  //       ]),
  //     ];

  //     // console.log("All Labels:", allLabels);

  //     const data = allLabels.map((label) => {
  //       const currentYearDataPoint = currentYearData.find((item) => item[labelType] === label);
  //       const previousYearDataPoint = previousYearData.find((item) => item[labelType] === label);

  //       // console.log("Current Year Data Point22222:", currentYearDataPoint);

  //       return {
  //         Supplies_Cost_CurrentYear: currentYearDataPoint ? currentYearDataPoint.Supplies_Cost : 0,
  //         Materials_Cost_CurrentYear: currentYearDataPoint
  //           ? currentYearDataPoint.Materials_Cost
  //           : 0,
  //         Supplies_Cost_Cogs_CurrentYear: currentYearDataPoint
  //           ? currentYearDataPoint.Supplies_Cost_Cogs
  //           : 0,
  //         Materials_Cost_Cogs_CurrentYear: currentYearDataPoint
  //           ? currentYearDataPoint.Materials_Cost_Cogs
  //           : 0,
  //         Supplies_Cost_PreviousYear: previousYearDataPoint
  //           ? previousYearDataPoint.Supplies_Cost
  //           : 0,
  //         Materials_Cost_PreviousYear: previousYearDataPoint
  //           ? previousYearDataPoint.Materials_Cost
  //           : 0,
  //         Supplies_Cost_Cogs_PreviousYear: previousYearDataPoint
  //           ? previousYearDataPoint.Supplies_Cost_Cogs
  //           : 0,
  //         Materials_Cost_Cogs_PreviousYear: previousYearDataPoint
  //           ? previousYearDataPoint.Materials_Cost_Cogs
  //           : 0,
  //       };
  //     });

  //     // console.log("Processed data22222:", data);

  //     setStackedMonthWiseInfo({
  //       labels: allLabels,
  //       datasets: [
  //         {
  //           label: "Supplies Cost (Current Year)",
  //           data: data.map((d) => d.Supplies_Cost_CurrentYear),
  //           backgroundColor: "rgba(223,121,112)",
  //           stack: "currentYear",
  //           hidden: false,
  //         },
  //         {
  //           label: "Materials Cost (Current Year)",
  //           data: data.map((d) => d.Materials_Cost_CurrentYear),
  //           backgroundColor: "rgba(247,179,129)",
  //           stack: "currentYear",
  //           hidden: false,
  //         },
  //         {
  //           label: "Supplies Cost (Previous Year)",
  //           data: data.map((d) => d.Supplies_Cost_PreviousYear),
  //           backgroundColor: "rgba(223,121,112,0.3)",
  //           stack: "previousYear",
  //           hidden: false,
  //         },
  //         {
  //           label: "Materials Cost (Previous Year)",
  //           data: data.map((d) => d.Materials_Cost_PreviousYear),
  //           backgroundColor: "rgba(247,179,129,0.3)",
  //           stack: "previousYear",
  //           hidden: false,
  //         },

  //         {
  //           label: "Supplies Cost Cogs (Current Year)",
  //           data: data.map((d) => d.Supplies_Cost_Cogs_CurrentYear),
  //           type: "bar",
  //           backgroundColor: "rgba(255,255,255,0.5)",
  //           stack: "currentYear",
  //           hidden: true,
  //         },
  //         {
  //           label: "Materials Cost Cogs (Current Year)",
  //           data: data.map((d) => d.Materials_Cost_Cogs_CurrentYear),
  //           type: "bar",
  //           backgroundColor: "rgba(255,255,255,0.5)",
  //           stack: "currentYear",
  //           hidden: true,
  //         },
  //         {
  //           label: "Supplies Cost Cogs (Previous Year)",
  //           data: data.map((d) => d.Supplies_Cost_Cogs_PreviousYear),
  //           type: "bar",
  //           backgroundColor: "rgba(255,255,255,0.5)",
  //           stack: "previousYear",
  //           hidden: true,
  //         },
  //         {
  //           label: "Materials Cost Cogs (Previous Year)",
  //           data: data.map((d) => d.Materials_Cost_Cogs_PreviousYear),
  //           type: "bar",
  //           backgroundColor: "rgba(255,255,255,0.5)",
  //           stack: "previousYear",
  //           hidden: true,
  //         },
  //       ],
  //     });

  //   } else {
  //     console.error("Response data or timeWindow is missing.");
  //   }
  // }, [responseData, timeWindow]);

  console.log("StackedMonthWiseInfo:", stackedMonthWiseInfo);
  // 3rd chart

  // -----------------------------

  useEffect(() => {
    if (responseData) {
      const currentYearData = responseData.currentYearData || [];
      const previousYearData = responseData.previousYearData || [];

      const timeWindowData = getProcessedDataByTimeWindow({
        currentYearData,
        previousYearData,
        timeWindow,
      });

      console.log("Time Window Data:", timeWindowData);

      const allLabels = Object.keys(timeWindowData);
      console.log("All Labels:", allLabels);

      const allYears = [
        ...new Set([
          ...currentYearData.map((item) => item.Fiscal_Year),
          ...previousYearData.map((item) => item.Fiscal_Year),
        ]),
      ];
      console.log("All Fiscal2222 Years:", allYears);

      const generateYearColors = (years) => {
        const baseColors = [
          ["rgba(223,121,112,1)", "rgba(247,179,129,1)"],
          ["rgba(153,102,255,1)", "rgba(75,192,192,1)"], // Base color for Supplies, Materials
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

      // const datasets = allYears
      //   .map((year, index) => [
      //     // Supplies_Cost dataset for each year and month
      //     {
      //       label: `${year} Supplies Cost`,
      //       data: allLabels.map((month) => {
      //         const dataForMonth = timeWindowData[month]?.[year] || {};
      //         return dataForMonth.Supplies_Cost || 0;
      //       }),
      //       // backgroundColor: "rgba(223,121,112, 0.8)",

      //       backgroundColor: generateColorForYearAndCategory(year, "Supplies_Cost"),
      //       stack: `year-${year}`,
      //       hidden: false,
      //     },

      //     // Materials_Cost dataset for each year and month
      //     {
      //       label: `${year} Materials Cost`,
      //       data: allLabels.map((month) => {
      //         const dataForMonth = timeWindowData[month]?.[year] || {};
      //         return dataForMonth.Materials_Cost || 0;
      //       }),
      //       // backgroundColor: "rgba(247,179,129, 0.8)",
      //       backgroundColor: generateColorForYearAndCategory(year, "Materials_Cost"),

      //       stack: `year-${year}`,
      //       hidden: false,
      //     },
      //   ])
      //   .flat();

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

      console.log("Chart Data:", { labels: allLabels, datasets });
    } else {
      console.error("Response data is missing.");
    }
  }, [responseData, timeWindow]);

  // ========================================

  // 33333333333333333333333333333333333333333333

  const getTaxesDataByTimeWindow = ({ currentYearData, previousYearData, timeWindow }) => {
    let timeWindowDataset = {};

    // Helper function to get the correct time window function
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

    // Get the function based on selected time window (Week, Month, Quarter, Year)
    const getTotalSalesData = getDataByTimeWindow(timeWindow);

    // Call the appropriate function to process data
    const timeWindowData = getTotalSalesData({
      currentYearData,
      previousYearData,
    });

    return timeWindowData;
  };

  // const getTaxesDataByMonth = ({ currentYearData, previousYearData }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];

  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item) => ({
  //       month: item.Month,
  //       // taxes: item.Taxes,
  //       // grossAmount: item.Gross_Amount,
  //       // netAmount: item.Net_Amount,
  //       ChannelCommission: item.Channel_Commission,
  //       ShippingCost: item.Shipping_Cost,
  //       discount: item.Discounts,
  //       ChannelCommissionCos: item["Channel_Commission/Cos"],
  //       ShippingCostCos: item["Shipping_Cost/Cos"],
  //       discountCos: item["Discounts/Cos"],
  //     }));
  //   } else {
  //     console.error("Expected currentYearData to be an array.");
  //   }

  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item) => ({
  //       month: item.Month,
  //       // taxes: item.Taxes,
  //       // grossAmount: item.Gross_Amount,
  //       // netAmount: item.Net_Amount,
  //       ChannelCommission: item.Channel_Commission,
  //       ShippingCost: item.Shipping_Cost,
  //       discount: item.Discounts,
  //       ChannelCommissionCos: item["Channel_Commission/Cos"],
  //       ShippingCostCos: item["Shipping_Cost/Cos"],
  //       discountCos: item["Discounts/Cos"],
  //     }));
  //   } else {
  //     console.error("Expected previousYearData to be an array.");
  //   }

  //   return { currentYearDataset, previousYearDataset };
  // };

  const getTaxesDataByMonth = ({ currentYearData, previousYearData }) => {
    let monthDataset = {};
    console.log("monthDataset", monthDataset);

    // Helper function to add cost data for the month
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

      // Initialize the dataset for the month if not already created
      if (!dataset[Month]) {
        dataset[Month] = {};
      }

      // Initialize the Fiscal Year data if it doesn't exist for the month
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

      // Add the costs to the dataset for the current month and fiscal year
      dataset[Month][Fiscal_Year].Channel_Commission += Channel_Commission || 0;
      dataset[Month][Fiscal_Year].Discounts += Discounts || 0;
      dataset[Month][Fiscal_Year].Shipping_Cost += Shipping_Cost || 0;
      dataset[Month][Fiscal_Year].Channel_Commission_Cos += Channel_Commission_Cos || 0;
      dataset[Month][Fiscal_Year].Discounts_Cos += Discounts_Cos || 0;
      dataset[Month][Fiscal_Year].Shipping_Cost_Cos += Shipping_Cost_Cos || 0;
    };

    // Process current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, monthDataset);
      });
    }

    // Process previous year data
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, monthDataset);
      });
    }

    console.log("monthDataset", monthDataset);
    return monthDataset;
  };

  // const getTaxesDataByQuarter = ({ currentYearData, previousYearData }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];

  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item) => ({
  //       quarter: item.Quarter,
  //       // taxes: item.Taxes,
  //       // grossAmount: item.Gross_Amount,
  //       // netAmount: item.Net_Amount,
  //       ChannelCommission: item.Channel_Commission,
  //       ShippingCost: item.Shipping_Cost,
  //       discount: item.Discounts,
  //       ChannelCommissionCos: item["Channel_Commission/Cos"],
  //       ShippingCostCos: item["Shipping_Cost/Cos"],
  //       discountCos: item["Discounts/Cos"],
  //     }));
  //   } else {
  //     console.error("Expected currentYearData to be an array.");
  //   }

  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item) => ({
  //       quarter: item.Quarter,
  //       // taxes: item.Taxes,
  //       // grossAmount: item.Gross_Amount,
  //       // netAmount: item.Net_Amount,
  //       ChannelCommission: item.Channel_Commission,
  //       ShippingCost: item.Shipping_Cost,
  //       discount: item.Discounts,
  //       ChannelCommissionCos: item["Channel_Commission/Cos"],
  //       ShippingCostCos: item["Shipping_Cost/Cos"],
  //       discountCos: item["Discounts/Cos"],
  //     }));
  //   } else {
  //     console.error("Expected previousYearData to be an array.");
  //   }

  //   return { currentYearDataset, previousYearDataset };
  // };

  const getTaxesDataByQuarter = ({ currentYearData, previousYearData }) => {
    let quarterDataset = {};
    console.log("monthDataset", quarterDataset);

    // Helper function to add cost data for the month
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

      // Initialize the dataset for the month if not already created
      if (!dataset[Quarter]) {
        dataset[Quarter] = {};
      }

      // Initialize the Fiscal Year data if it doesn't exist for the month
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

      // Add the costs to the dataset for the current month and fiscal year
      dataset[Quarter][Fiscal_Year].Channel_Commission += Channel_Commission || 0;
      dataset[Quarter][Fiscal_Year].Discounts += Discounts || 0;
      dataset[Quarter][Fiscal_Year].Shipping_Cost += Shipping_Cost || 0;
      dataset[Quarter][Fiscal_Year].Channel_Commission_Cos += Channel_Commission_Cos || 0;
      dataset[Quarter][Fiscal_Year].Discounts_Cos += Discounts_Cos || 0;
      dataset[Quarter][Fiscal_Year].Shipping_Cost_Cos += Shipping_Cost_Cos || 0;
    };

    // Process current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, quarterDataset);
      });
    }

    // Process previous year data
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, quarterDataset);
      });
    }

    console.log("monthDataset", quarterDataset);
    return quarterDataset;
  };

  // const getTaxesDataByYear = ({ currentYearData, previousYearData }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];

  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item) => ({
  //       year: item.Year,
  //       // taxes: item.Taxes,
  //       // grossAmount: item.Gross_Amount,
  //       // netAmount: item.Net_Amount,
  //       ChannelCommission: item.Channel_Commission,
  //       ShippingCost: item.Shipping_Cost,
  //       discount: item.Discounts,
  //       ChannelCommissionCos: item["Channel_Commission/Cos"],
  //       ShippingCostCos: item["Shipping_Cost/Cos"],
  //       discountCos: item["Discounts/Cos"],
  //     }));
  //   } else {
  //     console.error("Expected currentYearData to be an array.");
  //   }

  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item) => ({
  //       year: item.Year,
  //       // taxes: item.Taxes,
  //       // grossAmount: item.Gross_Amount,
  //       // netAmount: item.Net_Amount,
  //       ChannelCommission: item.Channel_Commission,
  //       ShippingCost: item.Shipping_Cost,
  //       discount: item.Discounts,
  //       ChannelCommissionCos: item["Channel_Commission/Cos"],
  //       ShippingCostCos: item["Shipping_Cost/Cos"],
  //       discountCos: item["Discounts/Cos"],
  //     }));
  //   } else {
  //     console.error("Expected previousYearData to be an array.");
  //   }

  //   return { currentYearDataset, previousYearDataset };
  // };

  const getTaxesDataByYear = ({ currentYearData, previousYearData }) => {
    let yearDataset = {};
    console.log("monthDataset", yearDataset);

    // Helper function to add cost data for the month
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

      // Initialize the dataset for the month if not already created
      if (!dataset[Year]) {
        dataset[Year] = {};
      }

      // Initialize the Fiscal Year data if it doesn't exist for the month
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

      // Add the costs to the dataset for the current month and fiscal year
      dataset[Year][Fiscal_Year].Channel_Commission += Channel_Commission || 0;
      dataset[Year][Fiscal_Year].Discounts += Discounts || 0;
      dataset[Year][Fiscal_Year].Shipping_Cost += Shipping_Cost || 0;
      dataset[Year][Fiscal_Year].Channel_Commission_Cos += Channel_Commission_Cos || 0;
      dataset[Year][Fiscal_Year].Discounts_Cos += Discounts_Cos || 0;
      dataset[Year][Fiscal_Year].Shipping_Cost_Cos += Shipping_Cost_Cos || 0;
    };

    // Process current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, yearDataset);
      });
    }

    // Process previous year data
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, yearDataset);
      });
    }

    console.log("monthDataset", yearDataset);
    return yearDataset;
  };

  // const getTaxesDataByWeek = ({ currentYearData, previousYearData }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];

  //   if (Array.isArray(currentYearData)) {
  //     currentYearDataset = currentYearData.map((item) => ({
  //       week: item.Week,
  //       // taxes: item.Taxes,
  //       // gr
  //       // week: `${item.Fiscal_Year} ${item.Week}`,
  //       grossAmount: item.Gross_Amount,
  //       // netAmount: item.Net_Amount,
  //       ChannelCommission: item.Channel_Commission,
  //       ShippingCost: item.Shipping_Cost,
  //       discount: item.Discounts,
  //       ChannelCommissionCos: item["Channel_Commission/Cos"],
  //       ShippingCostCos: item["Shipping_Cost/Cos"],
  //       discountCos: item["Discounts/Cos"],
  //     }));
  //   } else {
  //     console.error("Expected currentYearData to be an array.");
  //   }

  //   if (Array.isArray(previousYearData)) {
  //     previousYearDataset = previousYearData.map((item) => ({
  //       week: item.Week,
  //       // taxes: item.Taxes,
  //       // gr
  //       // week: `${item.Fiscal_Year} ${item.Week}`,
  //       grossAmount: item.Gross_Amount,
  //       // netAmount: item.Net_Amount,
  //       ChannelCommission: item.Channel_Commission,
  //       ShippingCost: item.Shipping_Cost,
  //       discount: item.Discounts,
  //       ChannelCommissionCos: item["Channel_Commission/Cos"],
  //       ShippingCostCos: item["Shipping_Cost/Cos"],
  //       discountCos: item["Discounts/Cos"],
  //     }));
  //   } else {
  //     console.error("Expected previousYearData to be an array.");
  //   }

  //   return { currentYearDataset, previousYearDataset };
  // };

  const getTaxesDataByWeek = ({ currentYearData, previousYearData }) => {
    let weekDataset = {};
    console.log("monthDataset", weekDataset);

    // Helper function to add cost data for the month
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

      // Initialize the dataset for the month if not already created
      if (!dataset[Week]) {
        dataset[Week] = {};
      }

      // Initialize the Fiscal Year data if it doesn't exist for the month
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

      // Add the costs to the dataset for the current month and fiscal year
      dataset[Week][Fiscal_Year].Channel_Commission += Channel_Commission || 0;
      dataset[Week][Fiscal_Year].Discounts += Discounts || 0;
      dataset[Week][Fiscal_Year].Shipping_Cost += Shipping_Cost || 0;
      dataset[Week][Fiscal_Year].Channel_Commission_Cos += Channel_Commission_Cos || 0;
      dataset[Week][Fiscal_Year].Discounts_Cos += Discounts_Cos || 0;
      dataset[Week][Fiscal_Year].Shipping_Cost_Cos += Shipping_Cost_Cos || 0;
    };

    // Process current year data
    if (Array.isArray(currentYearData)) {
      currentYearData.forEach((item) => {
        addCostData(item, weekDataset);
      });
    }

    // Process previous year data
    if (Array.isArray(previousYearData)) {
      previousYearData.forEach((item) => {
        addCostData(item, weekDataset);
      });
    }

    console.log("weekDataset", weekDataset);
    return weekDataset;
  };

  // useEffect(() => {
  //   if (responseData) {
  //     // console.log("responseData:", responseData);
  //     // console.log("timeWindow:", timeWindow);

  //     let currentYearData = [];
  //     let previousYearData = [];
  //     let processedData = [];

  //     let labelType;
  //     if (timeWindow === "W") {
  //       labelType = "week";
  //     } else if (timeWindow === "Q") {
  //       labelType = "quarter";
  //     } else if (timeWindow === "Y") {
  //       labelType = "year";
  //     } else {
  //       labelType = "month";
  //     }

  //     // Extract data based on the time window using the corresponding function
  //     switch (timeWindow) {
  //       case "W":
  //         const weekData = getTaxesDataByWeek(responseData);
  //         currentYearData = weekData.currentYearDataset;
  //         previousYearData = weekData.previousYearDataset;
  //         break;
  //       case "Q":
  //         const quarterData = getTaxesDataByQuarter(responseData);
  //         currentYearData = quarterData.currentYearDataset;
  //         previousYearData = quarterData.previousYearDataset;
  //         break;
  //       case "Y":
  //         const yearData = getTaxesDataByYear(responseData);
  //         currentYearData = yearData.currentYearDataset;
  //         previousYearData = yearData.previousYearDataset;
  //         break;
  //       case "M":
  //       default:
  //         const monthData = getTaxesDataByMonth(responseData);
  //         currentYearData = monthData.currentYearDataset;
  //         previousYearData = monthData.previousYearDataset;
  //         break;
  //     }

  //     // console.log("currentYearDataset33333333333333:", currentYearData);
  //     // console.log("previousYearDataset33333333333:", previousYearData);

  //     // Ensure labels are extracted correctly
  //     const allLabels = [
  //       ...new Set([
  //         ...currentYearData.map((item) => item[labelType]),
  //         ...previousYearData.map((item) => item[labelType]),
  //       ]),
  //     ];

  //     // console.log("All Labels:", allLabels);

  //     const data = allLabels.map((label) => {
  //       const currentYearDataPoint = currentYearData.find((item) => item[labelType] === label);

  //       const previousYearDataPoint = previousYearData.find((item) => item[labelType] === label);

  //       return {
  //         Channel_Commission_CurrentYear: currentYearDataPoint
  //           ? currentYearDataPoint.ChannelCommission
  //           : 0,
  //         Shipping_Cost_CurrentYear: currentYearDataPoint ? currentYearDataPoint.ShippingCost : 0,
  //         Discounts_CurrentYear: currentYearDataPoint ? currentYearDataPoint.discount : 0,
  //         Channel_Commission_Cos_CurrentYear: currentYearDataPoint
  //           ? currentYearDataPoint.ChannelCommissionCos
  //           : 0,
  //         Shipping_Cost_Cos_CurrentYear: currentYearDataPoint
  //           ? currentYearDataPoint.ShippingCostCos
  //           : 0,
  //         Discounts_Cos_CurrentYear: currentYearDataPoint ? currentYearDataPoint.discountCos : 0,

  //         Channel_Commission_PreviousYear: previousYearDataPoint
  //           ? previousYearDataPoint.ChannelCommission
  //           : 0,
  //         Shipping_Cost_PreviousYear: previousYearDataPoint
  //           ? previousYearDataPoint.ShippingCost
  //           : 0,
  //         Discounts_PreviousYear: previousYearDataPoint ? previousYearDataPoint.discount : 0,
  //         Channel_Commission_Cos_PreviousYear: previousYearDataPoint
  //           ? previousYearDataPoint.ChannelCommissionCos
  //           : 0,
  //         Shipping_Cost_Cos_PreviousYear: previousYearDataPoint
  //           ? previousYearDataPoint.ShippingCostCos
  //           : 0,
  //         Discounts_Cos_PreviousYear: previousYearDataPoint ? previousYearDataPoint.discountCos : 0,
  //       };
  //     });

  //     // console.log("Processed data333333333333:", data);

  //     setStackedSalesInfo({
  //       labels: allLabels, // Use the combined labels
  //       datasets: [
  //         {
  //           label: "Channel Commission (Current Year)",
  //           data: data.map((d) => d.Channel_Commission_CurrentYear),
  //           backgroundColor: "rgba(223,121,112)",
  //           stack: "currentYear",
  //           hidden: false,
  //         },
  //         {
  //           label: "Shipping Cost (Current Year)",
  //           data: data.map((d) => d.Shipping_Cost_CurrentYear),
  //           backgroundColor: "rgba(247,179,129)",
  //           stack: "currentYear",
  //           hidden: false,
  //         },
  //         {
  //           label: "Discounts (Current Year)",
  //           data: data.map((d) => d.Discounts_CurrentYear),
  //           backgroundColor: "rgba(75,192,192,0.6)",
  //           stack: "currentYear",
  //           hidden: false,
  //         },
  //         {
  //           label: "Channel Commission (Previous Year)",
  //           data: data.map((d) => d.Channel_Commission_PreviousYear),
  //           backgroundColor: "rgba(223,121,112,0.3)",
  //           stack: "previousYear",
  //           hidden: false,
  //         },
  //         {
  //           label: "Shipping Cost (Previous Year)",
  //           data: data.map((d) => d.Shipping_Cost_PreviousYear),
  //           backgroundColor: "rgba(247,179,129,0.3)",
  //           stack: "previousYear",
  //           hidden: false,
  //         },
  //         {
  //           label: "Discounts (Previous Year)",
  //           data: data.map((d) => d.Discounts_PreviousYear),
  //           backgroundColor: "rgba(75,192,192,0.3)",
  //           stack: "previousYear",
  //           hidden: false,
  //         },
  //         // Adding the Cos` for data labels
  //         {
  //           label: "Channel Commission Cos (Current Year)",
  //           data: data.map((d) => d.Channel_Commission_Cos_CurrentYear),
  //           backgroundColor: "rgba(223,121,112)",
  //           stack: "currentYear",
  //           hidden: true,
  //         },
  //         {
  //           label: "Shipping Cost Cos (Current Year)",
  //           data: data.map((d) => d.Shipping_Cost_Cos_CurrentYear),
  //           backgroundColor: "rgba(247,179,129)",
  //           stack: "currentYear",
  //           hidden: true,
  //         },
  //         {
  //           label: "Discounts Cos (Current Year)",
  //           data: data.map((d) => d.Discounts_Cos_CurrentYear),
  //           backgroundColor: "rgba(75,192,192)",
  //           stack: "currentYear",
  //           hidden: true,
  //         },
  //         {
  //           label: "Channel Commission Cos (Previous Year)",
  //           data: data.map((d) => d.Channel_Commission_Cos_PreviousYear),
  //           backgroundColor: "rgba(223,121,112,0.3)",
  //           stack: "previousYear",
  //           hidden: true,
  //         },
  //         {
  //           label: "Shipping Cost Cos (Previous Year)",
  //           data: data.map((d) => d.Shipping_Cost_Cos_PreviousYear),
  //           backgroundColor: "rgba(247,179,129,0.3)",
  //           stack: "previousYear",
  //           hidden: true,
  //         },
  //         {
  //           label: "Discounts Cos (Previous Year)",
  //           data: data.map((d) => d.Discounts_Cos_PreviousYear),
  //           backgroundColor: "rgba(75,192,192,0.3)",
  //           stack: "previousYear",
  //           hidden: true,
  //         },
  //       ],
  //     });
  //   } else {
  //     console.error("Response data or timeWindow is missing.");
  //   }
  // }, [responseData, timeWindow]);

  // 4th waterfall

  useEffect(() => {
    if (responseData) {
      const currentYearData = responseData.currentYearData || [];
      const previousYearData = responseData.previousYearData || [];

      const timeWindowData = getTaxesDataByTimeWindow({
        currentYearData,
        previousYearData,
        timeWindow,
      });

      console.log("Time Window Data:", timeWindowData);

      const allLabels = Object.keys(timeWindowData);
      console.log("All Labels:", allLabels);

      const allYears = [
        ...new Set([
          ...currentYearData.map((item) => item.Fiscal_Year),
          ...previousYearData.map((item) => item.Fiscal_Year),
        ]),
      ];
      console.log("All Fiscal2222 Years:", allYears);

      const generateYearColors = (years) => {
        const baseColors = [
          ["rgba(223,121,112,1)", "rgba(134,200,185,1)", "rgba(201,203,207,1)"],
          ["rgba(153,102,255,1)", "rgba(247,179,129,1)", "rgba(255,205,86,1)"], // Supplies, Materials, Channel
          ["rgba(75,192,192,1)", "rgba(255,99,132,1)", "rgba(54,162,235,1)"],
        ];

        return years.reduce((acc, year, index) => {
          acc[year] = baseColors[index % baseColors.length];
          return acc;
        }, {});
      };

      const yearColors = generateYearColors(allYears);
      console.log("Year Colors:", yearColors);

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

            // Pass the precomputed percentage
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

            // Pass the precomputed percentage
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

            // Pass the precomputed percentage
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

      console.log("Chart Data:", { labels: allLabels, datasets });
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

    // Helper function to get the correct time window function
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

    // Get the function based on selected time window (Week, Month, Quarter, Year)
    const getTotalSalesData = getDataByTimeWindow(timeWindow);

    // Call the appropriate function to process data
    const timeWindowData = getTotalSalesData({
      currentYearData,
      previousYearData,
    });

    return timeWindowData;
  };

  // const getWaterfallDataByMonth = ({ currentYearData = [], previousYearData = [] }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];
  //   let previousPvCurrent = 0;
  //   let previousUvCurrent = 0;
  //   let previousPvPrevious = 0;
  //   let previousUvPrevious = 0;

  //   // Process current year data
  //   // console.log("Current Yearrrrrrrr Data:", currentYearData); // Log the data being processed
  //   if (Array.isArray(currentYearData)) {
  //     currentYearData.forEach((item, index) => {
  //       let uv, pv, actualuv, actualpv, sales;

  //       // console.log("Processing current year item:", item); // Log each item
  //       if (index === 0) {
  //         uv = item?.Margin ?? 0; // Default to 0 if undefined
  //         pv = 0;
  //       } else {
  //         pv = previousPvCurrent + previousUvCurrent;
  //         uv = (item?.Margin ?? 0) - pv; // Default to 0 if undefined
  //       }

  //       actualuv = uv;
  //       actualpv = pv;

  //       if (uv < 0) {
  //         uv = Math.abs(uv);
  //         pv -= uv;
  //       }

  //       previousPvCurrent = actualpv;
  //       previousUvCurrent = actualuv;
  //       sales = actualpv + actualuv;

  //       currentYearDataset.push({
  //         period: item?.Month || "Unknown",
  //         uv,
  //         pv,
  //         actualuv,
  //         sales,
  //       });
  //     });
  //   }

  //   // Process previous year data
  //   // console.log("Previous Year Data:", previousYearData); // Log the data being processed
  //   if (Array.isArray(previousYearData)) {
  //     previousYearData.forEach((item, index) => {
  //       let uv, pv, actualuv, actualpv, sales;

  //       // console.log("Processing previous year item:", item); // Log each item
  //       if (index === 0) {
  //         uv = item?.Margin ?? 0; // Default to 0 if undefined
  //         pv = 0;
  //       } else {
  //         pv = previousPvPrevious + previousUvPrevious;
  //         uv = (item?.Margin ?? 0) - pv; // Default to 0 if undefined
  //       }

  //       actualuv = uv;
  //       actualpv = pv;

  //       if (uv < 0) {
  //         uv = Math.abs(uv);
  //         pv -= uv;
  //       }

  //       previousPvPrevious = actualpv;
  //       previousUvPrevious = actualuv;
  //       sales = actualpv + actualuv;

  //       previousYearDataset.push({
  //         period: item?.Month || "Unknown",
  //         uv,
  //         pv,
  //         actualuv,
  //         sales,
  //       });
  //     });
  //   }

  //   // console.log("Current Year Dataset:", currentYearDataset); // Log final datasets
  //   // console.log("Previous Year Dataset:", previousYearDataset);

  //   console.log("Currentwaaaaaa Year Dataset:", currentYearDataset);
  //   return { currentYearDataset, previousYearDataset };
  // };

  // Example Data:

  const getWaterfallDataByMonth = ({ currentYearData, previousYearData }) => {
    let monthDataset = {}; // Initialize an empty dataset to hold the processed data

    // Helper function to process and calculate values for each month
    const addMarginData = (item, dataset) => {
      const { Fiscal_Year, Month, Margin } = item;

      console.log(
        `\nProcessing: Fiscal Year - ${Fiscal_Year}, Month - ${Month}, Margin - ${Margin}`
      );

      // Ensure the dataset for the fiscal year exists
      if (!dataset[Fiscal_Year]) {
        dataset[Fiscal_Year] = {}; // Initialize data for the fiscal year
        console.log(`Initializing dataset for Fiscal Year: ${Fiscal_Year}`);
      }

      // Ensure the dataset for the specific month exists
      if (!dataset[Fiscal_Year][Month]) {
        dataset[Fiscal_Year][Month] = {
          uv: 0,
          pv: 0,
          actualuv: 0,
          sales: 0,
        };
        console.log(`Initializing dataset for Month: ${Month}`);
      }

      // Get the previous month's sales data for the same fiscal year
      const monthKeys = Object.keys(dataset[Fiscal_Year]); // Get all months processed so far
      console.log(`Processed months so far for ${Fiscal_Year}: ${monthKeys}`);

      const currentMonthIndex = monthKeys.indexOf(Month); // Find the current month index
      const prevMonth = currentMonthIndex > 0 ? monthKeys[currentMonthIndex - 1] : null;

      const prevData = prevMonth ? dataset[Fiscal_Year][prevMonth] : { sales: 0 }; // Use previous month's data or default to 0

      console.log(`Previous Month: ${prevMonth || "None"} | Previous Data:`, prevData);

      // Calculate UV, PV, and Sales
      let uv, actualuv, pv, sales;

      if (!prevMonth) {
        // First month for the fiscal year
        console.log(`Calculating for the first month of Fiscal Year ${Fiscal_Year}`);
        uv = Margin || 0;
        pv = 0; // No previous value
        sales = uv; // Sales is just uv in the first month
      } else {
        // Subsequent months
        console.log(`Calculating for a subsequent month of Fiscal Year ${Fiscal_Year}`);
        uv = Margin - prevData.sales; // Current margin - previous month's cumulative sales
        pv = prevData.sales; // Carry forward previous month's sales
        sales = prevData.sales + uv; // Cumulative sales
      }

      actualuv = uv;

      // Log calculations for the current month
      console.log(`Calculated values for ${Month} (${Fiscal_Year}):`);
      console.log(`UV: ${uv}, PV: ${pv}, ActualUV: ${actualuv}, Sales: ${sales}`);

      // Update the dataset with calculated values
      dataset[Fiscal_Year][Month].uv = actualuv;
      dataset[Fiscal_Year][Month].pv = pv; // Previous value
      dataset[Fiscal_Year][Month].actualuv = actualuv;
      dataset[Fiscal_Year][Month].sales = sales;

      console.log(`Updated dataset for ${Month} (${Fiscal_Year}):`, dataset[Fiscal_Year][Month]);
    };

    // Process data for the current year
    if (Array.isArray(currentYearData)) {
      console.log("\nProcessing Current Year Data:");
      currentYearData.forEach((item) => {
        addMarginData(item, monthDataset);
      });
    }

    // Process data for the previous year (if applicable)
    if (Array.isArray(previousYearData)) {
      console.log("\nProcessing Previous Year Data:");
      previousYearData.forEach((item) => {
        addMarginData(item, monthDataset);
      });
    }

    // Log final dataset after processing all months
    console.log("\nFinal Processed Dataset:", monthDataset);
    return monthDataset;
  };

  // const getWaterfallDataByYear = ({ currentYearData, previousYearData }) => {
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
  //         period: item.Year || "Unknown",
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
  //         period: item.Year || "Unknown",
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

  const getWaterfallDataByYear = ({ currentYearData, previousYearData }) => {
    let yearDataset = {}; // Initialize an empty dataset to hold the processed data

    // Helper function to process and calculate values for each year
    const addMarginData = (item, dataset) => {
      const { Fiscal_Year, Year, Margin } = item;

      console.log(`\nProcessing: Fiscal Year - ${Fiscal_Year}, Year - ${Year}, Margin - ${Margin}`);

      // Ensure the dataset for the fiscal year exists
      if (!dataset[Fiscal_Year]) {
        dataset[Fiscal_Year] = {}; // Initialize data for the fiscal year
        console.log(`Initializing dataset for Fiscal Year: ${Fiscal_Year}`);
      }

      // Ensure the dataset for the specific year exists
      if (!dataset[Fiscal_Year][Year]) {
        dataset[Fiscal_Year][Year] = {
          uv: 0,
          pv: 0,
          actualuv: 0,
          sales: 0,
        };
        console.log(`Initializing dataset for Year: ${Year}`);
      }

      // Get the previous year's sales data for the same fiscal year
      const yearKeys = Object.keys(dataset[Fiscal_Year]); // Get all years processed so far
      console.log(`Processed years so far for ${Fiscal_Year}: ${yearKeys}`);

      const currentYearIndex = yearKeys.indexOf(Year); // Find the current year index
      const prevYear = currentYearIndex > 0 ? yearKeys[currentYearIndex - 1] : null;

      const prevData = prevYear ? dataset[Fiscal_Year][prevYear] : { sales: 0 }; // Use previous year's data or default to 0

      console.log(`Previous Year: ${prevYear || "None"} | Previous Data:`, prevData);

      // Calculate UV, PV, and Sales
      let uv, actualuv, pv, sales;

      if (!prevYear) {
        // First year for the fiscal year
        console.log(`Calculating for the first year of Fiscal Year ${Fiscal_Year}`);
        uv = Margin || 0;
        pv = 0; // No previous value
        sales = uv; // Sales is just uv in the first year
      } else {
        // Subsequent years
        console.log(`Calculating for a subsequent year of Fiscal Year ${Fiscal_Year}`);
        uv = Margin - prevData.sales; // Current margin - previous year's cumulative sales
        pv = prevData.sales; // Carry forward previous year's sales
        sales = prevData.sales + uv; // Cumulative sales
      }

      actualuv = uv;

      // Log calculations for the current year
      console.log(`Calculated values for ${Year} (${Fiscal_Year}):`);
      console.log(`UV: ${uv}, PV: ${pv}, ActualUV: ${actualuv}, Sales: ${sales}`);

      // Update the dataset with calculated values
      dataset[Fiscal_Year][Year].uv = actualuv;
      dataset[Fiscal_Year][Year].pv = pv; // Previous value
      dataset[Fiscal_Year][Year].actualuv = actualuv;
      dataset[Fiscal_Year][Year].sales = sales;

      console.log(`Updated dataset for ${Year} (${Fiscal_Year}):`, dataset[Fiscal_Year][Year]);
    };

    // Process data for the current year
    if (Array.isArray(currentYearData)) {
      console.log("\nProcessing Current Year Data:");
      currentYearData.forEach((item) => {
        addMarginData(item, yearDataset);
      });
    }

    // Process data for the previous year (if applicable)
    if (Array.isArray(previousYearData)) {
      console.log("\nProcessing Previous Year Data:");
      previousYearData.forEach((item) => {
        addMarginData(item, yearDataset);
      });
    }

    // Log final dataset after processing all years
    console.log("\nFinalyyyyyyyyyyyyyyyyyy Processed Dataset:", yearDataset);
    return yearDataset;
  };

  // const getWaterfallDataByQuarter = ({ currentYearData, previousYearData }) => {
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
  //         period: item.Quarter || "Unknown",
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
  //         period: item.Quarter || "Unknown",
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

  const getWaterfallDataByQuarter = ({ currentYearData, previousYearData }) => {
    let quarterDataset = {}; // Initialize an empty dataset to hold the processed data

    // Helper function to process and calculate values for each quarter
    const addMarginData = (item, dataset) => {
      const { Fiscal_Year, Quarter, Margin } = item;

      console.log(
        `\nProcessing: Fiscal Year - ${Fiscal_Year}, Quarter - ${Quarter}, Margin - ${Margin}`
      );

      // Ensure the dataset for the fiscal year exists
      if (!dataset[Fiscal_Year]) {
        dataset[Fiscal_Year] = {}; // Initialize data for the fiscal year
        console.log(`Initializing dataset for Fiscal Year: ${Fiscal_Year}`);
      }

      // Ensure the dataset for the specific quarter exists
      if (!dataset[Fiscal_Year][Quarter]) {
        dataset[Fiscal_Year][Quarter] = {
          uv: 0,
          pv: 0,
          actualuv: 0,
          sales: 0,
        };
        console.log(`Initializing dataset for Quarter: ${Quarter}`);
      }

      // Get the previous quarter's sales data for the same fiscal year
      const quarterKeys = Object.keys(dataset[Fiscal_Year]); // Get all quarters processed so far
      console.log(`Processed quarters so far for ${Fiscal_Year}: ${quarterKeys}`);

      const currentQuarterIndex = quarterKeys.indexOf(Quarter); // Find the current quarter index
      const prevQuarter = currentQuarterIndex > 0 ? quarterKeys[currentQuarterIndex - 1] : null;

      const prevData = prevQuarter ? dataset[Fiscal_Year][prevQuarter] : { sales: 0 }; // Use previous quarter's data or default to 0

      console.log(`Previous Quarter: ${prevQuarter || "None"} | Previous Data:`, prevData);

      // Calculate UV, PV, and Sales
      let uv, actualuv, pv, sales;

      if (!prevQuarter) {
        // First quarter for the fiscal year
        console.log(`Calculating for the first quarter of Fiscal Year ${Fiscal_Year}`);
        uv = Margin || 0;
        pv = 0; // No previous value
        sales = uv; // Sales is just uv in the first quarter
      } else {
        // Subsequent quarters
        console.log(`Calculating for a subsequent quarter of Fiscal Year ${Fiscal_Year}`);
        uv = Margin - prevData.sales; // Current margin - previous quarter's cumulative sales
        pv = prevData.sales; // Carry forward previous quarter's sales
        sales = prevData.sales + uv; // Cumulative sales
      }

      actualuv = uv;

      // Log calculations for the current quarter
      console.log(`Calculated values for ${Quarter} (${Fiscal_Year}):`);
      console.log(`UV: ${uv}, PV: ${pv}, ActualUV: ${actualuv}, Sales: ${sales}`);

      // Update the dataset with calculated values
      dataset[Fiscal_Year][Quarter].uv = actualuv;
      dataset[Fiscal_Year][Quarter].pv = pv; // Previous value
      dataset[Fiscal_Year][Quarter].actualuv = actualuv;
      dataset[Fiscal_Year][Quarter].sales = sales;

      console.log(
        `Updated dataset for ${Quarter} (${Fiscal_Year}):`,
        dataset[Fiscal_Year][Quarter]
      );
    };

    // Process data for the current year
    if (Array.isArray(currentYearData)) {
      console.log("\nProcessing Current Year Data:");
      currentYearData.forEach((item) => {
        addMarginData(item, quarterDataset);
      });
    }

    // Process data for the previous year (if applicable)
    if (Array.isArray(previousYearData)) {
      console.log("\nProcessing Previous Year Data:");
      previousYearData.forEach((item) => {
        addMarginData(item, quarterDataset);
      });
    }

    // Log final dataset after processing all quarters
    console.log("\nFinalqqqqqqqqqqqqqqqqq Processed Dataset:", quarterDataset);
    return quarterDataset;
  };

  // const getWaterfallDataByWeek = ({ currentYearData = [], previousYearData = [] }) => {
  //   let currentYearDataset = [];
  //   let previousYearDataset = [];
  //   let previousPvCurrent = 0;
  //   let previousUvCurrent = 0;
  //   let previousPvPrevious = 0;
  //   let previousUvPrevious = 0;

  //   // Process current year data
  //   // console.log("Current Yearrrrrrrr Data:", currentYearData); // Log the data being processed
  //   if (Array.isArray(currentYearData)) {
  //     currentYearData.forEach((item, index) => {
  //       let uv, pv, actualuv, actualpv, sales;

  //       // console.log("Processing current year item:", item); // Log each item
  //       if (index === 0) {
  //         uv = item?.Margin ?? 0; // Default to 0 if undefined
  //         pv = 0;
  //       } else {
  //         pv = previousPvCurrent + previousUvCurrent;
  //         uv = (item?.Margin ?? 0) - pv; // Default to 0 if undefined
  //       }

  //       actualuv = uv;
  //       actualpv = pv;

  //       if (uv < 0) {
  //         uv = Math.abs(uv);
  //         pv -= uv;
  //       }

  //       previousPvCurrent = actualpv;
  //       previousUvCurrent = actualuv;
  //       sales = actualpv + actualuv;

  //       currentYearDataset.push({
  //         period: item?.Week || "Unknown",
  //         uv,
  //         pv,
  //         actualuv,
  //         sales,
  //       });
  //     });
  //   }

  //   // Process previous year data
  //   // console.log("Previous Year Data:", previousYearData); // Log the data being processed
  //   if (Array.isArray(previousYearData)) {
  //     previousYearData.forEach((item, index) => {
  //       let uv, pv, actualuv, actualpv, sales;

  //       // console.log("Processing previous year item:", item); // Log each item
  //       if (index === 0) {
  //         uv = item?.Margin ?? 0; // Default to 0 if undefined
  //         pv = 0;
  //       } else {
  //         pv = previousPvPrevious + previousUvPrevious;
  //         uv = (item?.Margin ?? 0) - pv; // Default to 0 if undefined
  //       }

  //       actualuv = uv;
  //       actualpv = pv;

  //       if (uv < 0) {
  //         uv = Math.abs(uv);
  //         pv -= uv;
  //       }

  //       previousPvPrevious = actualpv;
  //       previousUvPrevious = actualuv;
  //       sales = actualpv + actualuv;

  //       previousYearDataset.push({
  //         period: item?.Week || "Unknown",
  //         uv,
  //         pv,
  //         actualuv,
  //         sales,
  //       });
  //     });
  //   }

  //   // console.log("Current Year Dataset:", currentYearDataset); // Log final datasets
  //   // console.log("Previous Year Dataset:", previousYearDataset);

  //   return { currentYearDataset, previousYearDataset };
  // };

  // useEffect(() => {
  //   if (responseData) {
  //     // console.log("responseData:", responseData);
  //     // console.log("timeWindow:", timeWindow);

  //     let currentYearData = [];
  //     let previousYearData = [];
  //     let processedData = [];

  //     switch (timeWindow) {
  //       case "W":
  //         const weekData = getWaterfallDataByWeek(responseData);
  //         currentYearData = weekData.currentYearDataset;
  //         previousYearData = weekData.previousYearDataset;
  //         break;
  //       case "Q":
  //         const quarterData = getWaterfallDataByQuarter(responseData);
  //         currentYearData = quarterData.currentYearDataset;
  //         previousYearData = quarterData.previousYearDataset;
  //         break;
  //       case "Y":
  //         const yearData = getWaterfallDataByYear(responseData);
  //         currentYearData = yearData.currentYearDataset;
  //         previousYearData = yearData.previousYearDataset;
  //         break;
  //       case "M":
  //       default:
  //         const monthData = getWaterfallDataByMonth(responseData);
  //         currentYearData = monthData.currentYearDataset;
  //         previousYearData = monthData.previousYearDataset;
  //         break;
  //     }

  //     // console.log("Current Year Data:", currentYearData);
  //     // console.log("Previous Year Data:", previousYearData);

  //     // Prepare labels (periods) from both datasets
  //     const currentYearLabels = [...new Set(currentYearData.map((item) => item.period))];
  //     const previousYearLabels = [...new Set(previousYearData.map((item) => item.period))];
  //     const labels = [...new Set([...currentYearLabels, ...previousYearLabels])];
  //     // console.log("Labels:", labels);

  //     // Prepare data for chart
  //     const pvData = labels.map((label) => {
  //       const currentYearPoint = currentYearData.find((item) => item.period === label);
  //       const previousYearPoint = previousYearData.find((item) => item.period === label);
  //       return {
  //         currentYear: currentYearPoint ? currentYearPoint.pv : 0,
  //         previousYear: previousYearPoint ? previousYearPoint.pv : 0,
  //       };
  //     });

  //     const uvData = labels.map((label) => {
  //       const currentYearPoint = currentYearData.find((item) => item.period === label);
  //       const previousYearPoint = previousYearData.find((item) => item.period === label);
  //       return {
  //         currentYear: currentYearPoint ? currentYearPoint.uv : 0,
  //         previousYear: previousYearPoint ? previousYearPoint.uv : 0,
  //       };
  //     });

  //     const actualSalesData = labels.map((label) => {
  //       const currentYearPoint = currentYearData.find((item) => item.period === label);
  //       const previousYearPoint = previousYearData.find((item) => item.period === label);
  //       return {
  //         currentYear: currentYearPoint ? currentYearPoint.sales : 0,
  //         previousYear: previousYearPoint ? previousYearPoint.sales : 0,
  //       };
  //     });

  //     const actualUV = labels.map((label) => {
  //       const currentYearPoint = currentYearData.find((item) => item.period === label);
  //       const previousYearPoint = previousYearData.find((item) => item.period === label);
  //       return {
  //         currentYear: currentYearPoint ? currentYearPoint.actualuv : 0,
  //         previousYear: previousYearPoint ? previousYearPoint.actualuv : 0,
  //       };
  //     });

  //     // Map colors based on actualUV values (positive = blue, negative = red)
  //     const backgroundColorCurrentYear = actualUV.map((uv) =>
  //       uv.currentYear >= 0 ? "rgb(102, 217, 255)" : "rgb(255, 77, 77)"
  //     );
  //     const backgroundColorPreviousYear = actualUV.map((uv) =>
  //       uv.previousYear >= 0 ? "rgb(102, 217, 255,0.18)" : "rgb(255, 77, 77, 0.18)"
  //     );

  //     // Create new data object
  //     const newData = {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: "Current Year PV",
  //           data: pvData.map((data) => data.currentYear),
  //           // backgroundColor: "#66d9ff",
  //           backgroundColor: "transparent",

  //           // borderWidth: 1,
  //           stack: "a",
  //         },
  //         {
  //           label: "Previous Year PV",
  //           data: pvData.map((data) => data.previousYear),
  //           backgroundColor: "transparent",
  //           // borderWidth: 1,
  //           stack: "b",
  //         },
  //         {
  //           label: "Current Year UV",
  //           data: uvData.map((data) => data.currentYear),
  //           backgroundColor: backgroundColorCurrentYear,
  //           // borderWidth: 1,
  //           stack: "a",
  //         },
  //         {
  //           label: "Previous Year UV",
  //           data: uvData.map((data) => data.previousYear),
  //           backgroundColor: backgroundColorPreviousYear,
  //           // borderWidth: 1,
  //           stack: "b",
  //         },
  //         // {
  //         //   label: "Current Year Sales",
  //         //   data: actualSalesData.map((data) => data.currentYear),
  //         //   backgroundColor: "rgba(102, 217, 255, 0.2)",
  //         //   borderColor: "#66d9ff",
  //         //   borderWidth: 1,
  //         //   // type: "line", // Change type to 'line' if needed
  //         // },
  //         // {
  //         //   label: "Previous Year Sales",
  //         //   data: actualSalesData.map((data) => data.previousYear),
  //         //   backgroundColor: "rgba(179, 179, 179, 0.2)",
  //         //   borderColor: "#b3b3b3",
  //         //   borderWidth: 1,
  //         //   // type: "line", // Change type to 'line' if needed
  //         // }
  //       ],
  //     };

  //     // Update the chart data only if it has changed
  //     setWaterfallBar((prevData) => {
  //       if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
  //         return newData;
  //       }
  //       return prevData;
  //     });
  //   } else {
  //     console.error("Response data or timeWindow is missing.");
  //   }
  // }, [responseData, timeWindow]);

  const getWaterfallDataByWeek = ({ currentYearData, previousYearData }) => {
    let weekDataset = {}; // Initialize an empty dataset to hold the processed data

    // Helper function to process and calculate values for each quarter
    const addMarginData = (item, dataset) => {
      const { Fiscal_Year, Week, Margin } = item;

      console.log(`\nProcessing: Fiscal Year - ${Fiscal_Year}, Week - ${Week}, Margin - ${Margin}`);

      // Ensure the dataset for the fiscal year exists
      if (!dataset[Fiscal_Year]) {
        dataset[Fiscal_Year] = {}; // Initialize data for the fiscal year
        console.log(`Initializing dataset for Fiscal Year: ${Fiscal_Year}`);
      }

      // Ensure the dataset for the specific quarter exists
      if (!dataset[Fiscal_Year][Week]) {
        dataset[Fiscal_Year][Week] = {
          uv: 0,
          pv: 0,
          actualuv: 0,
          sales: 0,
        };
        console.log(`Initializing dataset for Quarter: ${Week}`);
      }

      // Get the previous quarter's sales data for the same fiscal year
      const weekKeys = Object.keys(dataset[Fiscal_Year]); // Get all quarters processed so far
      console.log(`Processed quarters so far for ${Fiscal_Year}: ${weekKeys}`);

      const currentQuarterIndex = weekKeys.indexOf(Week); // Find the current quarter index
      const prevQuarter = currentQuarterIndex > 0 ? weekKeys[currentQuarterIndex - 1] : null;

      const prevData = prevQuarter ? dataset[Fiscal_Year][prevQuarter] : { sales: 0 }; // Use previous quarter's data or default to 0

      console.log(`Previous Quarter: ${prevQuarter || "None"} | Previous Data:`, prevData);

      // Calculate UV, PV, and Sales
      let uv, actualuv, pv, sales;

      if (!prevQuarter) {
        // First quarter for the fiscal year
        console.log(`Calculating for the first quarter of Fiscal Year ${Fiscal_Year}`);
        uv = Margin || 0;
        pv = 0; // No previous value
        sales = uv; // Sales is just uv in the first quarter
      } else {
        // Subsequent quarters
        console.log(`Calculating for a subsequent quarter of Fiscal Year ${Fiscal_Year}`);
        uv = Margin - prevData.sales; // Current margin - previous quarter's cumulative sales
        pv = prevData.sales; // Carry forward previous quarter's sales
        sales = prevData.sales + uv; // Cumulative sales
      }

      actualuv = uv;

      // Log calculations for the current quarter
      console.log(`Calculated values for ${Week} (${Fiscal_Year}):`);
      console.log(`UV: ${uv}, PV: ${pv}, ActualUV: ${actualuv}, Sales: ${sales}`);

      // Update the dataset with calculated values
      dataset[Fiscal_Year][Week].uv = actualuv;
      dataset[Fiscal_Year][Week].pv = pv; // Previous value
      dataset[Fiscal_Year][Week].actualuv = actualuv;
      dataset[Fiscal_Year][Week].sales = sales;

      console.log(`Updated dataset for ${Week} (${Fiscal_Year}):`, dataset[Fiscal_Year][Week]);
    };

    // Process data for the current year
    if (Array.isArray(currentYearData)) {
      console.log("\nProcessing Current Year Data:");
      currentYearData.forEach((item) => {
        addMarginData(item, weekDataset);
      });
    }

    // Process data for the previous year (if applicable)
    if (Array.isArray(previousYearData)) {
      console.log("\nProcessing Previous Year Data:");
      previousYearData.forEach((item) => {
        addMarginData(item, weekDataset);
      });
    }

    // Log final dataset after processing all quarters
    console.log("\nFinalwwwwwwwwwwwwwwwwwwwwwwwww Processed Dataset:", weekDataset);
    return weekDataset;
  };

  // const getWaterfallDataByWeek = ({ currentYearData, previousYearData }) => {
  //   let weekDataset = {}; // Initialize an empty dataset to hold the processed data

  //   // Helper function to process and calculate values for each week
  //   const addMarginData = (item, dataset) => {
  //     const { Fiscal_Year, Week, Margin } = item;

  //     console.log(`\nProcessing: Fiscal Year - ${Fiscal_Year}, Week - ${Week}, Margin - ${Margin}`);

  //     // Ensure the dataset for the fiscal year exists
  //     if (!dataset[Fiscal_Year]) {
  //       dataset[Fiscal_Year] = {}; // Initialize data for the fiscal year
  //       console.log(`Initializing dataset for Fiscal Year: ${Fiscal_Year}`);
  //     }

  //     // Ensure the dataset for the specific week exists
  //     if (!dataset[Fiscal_Year][Week]) {
  //       dataset[Fiscal_Year][Week] = {
  //         uv: 0,
  //         pv: 0,
  //         actualuv: 0,
  //         sales: 0,
  //       };
  //       console.log(`Initializing dataset for Week: ${Week}`);
  //     }

  //     // Get the previous week's sales data for the same fiscal year
  //     const weekKeys = Object.keys(dataset[Fiscal_Year]); // Get all weeks processed so far
  //     console.log(`Processed weeks so far for ${Fiscal_Year}: ${weekKeys}`);

  //     const currentWeekIndex = weekKeys.indexOf(Week); // Find the current week index
  //     const prevWeek = currentWeekIndex > 0 ? weekKeys[currentWeekIndex - 1] : null;

  //     const prevData = prevWeek ? dataset[Fiscal_Year][prevWeek] : { sales: 0 }; // Use previous week's data or default to 0

  //     console.log(`Previous Week: ${prevWeek || "None"} | Previous Data:`, prevData);

  //     // Calculate UV, PV, and Sales
  //     let uv, actualuv, pv, sales;

  //     if (!prevWeek) {
  //       // First week for the fiscal year
  //       console.log(`Calculating for the first week of Fiscal Year ${Fiscal_Year}`);
  //       uv = Margin || 0;
  //       pv = 0; // No previous value
  //       sales = uv; // Sales is just uv in the first week
  //     } else {
  //       // Subsequent weeks
  //       console.log(`Calculating for a subsequent week of Fiscal Year ${Fiscal_Year}`);
  //       uv = Margin - prevData.sales; // Current margin - previous week's cumulative sales
  //       pv = prevData.sales; // Carry forward previous week's sales
  //       sales = prevData.sales + uv; // Cumulative sales
  //     }

  //     actualuv = uv;

  //     // Log calculations for the current week
  //     console.log(`Calculated values for ${Week} (${Fiscal_Year}):`);
  //     console.log(`UV: ${uv}, PV: ${pv}, ActualUV: ${actualuv}, Sales: ${sales}`);

  //     // Update the dataset with calculated values
  //     dataset[Fiscal_Year][Week].uv = actualuv;
  //     dataset[Fiscal_Year][Week].pv = pv; // Previous value
  //     dataset[Fiscal_Year][Week].actualuv = actualuv;
  //     dataset[Fiscal_Year][Week].sales = sales;

  //     console.log(`Updated dataset for ${Week} (${Fiscal_Year}):`, dataset[Fiscal_Year][Week]);
  //   };

  //   // Process data for the current year
  //   if (Array.isArray(currentYearData)) {
  //     console.log("\nProcessing Current Year Data:");
  //     currentYearData.forEach((item) => {
  //       addMarginData(item, weekDataset);
  //     });
  //   }

  //   // Process data for the previous year (if applicable)
  //   if (Array.isArray(previousYearData)) {
  //     console.log("\nProcessing Previous Year Data:");
  //     previousYearData.forEach((item) => {
  //       addMarginData(item, weekDataset);
  //     });
  //   }

  //   // Log final dataset after processing all weeks
  //   console.log("\nFinalwwwwwwwwwwwwwwwwwwwwwww Processed Dataset:", weekDataset);
  //   return weekDataset;
  // };

  useEffect(() => {
    if (responseData) {
      // Fetch data for the selected time window
      const timeWindowData = getWaterfallDataByTimeWindow({
        currentYearData: responseData.currentYearData || [],
        previousYearData: responseData.previousYearData || [],
        timeWindow,
      });

      console.log("Processedssssssssssssssssssssssssss Time Window Data:", timeWindowData);

      // Extract labels (e.g., months, weeks, quarters, years)
      const labels = Object.keys(timeWindowData).flatMap((fiscalYear) =>
        Object.keys(timeWindowData[fiscalYear]).map((timeKey) => `${timeKey}`)
      );

      console.log("Generatedddddddddddddddddddd Chart Labels:", labels);





      // Generate datasets for waterfall chart (change based on previous period)
      const datasets = Object.keys(timeWindowData).flatMap((fiscalYear) => {
        const yearData = timeWindowData[fiscalYear];
        console.log("Yearrrrrrrrrrrrrrrrrr Data:", yearData);
        let cumulativeUV = 0; // To accumulate the waterfall effect (start at 0)
        let cumulativeSales = 0; // To accumulate the waterfall effect (start at 0)

        // Data for UV (cumulative changes based on previous period)
        // const dataForUV = labels.map((label, index) => {
        //   const [timeKey] = label.split(" ");
        //   const currentData = yearData[timeKey] || {};
        //   const previousData = index > 0 ? yearData[labels[index - 1].split(" ")[0]] : {}; // Previous time period data
        //   const currentUV = currentData.uv || 0;
        //   const previousUV = previousData?.uv || 0;

        //   // Calculate the change (delta) for UV
        //   const change = currentUV - previousUV;
        //   console.log("Change for UV:", change);

        //   // Update cumulative value (cumulative waterfall effect)
        //   cumulativeUV += change;

        //   // Determine color: Blue for increase, Red for decrease
        //   const color = change >= 0 ? "rgba(54, 162, 235, 0.6)" : "rgba(255, 99, 132, 0.6)";

        //   return {
        //     value: Math.abs(cumulativeUV), // We use absolute value for UV change
        //     backgroundColor: color,
        //     borderColor: color,
        //   };
        // });

        const dataForUV = labels.map((label, index) => {
          console.log("Label:", label);
          // const [timeKey] = label.split(" ");
          const timeKey = label; // Use the full label as the key

          console.log("Time Key:", timeKey);
          const currentData = yearData[timeKey] || {};
          console.log("Current Data:", currentData);
          const previousData = index > 0 ? yearData[labels[index - 1].split(" ")[0]] : {}; // Previous time period data
          const currentUV = currentData.uv || 0;
          const previousUV = previousData?.uv || 0;

          // Calculate the change (delta) for UV
          const change = currentUV - previousUV;

          // Update cumulative value (cumulative waterfall effect)
          cumulativeUV += change;

          // For the first bar, UV should be transparent or omitted
          const isFirstBar = index === 0;

          return {
            value: isFirstBar ? 0 : Math.abs(cumulativeUV), // Show 0 for the first bar
            backgroundColor: isFirstBar
              ? "transparent"
              : change >= 0
              ? "rgba(54, 162, 235, 0.6)"
              : "rgba(255, 77, 77)", // Transparent for the first bar
            borderColor: isFirstBar
              ? "transparent"
              : change >= 0
              ? "rgba(54, 162, 235, 0.6)"
              : "rgba(255, 77, 77)", // Transparent for the first bar
          };
        });

        console.log("Data for UV:", dataForUV);

        // Data for Sales (transparent to show UV bars above it)
        // const dataForSales = labels.map((label, index) => {
        //   const [timeKey] = label.split(" ");
        //   const currentData = yearData[timeKey] || {};
        //   const previousData = index > 0 ? yearData[labels[index - 1].split(" ")[0]] : {}; // Previous time period data
        //   const currentSales = currentData.sales || 0;
        //   const previousSales = previousData?.sales || 0;

        //   // Calculate the change (delta) for Sales
        //   const change = currentSales - previousSales;
        //   console.log("Change for Sales:", change);

        //   // Update cumulative value (cumulative waterfall effect)
        //   cumulativeSales += change;

        //   // Sales bars are transparent, so use rgba(0,0,0,0) for transparency
        //   const color = "transparent"; // Transparent color for sales bar

        //   return {
        //     value: Math.abs(cumulativeSales), // Use the cumulative values for Sales (transparent bars)
        //     backgroundColor: color,
        //     borderColor: color,
        //   };
        // });




        const dataForSales = labels.map((label, index) => {
          // const [timeKey] = label.split(" ");
          const timeKey = label;
          const currentData = yearData[timeKey] || {};
          const previousData = index > 0 ? yearData[labels[index - 1].split(" ")[0]] : {}; // Previous time period data
          const currentSales = currentData.sales || 0;
          const previousSales = previousData?.sales || 0;

          // Calculate the change (delta) for Sales
          const change = currentSales - previousSales;

          // Update cumulative value (cumulative waterfall effect)
          cumulativeSales += change;

          // For the first bar, use a solid blue color
          const isFirstBar = index === 0;
          const color = isFirstBar ? "rgba(102, 217, 255)" : "transparent"; // Blue for the first bar, transparent for others

          return {
            value: Math.abs(cumulativeSales), // Use the cumulative values for Sales
            backgroundColor: color, // Blue for the first bar
            borderColor: color, // Blue for the first bar
          };
        });

        console.log("Data for Sales:", dataForSales);

        // Returning two datasets: Sales and UV
        return [
          {
            label: `${fiscalYear} Sales`,
            data: dataForSales.map((point) => point.value), // Use the cumulative values for waterfall (transparent bars)
            backgroundColor: dataForSales.map((point) => point.backgroundColor),
            borderColor: dataForSales.map((point) => point.borderColor),
            borderWidth: 1,
            // stack: "a", // Stack Sales below UV
          },
          {
            label: `${fiscalYear} UV`,
            data: dataForUV.map((point) => point.value), // Use the cumulative values for UV (stacked above Sales)
            backgroundColor: dataForUV.map((point) => point.backgroundColor),
            borderColor: dataForUV.map((point) => point.borderColor),
            borderWidth: 1,
            // stack: "b", // Stack UV above Sales
          },
        ];
      });

      console.log("Generated Waterfall Chart Datasets:", datasets);

      // Update the chart state with the new data
      setWaterfallBar({
        labels,
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

  // myyyyyyyyy

  const urlForDaywise = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

  // const [WeeklyChartdata, setWeeklyChartData] = useState({
  //   labels: [], // Week labels will go here (e.g., ['Week 04', 'Week 05', ...])
  //   datasets: [], // Data for daily sales and total sales per week will be populated here
  //   plugins: [
  //     {
  //       datalabels: {
  //         anchor: "end",
  //         align: "top",
  //         formatter: (value, context) => {
  //           // Show the value only for the "Total Sales per Week" line
  //           return context.dataset.label === "Gross Amount per Week" ? value : "";
  //         },
  //         color: "#000", // Set the label color to black
  //         font: {
  //           weight: "bold", // Make the labels bold
  //         },
  //       },
  //     },
  //   ],
  // });

  // In your useEffect, you will update this state with new data:
  // useEffect(() => {
  //   const url = urlForDaywise; // Replace with your actual URL
  //   const defaultCardPayload = {
  //     view: "weekly-gmv-measure",
  //   };

  //   const fetchCardData = async () => {
  //     try {
  //       const response = await axios.post(url, defaultCardPayload);
  //       const WeeklySalesMarginInfo = response.data;
  //       console.log(WeeklySalesMarginInfo, "dayyyyyyyyyyyyyss");
  //       const backgroundColorsWeekly = [
  //                     "#19b091",
  //                     "#f2a571",
  //                     "#21c2c3",
  //                     "#197fc0",
  //                     "#e75361",
  //                     "#758b98",
  //                     "#ff835c",
  //                   ];

  //       if (WeeklySalesMarginInfo.length > 0) {
  //         const weeks = WeeklySalesMarginInfo.map((item) => Object.keys(item)[0]);
  //         const salPerday = {
  //           Monday: [],
  //           Tuesday: [],
  //           Wednesday: [],
  //           Thursday: [],
  //           Friday: [],
  //           Saturday: [],
  //           Sunday: [],
  //         };

  //         console.log(salPerday,'salPerdaysalPerday')

  //         WeeklySalesMarginInfo.forEach((weekData) => {
  //           const weekKey = Object.keys(weekData)[0];
  //           const weekInfo = weekData[weekKey];

  //           Object.keys(salPerday).forEach((day) => {
  //             salPerday[day].push(weekInfo[day] || 0);
  //           });
  //         });

  //         const datasets = [
  //           {
  //             label: "Gross Amount per Week",
  //             type: "line",
  //             backgroundColor: "#4E78A6",
  //             borderColor: "#4E78A6",
  //             fill: false,
  //             data: weeks.map((weekKey) =>
  //               WeeklySalesMarginInfo.find((weekData) => weekKey in weekData)[weekKey][
  //                 "Gross_Amount_Per_Week"
  //               ]
  //             ),
  //             categoryPercentage: 1.0,
  //             barPercentage: 0.2,
  //           },
  //           ...Object.keys(salPerday).map((dayOfWeek, index) => ({
  //             // type: "line",
  //             label: dayOfWeek,
  //             backgroundColor: backgroundColorsWeekly[index % backgroundColorsWeekly.length],
  //             borderColor: backgroundColorsWeekly[index % backgroundColorsWeekly.length], // Color for the line

  //             data: salPerday[dayOfWeek],
  //             barPercentage: 1.0,
  //             categoryPercentage: 0.5,
  //           })),
  //         ];

  //         // console.log(datasets, 'datasettttttttttts')

  //         setWeeklyChartData({
  //           labels: weeks.map((week) => `${week}`),
  //           datasets: datasets,
  //           plugins: WeeklyChartdata.plugins, // Retain the data labels plugin
  //         });
  //       } else {
  //         console.log("No weekly sales data found.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching card data:", error);
  //     }
  //   };

  //   fetchCardData();
  // }, []);

  const [WeeklyChartdata, setWeeklyChartData] = useState({
    labels: [], // Week labels go here
    datasets: [], // Data for sales per day and total sales per week
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              console.log(tooltipItem, "Tooltip Item");

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

              console.log(label, "Label");

              return label; // Return the final label to be shown in the tooltip
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    const defaultCardPayload = {
      view: "weekly-gmv-measure",
    };

    const fetchCardData = async () => {
      try {
        const response = await axios.post(url, defaultCardPayload);
        const WeeklySalesMarginInfo = response.data;

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

          // Update chart data with custom tooltip for both line and bar datasets
          setWeeklyChartData({
            labels: weeks.map((week) => `${week}`),
            datasets: datasets,
            // options: {
            //   plugins: {
            //     tooltip: {
            //       callbacks: {
            //         label: (tooltipItem) => {
            //           const datasetLabel = tooltipItem.dataset.label;
            //           const weekIndex = tooltipItem.dataIndex;

            //           // For the "Gross Amount per Week" line dataset
            //           if (datasetLabel === "Gross Amount per Week") {
            //             const value = tooltipItem.raw || 0;
            //             return `${datasetLabel}: ${value.toFixed(2)}`;
            //           }

            //           // For day-of-week datasets with event data
            //           if (salPerday[datasetLabel]) {
            //             const salesData = salPerday[datasetLabel][weekIndex];
            //             let label = `${datasetLabel}: ${salesData.value.toFixed(2)}`;
            //             if (salesData.event) {
            //               label += ` - ${salesData.event}`;
            //             }
            //             return label;
            //           }

            //           return datasetLabel; // Fallback in case of an unknown dataset
            //         },
            //       },
            //     },
            //   },
            // },
            options: {
              plugins: {
                tooltip: {
                  callbacks: {
                    // label: function (tooltipItem) {
                    //   console.log("Tooltip Item:", tooltipItem);
                    //   const datasetLabel = tooltipItem.dataset.label; // Access the dataset label
                    //   const value = tooltipItem.raw || 0; // Tooltip value

                    //   // Check if it's the "Gross Amount per Week" dataset
                    //   if (datasetLabel === "Gross Amount per Week") {
                    //     return `${datasetLabel}: ${value.toFixed(2)}`;
                    //   }

                    //   // Handle day-wise data if it matches other dataset labels
                    //   if (salPerday[datasetLabel]) {
                    //     const weekIndex = tooltipItem.dataIndex; // Get the week index for this day
                    //     const salesData = salPerday[datasetLabel][weekIndex];

                    //     // Check if the specific day and week data exist
                    //     if (salesData) {
                    //       let label = `${datasetLabel}: ${salesData.value.toFixed(2)}`;
                    //       if (salesData.event) {
                    //         label += `  **${salesData.event}`; // Append event if it exists
                    //       }
                    //       return label;
                    //     }
                    //   }

                    //   return datasetLabel; // Fallback if no match found
                    // },
                    label: (tooltipItem) => {
                      const datasetLabel = tooltipItem.dataset.label;

                      if (datasetLabel === "Gross Amount per Week") {
                        const value = tooltipItem.raw || 0;

                        return `${datasetLabel}: ${value.toFixed(2)}`;
                      }

                      // Handle day-wise data
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
