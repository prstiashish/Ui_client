import React, { useEffect, useState } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import {
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { procurmentlist } from "src/components/charts/procurmentlist";
import BarChart from "src/components/charts/BarChart";
import DonutChart from "src/components/charts/PieChart";
import { yearSalesPercent } from "src/components/charts/productlist";
import LineChart from "src/components/charts/LineChart";
import { procuremnetDataList } from "src/components/charts/productlist";

const Chart = () => {
  // Define state variables to hold data
  const [totalSale, setTotalSale] = useState(0);
  const [totalAvgSale, setTotalAvgSale] = useState(0);
  const [mostSellingItem, setMostSellingItem] = useState("");
  const [totalProcurementCost, setTotalProcurementCost] = useState(0);
  const [year1, setYear1] = useState("");
  const [year2, setYear2] = useState("");
  const [procurementData, setProcurementData] = useState([]);
  const [filterType, setFilterType] = useState("year");
  const [totalProcurementData, setTotalProcurementData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [DonutchartData, setDonutChartData] = useState({ labels: [], datasets: [] });
  const [lineChartFilter, setLineChartFilter] = useState("year");

  //---------------------------------------------------
  const [xAxis, setXAxis] = useState("PODate");
  const [yAxis, setYAxis] = useState("TotalAmount");
  const [plottingColumn, setPlottingColumn] = useState("Category");

  //--------------------------------------------------

  useEffect(() => {
    // Check if procurmentlist is an object
    if (typeof procurmentlist !== "object") {
      console.error("procurmentlist is not an object.");
      return;
    }
    const total = procurmentlist.ProList.reduce((acc, item) => acc + item["Total Amount"], 0);
    setTotalProcurementCost(total);
    const average = total / procurmentlist.ProList.length;
    setTotalAvgSale(average);
  }, []);

  const totalAmount = procurmentlist.ProList.reduce((acc, item) => acc + item["Total Amount"], 0);

  // Prepare data for the bar chart

  useEffect(() => {
    processData("year");
  }, [filterType]);

  const processData = () => {
    const dataByDate = {};
    procurmentlist.ProList.forEach((item) => {
      const date = new Date(item["PO Date"]);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const week = getWeekNumber(date);
      const half = Math.ceil(month / 6);
      const quarter = Math.ceil(month / 3);

      let key = null;

      switch (filterType) {
        case "half":
          key = `${year}-H${half}`;
          break;
        case "quarter":
          key = `${year}-Q${quarter}`;
          break;
        case "month":
          key = `${year}-${month}`;
          break;
        case "week":
          key = `${year}-W${week}`;
          break;
        default:
          key = `${year}`;
      }

      if (!dataByDate[key]) {
        dataByDate[key] = 0;
      }
      dataByDate[key] += item["Total Amount"];
    });

    const labels = Object.keys(dataByDate);
    const datasets = [
      {
        label: "Overall Salse Data",
        data: labels.map((key) => dataByDate[key].toFixed(2)),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ];

    setChartData({ labels, datasets });
  };

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilterType(selectedFilter);
    processData(selectedFilter);
  };
  const handleLineChartFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setLineChartFilter(selectedFilter);
  };
  const getKey = (filterType, year, half, quarter, month, week) => {
    switch (filterType) {
      case "half":
        return `${year}-H${half}`;
      case "quarter":
        return `${year}-Q${quarter}`;
      case "month":
        return `${year}-${month}`;
      case "week":
        return `${year}-W${week}`;
      default:
        return `${year}`;
    }
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  //------------------------------------------------------------------------------
  useEffect(() => {
    if (typeof yearSalesPercent !== "object") {
      console.error("yearSalesPercent is not an object.");
      return;
    }

    // Process yearSalesPercent data for the Donut Chart
    const labels = yearSalesPercent.ProList.map((item) => item.Category);
    const data = yearSalesPercent.ProList.map((item) => item.salesPercet);

    const DonutchartData = {
      labels: labels,
      datasets: [
        {
          label: "Dataset 1",
          data: data,
          backgroundColor: [
            "#FF6384", // Red
            "#36A2EB", // Blue
            "#FFCE56", // Yellow
            "#36C5F0", // Sky Blue
            "#F1C40F", // Yellowish
            "#2ECC71", // Green
            "#1ABC9C", // Cyan
            "#9B59B6", // Violet
            "#E67E22", // Brownish Orange
            "#16A085", // Greenish Cyan
            "#D35400", // Orangey Brown
            "#3498DB", // Light Blue
            "#F39C12", // Orange
            "#27AE60", // Dark Green
            "#8E44AD", // Purple
            "#FAD7A0", // Light Yellow
            "#82E0AA", // Light Green
            "#82E0AA", // Light Green
            "#BB8FCE", // Light Purple
            "#F8C471", // Light Orange
            "#AED6F1", // Light Sky Blue
            "#F9E79F", // Light Yellowish
            "#A3E4D7", // Light Cyan
            "#D7BDE2", // Light Lavender
          ],
        },
      ],
    };

    setDonutChartData(DonutchartData);
  }, []);

  // Assuming procuremnetDataList.ProList is an array of objects with a 'Category' and 'TotalAmount' property

  const dataByCategory = procuremnetDataList.ProList.reduce((acc, item) => {
    if (!acc[item.Category]) {
      acc[item.Category] = 0;
    }
    acc[item.Category] += item.TotalAmount;
    return acc;
  }, {});

  const labels = Object.keys(dataByCategory);
  const data = Object.values(dataByCategory);

  const LinechartData = {
    labels: labels,
    datasets: [
      {
        label: "Total Sales per Category",
        data: data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  //------------------------------------------------------------------------------

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: -35,
          marginBottom: 20,
          padding: "10px",
          backgroundColor: "#faf9fd", // Dark Blue background color
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow
          gap: "20px", // Gap between cards
          height: "25%",
        }}
      >
        {/* Card for Total Sale */}
        <Card
          sx={{
            flex: "1",
            backgroundColor: "#2da0acfc", // Dark blue card background color
            color: "#fff", // White font color
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Total Sale
            </Typography>
            <Typography variant="h4" component="div">
              Rs.{totalProcurementCost.toFixed(2)} {/* Assuming totalSale is in dollars */}
            </Typography>
          </CardContent>
        </Card>

        {/* Card for Total Average Sale */}
        <Card
          sx={{
            flex: "1",
            backgroundColor: "#af648b", // Deep purple card background color
            color: "white", // Bright green font color
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Total Avg Sale
            </Typography>
            <Typography variant="h4" component="div">
              Rs.{totalAvgSale.toFixed(2)} {/* Assuming totalAvgSale is in dollars */}
            </Typography>
          </CardContent>
        </Card>

        {/* Card for Most Selling Item */}
        <Card
          sx={{
            flex: "1",
            backgroundColor: "#f6a96c", // Navy blue card background color
            color: "white", // Coral font color
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Most Selling: Ice Cream
            </Typography>
            <Typography variant="h4" component="div">
              Rs. 297059
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Separate div for additional content */}
      <div style={{ marginBottom: 5 }}>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel id="filter-label">Filter By</InputLabel>
          <Select
            labelId="filter-label"
            id="filter"
            value={filterType}
            onChange={handleFilterChange}
            label="Filter By"
          >
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="half">Half</MenuItem>
            <MenuItem value="quarter">Quarter</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="week">Week</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Separate div for additional content */}
      <div style={{ display: "flex", marginTop: 0 }}>
        <div style={{ flex: "1", marginRight: "10px" }}>
          <div style={{ height: "300px" }}>
            {" "}
            {/* Adjust height as needed */}
            <BarChart chartData={chartData} />
          </div>
        </div>
        <div style={{ flex: "1", marginLeft: "10px" }}>
          <div style={{ height: "300px" }}>
            {" "}
            {/* Adjust height as needed */}
            <DonutChart chartData={DonutchartData} />
          </div>
        </div>
      </div>
      <div style={{ flex: "1", marginTop: "3%" }}>
        <LineChart chartdata={LinechartData} />
      </div>
    </>
  );
};

Chart.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Chart;
