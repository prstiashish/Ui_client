// import React, { useEffect, useState, useMemo } from "react";
// import { DashboardLayout } from "src/components/dashboard-layout";
// import BarChart from "src/components/charts/BarChart";
// import dynamic from "next/dynamic";
// import axios from "axios";
// import { useRouter } from "next/router";
// import CloseIcon from "@mui/icons-material/Close";

// import {
//   Grid,
//   InputLabel,
//   Select,
//   MenuItem,
//   Card,
//   CardContent,
//   Typography,
//   Tooltip,
//   Button,
//   Drawer,
//   IconButton,
//   Box,
//   FormControl,
//   CircularProgress,
// } from "@mui/material";
// import { topTrendDimensions } from "src/components/charts/ThickShakeInfo";
// import StackedBarChart from "src/components/charts/StackedBarChart";
// import { GetAuthToken } from "src/components/charts/AuthDetails";
// import { GetSchema } from "src/components/charts/AuthDetails";
// import { GetTokenExpiredTime, GetRefreshToken, baseURLs } from "src/components/charts/AuthDetails";

// const TopSalesVisualization = ({  }) => {
//   const [dimension, setDimension] = useState("Brand"); // Default dimension
//   const [toplimit, setTopLimit] = useState(10); // Default top limit
//   const [loading, setLoading] = useState(false);
//   const [isSlideOpen, setIsSlideOpen] = useState(false);

//   const [chartData, setChartData] = useState(null);

//   // const [chartData, setChartData] = useState({
//   //   labels: [],
//   //   datasets: [
//   //     {
//   //       label: "Brand Sales",
//   //       data: [],
//   //     },
//   //   ],
//   // });




//   const handleCreateClick = () => {
//     setIsSlideOpen(true);
//   };

//   const handleCloseSlide = () => {
//     setIsSlideOpen(false);
//   };

//   const handelDimension = (event) => {
//     setDimension(event.target.value);
//   };



//  const handelTopLimit = (event) => {
//     setTopLimit(event.target.value);
//   };


//   // // myyyyyyyyyyyyyyyyyyyy



//   const dataUrl = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";




//   const defaultPayload = {
//     dimension: `${dimension}:All`,
//     view: "top-trends",
//     topRank: toplimit,
//   };

//   useEffect(() => {
//     // Fetch default data when the component mounts
//     const fetchData = async () => {
//       try {
//         const response = await axios.post(dataUrl, defaultPayload); // POST request with default payload
//         const data = response.data;
//         console.log("Fetched data:", data);
//         setChartData(data); // Update the chartData state with the fetched data
//         setLoading(false); // Set loading to false after data is fetched
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData(); // Call the fetchData function when the component mounts
//   }, []); // Empty dependency array ensures this runs only once when the component mounts

//   // Function to handle data fetching based on user selection
//   const handleFetchData = async () => {
//     setLoading(true);
//     const payload = {
//       dimension: `${dimension}:All`,
//       view: "top-trends",
//       topRank: toplimit,
//     };
//     try {
//       const response = await axios.post(dataUrl, payload); // POST request with user-selected payload
//       const data = response.data;
//       console.log("Fetched data222222:", data);
//       setChartData(data); // Update the chartData state with the fetched data
//       setLoading(false); // Set loading to false after data is fetched
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   const handleSubmit = () => {
//     handleFetchData(); // Fetch data based on the current user selection
//   };
//   // Update dimension and fetch data when it changes
//   const handleDimensionChange = (event) => {
//     setDimension(event.target.value);
//   };

//   // Update top limit and fetch data when it changes
//   const handleTopLimitChange = (event) => {
//     setTopLimit(event.target.value);
//   };

//   return (
//     <>
//       <div>
//         <Grid item xs={12} md={12} style={{ display: "flex", justifyContent: "flex-end" }}>
//           <Tooltip title="Create new graph" arrow>
//             <Button
//               variant="contained"
//               onClick={handleCreateClick}
//               style={{
//                 fontSize: "14px",
//                 marginBottom: "1%",
//                 backgroundColor: "#004792",
//                 boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
//                 color: "#fff",
//                 borderColor: "#b366ff",
//               }}
//             >
//               Query
//             </Button>
//           </Tooltip>
//         </Grid>

//         {/* Slide-Out Panel */}
//         <Drawer anchor="right" open={isSlideOpen} onClose={handleCloseSlide}>
//           <div style={{ width: "300px", padding: "20px" }}>
//             <IconButton
//               onClick={handleCloseSlide}
//               sx={{ position: "absolute", top: "16px", right: "16px" }}
//             >
//               <CloseIcon />
//             </IconButton>
//             <Grid item xs={12}>
//               <Box
//                 sx={{
//                   padding: "18px",
//                   borderRadius: "5px",
//                   border: "1px solid #dcdcdc",
//                   backgroundColor: "#f9f9f9",
//                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                   marginTop: "50px",
//                 }}
//               >
//                 <Typography variant="h6" sx={{ marginBottom: "8px" }}>
//                   Select Dimension
//                 </Typography>

//                 <FormControl fullWidth>
//                   <InputLabel>Dimension</InputLabel>
//                   <Select
//                      value={dimension}
//                      onChange={(e) => setDimension(e.target.value)}
//                 label="Dimension"
//                   >
//                      <MenuItem value="Brand">Brand</MenuItem>
//                 <MenuItem value="Franchise_Type">Franchise Type</MenuItem>
//                 <MenuItem value="Region">Region</MenuItem>
//                 <MenuItem value="Branch">Branch</MenuItem>
//                 <MenuItem value="Channel">Channel</MenuItem>
//                 <MenuItem value="Category">Category</MenuItem>
//                 <MenuItem value="Subcategory">Subcategory</MenuItem>
//                 <MenuItem value="Product">Product</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>
//             </Grid>
//             <Grid item xs={12}>
//               <Box
//                 sx={{
//                   padding: "18px",
//                   borderRadius: "5px",
//                   border: "1px solid #dcdcdc",
//                   backgroundColor: "#f9f9f9",
//                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                   marginTop: "50px",
//                 }}
//               >
//                 <Typography variant="h6" sx={{ marginBottom: "8px" }}>
//                   Top Trend
//                 </Typography>

//                 <FormControl fullWidth>
//                   <InputLabel>Top</InputLabel>
//                   <Select
//                     value={toplimit}
//                     onChange={(e) => setTopLimit(e.target.value)}
//                     label="Top"
//                     // style={{ outline: "1px solid #c7c8ca" }}
//                   >
//                     <MenuItem value={0}>Select</MenuItem>
//                     <MenuItem value={10}>Top 10</MenuItem>
//                     <MenuItem value={15}>Top 15</MenuItem>
//                     <MenuItem value={30}>Top 30</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>
//             </Grid>
//             <Grid container justifyContent="center" style={{ marginTop: "15px" }}>
//             <Button
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={loading}
//               startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
//               style={{
//                 backgroundColor: loading ? "#d6f5d6" : "#267326", // Darker green when loading, default green
//                 color: loading ? "black" : "white", // White text color
//                 // borderColor: loading ? '#006622' : '#009933', // Darker border color when loading, default green
//                 "&:hover": {
//                   backgroundColor: loading ? "#d6f5d6" : "#267326", // Even darker green when loading, lighter green on hover
//                 },
//               }}
//             >
//               {loading ? "Loading..." : "Render Visual"}
//             </Button>
//           </Grid>
//           </div>
//         </Drawer>
//       </div>


//       <Grid container spacing={1} style={{ marginTop: "1%", width: "100%" }}>
//         <Grid item xs={12} md>
//           <div
//             style={{
//               boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//               borderRadius: "5px",
//               overflow: "hidden",
//               height: "100%",
//               paddingRight: "12px",
//               paddingTop: 10,
//               paddingBottom: 10,
//             }}
//           >
//             {/* <BarChart chartData={chartData} title="Top Trend Visualization" /> */}
//           </div>
//         </Grid>
//       </Grid>

//     </>
//   );
// };
// TopSalesVisualization.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// export default TopSalesVisualization;

import React, { useState, useEffect } from "react";
import BarChart from "src/components/charts/BarChart";
import { DashboardLayout } from "src/components/dashboard-layout";

import axios from "axios";
import { Button, Grid, CircularProgress, Drawer, Box, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const MyComponent = () => {
  const [dimension, setDimension] = useState("Branch");
  const [toplimit, setTopLimit] = useState(15);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Brand Sales",
        data: [],
        backgroundColor: "#004792", // Example color
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [isSlideOpen, setIsSlideOpen] = useState(false);

  const dataUrl = "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/"; // Replace with your API endpoint

  // Function to fetch data from API
  const fetchData = async (payload) => {
    try {
      const response = await axios.post(dataUrl, payload);
      const data = response.data;

      // Process the response to extract labels and sales data
      const labels = data.map(item => item[dimension]);
      const salesData = data.map(item => item.Total_Sales);

      // Update the chart data
      const newChartData = {
        labels: labels, // Set labels dynamically
        datasets: [
          {
            label: `${dimension} Sales`, // Update the label dynamically
            data: salesData, // Set data dynamically
            backgroundColor: "#004792", // Example color, you can make this dynamic too
          },
        ],
      };

      setChartData(newChartData); // Update the chartData state with the new data
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Initial fetch of default data on component mount
  useEffect(() => {
    const defaultPayload = {
      dimension: `${dimension}:All`,
      view: "top-trends",
      topRank: toplimit,
    };
    fetchData(defaultPayload);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Function to handle data fetching based on user selection
  const handleFetchData = () => {
    // setLoading(true);
    const payload = {
      dimension: `${dimension}:All`,
      view: "top-trends",
      topRank: toplimit,
    };
    fetchData(payload);
  };

  // Function to handle submit button click
  const handleSubmit = () => {
    handleFetchData(); // Fetch data based on the current user selection
    setIsSlideOpen(false);
  };

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
      <div
        style={{
          marginBottom: "0px",
          fontWeight: "bold",
          padding: "0px",
          fontSize: "15px",
          marginTop: "10px",
          fontFamily: "-moz-initial",
        }}
      >
        {`Sales Performance by ${dimension}`}
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
                  <MenuItem value="Subcategory">Subcategory</MenuItem>
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
                <Select
                  value={toplimit}
                  onChange={(e) => setTopLimit(e.target.value)}
                  label="Top"
                >
                  <MenuItem value={10}>Top 10</MenuItem>
                  <MenuItem value={15}>Top 15</MenuItem>
                  <MenuItem value={30}>Top 30</MenuItem>
                </Select>
              </FormControl>
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
                  // backgroundColor: loading ? "#d6f5d6" : "#267326",
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
              <BarChart chartData={chartData} title="Top Trend Visualization" />
            {/* )} */}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
MyComponent.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MyComponent;
