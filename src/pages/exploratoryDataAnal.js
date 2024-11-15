const edaDropdown = ["Region", "Franchise", "Order Source", "Category"];
const edaPostURL = "https://37766csovpr64takaxyzdpitwu0emhdt.lambda-url.ap-south-1.on.aws/";

import React, { useState, useEffect } from "react";
import { Grid, Box, Button, Tooltip, TextField, Slide, Autocomplete } from "@mui/material";
import { DashboardLayout } from "src/components/dashboard-layout";

import EDABarChart from "src/components/charts/EDABarChart";

const ExploratoryDataAnal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Region");
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [chartData, setChartData] = useState(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const lightenColor = (color, factor = 0.2) => {
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    r = Math.min(255, r + factor * 255);
    g = Math.min(255, g + factor * 255);
    b = Math.min(255, b + factor * 255);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const generateShades = (baseColor, numShades = 20) => {
    const shades = [];
    for (let i = 0; i < numShades; i++) {
      const factor = i / (numShades - 1);
      shades.push(lightenColor(baseColor, factor));
    }
    return shades;
  };

  const baseColor = "#0059b3";
  const lighterShades = generateShades(baseColor, 40);

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert("Please select an option first!");
      return;
    }

    setLoading(true);
    console.log("Selected Option:", selectedOption);

    try {
      const payload = {
        column: selectedOption,
      };

      const response = await fetch(edaPostURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setResponseData(data);
      console.log("Response Data:", data);

      const keys = Object.keys(data[0]);
      console.log("Response Keys:", keys);

      if (keys.length < 2) {
        throw new Error("Response does not contain the expected keys (labels, data).");
      }

      const labelKey = keys[0];
      const dataKey = keys[1];

      const labels = data.map((item) => item[labelKey]);
      const responseDataValues = data.map((item) => item[dataKey]);

      console.log("Labels:", labels);
      console.log("Data:", responseDataValues);

      if (!Array.isArray(labels) || !Array.isArray(responseDataValues)) {
        throw new Error("Labels and data should be arrays.");
      }

      setChartData({
        labels,
        datasets: [
          {
            label: selectedOption,
            data: responseDataValues,
            // backgroundColor: "#004792",
            backgroundColor: lighterShades,
            borderColor: lighterShades,
            borderWidth: 1,
          },
        ],
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Error fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <Grid container spacing={2}>
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

      {/* <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
        <Box sx={{ flexGrow: 1, boxShadow: 5, p: 2, backgroundColor: "#fff" }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={edaDropdown}
                value={selectedOption}
                onChange={(event, newValue) => {
                  setSelectedOption(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Option" variant="outlined" />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                getOptionLabel={(option) => option}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
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
            {loading ? "Loading..." : "Submit"}
          </Button>
        </Box>
      </Slide> */}
      <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            flexGrow: 1,
            boxShadow: 5,
            p: 2,
            backgroundColor: "#fff",
            minWidth: 300,
            width: 300,
            position: "absolute",
            right: 27,
            top: 130,
            zIndex: 1200,
          }}
        >
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Autocomplete
                options={edaDropdown}
                value={selectedOption}
                onChange={(event, newValue) => {
                  setSelectedOption(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Option" variant="outlined" />
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option) =>
                    option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                getOptionLabel={(option) => option}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
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
            {loading ? "Loading..." : "Submit"}
          </Button>
        </Box>
      </Slide>

      {chartData && !loading && (
        <Grid container spacing={2} style={{ marginTop: "1%", marginLeft: "1%" }}>
          <Grid item xs={12}>
            <div
              style={{
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <EDABarChart chartData={chartData} />
            </div>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

ExploratoryDataAnal.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default ExploratoryDataAnal;
