import React, { useEffect, useState } from "react";

import { DashboardLayout } from "src/components/dashboard-layout";
import { useRouter } from "next/router";
import { Tabs, Tab, Typography } from "@mui/material";
import { productlist } from "src/components/charts/productlist";
import { maxSoldProduct } from "src/components/charts/productlist";
import { storeAvgSale } from "src/components/charts/productlist";
import BarChart from "src/components/charts/BarChart";
import LineChart from "src/components/charts/LineChart";
import { storeAvgSalePerMonthYear } from "src/components/charts/productlist";
import { storeAvgSalePerStoreandYear } from "src/components/charts/productlist";
import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { SalesVsPromotion } from "src/components/charts/productlist";

const dashboardschart = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [nestedTab, setNestedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleNestedTabChange = (event, newValue) => {
    setNestedTab(newValue);
  };
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
  // Inside your component
  const barColors = generateLightColors(maxSoldProduct.ProList.length);
  const borderColors = generateDarkColors(maxSoldProduct.ProList.length);

  const chartData = {
    labels: maxSoldProduct.ProList.map((ele) => ele.ProductType),
    datasets: [
      {
        label: "Data",
        data: maxSoldProduct.ProList.map((ele) => ele.MaxQtySold),
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1,
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: (value) => value,
          color: "black", // Adjust color as needed
          font: {
            weight: "bold", // Adjust font weight as needed
          },
        },
      },
    ],
    options: {
      plugins: {
        datalabels: {
          display: true,
        },
      },
    },
  };
  const avgSaleschartData = () => {
    return {
      labels: storeAvgSale.ProList.map((ele) => ele.StoreName),
      datasets: [
        {
          label: "Average Quantity Sold",
          data: storeAvgSale.ProList.map((ele) => ele.AvgQtySold),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
      ],
    };
  };
  const storeAvgSalePerMonthYear = () => {
    // Process the data and organize it into datasets
    const datasets = processData(storeAvgSale.ProList);

    return {
      labels: getMonths(), // Get labels for months (e.g., January, February, etc.)
      datasets: datasets,
    };
  };
  const processData = (data) => {
    // Create a map to group data by year
    const dataByYear = new Map();

    // Iterate over the data and group it by year
    data.forEach((storeData) => {
      const year = storeData.Year;
      if (!dataByYear.has(year)) {
        dataByYear.set(year, []);
      }
      dataByYear.get(year).push(storeData);
    });

    // Initialize an empty array to hold datasets
    const datasets = [];

    // Iterate over data grouped by year and create datasets
    dataByYear.forEach((yearData, year) => {
      const dataset = {
        label: `Year ${year}`,
        data: yearData.map((entry) => ({
          // x: entry.storeName, // Assuming Month is available in storeData
          y: entry.AvgQtySold,
        })),
        fill: false,
        borderColor: getRandomColor(),
        borderWidth: 2,
      };
      datasets.push(dataset);
    });

    return datasets;
  };

  // Function to generate an array of labels for months
  const getMonths = () => {
    // Define an array of month names
    const monthNames = [
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

    return monthNames;
  };

  // Function to generate a random color
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16); // Generate a random hexadecimal color
  };

  //Tab 1 - Nested Tab 2 start
  const monthNames = [
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

  const [selectedYear, setSelectedYear] = useState();
  const [selectedStore, setSelectedStore] = useState();

  const years = [...new Set(storeAvgSalePerStoreandYear.ProList.map((item) => item.Year))];
  const stores = [...new Set(storeAvgSalePerStoreandYear.ProList.map((item) => item.StoreName))];

  const filteredData = storeAvgSalePerStoreandYear.ProList.filter(
    (item) => item.Year === selectedYear && item.StoreName === selectedStore
  );

  const avgSaleschartPerYearandStore = () => {
    const yearsData = {};

    const filteredData = storeAvgSalePerStoreandYear.ProList.filter(
      (item) => item.StoreName === selectedStore
    );

    filteredData.forEach((item) => {
      const year = item.Year.toString(); // Convert year to string
      if (!yearsData[year]) {
        yearsData[year] = {
          labels: [],
          data: [],
          color: getRandomColor(), // Generate a random color for each year
        };
      }
      yearsData[year].labels.push(item.Month);
      yearsData[year].data.push(item.AvgQtySold);
    });

    const datasets = Object.keys(yearsData).map((year) => ({
      label: `Average Quantity Sold (${year})`,
      data: yearsData[year].data,
      fill: false,
      borderColor: yearsData[year].color,
      borderWidth: 2,
    }));
    const scatterDataset = {
      label: "AvgQtySold",
      data: filteredData.map((item) => ({
        x: monthNames.indexOf(item.Month) + 1, // Month index (1 to 12)
        y: item.AvgQtySold,
      })),
      backgroundColor: "rgba(255, 99, 132, 1)", // Adjust color as needed
      pointRadius: 5, // Adjust size of points
      pointHoverRadius: 8, // Adjust size of points on hover
    };

    return {
      labels: yearsData[Object.keys(yearsData)[0]].labels, // Assuming first year data will always be present
      datasets: [...datasets],
    };
  };

  // Function to generate a random color

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleStoreChange = (e) => {
    setSelectedStore(e.target.value);
  };

  //Tab 1 - Nested Tab 2 End
  //------------------------------------------------------------------------------------
  //Tab 1 - Nested Tab 3 start

  // const SalesVsPromotion = {
  //   labels: SalesVsPromotion.ProList.map((ele) => ele.ProductType),
  //   datasets: [
  //     {
  //       label: "Data",
  //       data: SalesVsPromotion.ProList.map((ele) => ele.MaxQtySold),
  //       backgroundColor: barColors,
  //       borderColor: borderColors,
  //       borderWidth: 1,
  //       datalabels: {
  //         anchor: "end",
  //         align: "top",
  //         formatter: (value) => value,
  //         color: "black", // Adjust color as needed
  //         font: {
  //           weight: "bold", // Adjust font weight as needed
  //         },
  //       },
  //     },
  //   ],
  // };

  //Tab 1 - Nested Tab 3 end

  useEffect(() => {
    const years = [...new Set(storeAvgSalePerStoreandYear.ProList.map((item) => item.Year))];
    setSelectedYear(years[0]);

    // Get the first available store from the data
    const stores = [...new Set(storeAvgSalePerStoreandYear.ProList.map((item) => item.StoreName))];
    setSelectedStore(stores[0]);
  }, [storeAvgSalePerStoreandYear]);
  if (
    !chartData.labels ||
    !chartData.datasets ||
    chartData.labels.length === 0 ||
    chartData.datasets.length === 0
  ) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Sales" />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
        <Tab label="Tab 4" />
        <Tab label="Tab 5" />
      </Tabs>
      {selectedTab === 0 && (
        <>
          <Tabs
            value={nestedTab}
            onChange={handleNestedTabChange}
            centered
            style={{ marginTop: 20 }}
          >
            <Tab label="Nested Tab 1" />
            <Tab label="Nested Tab 2" />
            <Tab label="Nested Tab 3" />
            <Tab label="Nested Tab 4" />
            <Tab label="Nested Tab 5" />
          </Tabs>
          <TabPanel value={nestedTab} index={0}>
            <Typography>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  overflowX: "auto",
                }}
              >
                <h2>Sales Graph Per Product</h2>
                <BarChart chartData={chartData}></BarChart>
                <h2>Sales Graph Per Product</h2>
                <LineChart chartdata={avgSaleschartData()}></LineChart>
              </div>
            </Typography>
          </TabPanel>
          <TabPanel value={nestedTab} index={1}>
            <Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="year-select-label">Select Year:</InputLabel>
                    <Select
                      labelId="year-select-label"
                      value={selectedYear}
                      onChange={handleYearChange}
                      label="Select Year"
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="store-select-label">Select Store:</InputLabel>
                    <Select
                      labelId="store-select-label"
                      value={selectedStore}
                      onChange={handleStoreChange}
                      label="Select Store"
                    >
                      {stores.map((store) => (
                        <MenuItem key={store} value={store}>
                          {store}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <LineChart chartdata={avgSaleschartPerYearandStore} />
            </Typography>
          </TabPanel>
          <TabPanel value={nestedTab} index={2}>
            <Typography>Content for Nested Tab 3</Typography>
          </TabPanel>
          <TabPanel value={nestedTab} index={3}>
            <Typography>Content for Nested Tab 4</Typography>
          </TabPanel>
          <TabPanel value={nestedTab} index={4}>
            <Typography>Content for Nested Tab 5</Typography>
          </TabPanel>
        </>
      )}
      {selectedTab !== 0 && (
        <TabPanel value={selectedTab} index={selectedTab}>
          <Typography>Content for Tab {selectedTab + 1}</Typography>
        </TabPanel>
      )}
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

dashboardschart.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default dashboardschart;
