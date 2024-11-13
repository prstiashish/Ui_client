import React, { useEffect, useState } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import BarChart from "src/components/charts/BarChart";

import dynamic from "next/dynamic";
import axios from "axios";

// import CanvasWaterfallChart from "src/components/charts/canvaswaterfallchart";

import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  ThkShkBranch,
  ThkShkBrand,
  ThkShkChannel,
  ThkShkBranchLabel,
  ThkCardInfo,
  currentvspreviousweek,
  TotalSaleMonthlyWise,
  stackedMonthWiseData,
  MonthwiseMargin,
  monthwiseSales,
  ThkShkOrderSource,
  stackedMonthWiseSalesData,
  weekWiseTotalSales,
} from "src/components/charts/ThickShakeInfo";
import StackedBarChart from "src/components/charts/StackedBarChart";

const SalesVisualization = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBranchLabel, setSelectedBranchLabel] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedOrderSource, setSelectedOrderSource] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [dataPoints, setDataPoints] = useState([]);
  const [marginDataPoints, setMarginDataPoints] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [showPopupBarChart, setShowPopupBarChart] = useState(false);

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleBranchLabelChange = (event) => {
    setSelectedBranchLabel(event.target.value);
  };

  const handleChannelChange = (event) => {
    setSelectedChannel(event.target.value);
  };

  const handleOrderSourceChange = (event) => {
    setSelectedOrderSource(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {}, [
    selectedBranch,
    selectedBrand,
    selectedBranchLabel,
    selectedChannel,
    selectedOrderSource,
    selectedYear,
  ]);
  const chartTitleMonth = "Monthly Sales Splitup";
  const chartTitle = "Current vs Previous Week Sales";
  const backgroundColors = [
    "#82aa57",
    "#e07a5f",
    "#570211",
    "#006da4",
    "#de6560",
    "#2a9d8f",
    "#e9c46a",
    "#e07a5f",
    "#cbb874",
    "#a3a398",
  ]; // Example colors

  const monthLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthWiseSalesChart = {
    labels: monthLabels,
    // monthwiseSales.Data.map((item) => monthLabels),
    datasets: [
      {
        label: "Monthly Total Sales",
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
        data: monthwiseSales.Data.map((item) => item.TotalSales),
      },
    ],
  };

  const salesByDay = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };
  weekWiseTotalSales.Data.forEach((item) => {
    salesByDay[item.DayOfWeek].push(item.Salesperday);
  });

  const totalSalesByWeek = weekWiseTotalSales.Data.reduce((acc, curr) => {
    if (!acc[curr.WeekNumber]) {
      acc[curr.WeekNumber] = 0;
    }
    acc[curr.WeekNumber] += curr.Salesperday;
    return acc;
  }, {});

  const backgroundColorsWeekly = [
    "#19b091",
    "#f2a571",
    "#21c2c3",
    "#197fc0",
    "#e75361",
    "#758b98",
    "#ff835c",
  ];
  const data = {
    labels: Object.keys(totalSalesByWeek).map((weekNumber) => `Week ${weekNumber}`),
    datasets: [
      // New dataset for outer bars
      {
        label: "Total Sales per Week",
        // backgroundColor: "rgba(193, 193, 193,0.4)", // Transparent outer bars #00d4ff
        // backgroundColor: "rgba(192, 237, 246,0.4)",
        backgroundColor: "rgba(217, 88, 88,0.4)",

        data: Object.values(totalSalesByWeek),
        categoryPercentage: 6, // Ensure the outer bar spans the full width
        order: 1,
        // grouped: false,
        // barPercentage: 1.0,
        //  / (Object.keys(salesByDay).length + 1), // Adjust the bar width relative to the number of inner bars
        borderWidth: 1, // Add border to clearly define the outer bar
      },
      // Existing datasets for inner bars (assuming data for only 1 day per week)
      ...(salesByDay
        ? Object.keys(salesByDay).map((dayOfWeek, index) => ({
            label: dayOfWeek,
            backgroundColor: [backgroundColorsWeekly[index % backgroundColorsWeekly.length]],
            data: salesByDay[dayOfWeek],
            barPercentage: 1.0,
            categoryPercentage: 0.5,
            // grouped: false,
          }))
        : []),
    ],
    plugins: [
      {
        // Plugin to display datalabels on top of the outer bar
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: (value, context) => {
            if (context.dataset.label === "Total Sales per Week") {
              return value; // Display total sales value only on the outer bar
            } else {
              return ""; // Hide datalabels for inner bars
            }
          },
          color: "#000", // Color of the datalabels
          font: {
            weight: "bold", // Font weight of the datalabels
          },
        },
      },
    ],
  };

  // Function to generate random color
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const chartTitlemonthwise = "Monthly Total Sales";
  const chartTitleWeeklywise = "Weekly Total Sales";
  const CurrentvsPreviousWeekchart = {
    labels: currentvspreviousweek.Data.map((item) => item.Day),
    datasets: [
      {
        label: "Current Week",
        backgroundColor: "#0a7b83",
        borderColor: "#0a7b83",
        borderWidth: 1,
        data: currentvspreviousweek.Data.map((item) => item.LastWeekTotal),
      },
      {
        label: "Previous Week",
        backgroundColor: "#2aa876",
        borderColor: "#2aa876",
        borderWidth: 1,
        data: currentvspreviousweek.Data.map((item) => item.PreviousWeekTotal),
      },
    ],
  };

  const handleChartDoubleClick = () => {
    setShowPopupChart(true);
  };

  useEffect(() => {
    // Transforming data for waterfall chart
    const waterfallChartData = TotalSaleMonthlyWise.Data.map((item, index, array) => {
      const previousSales = index > 0 ? array[index - 1].MonthlyTotalSales : 0;
      const change = item.MonthlyTotalSales - previousSales;
      const isNegative = change < 0;

      return {
        labels: monthLabels,
        y: isNegative ? Math.abs(change) : change,
        x: index,
        color: isNegative ? "#35a9af" : undefined,
      };
    });

    setDataPoints(waterfallChartData);
  }, []);

  useEffect(() => {
    // Transforming data for waterfall chart
    const waterfallMarginChartData = MonthwiseMargin.Data.map((item, index, array) => {
      const previousMargin = index > 0 ? array[index - 1].Margin : 0;
      const change = item.Margin - previousMargin;
      const isNegative = change < 0;

      return {
        label: item.FinancialMonthName,
        y: isNegative ? Math.abs(change) : change,
        x: index,
        color: isNegative ? "#35a9af" : undefined,
      };
    });

    setMarginDataPoints(waterfallMarginChartData);
  }, []);

  const stackedMonthWisInfo = {
    // labels: stackedMonthWiseData.Data.map((item) => item.FinancialMonthName),
    labels: monthLabels,
    datasets: [
      {
        label: "Material Cost",
        backgroundColor: "#f7b381",
        data: stackedMonthWiseData.Data.map((item) => item.MaterialsCost),
      },
      {
        label: "Discount",
        backgroundColor: "#51cda0",
        data: stackedMonthWiseData.Data.map((item) => item.TotalDiscount),
      },
      {
        label: "Supplies Cost",
        backgroundColor: "#df7970",
        data: stackedMonthWiseData.Data.map((item) => item.SuppliesCost),
      },
    ],
  };

  const stackedMonthWiseSalesInfo = {
    // labels: stackedMonthWiseSalesData.Data.map((item) => item.FinancialMonthName),
    labels: monthLabels,
    datasets: [
      {
        label: "Discount",
        backgroundColor: "#4CCD99",
        data: stackedMonthWiseSalesData.Data.map((item) => item.Discount),
      },
      {
        label: "Direct Charge",
        backgroundColor: "#F5DD61",
        data: stackedMonthWiseSalesData.Data.map((item) => item.DirectCharge),
      },

      {
        label: "Other Charge",
        backgroundColor: "#FF9BD2",
        data: stackedMonthWiseSalesData.Data.map((item) => item.OtherCharge),
      },
      {
        label: "Taxes",
        backgroundColor: "#81689D",
        data: stackedMonthWiseSalesData.Data.map((item) => item.Taxes),
      },
      {
        label: "Rounding",
        backgroundColor: "#df7970",
        data: stackedMonthWiseSalesData.Data.map((item) => item.Rounding),
      },
      {
        label: "Tip",
        backgroundColor: "#9195F6",
        data: stackedMonthWiseSalesData.Data.map((item) => item.Tip),
      },
      {
        label: "Gross Amount",
        backgroundColor: "#FF6868",
        data: stackedMonthWiseSalesData.Data.map((item) => item.GrossAmount),
      },
    ],
  };

  return (
    <>
      <Grid container spacing={2} style={{ marginTop: "1%" }}>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Branch</InputLabel>
            <Select value={selectedBranch} onChange={handleBranchChange}>
              {ThkShkBranch.BranchList.sort((a, b) => a.BranchName.localeCompare(b.BranchName)).map(
                (branch, index) => (
                  <MenuItem key={index} value={branch.BranchName}>
                    {branch.BranchName}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select value={selectedBrand} onChange={handleBrandChange}>
              {ThkShkBrand.BrandList.sort((a, b) =>
                a.BusinessBrand.localeCompare(b.BusinessBrand)
              ).map((brand, index) => (
                <MenuItem key={index} value={brand.BusinessBrand}>
                  {brand.BusinessBrand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Franchise Type</InputLabel>
            <Select value={selectedBranchLabel} onChange={handleBranchLabelChange}>
              {ThkShkBranchLabel.BranchLabelList.sort((a, b) =>
                a.BranchLabels.localeCompare(b.BranchLabels)
              ).map((label, index) => (
                <MenuItem key={index} value={label.BranchLabels}>
                  {label.BranchLabels}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Channel</InputLabel>
            <Select value={selectedChannel} onChange={handleChannelChange}>
              {ThkShkChannel.ChannelList.sort((a, b) => a.Channel.localeCompare(b.Channel)).map(
                (channel, index) => (
                  <MenuItem key={index} value={channel.Channel}>
                    {channel.Channel}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Order Source</InputLabel>
            <Select value={selectedOrderSource} onChange={handleOrderSourceChange}>
              {ThkShkOrderSource.OrderSourceList.sort((a, b) =>
                a.OrderSource.localeCompare(b.OrderSource)
              ).map((OrderSource, index) => (
                <MenuItem key={index} value={OrderSource.OrderSource}>
                  {OrderSource.OrderSource}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel>Period</InputLabel>
            <Select value={selectedYear} onChange={handleYearChange}>
              <MenuItem value={0}>Year</MenuItem>
              <MenuItem value={1}>Half-year</MenuItem>
              <MenuItem value={2}>Quater</MenuItem>
              <MenuItem value={2}>Week</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {/* Card Views */}
      <Grid container spacing={2} style={{ marginTop: "5px" }}>
        <Grid item xs={2}>
          <Card
            sx={{
              flex: "0",
              backgroundColor: "#19b091", // Dark blue card background color
              color: "#fff", // White font color
              height: "76px",
              width: "163px",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px" }}
              >
                Total Sale
              </Typography>
              <Typography
                variant="h3"
                component="div"
                style={{ fontSize: 16, textAlign: "Center" }}
              >
                ₹ {ThkCardInfo.CardInfo[0].TotalSales.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={2}>
          <Card
            sx={{
              flex: "1",
              backgroundColor: "#f2a571", // Dark blue card background color
              color: "#fff", // White font color
              height: "76px",
              width: "163px",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px" }}
              >
                Total Cost
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 16, textAlign: "Center" }}
              >
                ₹ {ThkCardInfo.CardInfo[0].TotalCost.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card
            sx={{
              flex: "1",
              backgroundColor: "#21c2c3", // Dark blue card background color
              color: "#fff", // White font color
              height: "76px",
              width: "163px",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px" }}
              >
                Total Margin
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 16, textAlign: "Center" }}
              >
                ₹ {ThkCardInfo.CardInfo[0].TotalProfit.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card
            sx={{
              flex: "1",
              backgroundColor: "#197fc0", // Dark blue card background color
              color: "#fff", // White font color
              height: "76px",
              width: "163px",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px" }}
              >
                Sales MTD
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 16, textAlign: "Center" }}
              >
                ₹ {ThkCardInfo.CardInfo[0].SalesCurrentMonth.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card
            sx={{
              flex: "1",
              backgroundColor: "#e75361", // Dark blue card background color
              color: "#fff", // White font color
              height: "76px",
              width: "163px",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px" }}
              >
                Cost MTD
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 16, textAlign: "Center" }}
              >
                ₹ {ThkCardInfo.CardInfo[0].CostCurrentMonth.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card
            sx={{
              flex: "1",
              backgroundColor: "#758b98", // Dark blue card background color
              color: "#fff", // White font color
              height: "76px",
              width: "163px",
            }}
          >
            <CardContent style={{ padding: "15px" }}>
              <Typography
                variant="h7"
                component="div"
                style={{ left: "-5px", position: "relative", top: "-10px" }}
              >
                Margin MTD
              </Typography>
              <Typography
                variant="h4"
                component="div"
                style={{ fontSize: 16, textAlign: "Center" }}
              >
                ₹ {ThkCardInfo.CardInfo[0].ProfitCurrentMonth.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <div style={{ display: "flex", marginTop: "20px" }}>
        <div style={{ flex: "1", marginRight: "10px" }}>
          <div style={{ height: "300px" }}>
            {" "}
            {/* Adjust height as needed */}
            {/* <BarChart chartData={CurrentvsPreviousWeekchart} title={chartTitle} /> */}
            <BarChart
              chartData={monthWiseSalesChart}
              title={chartTitlemonthwise}
              onDoubleClick={handleChartDoubleClick}
            />
          </div>
        </div>
        <div style={{ flex: "1", marginLeft: "10px" }}>
          <div style={{ height: "300px" }}>
            {" "}
            {/* Adjust height as needed */}
            <StackedBarChart chartData={stackedMonthWisInfo} title="Monthly Cost of Sales" />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: 0 }}>
        <div style={{ flex: "1", marginRight: "10px" }}>
          <div style={{ height: "100px" }}>
            {" "}
            <StackedBarChart
              chartData={stackedMonthWiseSalesInfo}
              title={chartTitleMonth}
              onDoubleClick={handleChartDoubleClick}
            />
            {/* <CanvasWaterfallChart chartData={dataPoints} title="Cost Analysis" /> */}
          </div>
        </div>
        <div style={{ flex: "1", marginLeft: "10px" }}>
          <div style={{ height: "100px" }}>
            {" "}
            {/* Adjust height as needed */}
            {/* <CanvasWaterfallChart
              chartData={marginDataPoints}
              title="Sales Margin Trend Analysis"
            /> */}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: "200px", height: "50px" }}>
        <div style={{ flex: "1", marginRight: "10px" }}>
          <div style={{ height: "100px" }}>
            {/* <BarChart
              chartData={CurrentvsPreviousWeekch  art}
              title={chartTitle}
              onDoubleClick={handleChartDoubleClick}
            /> */}
            <BarChart
              chartData={data}
              title={chartTitleWeeklywise}
              onDoubleClick={handleChartDoubleClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

SalesVisualization.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SalesVisualization;
