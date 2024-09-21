import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { DashboardLayout } from "src/components/dashboard-layout";


export default function ProfitLossStatement() {
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('1401 Syala Hyderabad');
  const [plData, setPlData] = useState({ categories: [] });

  // Dummy function to simulate API call to fetch data based on branch
  const fetchPlData = (branch) => {
    // Simulate an API call to fetch data
    const data = {
      '1401 Syala Hyderabad': {
        categories: [
          {
            category: 'Revenue',
            items: [
              { name: 'Product Sales', amount: 120000, total: 120000, percentage: '60%' },
              { name: 'Service Sales', amount: 80000, total: 80000, percentage: '40%' },
            ],
          },
          {
            category: 'Expenses',
            items: [
              { name: 'Rent', amount: 40000, total: 40000, percentage: '50%' },
              { name: 'Utilities', amount: 20000, total: 20000, percentage: '25%' },
              { name: 'Staff Wages', amount: 20000, total: 20000, percentage: '25%' },
            ],
          },
        ],
      },
      '1502 Jubilee Hills Hyderabad': {
        categories: [
          {
            category: 'Revenue',
            items: [
              { name: 'Product Sales', amount: 150000, total: 150000, percentage: '70%' },
              { name: 'Service Sales', amount: 50000, total: 50000, percentage: '30%' },
            ],
          },
          {
            category: 'Expenses',
            items: [
              { name: 'Rent', amount: 45000, total: 45000, percentage: '55%' },
              { name: 'Utilities', amount: 25000, total: 25000, percentage: '30%' },
              { name: 'Staff Wages', amount: 10000, total: 10000, percentage: '15%' },
            ],
          },
        ],
      },
      // Add more branches as needed
    };

    // Simulate delay for API call
    setTimeout(() => {
      setPlData(data[branch]);
    }, 500);
  };

  // Fetch initial data for default branch
  useEffect(() => {
    fetchPlData(selectedBranch);
  }, [selectedBranch]);

  // Handle open and close of dialog
  const handleEditClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Dummy download function (implement actual logic)
  const handleDownload = () => {
    alert('Download triggered');
  };

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
          THE THICKSHAKE FACTORY<br />
          MONTH/YEAR - MAY 2024<br />
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

      {/* Dialog for Branch Selection */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Branch</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Branch</InputLabel>
            <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
              <MenuItem value="1401 Syala Hyderabad">1401 Syala Hyderabad</MenuItem>
              <MenuItem value="1502 Jubilee Hills Hyderabad">1502 Jubilee Hills Hyderabad</MenuItem>
              <MenuItem value="1603 Banjara Hills Hyderabad">1603 Banjara Hills Hyderabad</MenuItem>
              {/* Add more branches as needed */}
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
}
ProfitLossStatement.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
