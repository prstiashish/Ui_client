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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import axios from "axios";

import { DashboardLayout } from "src/components/dashboard-layout";

import { useRouter } from "next/router";

// import { newallData } from "src/components/charts/newalldata";

// console.log(newallData);

const DataVisualization = ({ onClose, onSubmit, onNewClick }) => {
  const [selectedDimension, setSelectedDimension] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedMeasure, setSelectedMeasure] = useState("");
  const [selectCurrency, setSelectCurrency] = useState("");
  const [selectedTimeWindow, setSelectedTimeWindow] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [radioSelection, setRadioSelection] = useState("top");
  const [topInputValue, setTopInputValue] = useState("");
  const [downInputValue, setDownInputValue] = useState("");
  const [groupByDimension, setGroupByDimension] = useState("");
  const [groupByValues, setGroupByValues] = useState([]);
  const [groupByAnchorEl, setGroupByAnchorEl] = useState(null);
  const [searchValueGroupBy, setSearchValueGroupBy] = useState("");
  const [topError, setTopError] = useState("");
  const [downError, setDownError] = useState("");
  const [openGroupBy, setOpenGroupBy] = useState(false);
  const [includeCOGS, setIncludeCOGS] = useState(false);
  const [isGroupByEnabled, setIsGroupByEnabled] = useState(false);
  const [isNoneSelected, setIsNoneSelected] = useState(false);

  const [dimensionError, setDimensionError] = useState("");
  const [measureError, setMeasureError] = useState("");

  const [showDottedBox, setShowDottedBox] = useState(false);

  const [loading, setLoading] = useState(false);

  // for api

  const [dimensions, setDimensions] = useState({});
  const [measures, setMeasures] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [timeWindows, setTimeWindows] = useState([]);

  const dimensionKeys = Object.keys(dimensions);

  const createDimensionMappings = (dimensions) => {
    const dimensionMapping = {}; // Maps user-friendly names to backend values
    const reverseDimensionMapping = {}; // Maps backend values to UI options

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
    const backendValue = mappings.dimensionMapping[selectedFriendlyName]; // Correctly get backend value

    setSelectedDimension(selectedFriendlyName);
    setSelectedValues([]); // Clear selection when dimension changes

    // Optional: Uncomment if you need to see the backend value in the console
    console.log("Selected Dimension Value for Backend:", backendValue);
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
          "https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/UI_query_selection_dropdown.json"
        );

        const newallData = response.data;
        setDimensions(newallData.dimension);
        setMeasures(newallData.measure);
        setCurrency(newallData.currency);
        setTimeWindows(newallData.time_window);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const [newallData, setNewallData] = useState([]);
  // const [newallData, setNewallData] = useState({
  // dimension: {},
  // measure: {},
  // });

  // for json file

  // const dimensions = newallData.dimension;

  // const dimensionKeys = Object.keys(dimensions);
  // console.log(dimensionKeys, "kkkk");
  // const measures = newallData.measure;
  // console.log(measures, "mm");
  // const currency = newallData.currency;
  // const timeWindows = newallData.time_window;
  // console.log(timeWindows, "tw");

  // get

  // https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/UI_query_selection_dropdown.json

  // post
  // https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/

  const [error, setError] = useState(null);

  const generateFriendlyName = (key) => {
    return key
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  // old

  const { dimensionMapping, reverseDimensionMapping } = createDimensionMappings(dimensions);
  // console.log(dimensionMapping,'dimensionMapping')

  const formatData = () => {
    // Replace spaces with underscores in the selected dimension
    const formattedDimension = selectedDimension ? selectedDimension.replace(/\s+/g, "_") : "";

    // Build the dimension string using the formatted dimension
    const dimension =
      formattedDimension && selectedValues.length > 0
        ? `${formattedDimension}:${selectedValues.join(", ")}`
        : "";

    // Handle partition formatting
    const partition = isNoneSelected
      ? "None"
      : groupByDimension && groupByValues.length > 0
      ? `${groupByDimension.replace(/\s+/g, "_")}:${groupByValues.join(", ")}`
      : "";

    // Prepare the measure and time window columns (no transformation needed here)
    const measure = selectedMeasure;
    const time_window_col = selectedTimeWindow;

    // Log or return the formatted data as needed
    // console.log("Formatted Dimension:", dimension);
    // console.log("Partition:", partition);
    // console.log("Measure:", measure);
    // console.log("Time Window Column:", time_window_col);

    return {
      dimension,
      partition,
      measure,

      includeCOGS,
      topRank: topInputValue || 0, // Send 0 if no value is provided
      bottomRank: downInputValue || 0, // Send 0 if no value is provided
    };
  };

  const handleSubmit = async () => {
    let hasError = false;

    if (!selectedDimension) {
      setDimensionError("Please select a dimension.");
      hasError = true;
    } else {
      setDimensionError("");
    }

    if (!selectedMeasure) {
      setMeasureError("Please select a measure.");
      hasError = true;
    } else {
      setMeasureError("");
    }

    if (hasError) return;

    const payload = formatData();
    // console.log(data, "dataaaaaaaa");

    const url = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
        // body: jsondata
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      onSubmit(result, payload);
      console.log("Success Response:", result);
      console.log(payload, "payload");

      const router = useRouter();
      router.push({
        pathname: "/datagraphs", // Replace with your target page
        query: {
          ...result, // Pass the response
          payload: JSON.stringify(data), // Pass the payload as part of query
        },
      });
    } catch (error) {
      console.error("Error submitting data:", error.message);
      // Handle error response
    } finally {
      setLoading(false);
    }
    onClose();
  };

  const handleNewClick = () => {
    console.log("New button clicked");
    // Your logic here
    onNewClick();
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

  const getValuesByDimension = (dimensionKey) => {
    const dimension = newallData.dimension[dimensionKey];
    if (dimension && dimension.length > 0) {
      return dimension[0].values;
    }
    return [];
  };

  const handleGroupByChange = (event) => {
    if (isNoneSelected) return; // Ignore if "None" is selected

    if (!selectedDimension) {
      // Show hint or alert if no dimension is selected
      alert("Please select a dimension first.");
      return;
    }
    const newGroupByDimension = event.target.value;
    setGroupByDimension(newGroupByDimension);
    setGroupByValues([]); // Clear values when dimension changes
    setSearchValueGroupBy("");
  };

  const handleGroupByValueSelect = (value) => {
    if (isNoneSelected) return;
    if (value === "All") {
      setGroupByValues(["All"]);
    } else {
      if (groupByValues.includes("All")) {
        setGroupByValues([value]);
      } else {
        setGroupByValues((prev) =>
          prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
      }
    }
  };

  const getGroupByOptions = () => {
    const re = dimensions[groupByDimension]?.[0]?.values || [];
    // console.log(re, "gggeee");
    return re;
  };

  const handleGroupByClick = (event) => {
    if (isNoneSelected) return; // Ignore if "None" is selected

    setGroupByAnchorEl(event.currentTarget);
    setOpenGroupBy(true);
  };

  const handleGroupByClose = () => {
    setOpenGroupBy(false);
    setGroupByAnchorEl(null);
  };

  // const openGroupBy = Boolean(groupByAnchorEl);
  const idGroupBy = openGroupBy ? "group-by-popover" : undefined;

  const handleSearchChangeGroupBy = (event) => {
    const newValue = event.target.value;
    setSearchValueGroupBy(newValue);
    console.log(newValue, "Search Value");
  };

  const handleMeasureChange = (event) => {
    const value = event.target.value;
    console.log(typeof value, "typeeeeee");
    setSelectedMeasure(value);

    // Show checkbox only if "Total Sales" is selected, otherwise hide it and reset checkbox state
    if (value === "Total_Sales") {
      setIncludeCOGS(false); // Ensure checkbox is unchecked by default when "Total Sales" is selected
    } else {
      setIncludeCOGS(false); // Reset checkbox state if another measure is selected
    }
  };

  const handleIncludeCOGSChange = (event) => {
    setIncludeCOGS(event.target.checked);
  };

  const selectedMeasureDisplay = measures.find(
    (measure) => measure.value === selectedMeasure
  )?.values;

  const filteredMeasures = measures.filter((measure) =>
    measure.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle currency selection
  const handleCurrencyChange = (event) => {
    setSelectCurrency(event.target.value);
  };

  const filteredCurrency = currency.filter((currency) =>
    currency.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle window selection
  const handleTimeWindowChange = (event) => {
    setSelectedTimeWindow(event.target.value);
  };

  const filteredTimeWindow = timeWindows.filter((timewindow) =>
    timewindow.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setRadioSelection(selectedValue);
    // Reset the other input value
    if (selectedValue === "top") {
      setDownInputValue("");
    } else {
      setTopInputValue("");
    }
  };

  const handleTopInputChange = (e) => {
    const value = parseInt(e.target.value, 10);

    // console.log(typeof value, 'typeeeee')
    setTopInputValue(value);
    if (parseInt(value, 10) <= 0 && value !== "") {
      setTopError("Please enter a value greater than 0");
    } else {
      setTopError("");
    }
  };

  const handleDownInputChange = (e) => {
    const value = parseInt(e.target.value, 10);

    setDownInputValue(value);
    if (parseInt(value, 10) <= 0 && value !== "") {
      setDownError("Please enter a value greater than 0");
    } else {
      setDownError("");
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNoneCheckboxChange = (event) => {
    setIsNoneSelected(event.target.checked);
  };

  const handleGroupByCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsNoneSelected(checked);

    if (checked) {
      // Clear dimension and values when "None" is selected
      setGroupByDimension("");
      setGroupByValues([]);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "dimension-popover" : undefined;

  return (
    <Grid container spacing={2} style={{ marginTop: "1%" }}>
      <Grid item xs={12} md={12}>
        <Box
          style={{
            backgroundColor: "transparent",
            minHeight: "400px",
            boxShadow: "1px 2px 2px 1px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          {/* <Box style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <Button
              variant="contained"
              onClick={handleNewClick}
              color="primary"
              style={{ width: "auto", padding: "2 2" }}
            >
              New
            </Button>
          </Box> */}

          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxShadow: "1px 2px 2px 1px rgba(0, 0, 0, 0.1)",
                  minHeight: "200px",
                  borderRadius: "5px",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #dcdcdc",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {selectedValues.length > 0 && (
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              padding: "8px",
                              borderRadius: "5px",
                              border: "1px solid #dcdcdc",
                              backgroundColor: "#f9f9f9",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                              maxHeight: "130px", // Fixed height for displaying selected values
                              overflowY: "auto", // Enable scrollbar if content overflows
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
                                  backgroundColor: "#e0e0e0",
                                  color: "#333",
                                  "&:hover": {
                                    backgroundColor: "#c8c8c8",
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
                      {/* {dimensionError && <div className="error">{dimensionError}</div>} */}
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
                                  width: "170px", // Default width
                                  borderRadius: "8px",
                                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                  overflowY: "auto",
                                  overflowX: "auto",
                                  maxHeight: "250px", // Default max height
                                  // Media queries
                                  "@media (max-width: 768px)": {
                                    width: "300px", // Adjust width for tablets and small devices
                                    maxHeight: "200px", // Adjust max height for tablets and small devices
                                  },
                                  "@media (max-width: 480px)": {
                                    width: "330px", // Adjust width for very small devices
                                    maxHeight: "250px", // Adjust max height for very small devices
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
                                    <div>No options available</div> // Fallback if no options are available
                                  )}
                                </div>
                              </div>
                            </Popover>
                          </FormControl>
                        </>
                      )}
                    </Box>
                  </Grid>

                  {selectCurrency && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          padding: "8px",
                          borderRadius: "5px",
                          border: "1px solid #dcdcdc",
                          backgroundColor: "#f9f9f9",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Typography variant="h6" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
                          Currency:
                        </Typography>
                        <Chip
                          label={selectCurrency}
                          onDelete={() => setSelectCurrency("")}
                          deleteIcon={<CancelIcon />}
                          sx={{
                            backgroundColor: "#e0e0e0",
                            color: "#333",
                            "&:hover": {
                              backgroundColor: "#c8c8c8",
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  )}

                  {/* time window */}

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #dcdcdc",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Rank:
                      </Typography>
                      <RadioGroup
                        row
                        value={radioSelection}
                        onChange={handleRadioChange}
                        sx={{ marginBottom: "0px" }}
                      >
                        <FormControlLabel value="top" control={<Radio />} label="Top" />
                        <FormControlLabel value="down" control={<Radio />} label="Bottom" />
                      </RadioGroup>
                      {radioSelection === "top" && (
                        <TextField
                          label="Top Rank"
                          variant="outlined"
                          fullWidth
                          type="number"
                          value={topInputValue}
                          onChange={handleTopInputChange}
                          margin="normal"
                          error={!!topError}
                          helperText={topError}
                          sx={{ marginBottom: "16px" }}
                        />
                      )}
                      {radioSelection === "down" && (
                        <TextField
                          label="Bottom Rank"
                          variant="outlined"
                          fullWidth
                          type="number"
                          value={downInputValue}
                          onChange={handleDownInputChange}
                          margin="normal"
                          error={!!downError}
                          helperText={downError}
                          sx={{ marginBottom: "16px" }}
                        />
                      )}
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12}>
                    <Box
                      sx={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #dcdcdc",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {selectedTimeWindow && (
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              padding: "8px",
                              borderRadius: "5px",
                              border: "1px solid #dcdcdc",
                              backgroundColor: "#f9f9f9",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >

                            <Chip
                              label={selectedTimeWindow}
                              onDelete={() => setSelectedTimeWindow("")}
                              deleteIcon={<CancelIcon />}
                              sx={{
                                backgroundColor: "#e0e0e0",
                                color: "#333",
                                "&:hover": {
                                  backgroundColor: "#c8c8c8",
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      )}

                      <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                        Select Time Window
                      </Typography>
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
                          {filteredTimeWindow.map((window) => (
                            <MenuItem key={window.value} value={window.value}>
                              {window.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid> */}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxShadow: "1px 2px 2px 1px rgba(0, 0, 0, 0.1)",
                  minHeight: "200px",
                  borderRadius: "5px",
                }}
              >
                {/* wwwworki */}

                <Grid item xs={12}>
                  <Box
                    sx={{
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #dcdcdc",
                      backgroundColor: "#f9f9f9",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {selectedMeasureDisplay && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            padding: "8px",
                            borderRadius: "5px",
                            border: "1px solid #dcdcdc",
                            backgroundColor: "#f9f9f9",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          <Chip
                            label={selectedMeasureDisplay}
                            onDelete={() => setSelectedMeasure("")}
                            deleteIcon={<CancelIcon />}
                            sx={{
                              backgroundColor: "#e0e0e0",
                              color: "#333",
                              "&:hover": {
                                backgroundColor: "#c8c8c8",
                              },
                            }}
                          />
                        </Box>
                      </Grid>
                    )}
                    <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                      Select Measure
                    </Typography>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel id="measure-select-label">Measure</InputLabel>
                      <Select
                        labelId="measure-select-label"
                        id="measure-select"
                        value={selectedMeasure}
                        onChange={handleMeasureChange}
                        label="Measure"
                        input={<OutlinedInput label="Measure" />}
                      >
                        <MenuItem value="">
                          <em>Select Measure</em>
                        </MenuItem>
                        {measures.map((measure, index) => (
                          <MenuItem key={measure.value + index} value={measure.value}>
                            {measure.values}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* {measureError && <div className="error">{measureError}</div>} */}
                    {measureError && (
                        <div style={{ color: "#F74617" }} className="error">
                          {measureError}
                        </div>
                      )}

                    {selectedMeasure === "Total_Sales" && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeCOGS}
                            onChange={handleIncludeCOGSChange}
                            color="primary"
                          />
                        }
                        label="Include COGS"
                        sx={{ marginTop: "16px" }}
                      />
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #dcdcdc",
                      backgroundColor: "#f9f9f9",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Tooltip
                          title={
                            isNoneSelected
                              ? "If you want to group by, please uncheck"
                              : "If you don't want group, please check"
                          }
                        >
                          <Checkbox
                            checked={isNoneSelected}
                            onChange={handleGroupByCheckboxChange}
                          />
                        </Tooltip>
                      }
                      label="None"
                      sx={{ marginBottom: "16px" }}
                    />

                    {/* Conditional Rendering of Group By Dimension */}
                    {!isNoneSelected && (
                      <>
                        {groupByValues.length > 0 && (
                          <Box
                            sx={{
                              padding: "8px",
                              borderRadius: "5px",
                              border: "1px solid #dcdcdc",
                              backgroundColor: "#f9f9f9",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                              maxHeight: "130px",
                              overflowY: "auto",
                            }}
                          >
                            {groupByValues.map((value, index) => (
                              <Chip
                                key={index}
                                label={value}
                                onDelete={() =>
                                  setGroupByValues((prev) => prev.filter((item) => item !== value))
                                }
                                deleteIcon={<CancelIcon />}
                                sx={{
                                  backgroundColor: "#e0e0e0",
                                  color: "#333",
                                  "&:hover": {
                                    backgroundColor: "#c8c8c8",
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        )}

                        <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                          Select group by
                        </Typography>
                        <FormControl fullWidth variant="outlined" margin="normal">
                          <InputLabel id="group-by-select-label">Group By</InputLabel>
                          <Select
                            labelId="group-by-select-label"
                            id="group-by-select"
                            value={groupByDimension}
                            onChange={handleGroupByChange}
                            label="Group By"
                            disabled={isNoneSelected || !selectedDimension}
                          >
                            <MenuItem value="">
                              <em>Select Group By Dimension</em>
                            </MenuItem>
                            {dimensionKeys
                              .filter((key) => key !== selectedDimension)
                              .map((key) => (
                                <MenuItem key={key} value={key}>
                                  {key}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        <Typography
                          variant="h6"
                          sx={{ marginBottom: "8px", fontSize: "12px", color: "textSecondary" }}
                        >
                          {!selectedDimension && (
                            <Tooltip>
                              <span>Please select a dimension to enable group by.</span>
                            </Tooltip>
                          )}
                        </Typography>

                        {groupByDimension && (
                          <>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ fontWeight: "bold", fontSize: "12px", textAlign: "start" }}
                            >
                              Select {groupByDimension}
                            </Typography>
                            <FormControl fullWidth variant="outlined" margin="normal">
                              <Button
                                aria-describedby={idGroupBy}
                                variant="outlined"
                                onClick={handleGroupByClick}
                                endIcon={<ArrowDropDownIcon />}
                                fullWidth
                                disabled={isNoneSelected} // Disable button when "None" is selected
                              >
                                {groupByValues.length > 0 && groupByValues.includes("All")
                                  ? "All"
                                  : `Select ${groupByDimension}`}
                              </Button>

                              <Popover
                                id={idGroupBy}
                                open={openGroupBy}
                                anchorEl={groupByAnchorEl}
                                onClose={handleGroupByClose}
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
                                    maxHeight: "200px",
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
                                <div style={{ padding: "16px", width: "300px" }}>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Search"
                                    onChange={handleSearchChangeGroupBy}
                                    value={searchValueGroupBy}
                                    style={{ marginBottom: "16px" }}
                                  />

                                  <div>
                                    <MenuItem onClick={() => handleGroupByValueSelect("All")}>
                                      <ListItemText primary="All" />
                                    </MenuItem>

                                    {getGroupByOptions(groupByDimension)
                                      .filter((val) => val !== null)
                                      .filter((val) =>
                                        val.toLowerCase().includes(searchValueGroupBy.toLowerCase())
                                      )
                                      .map(
                                        (value, index) =>
                                          value !== "All" && (
                                            <MenuItem
                                              key={index}
                                              value={value}
                                              onClick={() => handleGroupByValueSelect(value)}
                                            >
                                              <Checkbox checked={groupByValues.includes(value)} />
                                              <ListItemText primary={value} />
                                            </MenuItem>
                                          )
                                      )}
                                  </div>
                                </div>
                              </Popover>
                            </FormControl>
                          </>
                        )}
                      </>
                    )}
                  </Box>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          {/* <Grid container justifyContent="center" style={{ marginTop: "15px" }}>
            <Button variant="contained" color="green" onClick={handleSubmit}>
              Render Visual
            </Button>
          </Grid> */}
          <Grid container justifyContent="center" style={{ marginTop: "15px" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
              style={{
                backgroundColor: loading ? "#ffb84d" : "#00b300", // Darker green when loading, default green
                color: loading ? "black" : "white", // White text color
                // borderColor: loading ? '#006622' : '#009933', // Darker border color when loading, default green
                "&:hover": {
                  backgroundColor: loading ? "#ffb84d" : "#00b300", // Even darker green when loading, lighter green on hover
                },
              }}
            >
              {loading ? "Loading..." : "Render Visual"}
            </Button>
          </Grid>
          <div></div>
        </Box>
      </Grid>
    </Grid>
  );
};

DataVisualization.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DataVisualization;
