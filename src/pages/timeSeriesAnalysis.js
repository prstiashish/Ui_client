import React, { useState } from "react";

import { DashboardLayout } from "src/components/dashboard-layout";

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Tooltip,
  TextField,
  Popper,
  Autocomplete,
} from "@mui/material";

import { TimeSeriesDataMonthly, TimeSeriesDataWeekly } from "src/components/charts/TimeSeriesDataDummy";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  // Tooltip,
  Legend,
  LineController,
  // LineElement
} from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrimeSeriesDropdown = [
  {
    selected_categories: [
      {
        value: "Categories",
        values: [
          "99 Thickshakes",
          "Add Ons",
          "Beverages",
          "Big Bowls",
          "Biryanis",
          "Bowls",
          "Burgers",
          "Cold Coffee",
          "Combos",
          "DF THICKSHAKE",
          "Desserts",
          "EV Thick Shake",
          "Extras",
          "Family Binge Combos",
          "Fried Rice Combo Box",
          "Fries",
          "Garlic Bread",
          "Guilt Free Chinese",
          "Hot Coffee",
          "Ice Cream Cone",
          "Ice Cream Cups",
          "Ice Cream Jars",
          "Ice Cream Sundae",
          "Ice Cream Tubs (100 ml)",
          "Ice Teas",
          "Jumbo Burgers",
          "Large Bowls",
          "Late Night Offerings",
          "MAGGI",
          "Main Course",
          "Make a Shawarma",
          "Meal for 1 Value Combos",
          "Milk Shakes",
          "Milk shakes",
          "Noodles Combo Box",
          "Others",
          "Pizza",
          "Pocket Waffles",
          "Real Fruit Thickshakes [New Launch]",
          "Regular Bowls",
          "Shape Your Shake",
          "Sides",
          "Slushes",
          "Snacks",
          "Snacks n' Bites",
          "Soup Box",
          "Soups",
          "Specials",
          "Starters",
          "Sundaes",
          "THICKSHAKE",
          "TTSF FMCG",
          "TTSF Wrap",
          "Thick Friends Value Combos",
          "Thick Shakes",
          "Thick shakes",
          "Waffles",
        ],
      },
    ],
    selected_franchises: [
      {
        value: "Franchise_Type",
        values: ["TTSF", "COCO", "FOCO", "FOFO"],
      },
    ],
    selected_channels: [
      {
        value: "Channel",
        values: ["swiggy", "zomato", "magicpin", "POS", "DotPe", "dotpe"],
      },
    ],
    time_window: [
      {
        label: "Weekly",
        value: "W",
      },
      {
        label: "Monthly",
        value: "M",
      },
    ],
  },
];

const TimeSeriesAnalysis = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFranchiseType, setSelectedFranchiseType] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(null);
  // Get options for Autocomplete
  const categories = TrimeSeriesDropdown[0]?.selected_categories[0]?.values || [];
  const franchises = TrimeSeriesDropdown[0]?.selected_franchises[0]?.values || [];
  const channels = TrimeSeriesDropdown[0]?.selected_channels[0]?.values || [];
  const timeWindows = TrimeSeriesDropdown[0]?.time_window || [];

  const payload = {
    selected_categories: selectedCategory,
    selected_franchises: selectedFranchiseType,
    selected_channels: selectedChannel,
    time_window: selectedTimeWindow,
  };
  console.log("payloaddddd", payload);

  const handleSubmit = () => {
    // Handle the submit logic
    console.log({
      selectedCategory,
      selectedFranchiseType,
      selectedChannel,
      selectedTimeWindow,
    });
    setIsOpen(false); // Close the dialog on submit
  };

  const handleOpen = () => setIsOpen(true);

  // Filter categories based on search input

  const chartData = {
    labels: TimeSeriesDataMonthly.map((entry) => entry.Date), // X-axis labels (dates)
    datasets: [
      {
        label: "Forecasted Sales",
        data: TimeSeriesDataWeekly.map((entry) => entry["Forecasted Sales"]),
        borderColor: "rgba(75, 192, 192, 1)", // Teal line color for Forecasted Sales
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Light teal background fill
        fill: true,
        pointStyle: "rectRot", // Diamond shape for data points
      },
      {
        label: "Lower Limit",
        data: TimeSeriesDataWeekly.map((entry) => entry["Lower Limit"]),
        borderColor: "rgba(54, 162, 235, 1)", // Blue line color for Lower Limit
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Light blue background fill
        fill: "+1", // Fill between Lower and Upper limits
        borderDash: [5, 5], // Dashed line style
        pointStyle: "triangle", // Triangle shape for data points
      },
      {
        label: "Upper Limit",
        data: TimeSeriesDataWeekly.map((entry) => entry["Upper Limit"]),
        borderColor: "rgba(255, 206, 86, 1)", // Yellow line color for Upper Limit
        backgroundColor: "rgba(255, 206, 86, 0.2)", // Light yellow background fill
        fill: "-1", // Fill between Lower and Upper limits
        borderDash: [10, 5], // Longer dashed line style
        pointStyle: "star", // Star shape for data points
      },
      {
        label: "Test Sales",
        data: TimeSeriesDataWeekly.map((entry) => entry["Test Sales"]),
        borderColor: "rgba(255, 99, 132, 1)", // Red line color for Test Sales
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Light red background
        fill: false,
        pointStyle: "circle", // Circle shape for data points
        borderWidth: 2, // Slightly thicker line
      },
    ],

    // datasets: [
    //   {
    //     label: "Forecasted Sales",
    //     data: TimeSeriesDataMonthly.map((entry) => entry["Forecasted Sales"]),
    //     borderColor: "rgba(75, 192, 192, 1)", // Teal line color for Forecasted Sales
    //     backgroundColor: "rgba(75, 192, 192, 0.2)", // Light teal background fill
    //     fill: true,
    //     pointStyle: "rectRot", // Diamond shape for data points
    //   },
    //   {
    //     label: "Lower Limit",
    //     data: TimeSeriesDataMonthly.map((entry) => entry["Lower Limit"]),
    //     borderColor: "rgba(54, 162, 235, 1)", // Blue line color for Lower Limit
    //     backgroundColor: "rgba(54, 162, 235, 0.2)", // Light blue background fill
    //     fill: "+1", // Fill between Lower and Upper limits
    //     borderDash: [5, 5], // Dashed line style
    //     pointStyle: "triangle", // Triangle shape for data points
    //   },
    //   {
    //     label: "Upper Limit",
    //     data: TimeSeriesDataMonthly.map((entry) => entry["Upper Limit"]),
    //     borderColor: "rgba(255, 206, 86, 1)", // Yellow line color for Upper Limit
    //     backgroundColor: "rgba(255, 206, 86, 0.2)", // Light yellow background fill
    //     fill: "-1", // Fill between Lower and Upper limits
    //     borderDash: [10, 5], // Longer dashed line style
    //     pointStyle: "star", // Star shape for data points
    //   },
    //   {
    //     label: "Test Sales",
    //     data: TimeSeriesDataMonthly.map((entry) => entry["Test Sales"]),
    //     borderColor: "rgba(255, 99, 132, 1)", // Red line color for Test Sales
    //     backgroundColor: "rgba(255, 99, 132, 0.2)", // Light red background
    //     fill: false,
    //     pointStyle: "circle", // Circle shape for data points
    //     borderWidth: 2, // Slightly thicker line
    //   },
    // ],
  };

  // Chart configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      zoom: {
        enabled: true,
        axes: "xy",
        anchorPointX: "pointer",
        anchorPointY: "pointer",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales Amount",
        },
      },
    },
  };

  return (
    <div>
      <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Create new graph" arrow>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              fontSize: "14px",
              backgroundColor: "#004792",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#004792",
              },
              mb: 2,
            }}
          >
            Query
          </Button>
        </Tooltip>
      </Grid>

      <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
        <Box sx={{ flexGrow: 1, boxShadow: 5, p: 2, backgroundColor: "#fff" }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Categories Dropdown */}
            <Grid item xs={6} md={4} lg={3}>
              <Autocomplete
                options={categories}
                value={selectedCategory}
                onChange={(event, newValue) => {
                  setSelectedCategory(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Categories" variant="outlined" />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                getOptionLabel={(option) => option}
              />
            </Grid>

            {/* Franchise Type Dropdown */}
            <Grid item xs={6} md={4} lg={3}>
              <Autocomplete
                options={franchises}
                value={selectedFranchiseType}
                onChange={(event, newValue) => {
                  setSelectedFranchiseType(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Franchise Type" variant="outlined" />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                getOptionLabel={(option) => option}
              />
            </Grid>

            {/* Channel Dropdown */}
            <Grid item xs={6} md={4} lg={3}>
              <Autocomplete
                options={channels}
                value={selectedChannel}
                onChange={(event, newValue) => {
                  setSelectedChannel(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Channel" variant="outlined" />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                getOptionLabel={(option) => option}
              />
            </Grid>

            {/* Time Window Dropdown */}
            {/* <Grid item xs={6} md={4} lg={3}>
              <Autocomplete
                options={timeWindows.map((time) => time.label)}
                value={selectedTimeWindow}
                onChange={(event, newValue) => {
                  setSelectedTimeWindow(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Time Window" variant="outlined" />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                getOptionLabel={(option) => option}
              />
            </Grid> */}

            <Grid item xs={6} md={4} lg={3}>
              <Autocomplete
                options={timeWindows} // Array of { label, value } objects
                value={timeWindows.find((option) => option.value === selectedTimeWindow) || null} // Find option by value
                onChange={(event, newValue) => {
                  setSelectedTimeWindow(newValue ? newValue.value : ""); // Store only the value
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Time Window" variant="outlined" />
                )}
                getOptionLabel={(option) => option.label} // Display the label in the dropdown
                isOptionEqualToValue={(option, value) => option.value === value?.value} // Ensure correct selection
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              // mt: 2,
              backgroundColor: "#004792",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#004792",
              },
              boxShadow: 2,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            Submit
          </Button>
        </Box>
      </Slide>

      <Line data={chartData} options={options} />
    </div>
  );
};

TimeSeriesAnalysis.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TimeSeriesAnalysis;
