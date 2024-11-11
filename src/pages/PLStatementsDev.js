// import React from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
// import { DashboardLayout } from "src/components/dashboard-layout";

// // Sample P/L data
// const samplePLData = {
//   gmv: 120000, // Gross Merchandise Value
//   discounts: 20000, // Discounts
//   netSales: 100000, // GMV - Discounts = Net Sales
//   cogs: 40000, // Cost of Goods Sold
//   grossProfit: 60000, // Net Sales - COGS = Gross Profit
//   operatingExpenses: 20000, // Operating Expenses
//   netProfit: 40000, // Gross Profit - Operating Expenses = Net Profit
//   tax: 5000, // Tax
//   netIncome: 35000, // Net Profit - Tax = Net Income
// };

// const ProfitLossStatement = ({ data }) => {
//   return (
//     <TableContainer component={Paper} sx={{ width: '80%', margin: 'auto', mt: 4 }}>
//       <Typography variant="h5" sx={{ padding: 2, textAlign: 'center' }}>
//         Profit and Loss Statement
//       </Typography>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Category</TableCell>
//             <TableCell align="right">Amount (USD)</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           <TableRow>
//             <TableCell>Gross Merchandise Value (GMV)</TableCell>
//             <TableCell align="right">{data.gmv.toLocaleString()}</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell>Less: Discounts</TableCell>
//             <TableCell align="right">({data.discounts.toLocaleString()})</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell><strong>Net Sales</strong></TableCell>
//             <TableCell align="right"><strong>{data.netSales.toLocaleString()}</strong></TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell>Cost of Goods Sold (COGS)</TableCell>
//             <TableCell align="right">{data.cogs.toLocaleString()}</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell>Gross Profit</TableCell>
//             <TableCell align="right">{data.grossProfit.toLocaleString()}</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell>Operating Expenses</TableCell>
//             <TableCell align="right">{data.operatingExpenses.toLocaleString()}</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell>Net Profit</TableCell>
//             <TableCell align="right">{data.netProfit.toLocaleString()}</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell>Tax</TableCell>
//             <TableCell align="right">{data.tax.toLocaleString()}</TableCell>
//           </TableRow>
//           <TableRow>
//             <TableCell><strong>Net Income</strong></TableCell>
//             <TableCell align="right"><strong>{data.netIncome.toLocaleString()}</strong></TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// const PLTemplate = () => {
//   return (
//     <div>
//       <ProfitLossStatement data={samplePLData} />
//     </div>
//   );
// };

// PLTemplate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// export default PLTemplate;

// import React from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
// import { DashboardLayout } from "src/components/dashboard-layout";

// // Sample P/L data with GMV and Discounts
// const samplePLData = {
//   gmv: 120000, // Gross Merchandise Value
//   discounts: 20000, // Discounts
//   netSales: 100000, // GMV - Discounts = Net Sales
//   cogs: 40000, // Cost of Goods Sold
//   grossProfit: 60000, // Net Sales - COGS = Gross Profit
//   operatingExpenses: 20000, // Operating Expenses
//   netProfit: 40000, // Gross Profit - Operating Expenses = Net Profit
//   tax: 5000, // Tax
//   netIncome: 35000, // Net Profit - Tax = Net Income
// };

// const calculatePercentage = (value, total) => ((value / total) * 100).toFixed(2);

// const ProfitLossStatement = ({ data }) => {
//   let runningTotal = data.gmv; // Start with GMV as the total for the first row

//   return (
//     <TableContainer component={Paper} sx={{ width: '90%', margin: 'auto', mt: 4 }}>
//       <Typography variant="h5" sx={{ padding: 2, textAlign: 'left' }}>
//         Profit and Loss Statement
//       </Typography>
//       <Typography variant="h6" sx={{ padding: 2, textAlign: 'left' }}>
//         THE THICKSHAKE FACTORY<br></br>
//         MONTH/YEAR - MAY 2024<br></br>
//         BRANCH - 1401 Syala Hyderabad
//       </Typography>

//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Category</TableCell>
//             {/* Amount (USD) */}
//             <TableCell align="right"></TableCell>
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)"  }}>Total</TableCell>
//             <TableCell align="right">Percentage (%)</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {/* GMV */}
//           <TableRow>
//             <TableCell>Gross Merchandise Value (GMV)</TableCell>
//             <TableCell align="right">{data.gmv.toLocaleString()}</TableCell>
//             {/* {runningTotal.toLocaleString()} */}
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)"  }}></TableCell>
//             <TableCell align="right">{calculatePercentage(data.gmv, data.gmv)}%</TableCell>
//           </TableRow>

//           {/* Discounts */}
//           <TableRow>
//             <TableCell>Less: Discounts</TableCell>
//             <TableCell align="right">({data.discounts.toLocaleString()})</TableCell>
//             {/* {(runningTotal -= data.discounts).toLocaleString()} */}
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)"  }}></TableCell>
//             <TableCell align="right">({calculatePercentage(data.discounts, data.gmv)}%)</TableCell>
//           </TableRow>

//           {/* Net Sales */}
//           <TableRow>
//             <TableCell><strong>Net Sales</strong></TableCell>
//             <TableCell align="right"><strong></strong></TableCell>
//             {/* {runningTotal.toLocaleString()} */}
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)"  }}><strong>{data.netSales.toLocaleString()}</strong></TableCell>
//             <TableCell align="right"><strong>{calculatePercentage(data.netSales, data.gmv)}%</strong></TableCell>
//           </TableRow>

//           {/* COGS */}
//           <TableRow>
//             <TableCell>Cost of Goods Sold (COGS)</TableCell>
//             <TableCell align="right">{data.cogs.toLocaleString()}</TableCell>
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)"  }}>{(runningTotal -= data.cogs).toLocaleString()}</TableCell>
//             <TableCell align="right">{calculatePercentage(data.cogs, data.gmv)}%</TableCell>
//           </TableRow>

//           {/* Gross Profit */}
//           <TableRow>
//             <TableCell>Gross Profit</TableCell>
//             <TableCell align="right">{data.grossProfit.toLocaleString()}</TableCell>
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)"  }}>{runningTotal.toLocaleString()}</TableCell>
//             <TableCell align="right">{calculatePercentage(data.grossProfit, data.gmv)}%</TableCell>
//           </TableRow>

//           {/* Operating Expenses */}
//           <TableRow>
//             <TableCell>Operating Expenses</TableCell>
//             <TableCell align="right">{data.operatingExpenses.toLocaleString()}</TableCell>
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)"  }}>{(runningTotal -= data.operatingExpenses).toLocaleString()}</TableCell>
//             <TableCell align="right">{calculatePercentage(data.operatingExpenses, data.gmv)}%</TableCell>
//           </TableRow>

//           {/* Net Profit */}
//           <TableRow>
//             <TableCell>Net Profit</TableCell>
//             <TableCell align="right">{data.netProfit.toLocaleString()}</TableCell>
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)"  }}>{runningTotal.toLocaleString()}</TableCell>
//             <TableCell align="right">{calculatePercentage(data.netProfit, data.gmv)}%</TableCell>
//           </TableRow>

//           {/* Tax */}
//           <TableRow>
//             <TableCell>Tax</TableCell>
//             <TableCell align="right">{data.tax.toLocaleString()}</TableCell>
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)"  }}>{(runningTotal -= data.tax).toLocaleString()}</TableCell>
//             <TableCell align="right">{calculatePercentage(data.tax, data.gmv)}%</TableCell>
//           </TableRow>

//           {/* Net Income */}
//           <TableRow>
//             <TableCell><strong>Net Income</strong></TableCell>
//             <TableCell align="right"><strong>{data.netIncome.toLocaleString()}</strong></TableCell>
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)" }}><strong>{runningTotal.toLocaleString()}</strong></TableCell>
//             <TableCell align="right"><strong>{calculatePercentage(data.netIncome, data.gmv)}%</strong></TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// const PLTemplate = () => {
//   return (
//     <div>
//       <ProfitLossStatement data={samplePLData} />
//     </div>
//   );
// };
// PLTemplate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// export default PLTemplate;

// allll

import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import { DashboardLayout } from "src/components/dashboard-layout";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";

// const plData = {
//   categories: [
//     {
//       category: "Revenue",
//       items: [
//         { name: "Gross Merchandise Value (GMV)", amount: 120000, total: '', percentage: "100%" },
//         { name: "Discounts", amount: -20000, total: '', percentage: "-16.67%" },
//         { name: "Net Sales", amount: '', total: 100000, percentage: "83.33%" }
//       ]
//     },
//     {
//       category: "Cost of Goods Sold",
//       items: [
//         { name: "Material Consumption", amount: 40000, total: '', percentage: "33.33%" },
//         { name: "Cost of Goods Sold", amount: '', total: 40000, percentage: "33.33%" },
//         { name: "Gross Profit", amount: '', total: 60000, percentage: "33.33%" }

//       ]
//     },
//     {
//       category: "Expenses",
//       items: [
//         { name: "Online Expenses", amount: 10000, total: '', percentage: "8.33%" },
//         { name: "Revenue Share", amount: 5000, total: '', percentage: "4.17%" },
//         { name: "Power", amount: 5000, total: '', percentage: "4.17%" },
//         { name: "Total Expenses", amount: '', total: 20000, percentage: "4.17%" }
//       ]
//     },
//     {
//       category: "Net Profit",
//       items: [
//         { name: "Gross Profit", amount: 60000, total: '', percentage: "50%" },
//         { name: "Total Expenses", amount: 20000, total: '', percentage: "4.17%" },
//         { name: "Net Profit", amount: '', total: 40000, percentage: "33.33%" }
//       ]
//     }
//   ]
// };

const plData = {
  categories: [
    {
      category: "Revenue",
      items: [
        { name: "Gross Merchandise Value (GMV)", amount: 120000, percentage: "100%" },
        { name: "Discounts", amount: -20000, percentage: "-16.67%" },
        { name: "Net Sales", total: 100000, percentage: "83.33%" },
      ],
    },
    {
      category: "Cost of Goods Sold",
      items: [
        { name: "Material Consumption", amount: 40000, percentage: "33.33%" },
        { name: "Cost of Goods Sold", total: 40000, percentage: "33.33%" },
        { name: "Gross Profit", total: 60000, percentage: "50%" },
      ],
    },
    {
      category: "Expenses",
      items: [
        { name: "Online Expenses", amount: 10000, percentage: "8.33%" },
        { name: "Revenue Share", amount: 5000, percentage: "4.17%" },
        { name: "Power", amount: 5000, percentage: "4.17%" },
        { name: "Total Expenses", total: 20000, percentage: "16.67%" },
      ],
    },
    {
      category: "Net Profit",
      items: [
        { name: "Gross Profit", amount: 60000, percentage: "50%" },
        { name: "Total Expenses", amount: 20000, percentage: "16.67%" },
        { name: "Net Profit", total: 40000, percentage: "33.33%" },
      ],
    },
  ],
};
const ProfitLossTable = () => {
  const [open, setOpen] = useState(false);
  // const [selectedBranch, setSelectedBranch] = useState("1401 Syala Hyderabad");

  const handleEditClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    // Implement download functionality (e.g., export to CSV or PDF)
    alert("Download initiated");
  };

  const plUrl = "https://prsti-public-data.s3.ap-south-1.amazonaws.com/tsf/P%26L-Dropdown.json";
  // for dropdown
  const [data, setData] = useState({ Branch: [], "Year/Month": {} }); // State to hold fetched data
  const [selectedBranch, setSelectedBranch] = useState(""); // State for selected branch
  const [selectedYearMonth, setSelectedYearMonth] = useState(""); // State for selected year/month
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(plUrl); // Replace with your API URL
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result); // Assuming the data is structured as shown in your example
      } catch (error) {
        setError(error.message); // Handle error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once on mount

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value); // Update selected branch
  };

  const handleYearMonthChange = (event) => {
    setSelectedYearMonth(event.target.value); // Update selected year/month
  };

  if (loading) return <Typography>Loading...</Typography>; // Loading state
  if (error) return <Typography>Error: {error}</Typography>; // Error handling

  // Prepare options for Branch dropdown
  const branchOptions = data.Branch ? data.Branch[0].values : [];

  // Prepare options for Year/Month dropdown
  const yearMonthOptions = data["Year/Month"][0].values
    ? Object.entries(data["Year/Month"][0].values)
    : [];

  const selectedYearMonthDisplay =
    yearMonthOptions.find(([key]) => key === selectedYearMonth)?.[1] || "";

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ padding: 2, textAlign: "left" }}></Typography>
        <div>
          {/* Edit Button */}
          <IconButton onClick={handleEditClick}>
            <EditIcon />
          </IconButton>

          {/* Download Button */}
          <IconButton onClick={handleDownload}>
            <DownloadIcon />
          </IconButton>
        </div>
      </div>
      <TableContainer component={Paper} sx={{ width: "90%", margin: "auto", mt: 4 }}>
        <Typography variant="h5" sx={{ padding: 2, textAlign: "left" }}>
          Profit and Loss Statement
        </Typography>
        <Typography variant="h6" sx={{ padding: 2, textAlign: "left" }}>
          THE THICKSHAKE FACTORY
          <br />
          MONTH/YEAR - {selectedYearMonthDisplay}
          <br />
          BRANCH - {selectedBranch}
        </Typography>

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
            {plData.categories.map((category, idx) => (
              <React.Fragment key={idx}>
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: "rgba(25, 127, 192,0.18)",
                    }}
                  >
                    {category.category}
                  </TableCell>
                </TableRow>
                {category.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell></TableCell> {/* Empty cell for alignment */}
                    <TableCell
                      sx={{ fontWeight: index === category.items.length - 1 ? "bold" : "normal" }}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell align="right">
                      {item.amount !== undefined ? item.amount.toLocaleString("en-IN") : ""}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ backgroundColor: "rgba(25, 127, 192,0.6)", color: "white" }}
                    >
                      {item.total !== undefined ? `₹${item.total.toLocaleString("en-IN")}` : ""}
                    </TableCell>
                    <TableCell align="right">{item.percentage}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Branch</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Branch</InputLabel>
            <Select value={selectedBranch} onChange={handleBranchChange}>
              {branchOptions.map((branch, index) => (
                <MenuItem key={index} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Year/Month</InputLabel>
            <Select value={selectedYearMonth} onChange={handleYearMonthChange}>
              {yearMonthOptions.map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value} {/* Display value (e.g., "JAN-2024") for UI */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// const ProfitLossStatement = ({ data }) => {
//   return (
//     <TableContainer component={Paper} sx={{ width: '90%', margin: 'auto', mt: 4 }}>
//       <Typography variant="h4" sx={{ padding: 2, textAlign: 'left' }}>
//         Profit and Loss Statement

//       </Typography>
//       <Typography variant="h6" sx={{ padding: 2, textAlign: 'left' }}>

//         THE THICKSHAKE FACTORY<br></br>
//         MONTH/YEAR - MAY 2024<br></br>
//         BRANCH - 1401 Syala Hyderabad
//       </Typography>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Category</TableCell>
//             <TableCell align="right"></TableCell>
//             <TableCell align="right" sx={{  backgroundColor: "rgba(25, 127, 192,0.6)", color: 'white'}}>Total</TableCell>
//             <TableCell align="right">Percentage (%)</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {data.categories.map((category, idx) => (
//             <React.Fragment key={idx}>
//               <TableRow>
//                 <TableCell colSpan={4} sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
//                   {category.category}
//                 </TableCell>
//               </TableRow>
//               {category.items.map((item, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{item.name}</TableCell>
//                   <TableCell align="right">{item.amount.toLocaleString()}</TableCell>
//                   <TableCell align="right"  sx={{  backgroundColor: "rgba(25, 127, 192,0.6)", color: 'white'}}>{item.total.toLocaleString()}</TableCell>
//                   <TableCell align="right">{item.percentage}</TableCell>
//                 </TableRow>
//               ))}
//             </React.Fragment>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

const PLTemplate = () => {
  return (
    <div>
      <ProfitLossTable data={plData} />
    </div>
  );
};
PLTemplate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default PLTemplate;
