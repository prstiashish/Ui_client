import React, { useEffect, useState } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import BarChart from "src/components/charts/BarChart";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
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

import StackedBarChart from "src/components/charts/StackedBarChart";
import BarChartComp from "src/components/charts/BarChartComp";
import BarChartWeekly from "src/components/charts/BarChartWeekly";
import { GetAuthToken } from "src/components/charts/AuthDetails";
import { GetSchema } from "src/components/charts/AuthDetails";
import { GetTokenExpiredTime, GetRefreshToken, baseURLs } from "src/components/charts/AuthDetails";
import axios from "axios";

const GraphsDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = baseURLs();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brand, setBrand] = useState([]);
  const [selectedBranchLabel, setSelectedBranchLabel] = useState("");
  const [franchisetype, setFranchiseType] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [channel, setChannel] = useState([]);
  const [selectedOrderSource, setSelectedOrderSource] = useState("");
  const [ordersourcetype, setOrderSource] = useState([]);
  const [chartTitlemonthwise, setChartTitlemonthwise] = useState();
  const [chartTitleCostWise, setChartTitleCostWise] = useState();
  const [chartTitleSalesSplitup, setChartTitleSalesSplitup] = useState();
  const [chartTitleMarginAnalysis, setChartTitleMarginAnalysis] = useState();
  const [yearList, setYearList] = useState([]);
  const [MonthList, setMonthList] = useState([]);
  const [quarterList, setQuarterList] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedQuarter, setSelectedQuarter] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [totalSales, setTotalSales] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [MTDTotalSales, setMTDTotalSales] = useState(0);
  const [MTDtotalCost, setMTDTotalCost] = useState(0);
  const [MTDTotalProfit, setMTDTotalProfit] = useState(0);
  const initialFilterType = {
    brand: {},
    branch: {},
  };

  const [monthlyWiseSalesChart, setMonthWiseSalesChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Total Sales",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: [],
      },
    ],
  });
  const [stackedMonthlyWisInfo, setStackedMonthWisInfo] = useState({
    labels: [],
    datasets: [
      // {
      //   label: "Material Cost",
      //   backgroundColor: "#f7b381",
      //   data: [],
      // },
      // {
      //   label: "Discount",
      //   backgroundColor: "#51cda0",
      //   data: [],
      // },
      // {
      //   label: "Supplies Cost",
      //   backgroundColor: "#df7970",
      //   data: [],
      // },
    ],
  });
  const [stackedSalesInfo, setStackedSalesInfo] = useState({
    labels: [],
    datasets: [
      {
        label: "DirectCharge",
        backgroundColor: "#F5DD61",
        data: [],
      },
      {
        label: "OtherCharge",
        backgroundColor: "#FF9BD2",
        data: [],
      },
      {
        label: "Taxes",
        backgroundColor: "#81689D",
        data: [],
      },
      {
        label: "Rounding",
        backgroundColor: "#df7970",
        data: [],
      },
      {
        label: "Tip",
        backgroundColor: "#9195F6",
        data: [],
      },
    ],
  });
  const salesByDay = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

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

  const [waterfallPlotlyMargin, setWaterfallPlotlyMargin] = useState({
    labels: [],
    data: [],
    type: "waterfall",
    connector: { line: { color: "rgb(63, 63, 63)" } },
  });

  const [waterfallStackedBar, setWaterfallStackedBar] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Total Sales",
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        data: [],
      },
    ],
  });

  const handleScroll = (e) => {
    if (e.target.scrollTop > 0) {
      setShowScrollbar(true);
    } else {
      setShowScrollbar(false);
    }
  };

  const handleMoreFiltersOpen = () => {
    setOpenMoreFilters(true);
  };

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue);
    setSelectedMonth(null);
    setSelectedQuarter(null);
    setSelectedWeek(null);
  };
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const handleQuarterChange = (event) => {
    setSelectedQuarter(event.target.value);
  };
  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  const dimensionSetALL = () => {
    if (selectedBranch == "All") {
      selectedBranch = "";
    }
    if (selectedBrand == "All") {
      selectedBrand = "";
    }
    if (selectedBranchLabel == "All") {
      selectedBranchLabel = "";
    }
    if (selectedChannel == "All") {
      selectedChannel = "";
    }
    if (selectedOrderSource == "All") {
      selectedOrderSource = "";
    }
    if (selectedMonth == "All") {
      selectedMonth = "";
    }
    if (selectedQuarter == "All") {
      selectedQuarter = "";
    }
    if (selectedWeek == "All") {
      selectedWeek = "";
    }
  };
  const getConditions = () => {
    const conditions = {};

    if (selectedBranch) {
      conditions.branchkey = selectedBranch;
    }
    if (selectedBrand) {
      conditions.BrandKey = selectedBrand;
    }
    if (selectedBranchLabel) {
      conditions.FranchiseTypeKey = selectedBranchLabel;
    }
    if (selectedChannel) {
      conditions.ChannelKey = selectedChannel;
    }
    if (selectedOrderSource) {
      conditions.OrderSourceKey = selectedOrderSource;
    }
    if (selectedMonth) {
      conditions.month = selectedMonth;
    }
    if (selectedQuarter) {
      conditions.quarter = selectedQuarter;
    }
    if (selectedWeek) {
      conditions.week = selectedWeek;
    }
    if (selectedYear) {
      conditions.year = selectedYear;
    }

    return conditions;
  };
  // CardInfo Details Start
  const fetchDataAndUpdateCard = async () => {
    try {
      const conditions = {};

      dimensionSetALL();

      if (selectedBranch) {
        conditions.branchkey = selectedBranch;
      }
      if (selectedBrand) {
        conditions.BrandKey = selectedBrand;
      }
      if (selectedBranchLabel) {
        conditions.FranchiseTypeKey = selectedBranchLabel;
      }
      if (selectedChannel) {
        conditions.ChannelKey = selectedChannel;
      }
      if (selectedOrderSource) {
        conditions.OrderSourceKey = selectedOrderSource;
      }
      const whereClause = conditions;
      debugger;
      checkTokenExpired();
      var baseUrl = baseURL + "get-ytd-cardinfo";
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
        where_clause: whereClause,
      };
      axios
        .post(baseUrl, body, config)
        .then((response) => {
          if (response?.data?.TotalSalesYTD?.length) {
            const data = response.data.TotalSalesYTD[0];
            if (data.totalsales != null) {
              setTotalSales(data.totalsales);
            }
            if (data.totalcost != null) {
              setTotalCost(data.totalcost);
            }
            if (data.totalprofit != null) {
              setTotalProfit(data.totalprofit);
            }
          } else {
            setTotalSales(0);
            setTotalCost(0);
            setTotalProfit(0);
          }
        })
        .catch((error) => {
          console.error("GetTotalSalesYTD:", error);
        });
    } catch (error) {
      console.error("Error fetching data or updating card:", error);
    }
  };

  const fetchMTDCars = async () => {
    try {
      dimensionSetALL();
      const conditions = {};

      if (selectedBranch) {
        conditions.branchkey = selectedBranch;
      }
      if (selectedBrand) {
        conditions.BrandKey = selectedBrand;
      }
      if (selectedBranchLabel) {
        conditions.FranchiseTypeKey = selectedBranchLabel;
      }
      if (selectedChannel) {
        conditions.ChannelKey = selectedChannel;
      }
      if (selectedOrderSource) {
        conditions.OrderSourceKey = selectedOrderSource;
      }

      // const whereClause = Object.keys(conditions).length > 0 ? JSON.stringify(conditions) : "";
      const whereClause = conditions;
      checkTokenExpired();
      var baseUrl = baseURL + "get-mtd-cardinfo";
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
        where_clause: whereClause,
      };
      axios
        .post(baseUrl, body, config)
        .then((response) => {
          if (response?.data?.TotalSalesMTD?.length > 0) {
            const data = response.data.TotalSalesMTD[0];
            if (data.totalsales != null) {
              setMTDTotalSales(data.totalsales);
            }
            if (data.totalcost != null) {
              setMTDTotalCost(data.totalcost);
            }
            if (data.totalprofit != null) {
              setMTDTotalProfit(data.totalprofit);
            }
          } else {
            setMTDTotalSales(0);
            setMTDTotalCost(0);
            setMTDTotalProfit(0);
          }
        })
        .catch((error) => {
          console.error("GetTotalSalesMTD:", error);
          // Handle error
        });
    } catch (error) {
      console.error("Error fetching data or updating card:", error);
    }
  };
  // CardInfo Details End

  //Monthlywise Sales Chart Start
  const MonthlyWiseSalesChart = async () => {
    try {
      const conditions = getConditions();
      dimensionSetALL();

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
        function: "TotalSales",
        filter_criteria: {
          is_week_enabled: isWeekEnable,
          is_quarter_enabled: isQuarterEnable,
          where_clause: whereClause,
        },
      };

      axios
        .post(baseUrl, body, config)
        .then((response) => {
          if (response?.data?.TotalSalesInfo?.length) {
            const data = response.data.TotalSalesInfo;
            const labels = isWeekEnable
              ? data.map((item) => "Week " + item.week)
              : isQuarterEnable
              ? data.map((item) => item.quarter)
              : data.map((item) => item.salesmonth);

            let title;

            if (isWeekEnable) {
              title = "Week Wise Total Sales";
              setChartTitlemonthwise("Week Wise Total Sales");
            } else if (isQuarterEnable) {
              title = "Quarter Wise Total Sales";
              setChartTitlemonthwise("Quarter Wise Total Sales");
            } else {
              title = "Monthly Total Sales";
              setChartTitlemonthwise("Monthly Total Sales");
            }

            setMonthWiseSalesChart({
              labels: labels,
              datasets: [
                {
                  label: title,
                  backgroundColor: "#197fc0",
                  // backgroundColors,
                  borderColor: "#197fc0",
                  //backgroundColors,
                  borderWidth: 1,
                  data: data.map((item) => item.totalsales),
                },
              ],
            });
          } else {
            setMonthWiseSalesChart((prevChart) => ({
              ...prevChart,
              datasets: prevChart.datasets.map((dataset) => ({
                ...dataset,
                data: Array(dataset.data.length).fill(0),
              })),
            }));
            console.log("Total Sales: No data found or the data is empty");
          }
        })
        .catch((error) => {
          console.error("GetTotalSalesYTD:", error);
          setMonthWiseSalesChart({});
        });
    } catch (error) {
      console.error("Monthly Total Sales:", error);
      setMonthWiseSalesChart({});
    }
  };
  //Monthly Sales Chart End

  //Monthly Cost of Salse StackedBar Start
  const MonthlyCostStackedInfo = async () => {
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
        function: "TotalCostSalesSplitup",
        filter_criteria: {
          is_week_enabled: isWeekEnable,
          is_quarter_enabled: isQuarterEnable,
          where_clause: whereClause,
        },
      };

      axios
        .post(baseUrl, body, config)
        .then((response) => {
          debugger;
          if (response?.data?.TotalCostSalesSplitupInfo?.length > 0) {
            const { TotalCostSalesSplitupInfo } = response.data.TotalCostSalesSplitupInfo;
            const data = response.data.TotalCostSalesSplitupInfo;
            let legendVisible = 0;
            for (const item of data) {
              if (item.cogs_material > 0 || item.cogs_overheads > 0 || item.cogs_discount > 0) {
                legendVisible = 1;
                break;
              }
            }
            const labels = isWeekEnable
              ? data.map((item) => "Week " + item.week)
              : isQuarterEnable
              ? data.map((item) => item.quarter)
              : data.map((item) => item.salesmonth);

            if (isWeekEnable) {
              setChartTitleCostWise("Week Wise Cost Sales");
            } else if (isQuarterEnable) {
              setChartTitleCostWise("Quarter Wise Cost Sales");
            } else {
              setChartTitleCostWise("Monthly Cost Sales");
            }

            setStackedMonthWisInfo({
              labels: labels,
              legendVisible: legendVisible,
              datasets: [
                {
                  label: "Material Cost",
                  backgroundColor: "#f7b381",
                  data: response.data.TotalCostSalesSplitupInfo.map((item) => item.cogs_material),
                  ledgend: 1,
                },
                {
                  label: "Discount",
                  backgroundColor: "#51cda0",
                  data: response.data.TotalCostSalesSplitupInfo.map((item) => item.cogs_discount),
                  ledgend: 1,
                },
                {
                  label: "Supplies Cost",
                  backgroundColor: "#df7970",
                  data: response.data.TotalCostSalesSplitupInfo.map((item) => item.cogs_overheads),
                  ledgend: 1,
                },
              ],
            });
          } else {
            setStackedMonthWisInfo((prevChart) => ({
              ...prevChart,
              legendVisible: 0,
              datasets: prevChart.datasets.map((dataset) => ({
                ...dataset,
                data: Array(dataset.data.length).fill(0),
              })),
            }));

            console.log("Cost of Sales: No data found or the data is empty");
          }
        })
        .catch((error) => {
          setStackedMonthWisInfo({});
          console.error("Cost of Sales Splitup Error:", error);
        });
    } catch (error) {
      console.error("Error fetching data or updating card:", error);
    }
  };
  //Monthly Cost of Sales StackedBar End
  //Sales Wise Splitup StackedBar Chart Start

  const MonthlySalesStackedInfo = async () => {
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
        function: "TotalSalesSplitup",
        filter_criteria: {
          is_week_enabled: isWeekEnable,
          is_quarter_enabled: isQuarterEnable,
          where_clause: whereClause,
        },
      };

      axios
        .post(baseUrl, body, config)
        .then((response) => {
          if (response?.data?.TotalSalesSplitupInfo?.length > 0) {
            const data = response.data.TotalSalesSplitupInfo;
            let legendVisible = 0;
            for (const item of data) {
              if (
                item.sales_taxes > 0 ||
                item.sales_directchargeamount > 0 ||
                item.sales_otherchargeamount > 0 ||
                item.sales_rounding > 0 ||
                item.sales_tip > 0 ||
                item.sales_discount > 0
              ) {
                legendVisible = 1;
                break;
              }
            }
            const labels = isWeekEnable
              ? data.map((item) => "Week " + item.week)
              : isQuarterEnable
              ? data.map((item) => item.quarter)
              : data.map((item) => item.salesmonth);

            if (isWeekEnable) {
              setChartTitleSalesSplitup("Week Wise Sales Splitup");
            } else if (isQuarterEnable) {
              setChartTitleSalesSplitup("Quarter Wise Sales Splitup");
            } else {
              setChartTitleSalesSplitup("Monthly Sales Splitup");
            }

            setStackedSalesInfo({
              labels: labels,
              legendVisible: legendVisible,
              datasets: [
                {
                  label: "Taxes",
                  backgroundColor: "#ff835c",
                  data: response.data.TotalSalesSplitupInfo.map((item) => item.sales_taxes),
                },
                {
                  label: "DirectCharge",
                  backgroundColor: "#F5DD61",
                  data: response.data.TotalSalesSplitupInfo.map(
                    (item) => item.sales_directchargeamount
                  ),
                },
                {
                  label: "OtherCharge",
                  backgroundColor: "#4CB9E7",
                  data: response.data.TotalSalesSplitupInfo.map(
                    (item) => item.sales_otherchargeamount
                  ),
                },
                {
                  label: "Rounding",
                  backgroundColor: "#21c2c3",
                  data: response.data.TotalSalesSplitupInfo.map((item) => item.sales_rounding),
                },
                {
                  label: "Tip",
                  backgroundColor: "#f2a571",
                  data: response.data.TotalSalesSplitupInfo.map((item) => item.sales_tip),
                },
                {
                  label: "Discount",
                  backgroundColor: "#9195F6",
                  data: response.data.TotalSalesSplitupInfo.map((item) =>
                    Math.abs(item.sales_discount)
                  ),
                },
              ],
            });
          } else {
            setStackedSalesInfo((prevChart) => ({
              ...prevChart,
              legendVisible: 0,
              datasets: prevChart.datasets.map((dataset) => ({
                ...dataset,
                data: Array(dataset.data.length).fill(0),
              })),
            }));
            console.log("Cost of Sales: No data found or the data is empty");
          }
        })
        .catch((error) => {
          console.error("Cost of Sales Splitup Error:", error);
        });
    } catch (error) {
      console.error("Error fetching data or updating card:", error);
    }
  };

  //Sales Wise Splitup StackedBar Chart End

  //Sales Margin Trend WaterFall Chart Start
  const SalesMarginWaterFall = async () => {
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
        function: "SalesMargin",
        filter_criteria: {
          is_week_enabled: isWeekEnable,
          is_quarter_enabled: isQuarterEnable,
          where_clause: whereClause,
        },
      };

      axios
        .post(baseUrl, body, config)
        .then((response) => {
          if (response?.data?.SalesMarginInfo?.length > 0) {
            const data = response.data.SalesMarginInfo;
            if (isWeekEnable) {
              setChartTitleMarginAnalysis("Margin Trend Analysis");
            } else if (isQuarterEnable) {
              setChartTitleMarginAnalysis("Margin Trend Analysis");
            } else {
              setChartTitleMarginAnalysis("Margin Trend Analysis");
            }

            const labels = isWeekEnable
              ? data.map((item) => "Week " + item.week)
              : isQuarterEnable
              ? data.map((item) => item.quarter)
              : data.map((item) => item.salesmonth);
            let previousPv = 0;
            let previousUv = 0;
            const dataset = data.map((item, index) => {
              let uv, pv, actualuv, actualpv, sales;
              if (index === 0) {
                uv = item.margin;
                pv = 0;
              } else {
                pv = previousPv + previousUv;
                uv = item.margin - pv;
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
              console.log(sales);

              return { uv, pv, actualuv, sales };
            });

            const uvData = dataset.map((entry) => entry.uv);
            const pvData = dataset.map((entry) => entry.pv);
            const actualSalesData = dataset.map((entry) => entry.sales);
            const actualUV = dataset.map((entry) => entry.actualuv);
            setWaterfallStackedBar({
              labels: labels,
              datasets: [
                {
                  label: "",
                  backgroundColor: "transparent",
                  stack: "a",
                  data: pvData,
                  tooltips: "false",
                },

                {
                  label: "Margin Trend Analysis",
                  backgroundColor: dataset.map((item) =>
                    item.actualuv < 0 ? "#ff4d4d" : "#66d9ff"
                  ),

                  borderWidth: 1,
                  data: uvData,
                  stack: "a",
                  salesData: actualSalesData,
                  tooltips: "true",
                  actualuv: actualUV,
                  ledgend: 1,
                },
              ],
            });
          } else {
            setWaterfallStackedBar((prevChart) => ({
              ...prevChart,
              datasets: prevChart.datasets.map((dataset) => ({
                ...dataset,
                data: Array(dataset.data.length).fill(0),
                ledgend: 0,
              })),
            }));
            console.log("Sales Margin: No data found or the data is empty");
          }
        })
        .catch((error) => {
          console.error("Sales Margin Error:", error);
        });
    } catch (error) {
      console.error("Error fetching data or updating margin data:", error);
    }
  };

  const SalesMarginPlotlyWaterFall = async () => {
    try {
      const conditions = {};
      if (selectedBranch == "All") {
        selectedBranch = "";
      }
      if (selectedBrand == "All") {
        selectedBrand = "";
      }
      if (selectedBranchLabel == "All") {
        selectedBranchLabel = "";
      }
      if (selectedChannel == "All") {
        selectedChannel = "";
      }
      if (selectedOrderSource == "All") {
        selectedOrderSource = "";
      }
      if (selectedMonth == "All") {
        selectedMonth = "";
      }
      if (selectedQuarter == "All") {
        selectedQuarter = "";
      }
      if (selectedWeek == "All") {
        selectedWeek = "";
      }

      let isWeekEnable = false;
      let isQuarterEnable = false;
      if (selectedFilter === 4) {
        isWeekEnable = true;
      }
      if (selectedFilter === 3) {
        isQuarterEnable = true;
      }

      if (selectedBranch) {
        conditions.branchkey = selectedBranch;
      }
      if (selectedBrand) {
        conditions.BrandKey = selectedBrand;
      }
      if (selectedBranchLabel) {
        conditions.FranchiseTypeKey = selectedBranchLabel;
      }
      if (selectedChannel) {
        conditions.ChannelKey = selectedChannel;
      }
      if (selectedOrderSource) {
        conditions.OrderSourceKey = selectedOrderSource;
      }
      if (selectedMonth) {
        conditions.month = selectedMonth;
      }
      if (selectedQuarter) {
        conditions.quarter = selectedQuarter;
      }
      if (selectedWeek) {
        conditions.week = selectedWeek;
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
        function: "SalesMargin",
        filter_criteria: {
          is_week_enabled: isWeekEnable,
          is_quarter_enabled: isQuarterEnable,
          where_clause: whereClause,
        },
      };

      axios
        .post(baseUrl, body, config)
        .then((response) => {
          if (response?.data?.SalesMarginInfo?.length > 0) {
            const data = response.data.SalesMarginInfo;
            if (isWeekEnable) {
              setChartTitleMarginAnalysis("Margin Trend Analysis");
            } else if (isQuarterEnable) {
              setChartTitleMarginAnalysis("Margin Trend Analysis");
            } else {
              setChartTitleMarginAnalysis("Margin Trend Analysis");
            }

            const labels = isWeekEnable
              ? data.map((item) => "Week " + item.week)
              : isQuarterEnable
              ? data.map((item) => item.quarter)
              : data.map((item) => item.salesmonth);

            // Initialize variables
            let previousValue = data[0].margin; // Assuming the first margin is your starting point
            const backgroundColors = data.map((item, index) => {
              if (index === 0) return "#66d9ff"; // First bar, or choose a neutral color if preferred
              return item.margin < previousValue ? "#ff4d4d" : "#66d9ff";
            });

            // Prepare dataset
            const dataset = data.map((item, index) => {
              if (index === 0) {
                previousValue = item.margin; // No change for the first item
                return item.margin;
              } else {
                const change = item.margin - previousValue;
                previousValue = item.margin; // Update previousValue for the next iteration
                return change; // This is the value you want to plot
              }
            });

            setWaterfallPlotlyMargin([
              {
                type: "waterfall",
                x: labels,
                y: dataset,
                connector: { line: { color: "rgb(63, 63, 63)" } },
                marker: {
                  color: backgroundColors,
                },
              },
            ]);
          } else {
            console.log("Cost of Sales: No data found or the data is empty");
          }
        })
        .catch((error) => {
          console.error("Cost of Sales Splitup Error:", error);
        });
    } catch (error) {
      console.error("Error fetching data or updating margin data:", error);
    }
  };
  //Sales Margin Trend WaterFall Chart End
  //Week Wise Sales Chart Start
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
  //Week Wise Sales Chart End

  const handleBranchChange = (event) => {
    setSelectedBranch(event);
  };
  const handleBrandChange = (event) => {
    setSelectedBrand(event);
  };

  const handleBranchLabelChange = (event) => {
    setSelectedBranchLabel(event);
  };

  const handleChannelChange = (event) => {
    setSelectedChannel(event);
  };

  const handleOrderSourceChange = (event) => {
    setSelectedOrderSource(event);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event);
  };

  const checkTokenExpired = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const expTime = GetTokenExpiredTime();
    const remainingTime = expTime - currentTime;
    if (remainingTime <= 300) {
      var refreshTokenUrl =
        "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/refresh-token-auth";
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

  const router = useRouter();
  useEffect(() => {
    const authToken = GetAuthToken();

    if (!authToken || authToken.trim() === "") {
      router.push("/login");
    } else {
      debugger;
      setTotalSales(0);
      getBranchList();
      getBrandList();
      getFranchiseType();
      getChannel();
      orderSource();
      getYearList();
      getMonthList();
      getQuarterList();
      getWeekList();
      fetchDataAndUpdateCard();
      fetchMTDCars();
      MonthlyWiseSalesChart();
      MonthlyCostStackedInfo();
      MonthlySalesStackedInfo();
      SalesMarginWaterFall();
      WeekWiseSalesData();
    }
  }, [
    selectedBranch,
    selectedBrand,
    selectedBranchLabel,
    selectedChannel,
    selectedOrderSource,
    selectedYear,
    selectedFilter,
    selectedMonth,
    selectedQuarter,
    selectedWeek,
    // monthlyWiseSalesChart,
  ]);

  const fetchDimenmsionData = (dimension, setterFunction) => {
    checkTokenExpired();
    const baseUrl = baseURL + "get-dimension-list";
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
      dimension: dimension,
    };

    return axios
      .post(baseUrl, body, config)
      .then((response) => {
        setterFunction(response.data[dimension + "List"]);
      })
      .catch((error) => {
        console.error(`Error fetching ${dimension}:`, error);
        // Handle error
      });
  };

  const getBranchList = () => {
    return fetchDimenmsionData("Branch", setBranches);
  };

  const getBrandList = () => {
    return fetchDimenmsionData("Brand", setBrand);
  };

  const getFranchiseType = () => {
    return fetchDimenmsionData("FranchiseType", setFranchiseType);
  };
  const getChannel = () => {
    return fetchDimenmsionData("Channel", setChannel);
  };
  const orderSource = () => {
    return fetchDimenmsionData("OrderSource", setOrderSource);
  };

  const getYearList = () => {
    checkTokenExpired();
    var baseUrl = baseURL + "get-time-dimension-list";
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
      time_dimension: "Year",
    };
    axios
      .post(baseUrl, body, config)
      .then((response) => {
        setYearList(response.data.YearList);
      })
      .catch((error) => {
        console.error("GetBranchError:", error);
        // Handle error
      });
  };
  const getTimeDimensionList = (timeDimension, setterFunction) => {
    checkTokenExpired();
    const baseUrl = baseURL + "get-time-dimension-list";
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
      time_dimension: timeDimension,
    };
    axios
      .post(baseUrl, body, config)
      .then((response) => {
        setterFunction(response.data[timeDimension + "List"]);
      })
      .catch((error) => {
        console.error(`Get${timeDimension}ListError:`, error);
        // Handle error
      });
  };

  const getMonthList = () => {
    getTimeDimensionList("Month", setMonthList);
  };

  const getQuarterList = () => {
    getTimeDimensionList("Quarter", setQuarterList);
  };

  const getWeekList = () => {
    getTimeDimensionList("Week", setWeekList);
  };

  const chartTitleWeeklywise = "Weekly Total Sales";

  const handleChartDoubleClick = () => {
    setShowPopupChart(true);
  };

  return (
    <>
      {/* <Grid container spacing={1} style={{ marginTop: "0%" }}>
        <Grid item xs={3} sm>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Branch</InputLabel>
            <Select
              // style={{ outline: "1px solid #c7c8ca" }}
              label="Branch"
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              onScroll={handleScroll}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {branches
                .sort((a, b) => a.branchname.localeCompare(b.branchname))
                .map((branch) => (
                  <MenuItem key={branch.branchkey} value={branch.branchkey}>
                    {branch.branchname}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} sm>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select
              // style={{ outline: "1px solid #c7c8ca" }}
              label="Brand"
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              onScroll={handleScroll}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {brand
                .sort((a, b) => a.brandname.localeCompare(b.brandname))
                .map((brand) => (
                  <MenuItem key={brand.brandkey} value={brand.brandkey}>
                    {brand.brandname}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} sm>
          <FormControl fullWidth>
            <InputLabel>Franchise Type</InputLabel>
            <Select
              // style={{ outline: "1px solid #c7c8ca" }}
              label="Franchise Type"
              value={selectedBranchLabel}
              onChange={(e) => handleBranchLabelChange(e.target.value)}
              onScroll={handleScroll}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {franchisetype.map((franchisetype) => (
                <MenuItem
                  key={franchisetype.franchisetypekey}
                  value={franchisetype.franchisetypekey}
                >
                  {franchisetype.franchisetype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} sm>
          <FormControl fullWidth>
            <InputLabel>Channel</InputLabel>
            <Select
              // style={{ outline: "1px solid #c7c8ca" }}
              label="Channel"
              value={selectedChannel}
              onChange={(e) => handleChannelChange(e.target.value)}
              onScroll={handleScroll}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {channel
                .sort((a, b) => a.channelname.localeCompare(b.channelname))
                .map((channel) => (
                  <MenuItem key={channel.channelkey} value={channel.channelkey}>
                    {channel.channelname}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} sm>
          <FormControl fullWidth>
            <InputLabel>Order Source</InputLabel>
            <Select
              // style={{ outline: "1px solid #c7c8ca" }}
              label="Order Source"
              value={selectedOrderSource}
              onChange={(e) => handleOrderSourceChange(e.target.value)}
              onScroll={handleScroll}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {ordersourcetype
                .sort((a, b) => a.ordersourcetype.localeCompare(b.ordersourcetype))
                .map((ordersourcetype) => (
                  <MenuItem
                    key={ordersourcetype.ordersourcekey}
                    value={ordersourcetype.ordersourcekey}
                  >
                    {ordersourcetype.ordersourcetype}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} sm>
          <FormControl fullWidth>
            <InputLabel>Period</InputLabel>
            <Select
              // style={{ outline: "1px solid #c7c8ca" }}
              label="Period"
              value={selectedFilter}
              onChange={handleFilterChange}
              onScroll={handleScroll}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              <MenuItem value={1}>Year</MenuItem>
              <MenuItem value={2}>Month</MenuItem>
              <MenuItem value={3}>Quarter</MenuItem>
              <MenuItem value={4}>Week</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3} sm>
          <FormControl fullWidth>
            <InputLabel></InputLabel>
            {selectedFilter === 1 && (
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  // style={{ outline: "1px solid #c7c8ca" }}
                  label="Year"
                  value={selectedYear}
                  onChange={handleYearChange}
                  onScroll={handleScroll}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  {yearList.map((year) => (
                    <MenuItem key={year.year} value={year.year}>
                      {year.year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedFilter === 2 && (
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  // style={{ outline: "1px solid #c7c8ca" }}
                  label="Month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  onScroll={handleScroll}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {MonthList.map((month, index) => (
                    <MenuItem key={month.monthname} value={month.month}>
                      {month.monthname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedFilter === 3 && (
              <FormControl fullWidth>
                <InputLabel>Quarter</InputLabel>
                <Select
                  // style={{ outline: "1px solid #c7c8ca" }}
                  label="Quarter"
                  value={selectedQuarter}
                  onChange={handleQuarterChange}
                  onScroll={handleScroll}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {quarterList.map((qt, index) => (
                    <MenuItem key={qt.quarter} value={qt.quarter}>
                      {qt.quarter}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {selectedFilter === 4 && (
              <FormControl fullWidth>
                <InputLabel>Week</InputLabel>
                <Select
                  // style={{ outline: "1px solid #c7c8ca" }}
                  label="Week"
                  value={selectedWeek}
                  onChange={handleWeekChange}
                  onScroll={handleScroll}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {weekList.map((wk, index) => (
                    <MenuItem key={wk.week} value={wk.week}>
                      {"Week" + wk.week}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={1} style={{ display: "none" }}>
          <Button onClick={handleMoreFiltersOpen}>More Filters</Button>
        </Grid>
      </Grid> */}

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
                    position: "relative", top: "-10px", fontSize: 9 }}
              >
                Total Sales YTD
              </Typography>
              <Typography
                variant="h3"
                component="div"
                style={{ fontSize: 14, textAlign: "Center" }}
              >
                ₹{totalSales.toLocaleString()}
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
                ₹{totalCost.toLocaleString()}
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
                ₹{totalProfit.toLocaleString()}
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
                ₹{MTDTotalProfit.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: "1%" }}>
        {/* <Grid container spacing={1} style={{ width: "100%", overflow: "hidden" }}> */}
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
              chartData={monthlyWiseSalesChart}
              title={chartTitlemonthwise}
              onDoubleClick={handleChartDoubleClick}
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
            <StackedBarChart chartData={stackedMonthlyWisInfo} title={chartTitleCostWise} />
          </div>
        </Grid>
        {/* </Grid> */}
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
    </>
  );
};

GraphsDashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default GraphsDashboard;
