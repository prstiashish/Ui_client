import React, { useEffect, useState } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import { Tabs, Tab, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { procurmentlist } from "src/components/charts/procurmentlist";
import { MenuItem, Select, FormControl, InputLabel, Button, Chip, Grid } from "@mui/material";
import BarChart from "src/components/charts/BarChart";
import BarChartComp from "src/components/charts/BarChartComp";

const PrcCharts = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [nestedTab, setNestedTab] = useState(0);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [selectedXAxis, setSelectedXAxis] = useState("");
  const [selectedYAxis, setSelectedYAxis] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [chartDatas, setChartData] = useState({ labels: [], datasets: [] });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleNestedTabChange = (event, newValue) => {
    setNestedTab(newValue);
  };

  // Define specific columns for X and Y axes
  const xOptions = [
    "Store Name",
    "Category",
    "Inventory Item Name",
    "Supplier Code",
    "Supplier Name",
    "PO Type",
  ];
  const yOptions = [
    "Supplier Qty",
    "RATE INCL GST",
    "Supplier Unit Cost",
    "Discount Amount",
    "Total Cost",
    "Total Tax",
    "Total ITC",
    "Total Amount",
    "Inventory Qty",
    "Inventory Unit Cost",
    "PO Quantity",
    "PO Quantity Variance",
  ];
  const generateLightColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      const color = `hsla(${hue}, 70%, 80%, 0.7)`; // Light color with 70% saturation and 80% lightness
      colors.push(color);
    }
    return colors;
  };

  const generateDarkColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      const color = `hsla(${hue}, 70%, 30%, 1)`; // Dark color with 70% saturation and 30% lightness
      colors.push(color);
    }
    return colors;
  };
  const generateGradient = (colors) => {
    const ctx = document.createElement("canvas").getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / colors.length, color);
    });
    return gradient;
  };

  useEffect(() => {
    if (procurmentlist.ProList.length > 0) {
      setSelectedXAxis(xOptions[0]); // Set initial X axis to the first key
    }
  }, [procurmentlist.ProList]);

  useEffect(() => {
    if (selectedXAxis && selectedYAxis) {
      const filtered = procurmentlist.ProList.map((item) => ({
        x: item[selectedXAxis],
        y: item[selectedYAxis],
      }));
      setFilteredData(filtered);
    }
  }, [procurmentlist.ProList, selectedXAxis, selectedYAxis]);

  useEffect(() => {
    if (selectedXAxis && selectedYAxis) {
      const groupedData = {};
      procurmentlist.ProList.forEach((item) => {
        const key = `${item[selectedXAxis]}`;
        if (groupedData[key]) {
          groupedData[key] += item[selectedYAxis];
        } else {
          groupedData[key] = item[selectedYAxis];
        }
      });

      const labels = Object.keys(groupedData);
      const datasets = [
        {
          label: "Data",
          data: Object.values(groupedData),
          backgroundColor: generateLightColors(labels.length), // Using dynamically generated colors
          borderColor: generateDarkColors(labels.length), // Using dynamically generated colors
          borderWidth: 1,
        },
      ];

      setChartData({ labels, datasets });
    }
  }, [procurmentlist.ProList, selectedXAxis, selectedYAxis]);

  // Dynamically generate options for Y-axis dropdown
  const groupedData = {};
  procurmentlist.ProList.forEach((item) => {
    const itemName = item["Inventory Item Name"];
    if (!groupedData[itemName]) {
      groupedData[itemName] = {
        "Inventory Qty": item["Inventory Qty"],
        "PO Quantity": item["PO Quantity"],
      };
    } else {
      groupedData[itemName]["Inventory Qty"] += item["Inventory Qty"];
      groupedData[itemName]["PO Quantity"] += item["PO Quantity"];
    }
  });

  // Extract labels and datasets from grouped data
  const labels = Object.keys(groupedData);
  const datasets = [
    {
      label: "Inventory Qty",
      backgroundColor: labels.map(
        (itemName) =>
          groupedData[itemName]["Inventory Qty"] > groupedData[itemName]["PO Quantity"]
            ? "#d70684" // Light Red
            : "#0d96cc" // Light Blue
      ),
      borderColor: labels.map(
        (itemName) =>
          groupedData[itemName]["Inventory Qty"] > groupedData[itemName]["PO Quantity"]
            ? "#d70684" // Red
            : "#004262" // Dark Blue
      ),
      borderWidth: 1,
      data: labels.map((itemName) => groupedData[itemName]["Inventory Qty"]),
    },
    {
      label: "PO Quantity",
      backgroundColor: labels.map(
        (itemName) =>
          groupedData[itemName]["Inventory Qty"] > groupedData[itemName]["PO Quantity"]
            ? "#a70c6a" // Light Red
            : "#004262" // Dark Blue
      ),
      borderColor: labels.map(
        (itemName) =>
          groupedData[itemName]["Inventory Qty"] > groupedData[itemName]["PO Quantity"]
            ? "#a70c6a" // Red
            : "#004262" // Dark Blue
      ),
      borderWidth: 1,
      data: labels.map((itemName) => groupedData[itemName]["PO Quantity"]),
    },
  ];
  // Construct the chart data object
  const chartData = { labels, datasets };
  return (
    <>
      <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} centered>
        <Tab label="Procurement" />

        {/* Add other tabs as needed */}
      </Tabs>
      {selectedTab === 0 && (
        <>
          <Tabs
            value={nestedTab}
            onChange={(event, newValue) => setNestedTab(newValue)}
            centered
            style={{ marginTop: 20 }}
          >
            <Tab label="Financial Visualization" />
            <Tab label="Inventory Qty vs PO Qty" />
            {/* Add other nested tabs as needed */}
          </Tabs>
          <TabPanel value={nestedTab} index={0}>
            <Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FormControl style={{ marginRight: "10px", width: "120px" }}>
                  <Select
                    value={selectedXAxis}
                    onChange={(event) => setSelectedXAxis(event.target.value)}
                    fullWidth
                  >
                    {xOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl style={{ width: "120px" }}>
                  <InputLabel>Select</InputLabel>
                  <Select
                    value={selectedYAxis}
                    onChange={(event) => setSelectedYAxis(event.target.value)}
                    fullWidth
                  >
                    {yOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Pass the updated chartData to the BarChart component */}
              <BarChart chartData={chartDatas} />
            </Typography>
          </TabPanel>
          <TabPanel value={nestedTab} index={1}>
            <div style={{ overflowX: "auto", maxWidth: "100%" }}>
              <BarChartComp chartData={chartData} />
            </div>
          </TabPanel>
        </>
      )}
      {/* Add TabPanel for other main tabs if needed */}
    </>
  );
};
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
};
PrcCharts.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default PrcCharts;
