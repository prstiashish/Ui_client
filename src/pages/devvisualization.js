import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Popover,
  TextField,
  Checkbox,
  ListItemText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';

import axios from "axios";

import { DashboardLayout } from "src/components/dashboard-layout";
import { DevDashboard } from "./devdashboard.js";
import { AIDashboard } from "./ai.dashboard.js";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { pink } from "@mui/material/colors";
import { format } from "date-fns";

import { useRouter } from "next/router";
import { faBold } from "@fortawesome/free-solid-svg-icons";

// import { newallData } from "src/components/charts/newalldata";

// console.log(newallData);

const DevVisualization = ({ onClose, onSubmit, onNewClick }) => {
  const [selectedDimension, setSelectedDimension] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);

  const [selectedTimeWindow, setSelectedTimeWindow] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const [groupByDimension, setGroupByDimension] = useState("");
  console.log(groupByDimension, "groupByDimension");
  const [groupByValues, setGroupByValues] = useState([]);

  const [dimensionError, setDimensionError] = useState("");
  const [measureError, setMeasureError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // for api

  const [dimensions, setDimensions] = useState({});
  console.log(dimensions, "dimensions");
  const [measures, setMeasures] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [timeWindows, setTimeWindows] = useState([]);

  const dimensionKeys = Object.keys(dimensions);

  const createDimensionMappings = (dimensions) => {
    const dimensionMapping = {};
    const reverseDimensionMapping = {};

    Object.keys(dimensions).forEach((key) => {
      const dimensionArray = dimensions[key];
      if (Array.isArray(dimensionArray) && dimensionArray.length > 0) {
        const dimension = dimensionArray[0];
        const friendlyName = key;
        const backendValue = dimension.value;

        dimensionMapping[friendlyName] = backendValue;
        reverseDimensionMapping[backendValue] = dimension.values;
      }
    });

    return { dimensionMapping, reverseDimensionMapping };
  };

  const mappings = createDimensionMappings(dimensions);

  const getOptions = (selectedDimension) => {
    const backendValue = mappings.dimensionMapping[selectedDimension];
    if (backendValue) {
      return mappings.reverseDimensionMapping[backendValue] || [];
    }
    return [];
  };

  const handleDimensionChange = (event) => {
    const selectedFriendlyName = event.target.value;
    const backendValue = mappings.dimensionMapping[selectedFriendlyName];

    setSubmitError("");
    setSelectedDimension(selectedFriendlyName);
    setSelectedValues([]);

    // console.log("Selected Dimension Value for Backend:", backendValue);
  };
  const handleValueSelect = (value) => {
    if (value === "All") {
      setSelectedValues(["All"]);
    } else {
      if (selectedValues.includes("All")) {
        setSelectedValues([value]);
      } else {
        setSelectedValues((prev) =>
          prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
      }
    }
  };

  const filteredOptions = getOptions(selectedDimension)
    .filter((option) => option && option.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((option) => option !== "All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          // "https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/UI_query_selection_dropdown.json"
          // "https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/Ui-Dropdown.json"
          "https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/Ui-Dropdown-New.json"
        );

        const newallData = response.data;
        // console.log(newallData, "newallData333333333333333");
        setDimensions(newallData.dimension);
        setMeasures(newallData.measure);
        setCurrency(newallData.currency);
        setTimeWindows(newallData.time_window);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const router = useRouter();

  const [startDate, setStartDate] = useState(null);
  console.log(startDate, "ssssdddddd");

  const [endDate, setEndDate] = useState(null);
  console.log(endDate, "eeeedddddd");

  const [isChecked, setIsChecked] = useState(false); // Default value should be false
  console.log(isChecked, "isCheckedeeeeee");

  const handleSubmit = async () => {
    if (!selectedDimension) {
      // You can show an alert or a custom error message here

      setSubmitError("Please select a dimension before submitting.");
      return; // Prevent submission
    }
    setSubmitError("");
    setLoading(true);

    const formattedDimension = selectedDimension ? selectedDimension.replace(/\s+/g, "_") : "";
    const dimension =
      formattedDimension && selectedValues.length > 0
        ? `${formattedDimension}:${selectedValues.join(", ")}`
        : "";

    const timeWindow = selectedTimeWindow;

    const formattedStartDate =
      startDate instanceof Date && !isNaN(startDate)
        ? startDate.toLocaleDateString("en-CA") // Formats to 'YYYY-MM-DD' in local time
        : "";

    const formattedEndDate =
      endDate instanceof Date && !isNaN(endDate)
        ? endDate.toLocaleDateString("en-CA") // Formats to 'YYYY-MM-DD' in local time
        : "";

    // Instead of routing with params, you can navigate with state
    router.push({
      pathname: "/ai.dashboard",
      query: {
        dimension,
        timeWindow,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        isChecked,
      },
    });

    setLoading(false);
    onClose();
  };
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    // Reset selected values to "All" if a new dimension is selected
    if (selectedDimension && !selectedValues.includes("All")) {
      setSelectedValues(["All"]);
    }
  }, [selectedDimension]);

  useEffect(() => {
    // Reset selected values to "All" if a new dimension is selected
    if (groupByDimension && !groupByValues.includes("All")) {
      setGroupByValues(["All"]);
    }
  }, [groupByDimension]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "dimension-popover" : undefined;

  const [timeWindowError, setTimeWindowError] = useState("");

  const handleTimeWindowChange = (event) => {
    const value = event.target.value;
    setSelectedTimeWindow(value);

    // Optionally, handle validation or error setting
    if (!value) {
      setTimeWindowError("Please select a time window.");
    } else {
      setTimeWindowError("");
    }
  };

  // for date picker

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // Optionally validate dates
    if (endDate && date > endDate) {
      setError("Start date cannot be later than end date.");
    } else {
      setError("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    // Optionally validate dates
    if (startDate && date < startDate) {
      setError("End date cannot be earlier than start date.");
    } else {
      setError("");
    }
  };

  // Function to handle the checkbox toggle
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    console.log(checked, "event.target.checked"); // Check if this prints the expected value
    setIsChecked(checked); // Update the state with the checkbox value
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <Grid item xs={12} md={12}>
        {/* <Box
          style={{
            backgroundColor: "transparent",
            minHeight: "100px",
            boxShadow: "1px 2px 2px 1px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: "10px",
            width: "200px",
          }}
        > */}
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: "8px",
                  width: "180px",
                  borderRadius: "5px",
                  border: "1px solid #dcdcdc",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              >
                {selectedValues.length > 0 && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #dcdcdc",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        maxHeight: "130px",
                        overflowY: "auto",
                      }}
                    >
                      {selectedValues.map((value, index) => (
                        <Chip
                          key={index}
                          label={value}
                          onDelete={() =>
                            setSelectedValues((prev) => prev.filter((item) => item !== value))
                          }
                          deleteIcon={<CancelIcon />}
                          sx={{
                            backgroundColor: "#ffffff",
                            color: "#333",
                            "&:hover": {
                              backgroundColor: "#ffffff",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                  Select Dimension
                </Typography>

                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel id="dimension-select-label">Dimension</InputLabel>
                  <Select
                    labelId="dimension-select-label"
                    id="dimension-select"
                    value={selectedDimension}
                    onChange={handleDimensionChange}
                    label="Dimension"
                  >
                    <MenuItem value="">
                      <em>Select Dimension</em>
                    </MenuItem>

                    {Object.keys(dimensions).map((dimension) => (
                      <MenuItem key={dimension} value={dimension}>
                        {dimension}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {dimensionError && (
                  <div style={{ color: "#F74617" }} className="error">
                    {dimensionError}
                  </div>
                )}

                {selectedDimension && (
                  <>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: "bold", fontSize: "12px", textAlign: "start" }}
                    >
                      Select {selectedDimension}
                    </Typography>

                    <FormControl fullWidth variant="outlined" margin="normal">
                      <Button
                        aria-describedby={id}
                        variant="outlined"
                        onClick={handleClick}
                        endIcon={<ArrowDropDownIcon />}
                        fullWidth
                      >
                        {selectedValues.length > 0 && selectedValues.includes("All")
                          ? "All"
                          : `Select ${selectedDimension}`}
                      </Button>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        PaperProps={{
                          sx: {
                            padding: "0px",
                            width: "170px",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            overflowY: "auto",
                            overflowX: "auto",
                            maxHeight: "250px",

                            "@media (max-width: 768px)": {
                              width: "300px",
                              maxHeight: "200px",
                            },
                            "@media (max-width: 480px)": {
                              width: "330px",
                              maxHeight: "250px",
                            },
                          },
                        }}
                      >
                        <div style={{ padding: "15px", width: "300px" }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="Search"
                            onChange={handleSearchChange}
                            value={searchValue}
                            style={{ marginBottom: "16px" }}
                          />
                          <div>
                            <MenuItem onClick={() => handleValueSelect("All")}>
                              <ListItemText primary="All" />
                            </MenuItem>

                            {selectedDimension && filteredOptions.length > 0 ? (
                              filteredOptions.map((value, index) => (
                                <MenuItem
                                  key={index}
                                  value={value}
                                  onClick={() => handleValueSelect(value)}
                                >
                                  <Checkbox checked={selectedValues.includes(value)} />
                                  <ListItemText primary={value} />
                                </MenuItem>
                              ))
                            ) : (
                              <div>No options available</div>
                            )}
                          </div>
                        </div>
                      </Popover>
                    </FormControl>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  padding: "8px",
                  width: "180px",
                  borderRadius: "5px",
                  border: "1px solid #dcdcdc",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "30px",
                }}
              >
                <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                  Select Time Window
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {/* Start Date Picker */}
                  <FormControl fullWidth variant="outlined" margin="normal" error={!!error}>
                    <InputLabel
                      shrink
                      htmlFor="start-date-picker"
                      sx={{ marginLeft: "-11px", fontWeight: "bold", color: "black" }}
                    >
                      Start Date
                    </InputLabel>

                    <DatePicker
                      id="start-date-picker"
                      value={startDate}
                      onChange={handleStartDateChange}
                      views={["year", "month", "day"]}
                      inputFormat="yyyy/MM/dd"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            width: "100px",
                            "& .MuiInputBase-input": {
                              height: "100px",
                            },
                          }}
                        />
                      )}
                      minDate={new Date(1900, 0, 1)}
                      maxDate={new Date(currentYear + 1, 11, 31)}
                      sx={{ marginTop: "10px" }}
                    />
                    {error && <FormHelperText>{error}</FormHelperText>}
                  </FormControl>

                  {/* End Date Picker */}
                  <FormControl fullWidth variant="outlined" margin="normal" error={!!error}>
                    <InputLabel
                      shrink
                      htmlFor="end-date-picker"
                      sx={{ marginLeft: "-11px", fontWeight: "bold", color: "black" }}
                    >
                      End Date
                    </InputLabel>

                    <DatePicker
                      id="end-date-picker"
                      value={endDate}
                      onChange={handleEndDateChange}
                      views={["year", "month", "day"]}
                      inputFormat="yyyy/MM/dd"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            width: "100px",
                            "& .MuiInputBase-input": {
                              height: "20px",
                            },
                          }}
                        />
                      )}
                      minDate={new Date(1900, 0, 1)}
                      maxDate={new Date(currentYear + 1, 11, 31)}
                      sx={{ marginTop: "10px" }}
                    />
                    {error && <FormHelperText>{error}</FormHelperText>}
                  </FormControl>
                </LocalizationProvider>

                <div>
                  <Tooltip
                    title={
                      isChecked
                        ? "Uncheck to hide corresponding previous data comparison."
                        : "Check to see corresponding previous data comparison."
                    }
                    arrow
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          color="primary"
                        />
                      }
                      label={isChecked ? "Checked" : "Previous Data Comparison"}
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontWeight: "bold",
                        },
                      }}
                    />
                  </Tooltip>
                </div>

                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel id="time-window-select-label">Time Window</InputLabel>
                  <Select
                    labelId="time-window-select-label"
                    id="time-window-select"
                    value={selectedTimeWindow}
                    onChange={handleTimeWindowChange}
                    label="Time Window"
                  >
                    <MenuItem value="">
                      <em>Select Time Window</em>
                    </MenuItem>
                    <MenuItem value="Y">Year</MenuItem>
                    <MenuItem value="M">Month</MenuItem>
                    <MenuItem value="Q">Quarter</MenuItem>
                    <MenuItem value="W">Week</MenuItem>
                  </Select>
                </FormControl>

                {timeWindowError && (
                  <div style={{ color: "#F74617" }} className="error">
                    {timeWindowError}
                  </div>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid container justifyContent="center" style={{ marginTop: "0px", borderTop: "1px solid gray", paddingTop: "10px" }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
            style={{
              backgroundColor: loading ? "#d6f5d6" : "#267326",
              color: loading ? "black" : "white",


              "&:hover": {
                backgroundColor: loading ? "#d6f5d6" : "#267326",
              },
            }}
          >
            {loading ? "Loading..." : "Render Visual"}
          </Button>

          {submitError && (
            <FormHelperText
              sx={{ color: "red", marginTop: "8px", fontWeight: "bold", fontSize: "11px" }}
            >
              {submitError}
            </FormHelperText>
          )}
        </Grid>

        <div></div>
        {/* </Box> */}
      </Grid>
    </>
  );
};

DevVisualization.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DevVisualization;
