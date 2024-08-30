// workinggg

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
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import axios from "axios"; // Import axios for making HTTP requests

import { DashboardLayout } from "src/components/dashboard-layout";
// import { newallData } from "src/components/charts/newalldata";

// console.log(newallData);

const DataVisualization = ({ onClose, onSubmit }) => {
  const [selectedDimension, setSelectedDimension] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedMeasure, setSelectedMeasure] = useState("");
  // console.log(selectedMeasure, 'selectedMeasure')
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


  const [dimensionError, setDimensionError] = useState('');
  const [measureError, setMeasureError] = useState('');

  // for api

  const [dimensions, setDimensions] = useState({});
  const [measures, setMeasures] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [timeWindows, setTimeWindows] = useState([]);

  const dimensionKeys = Object.keys(dimensions);

  // console.log(dimensions);

  // const getUrl = 'https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/UI_query_selection_dropdown.json'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/UI_query_selection_dropdown.json"
        );
        // const response = await fetch('https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/UI_query_selection_dropdown.json');

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
  // Extract the keys from dimensions

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

  // const createDimensionMappings = (dimensions) => {
  //   const dimensionMapping = {}; // Maps user-friendly names to backend values
  //   const reverseDimensionMapping = {}; // Maps backend values to user-friendly names

  //   if (!dimensions || typeof dimensions !== "object") {
  //     console.error("Invalid dimensions data", dimensions);
  //     return { dimensionMapping, reverseDimensionMapping };
  //   }

  //   Object.keys(dimensions).forEach((key) => {
  //     const friendlyName = key;
  //     const backendValue = dimensions[key][0].value;
  //     dimensionMapping[friendlyName] = backendValue;

  //     reverseDimensionMapping[backendValue] = friendlyName;
  //   });

  //   return { dimensionMapping, reverseDimensionMapping };
  // };


  const createDimensionMappings = (dimensions) => {
    const dimensionMapping = {}; // Maps user-friendly names to backend values
    const reverseDimensionMapping = {}; // Maps backend values to dropdown options

    if (!dimensions || typeof dimensions !== "object") {
      console.error("Invalid dimensions data", dimensions);
      return { dimensionMapping, reverseDimensionMapping };
    }

    Object.keys(dimensions).forEach((key) => {
      const dimensionArray = dimensions[key];
      if (Array.isArray(dimensionArray) && dimensionArray.length > 0) {
        const dimension = dimensionArray[0];
        const friendlyName = key; // User-friendly name
        const backendValue = dimension.value; // Backend value

        dimensionMapping[friendlyName] = backendValue;
        console.log( dimensionMapping[friendlyName],'mpf')
        reverseDimensionMapping[backendValue] = dimension.values;
console.log( reverseDimensionMapping[backendValue],'rr')
        // Map backend value to UI options
      }
    });

    return { dimensionMapping, reverseDimensionMapping };
  };

  // Example usage




//
  // const createDimensionMappings = (dimensions) => {
  //   const dimensionMapping = {}; // Maps user-friendly names to backend values
  //   const reverseDimensionMapping = {}; // Maps backend values to user-friendly names

  //   if (!dimensions || typeof dimensions !== "object") {
  //     console.error("Invalid dimensions data", dimensions);
  //     return { dimensionMapping, reverseDimensionMapping };
  //   }

  //   Object.keys(dimensions).forEach((key) => {
  //     // Assuming dimensions[key] is an array and we're interested in the first item
  //     const dimensionArray = dimensions[key];
  //     if (Array.isArray(dimensionArray) && dimensionArray.length > 0) {
  //       const friendlyName = dimensionArray[0].value;
  //       const backendValue = dimensionArray[0].value; // Ensure this is correct as per your data structure

  //       dimensionMapping[friendlyName] = backendValue;

  //       dimensionArray[0].values.forEach((value) => {
  //         reverseDimensionMapping[value] = friendlyName;
  //       });
  //     }
  //   });

  //   return { dimensionMapping, reverseDimensionMapping };
  // };

  // Example usage
  // const mappings = createDimensionMappings(newallData.dimension);
  // console.log(mappings);

  const { dimensionMapping, reverseDimensionMapping } = createDimensionMappings(dimensions);
  console.log(dimensionMapping,'dimensionMapping')



  const formatData = () => {
    const dimension =
      selectedDimension && selectedValues.length > 0
        ? `${selectedDimension}:${selectedValues.join(' , ')}`
        : "";


    const partition = isNoneSelected
      ? "None"
      : groupByDimension && groupByValues.length > 0
      ? `${groupByDimension}:${groupByValues.join(', ')}`
      : "";

    const measure = selectedMeasure;
    const time_window_col = selectedTimeWindow;



    return {

      dimension,
      partition,
      measure,
      time_window_col,
      includeCOGS,
      topRank: topInputValue || 0, // Send 0 if no value is provided
      bottomRank: downInputValue || 0 // Send 0 if no value is provided
      // isGroupByEnabled,
    };
  };




  //   onSubmit(data);

  //   console.log("Submitting data:", data);

  //   onClose();
  // };

  // const handleSubmit = async () => {
  //   let hasError = false;

  //   // Validate dimension
  //   if (!selectedDimension) {
  //     setDimensionError("Please select a dimension.");
  //     hasError = true;
  //   } else {
  //     setDimensionError(""); // Clear error if dimension is selected
  //   }

  //   // Validate measure
  //   if (!selectedMeasure) {
  //     setMeasureError("Please select a measure.");
  //     hasError = true;
  //   } else {
  //     setMeasureError(""); // Clear error if measure is selected
  //   }

  //   // If there's any error, stop submission
  //   if (hasError) return;

  //   // Collect the selected options
  //   const data = formatData();

  //   console.log("Submitting dataaaaaaa:", data);

  //   try {
  //     // Send the data to the backend
  //     const response = await axios.post('https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/', data, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     console.log('Success Responseeeeee:', response.data);
  //     onSubmit(response.data);

  //     // Handle the response as needed (e.g., show success message)
  //   } catch (error) {
  //     console.error('Errorrrrr:', error.response?.data || error.message);


  //   }

  //   // Close the slide panel
  //   onClose();
  // };


// stingifyy

  const handleSubmit = async () => {
    let hasError = false;

    // Validate dimension
    if (!selectedDimension) {
      setDimensionError("Please select a dimension.");
      hasError = true;
    } else {
      setDimensionError(""); // Clear error if dimension is selected
    }

    // Validate measure
    if (!selectedMeasure) {
      setMeasureError("Please select a measure.");
      hasError = true;
    } else {
      setMeasureError(""); // Clear error if measure is selected
    }

    // If there's any error, stop submission
    if (hasError) return;

    const data = formatData();
    console.log(data,'dataaaaaaaa')
    // console.log('Formatted Dataaaa:', JSON.stringify(data));
    // const jsondata =JSON.stringify(data)
    // https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/
    const url = 'https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/'
    // const url = 'https://sheep-spies-organ-mid.trycloudflare.com/accounts/api/client/v1/test-api/'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
        // body: jsondata
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      onSubmit(result)
      console.log('Success Response:', result);
      // Handle success response

    } catch (error) {
      console.error('Error submitting data:', error.message);
      // Handle error response
    }
    onClose();
  };



// Assuming you have a form with an ID of 'myForm' and a submit button

  const handleDimensionChange = (event) => {
    const selectedFriendlyName = event.target.value;
    const backendValue = dimensionMapping[selectedFriendlyName];

    setSelectedDimension(selectedFriendlyName);

    // console.log("Selected Dimension Value for Backend:", backendValue);
  };
  const handleValueSelect = (value) => {
    if (value === "All") {
      // Select "All" and clear other selections
      setSelectedValues(["All"]);
    } else {
      if (selectedValues.includes("All")) {
        // If "All" was selected, replace with the new selection
        setSelectedValues([value]);
      } else {
        setSelectedValues((prev) =>
          prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
      }
    }
  };

  //
  const getOptions = (dimension) => {
    const dimensionKey = dimensionMapping[dimension];
    if (!dimensionKey) {
      return [];
    }
    const dimensionData = dimensions[dimensionKey];
    console.log(dimensionData, "dd");
    return dimensionData && dimensionData.length > 0 ? dimensionData[0].values : [];
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
    console.log(value)
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
    // const value = parseInt(e.target.value);
    const value = parseInt(e.target.value, 10); // Always specify the radix (base 10)


    // console.log(typeof value, 'typeeeee')
    setTopInputValue(value);
    if (parseInt(value, 10) <= 0 && value !== "") {
      setTopError("Please enter a value greater than 0");
    } else {
      setTopError("");
    }
  };

  const handleDownInputChange = (e) => {
    const value = e.target.value;
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
      {/* <Grid item xs={12} md={7}>
        <Box
          style={{
            backgroundColor: "transparent",
            minHeight: "400px",
            boxShadow: "1px 2px 2px 1px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            padding: "8px",
          }}
        >
          <h1>HII</h1>
        </Box>
      </Grid> */}
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
          }}
        >
          <Box style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <Button variant="contained" color="primary" style={{ width: "auto", padding: "2 2" }}>
              New
            </Button>
          </Box>

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

                          {Object.keys(dimensionMapping).map((friendlyName) => (
                            <MenuItem
                              key={dimensionMapping[friendlyName]}
                              value={dimensionMapping[friendlyName]}
                            >
                              {friendlyName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {dimensionError && <div className="error">{dimensionError}</div>}


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

                                  {getOptions(selectedDimension)
                                    .filter((val) => val !== null) // Filter out 'null'
                                    .filter((val) =>
                                      val.toLowerCase().includes(searchValue.toLowerCase())
                                    ) // Apply search filter
                                    .map(
                                      (value, index) =>
                                        value !== "All" && ( // Exclude 'All' option
                                          <MenuItem
                                            key={index}
                                            value={value}
                                            onClick={() => handleValueSelect(value)}
                                          >
                                            <Checkbox checked={selectedValues.includes(value)} />
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
                            {/* <Typography variant="h6" sx={{ marginBottom: "8px", fontWeight: "bold" }}>
                            Time Window:
                          </Typography> */}
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
                  </Grid>
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
                    {measureError && <div className="error">{measureError}</div>}

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

                {/* group by */}
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
                    {groupByValues.length > 0 && (
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
                      </Grid>
                    )}

                    <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                      Select group by
                    </Typography>

                    <FormControlLabel
                      control={
                        <Checkbox checked={isNoneSelected} onChange={handleGroupByCheckboxChange} />
                      }
                      label="None"
                      sx={{ marginBottom: "16px" }}
                    />
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel id="group-by-select-label">Group By</InputLabel>
                      <Select
                        labelId="group-by-select-label"
                        id="group-by-select"
                        value={groupByDimension}
                        onChange={handleGroupByChange}
                        label="Group By"
                        disabled={!selectedDimension}
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
                                width: "170px", // Default width
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                overflowY: "auto",
                                overflowX: "auto",
                                maxHeight: "200px", // Default max height
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
                                  .filter((val) => val !== null) // Filter out 'null'
                                  .filter((val) =>
                                    val.toLowerCase().includes(searchValueGroupBy.toLowerCase())
                                  ) // Apply search filter
                                  .map(
                                    (value, index) =>
                                      value !== "All" && ( // Exclude 'All' option
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
                  </Box>
                </Grid> */}
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
                    {/* Checkbox for selecting 'None' */}
                    {/* <FormControlLabel
                      control={
                        <Checkbox checked={isNoneSelected} onChange={handleGroupByCheckboxChange} />
                      }
                      label="None"
                      sx={{ marginBottom: "16px" }}
                    /> */}
                    <FormControlLabel
  control={
    <Tooltip  title={isNoneSelected ? "If you want to group by, please uncheck" : "If you don't want group, please check"}>
      <Checkbox checked={isNoneSelected} onChange={handleGroupByCheckboxChange} />
    </Tooltip>
  }
  label="None"
  sx={{ marginBottom: '16px' }}
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

          <Grid container justifyContent="center" style={{ marginTop: "15px" }}>
            <Button variant="contained" color="secondary" onClick={handleSubmit}>
              Render Visual
            </Button>
          </Grid>
          <div>
            {/* Your form components go here */}

            {/* <button onClick={handleCheckValues}>Check Values</button> */}
          </div>
        </Box>
      </Grid>
    </Grid>
  );
};

DataVisualization.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DataVisualization;
