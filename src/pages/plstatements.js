import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DashboardLayout } from "src/components/dashboard-layout";

const getPLUrl =
  "https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/P%26L-Dropdown-New.json";
// const postPLUrl = "https://upt2oqihzc5nw7urbslfops6qe0dvftz.lambda-url.ap-south-1.on.aws/";
const postPLUrl = "https://xu2iufbhz0.execute-api.ap-south-1.amazonaws.com/dev/profit-and-loss";
const ProfitLossTable = () => {
  const [data, setData] = useState({ Branch: [], "Year/Month": [] });
  const [selectedYearMonth, setSelectedYearMonth] = useState("2024-01"); // Default to January 2024
  const [selectedBranch, setSelectedBranch] = useState("All"); // Default to "All" branch
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null);
  const [branchAnchorEl, setBranchAnchorEl] = useState(null);
  const [yearMonthAnchorEl, setYearMonthAnchorEl] = useState(null);

  const [responseData, setResponseData] = useState([]);

  // Fetch the initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getPLUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
        // setLoading(false);
      } catch (error) {
        setError(error.message);
        // setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Send request based on selected branch and Year/Month
  // useEffect(() => {
  //   const sendRequest = async () => {
  //     const payload = {
  //       branch: selectedBranch,
  //       "Year/Month": selectedYearMonth,
  //     };

  //     // console.log("Payload:", payload);

  //     try {
  //       const response = await axios.post(postPLUrl, payload);
  //       setResponseData(response.data);
  //       // console.log("Response:", response.data);
  //     } catch (error) {
  //       console.error(
  //         "Error sending request:",
  //         error.response ? error.response.data : error.message
  //       );
  //     }
  //   };

  //   if (selectedBranch && selectedYearMonth) {
  //     sendRequest();
  //   }
  // }, [selectedBranch, selectedYearMonth]);

  useEffect(() => {
    const sendRequest = async () => {
      const payload = {
        branch: selectedBranch,
        "Year/Month": selectedYearMonth,
      };

      const token = sessionStorage.getItem("Access_Token");

      if (!token) {
        console.error("Access Token is missing");
        return;
      }
      console.log("Using Access Token:", token);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Replace `yourBearerToken` with the actual token
          },
        };
        console.log("Payload:", payload);
        console.log("Post URL:", postPLUrl);
        const response = await axios.post(postPLUrl, payload, config);
        console.log("Response:", response);
        setResponseData(response.data);
      } catch (error) {
        console.error(
          "Error sending request:",
          error.response ? error.response.data : error.message
        );
      }
    };

    if (selectedBranch && selectedYearMonth) {
      sendRequest();
    }
  }, [selectedBranch, selectedYearMonth]);

  // Branch and Year/Month dropdown handlers
  const handleBranchMenuOpen = (event) => {
    setBranchAnchorEl(event.currentTarget);
  };

  const handleBranchMenuClose = () => {
    setBranchAnchorEl(null);
  };

  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    handleBranchMenuClose();
  };

  const handleYearMonthMenuOpen = (event) => {
    setYearMonthAnchorEl(event.currentTarget);
  };

  const handleYearMonthMenuClose = () => {
    setYearMonthAnchorEl(null);
  };

  const handleSelectYearMonth = (key) => {
    setSelectedYearMonth(key);
    handleYearMonthMenuClose();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Prepare options for Branch dropdown
  const branchOptions = data.Branch.length > 0 ? data.Branch[0].values : [];

  // Prepare options for Year/Month dropdown
  const yearMonthValues = data["Year/Month"].length > 0 ? data["Year/Month"][0].values : {};
  const yearMonthOptions = Object.entries(yearMonthValues);

  const selectedYearMonthDisplay =
    yearMonthOptions.find(([key]) => key === selectedYearMonth)?.[1] || "";

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "90%",
        margin: "auto",
        mt: 4,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Custom shadow
      }}
    >
      <Typography
        variant="h5"
        sx={{ padding: 2, textAlign: "left", color: "rgba(25, 127, 192)", fontSize: "25px" }}
      >
        PROFIT AND LOSS STATEMENT
      </Typography>

      <div style={{ padding: 2 }}>
        <Typography
          variant="h6"
          sx={{
            textAlign: "left",
            paddingLeft: 2,
            fontWeight: "bold",
            fontSize: "17px",
            color: "black",
          }}
        >
          THE THICKSHAKE FACTORY
        </Typography>

        {/* Year/Month Dropdown */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ paddingLeft: 2, fontWeight: "bold" }} variant="body1">
            MONTH/YEAR - {selectedYearMonthDisplay}
          </Typography>
          <IconButton onClick={handleYearMonthMenuOpen}>
            <ArrowDropDownIcon />
          </IconButton>
          <Menu
            anchorEl={yearMonthAnchorEl}
            open={Boolean(yearMonthAnchorEl)}
            onClose={handleYearMonthMenuClose}
          >
            {yearMonthOptions.map(([key, value]) => (
              <MenuItem key={key} onClick={() => handleSelectYearMonth(key)}>
                {value}
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* Branch Dropdown */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ paddingLeft: 2, fontWeight: "bold" }} variant="body1">
            BRANCH - {selectedBranch}
          </Typography>
          <IconButton onClick={handleBranchMenuOpen}>
            <ArrowDropDownIcon />
          </IconButton>
          <Menu
            anchorEl={branchAnchorEl}
            open={Boolean(branchAnchorEl)}
            onClose={handleBranchMenuClose}
          >
            {branchOptions.map((branch, index) => (
              <MenuItem key={index} onClick={() => handleSelectBranch(branch)}>
                {branch}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white" }}
            >
              Total
            </TableCell>
            <TableCell align="right">Percentage (%)</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell
              colSpan={5}
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: "rgba(25, 127, 192,0.18)",
                padding: "5px",
                paddingLeft: "14px",
                fontSize: "13px",
              }}
            >
              Revenue
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ padding: "4px 8px", fontSize: "14px" }}></TableCell>
            <TableCell sx={{ padding: "4px 8px", fontSize: "14px" }}>Gross Amount</TableCell>
            <TableCell sx={{ padding: "4px 8px", fontSize: "14px" }} align="right">
              {responseData.Gross_Amount}
            </TableCell>
            <TableCell
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {`100%`}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ padding: "4px 8px" }}></TableCell>
            <TableCell sx={{ padding: "4px 8px", fontSize: "14px" }}>Discounts</TableCell>
            <TableCell align="right" sx={{ padding: "4px 8px", fontSize: "14px" }}>
              {responseData.Discounts}
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: "rgba(25, 127, 192, 0.6)",
                color: "white",
                padding: "4px 8px", // Consistent reduced padding
              }}
            ></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ padding: "4px 8px" }}></TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                padding: "4px 8px",
                fontSize: "14px",
              }}
            >
              Net Sales
            </TableCell>
            <TableCell sx={{ padding: "4px 8px" }}></TableCell>
            <TableCell
              align="right"
              sx={{
                backgroundColor: "rgba(25, 127, 192,0.6)",
                color: "white",
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              {responseData.Net_Sales}
            </TableCell>
          </TableRow>

          {/* COGS Category */}

          <TableRow>
            <TableCell
              colSpan={5}
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: "rgba(25, 127, 192,0.18)",
                padding: "5px 0 5px 14px",
                fontSize: "13px",
              }}
            >
              COGS
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell rowSpan={3} sx={{ padding: "4px 8px", fontSize: "14px" }}></TableCell>{" "}
            {/* COGS Category Header */}
            <TableCell sx={{ padding: "4px 8px", fontSize: "14px" }}>
              Material Consumption
            </TableCell>
            <TableCell sx={{ padding: "4px 8px", fontSize: "14px" }} align="right">
              {responseData.Material_Consumption}
            </TableCell>
            <TableCell
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ padding: "4px 8px", fontSize: "14px" }}>Cost of Goods Sold</TableCell>
            <TableCell sx={{ padding: "4px 8px", fontSize: "14px" }}></TableCell>

            <TableCell
              align="right"
              sx={{
                backgroundColor: "rgba(25, 127, 192,0.6)",
                color: "white",
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              {responseData.Cogs}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >{`${responseData.Cogs_Percentage}%`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Gross Profit
            </TableCell>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            ></TableCell>
            <TableCell
              align="right"
              sx={{
                backgroundColor: "rgba(25, 127, 192,0.6)",
                color: "white",
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              {responseData.Gross_Profit}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              colSpan={5}
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: "rgba(25, 127, 192,0.18)",
                padding: "5px 0 5px 14px",
                fontSize: "13px",
              }}
            >
              Expenses
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              rowSpan={7}
              sx={{
                padding: "4px 8px",
              }}
            ></TableCell>{" "}
            {/* COGS Category Header */}
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Online Expenses
            </TableCell>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {responseData.Online_Expenses}
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Revenue Share
            </TableCell>

            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {responseData.Revenue_Share}
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Power
            </TableCell>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {responseData.Power}
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Rent
            </TableCell>
            {/* <TableCell></TableCell> */}
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {responseData.Rent}
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Salaries
            </TableCell>
            {/* <TableCell></TableCell> */}
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {responseData.Salaries}
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Outlet
            </TableCell>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {responseData.Outlet}
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Total Expenses
            </TableCell>
            <TableCell
              sx={{
                padding: "4px 8px",
              }}
            ></TableCell>
            <TableCell
              align="right"
              sx={{
                backgroundColor: "rgba(25, 127, 192,0.6)",
                color: "white",
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              {responseData.Total_Expenses}
            </TableCell>

            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {`${responseData.Expense_Percentage}%`}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              colSpan={5}
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: "rgba(25, 127, 192,0.18)",
                padding: "5px 0 5px 14px",
                fontSize: "13px",
              }}
            >
              Net Profit
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              rowSpan={4}
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            ></TableCell>{" "}
            {/* COGS Category Header */}
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Gross Profit
            </TableCell>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {responseData.Gross_Profit}
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
            >
              Total Expenses
            </TableCell>

            <TableCell
              sx={{
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {responseData.Total_Expenses}
            </TableCell>
            <TableCell
              align="right"
              sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white", padding: "4px 8px" }}
            ></TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                padding: "4px 8px",
                fontSize: "14px",
              }}
            >
              Net Profit/Loss
            </TableCell>
            <TableCell></TableCell>
            <TableCell
              align="right"
              sx={{
                backgroundColor: "rgba(25, 127, 192,0.6)",
                color: "white",
                padding: "4px 8px",
                fontSize: "14px",
              }}
            >
              {responseData.Net_Profit}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                fontSize: "14px",
                padding: "4px 8px",
              }}
              align="right"
            >
              {`${responseData.Net_Profit_Percentage}%`}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PLTemplate = () => {
  return (
    <div>
      <ProfitLossTable />
    </div>
  );
};

PLTemplate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PLTemplate;
