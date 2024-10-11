import React, { useState, useEffect } from "react";
import TopTrendBarChart from "src/components/charts/TopTrendBarChart";
import { DashboardLayout } from "src/components/dashboard-layout";

import axios from "axios";
import {
  Button,
  Grid,
  CircularProgress,
  Drawer,
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Importing DatePicker from MUI
import TextField from "@mui/material/TextField"; // Importing TextField for the date input

import { format } from "date-fns";

const MyComponent = () => {
  const [dimension, setDimension] = useState("Branch");
  console.log(dimension, "hwwwwwww");
  const [toplimit, setTopLimit] = useState(15);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Brand Sales",
        data: [],
        backgroundColor: "#004792",
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [isSlideOpen, setIsSlideOpen] = useState(false);

  const [error, setError] = useState(null);

  // const [startDate, setStartDate] = useState(null);

  // const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(new Date("2024-04-01")); // Default start date
  const [endDate, setEndDate] = useState(new Date()); // Current date

  const [FYStartDate, setFYStartDate] = useState(null);
  console.log(FYStartDate, "FYStartDate");
  const [FYEndDate, setFYEndDate] = useState(null);
  console.log(FYEndDate, "FYEndDate");

  const [isChecked, setIsChecked] = useState(false);

  const [includePrevYear, setIncludePrevYear] = useState(false);

  useEffect(() => {
    setIncludePrevYear(isChecked === "true" ? true : false);
  }, [isChecked]);

  // const dataUrl = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";

  const dataUrl = "https://aotdgyib2bvdm7hzcttncgy25a0axpwu.lambda-url.ap-south-1.on.aws/";

  // Initial fetch of default data on component mount
  // useEffect(() => {
  //   const defaultPayload = {
  //     dimension: `${dimension}:All`,
  //     view: "top-trends",
  //     topRank: toplimit,
  //   };
  //   fetchData(defaultPayload);
  // }, []);

  // const handleFetchData = () => {
  //   // const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : "";
  //   // const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : "";
  //   const defaultStartDate = "2024-04-01";
  //   const defaultEndDate = format(new Date(), "yyyy-MM-dd"); // Current date formatted

  //   // Format start and end dates or use default values
  //   const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : defaultStartDate;
  //   const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : defaultEndDate;

  //   setStartDate(formattedStartDate);
  //   setEndDate(formattedEndDate);

  //   console.log(formattedStartDate, "startDdddddddddddddate");
  //   console.log(formattedEndDate, "endDdddddddddddddddate");

  //   const payload = {
  //     dimension: `${dimension}:All`,
  //     view: "top-trends",
  //     topRank: toplimit,
  //     start_date: formattedStartDate,
  //     end_date: formattedEndDate,
  //     include_prev_year: isChecked,
  //   };
  //   console.log("Payload inside handleFetchData:", payload);

  //   // console.log("Payload inside handleFetchData:", payload);
  //   fetchData(payload);
  // };

  // const fetchData = async (payload) => {
  //   console.log("Fetching data with payload:", payload);
  //   try {
  //     const response = await axios.post(dataUrl, payload);
  //     const data = response.data;

  //     // Log response data for debugging
  //     console.log("Response data:", data);
  //     console.log("Data keys:", Object.keys(data));
  //     console.log("Data for current fiscal year:", data["Current Fiscal Year"]);
  //     console.log("Data for previous fiscal year:", data["Previous Fiscal Year"]);

  //     // Check if the response data is an array or contains expected keys
  //     if (Array.isArray(data)) {
  //       // Process data if it's an array (for when include_prev_year is false)
  //       const labels = data.map((item) => item[dimension] || "Unknown"); // Handle missing dimension
  //       const salesData = data.map((item) => item.Gross_Amount || 0); // Handle missing Gross_Amount

  //       const newChartData = {
  //         labels: labels,
  //         datasets: [
  //           {
  //             label: `${dimension} Sales`,
  //             data: salesData,
  //             // backgroundColor: "#004792",
  //             backgroundColor: "rgba(25, 127, 192)",
  //           },
  //         ],
  //       };

  //       setChartData(newChartData);
  //     } else if (data["Current Fiscal Year"] && data["Previous Fiscal Year"]) {
  //       // Process data if it includes current and previous fiscal years
  //       const currentYearData = data["Current Fiscal Year"] || [];
  //       const previousYearData = data["Previous Fiscal Year"] || [];

  //       const currentLabels = currentYearData.map((item) => item[dimension] || "Unknown");
  //       const currentSalesData = currentYearData.map((item) => item.Gross_Amount || 0);

  //       const previousLabels = previousYearData.map((item) => item[dimension] || "Unknown");
  //       const previousSalesData = previousYearData.map((item) => item.Gross_Amount || 0);

  //       // Combine labels and sales data
  //       const labels = [...new Set([...currentLabels, ...previousLabels])];
  //       const combinedSalesData = labels.map((label) => {
  //         return {
  //           current: currentSalesData[currentLabels.indexOf(label)] || 0,
  //           previous: previousSalesData[previousLabels.indexOf(label)] || 0,
  //         };
  //       });

  //       const datasets = [
  //         {
  //           label: "Current Fiscal Year Sales",
  //           data: combinedSalesData.map((item) => item.current),
  //           // backgroundColor: "rgb(0, 71, 146)",
  //           backgroundColor: "rgba(25, 127, 192)",
  //         },
  //       ];

  //       if (previousYearData.length > 0) {
  //         datasets.push({
  //           label: "Previous Fiscal Year Sales",
  //           data: combinedSalesData.map((item) => item.previous),
  //           // backgroundColor: "rgb(0, 71, 146,0.3)",
  //           backgroundColor: "rgba(25, 127, 192, 0.18)",
  //         });
  //       }

  //       const newChartData = {
  //         labels: labels,
  //         datasets: datasets,
  //       };

  //       setChartData(newChartData);
  //     } else {
  //       console.error("Unexpected data format:", data);
  //     }

  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = () => {
  //   handleFetchData();
  //   setIsSlideOpen(false);
  //   setTopLimit(15);
  //   // setStartDate(null);
  //   // setEndDate(null);
  //   setStartDate("2024-04-01");
  //   setEndDate(format(new Date(), "yyyy-MM-dd"));
  //   setIsChecked(false);
  // };

  const createPayload = () => {
    const defaultStartDate = new Date("2024-04-01"); // Set default start date
    const defaultEndDate = format(new Date(), "yyyy-MM-dd"); // Current date

    const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : defaultStartDate;
    const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : defaultEndDate;
    setFYStartDate(formattedStartDate);
    setFYEndDate(formattedEndDate);

    return {
      dimension: `${dimension}:All`,
      view: "top-trends",
      topRank: toplimit,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      include_prev_year: isChecked,
    };
  };

  useEffect(() => {
    const defaultPayload = createPayload();
    fetchData(defaultPayload);
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle data fetching
  const handleFetchData = () => {
    const payload = createPayload();
    // console.log("Payload inside handleFetchData:", payload);

    fetchData(payload);
  };

  const fetchData = async (payload) => {
    console.log("Fetching data with payload:", payload);
    try {
      const response = await axios.post(dataUrl, payload);
      const data = response.data;

      // // Log response data for debugging
      // console.log("Response data:", data);
      // console.log("Data keys:", Object.keys(data));
      // console.log("Data for current fiscal year:", data["Current Fiscal Year"]);
      // console.log("Data for previous fiscal year:", data["Previous Fiscal Year"]);

      // Check if the response data is an array or contains expected keys
      if (Array.isArray(data)) {
        // Process data if it's an array (for when include_prev_year is false)
        const labels = data.map((item) => item[dimension] || "Unknown"); // Handle missing dimension
        const salesData = data.map((item) => item.Gross_Amount || 0); // Handle missing Gross_Amount

        const newChartData = {
          labels: labels,
          datasets: [
            {
              label: `${dimension} Sales`,
              data: salesData,
              // backgroundColor: "#004792",
              backgroundColor: "rgba(25, 127, 192)",
            },
          ],
        };

        setChartData(newChartData);
      } else if (data["Current Fiscal Year"] && data["Previous Fiscal Year"]) {
        // Process data if it includes current and previous fiscal years
        const currentYearData = data["Current Fiscal Year"] || [];
        const previousYearData = data["Previous Fiscal Year"] || [];

        const currentLabels = currentYearData.map((item) => item[dimension] || "Unknown");
        const currentSalesData = currentYearData.map((item) => item.Gross_Amount || 0);

        const previousLabels = previousYearData.map((item) => item[dimension] || "Unknown");
        const previousSalesData = previousYearData.map((item) => item.Gross_Amount || 0);

        // Combine labels and sales data
        const labels = [...new Set([...currentLabels, ...previousLabels])];
        const combinedSalesData = labels.map((label) => {
          return {
            current: currentSalesData[currentLabels.indexOf(label)] || 0,
            previous: previousSalesData[previousLabels.indexOf(label)] || 0,
          };
        });

        const datasets = [
          {
            label: "Current Fiscal Year Sales",
            data: combinedSalesData.map((item) => item.current),
            // backgroundColor: "rgb(0, 71, 146)",
            backgroundColor: "rgba(25, 127, 192)",
          },
        ];

        if (previousYearData.length > 0) {
          datasets.push({
            label: "Corresponding Previous Fiscal Year Sales",
            data: combinedSalesData.map((item) => item.previous),
            // backgroundColor: "rgb(0, 71, 146,0.3)",
            backgroundColor: "rgba(25, 127, 192, 0.18)",
          });
        }

        const newChartData = {
          labels: labels,
          datasets: datasets,
        };

        setChartData(newChartData);
      } else {
        console.error("Unexpected data format:", data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    handleFetchData();
    setIsSlideOpen(false);
    setTopLimit(15);
    // setStartDate(null);
    // setEndDate(null);
    setStartDate("2024-04-01");
    setEndDate(format(new Date(), "yyyy-MM-dd"));
    setIsChecked(false);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);

    if (endDate && date > endDate) {
      setError("Start date cannot be later than end date.");
    } else {
      setError("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);

    if (startDate && date < startDate) {
      setError("End date cannot be earlier than start date.");
    } else {
      setError("");
    }
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    // console.log(checked, "event.target.checked");
    setIsChecked(checked);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Button to handle the slide-out panel */}
      <Grid item xs={12} md={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Create new graph" arrow>
          <Button
            variant="contained"
            onClick={() => setIsSlideOpen(true)}
            style={{
              fontSize: "14px",
              marginBottom: "1%",
              backgroundColor: "#004792",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
              color: "#fff",
              borderColor: "#b366ff",
            }}
          >
            Query
          </Button>
        </Tooltip>
      </Grid>
      <p style={{ fontSize: "12px", margin: 0, fontWeight: "bold" }}>
        Start Date: {FYStartDate} &nbsp;&nbsp; End Date: {FYEndDate}
      </p>
      <div
        style={{
          display: "flex", // Flexbox layout
          justifyContent: "space-between", // Spreads out the content
          alignItems: "center", // Vertically centers the items
          marginBottom: "0px",
          fontWeight: "bold",
          padding: "0px",
          fontSize: "15px",
          fontFamily: "-moz-initial",
        }}
      >
        <div style={{ textAlign: "center", flex: 1 }}>{`Sales Performance by ${dimension}`}</div>
      </div>

      {/* Slide-Out Panel */}
      <Drawer anchor="right" open={isSlideOpen} onClose={() => setIsSlideOpen(false)}>
        <div style={{ width: "300px", padding: "20px" }}>
          <IconButton
            onClick={() => setIsSlideOpen(false)}
            sx={{ position: "absolute", top: "16px", right: "16px" }}
          >
            <CloseIcon />
          </IconButton>

          {/* Dimension Selection */}
          <Grid item xs={12}>
            <Box
              sx={{
                padding: "18px",
                borderRadius: "5px",
                border: "1px solid #dcdcdc",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                marginTop: "50px",
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                Select Dimension
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Dimension</InputLabel>
                <Select
                  value={dimension}
                  onChange={(e) => setDimension(e.target.value)}
                  label="Dimension"
                >
                  <MenuItem value="Brand">Brand</MenuItem>
                  <MenuItem value="Franchise_Type">Franchise Type</MenuItem>
                  <MenuItem value="Region">Region</MenuItem>
                  <MenuItem value="Branch">Branch</MenuItem>
                  <MenuItem value="Channel">Channel</MenuItem>
                  <MenuItem value="Category">Category</MenuItem>
                  <MenuItem value="Subcategory">SubCategory</MenuItem>
                  <MenuItem value="Product">Product</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Top Limit Selection */}
          <Grid item xs={12}>
            <Box
              sx={{
                padding: "18px",
                borderRadius: "5px",
                border: "1px solid #dcdcdc",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                marginTop: "50px",
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                Top Trend
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Top</InputLabel>
                <Select value={toplimit} onChange={(e) => setTopLimit(e.target.value)} label="Top">
                  <MenuItem value={10}>Top 10</MenuItem>
                  <MenuItem value={15}>Top 15</MenuItem>
                  <MenuItem value={30}>Top 30</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* time window */}

          <Grid item xs={12}>
            <Box
              sx={{
                padding: "8px",
                // width: "180px",
                borderRadius: "5px",
                border: "1px solid #dcdcdc",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                marginTop: "30px",
                marginBottom: "30px",
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                Select Time Window
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <FormControl fullWidth variant="outlined" margin="normal" error={!!error}>
                  <InputLabel shrink htmlFor="start-date-picker" sx={{ marginLeft: "-11px" }}>
                    Start Date
                  </InputLabel>

                  <DatePicker
                    id="start-date-picker"
                    value={startDate || null}
                    views={["year", "month", "day"]}
                    onChange={(date) => handleStartDateChange(date)}
                    renderInput={(params) => <TextField {...params} />}
                    minDate={new Date(1900, 0, 1)} // January 1 of current year
                    maxDate={new Date(currentYear + 1, 11, 31)} // December 31 of next year
                    sx={{ marginTop: "10px" }}

                  />
                  {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth variant="outlined" margin="normal" error={!!error}>
                  <InputLabel shrink htmlFor="end-date-picker" sx={{ marginLeft: "-11px" }}>
                    End Date
                  </InputLabel>
                  <DatePicker
                    id="end-date-picker"
                    value={endDate || null}
                    views={["year", "month", "day"]}
                    onChange={(date) => handleEndDateChange(date)}
                    renderInput={(params) => <TextField {...params} />}
                    minDate={new Date(1900, 0, 1)} // January 1 of current year
                    maxDate={new Date(currentYear + 1, 11, 31)} // December 31 of next year
                    sx={{ marginTop: "10px" }}
                  />
                  {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
              </LocalizationProvider>

              <div>
                <FormControlLabel
                  control={
                    <Checkbox checked={isChecked} onChange={handleCheckboxChange} color="primary" />
                  }
                  label={isChecked ? "Checked" : "Previous Data Comparison"}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontWeight: "bold",
                    },
                  }}
                />
              </div>
            </Box>
          </Grid>

          {/* Submit Button */}
          <Grid container justifyContent="center" style={{ marginTop: "15px" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
              style={{
                backgroundColor: loading ? "#d6f5d6" : "#267326",
                // color: loading ? "black" : "white",
                "&:hover": {
                  backgroundColor: loading ? "#d6f5d6" : "#267326",
                },
              }}
            >
              {loading ? "Loading..." : "Render Visual"}
            </Button>
          </Grid>
        </div>
      </Drawer>

      {/* Visualization */}
      <Grid container spacing={1} style={{ marginTop: "1%", width: "100%" }}>
        <Grid item xs={12} md>
          <div
            style={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "5px",
              overflow: "hidden",
              height: "100%",
              paddingRight: "12px",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            {/* {loading ? (
              <CircularProgress />
            ) : ( */}
            <TopTrendBarChart
              chartData={chartData}
              startDate={FYStartDate} // Pass the start date
              endDate={FYEndDate}
              title="Top Trend Visualization"
            />
            {/* )} */}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
MyComponent.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MyComponent;
