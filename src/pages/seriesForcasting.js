import React, { useState, useEffect } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid"; // Import the DataGrid component
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

import SlideOutPanel from "./slideoutpannel"; // Ensure this path is correct
import QueryAnalytics from "./query-analytics"


// import "ag-grid-community/dist/styles/ag-theme-alpine.css"

const dataGridAPI = "https://zscfpdvr6sluc3y4xd7bugp2im0nmgkf.lambda-url.ap-south-1.on.aws/";

const DevDatadrilldown = () => {
  const [gridApi, setGridApi] = useState(null);
  console.log(gridApi, 'pppp');
  const [pageNumberInput, setPageNumberInput] = useState(1);
  const [data, setData] = useState([]); // State to hold the fetched data
  const [columns, setColumns] = useState([]); // State to hold the column definitions
  const [error, setError] = useState(""); // State to hold error messages
  const [isPanelOpen, setPanelOpen] = useState(false);
  const handleClosePanel = () => {
    setPanelOpen(false);
  };

  const handleSubmit = () => {
    setPanelOpen(false);
  };

  console.log(pageNumberInput);
  console.log(typeof pageNumberInput);
  const handleInputChange = (event) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      setPageNumberInput(value); // Update state with valid input
    }
  };

  const fetchData = async () => {
    const payload = {
      page_number: parseInt(pageNumberInput, 10),
    };

    try {
      const response = await axios.post(dataGridAPI, payload);
      console.log("responseeeeeeeeeeeeeee", response); // Log the response data
      console.log("API Response:", response.data); // Log the response data
      console.log(typeof response.data, "typeeeeeeeeeee"); // Check the type of response.data

      let fetchedData;
      console.log("################################");
      // fetchedData = response.data

      fetchedData = JSON.parse(response.data); // Parse the string to JSON
      console.log("Fetched Data:", fetchedData);
      console.log("################################");

      // Log the fetched data

      // Ensure fetchedData is an array
      if (!Array.isArray(fetchedData)) {
        console.error("Fetched data is not an array:", fetchedData);
        throw new Error("Fetched data is not an array");
      }

      // Add unique ID to each object in the fetched data
      const dataWithId = fetchedData.map((item, index) => ({
        ...item,
        id: item.id || index, // Use the existing id or index
      }));

      setData(dataWithId); // Set the state with the fetched data
      setError(""); // Clear any previous error

      // Extract keys from the first object to create columns
      if (dataWithId.length > 0) {
        const keys = Object.keys(dataWithId[0]);
        const generatedColumns = keys.map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          width: 140,
          // flex: 7,
          // filter: true,
          // floatingFilter: true,
        }));
        setColumns(generatedColumns); // Set the columns state
      }

    } catch (error) {
      console.error("Error fetching data:", error);

      // Check for a custom error response from the backend
      if (error.response && error.response.data) {

        setError(error.response.data); // Assuming the error message is in the response
      } else {
        setError(error.message); // Fallback error message
      }
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [pageNumberInput]);

  useEffect(() => {
    const pageNumber = parseInt(pageNumberInput, 10) || 1; // Default to 1 if invalid
    if (pageNumber > 0) { // Only fetch data if pageNumber is valid
      fetchData(pageNumber);
    }
  }, [pageNumberInput]);

  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     fetchData(); // Call fetchData without parameters
  //   }
  // };

  const defaultColDefs = {
    sortable: true,
    flex: 1,
    filter: true,
    floatingFilter: true,

  }

  const rowData = [
    { id: 1, name: "John Doe", age: 30, city: "New York" },
    { id: 2, name: "Jane Smith", age: 25, city: "Los Angeles" },
    { id: 3, name: "Bob Johnson", age: 40, city: "Chicago" },
  ];

  const columndefs = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "city", headerName: "City", width: 150 },
  ];


  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  // return (
  //   <>
  //     <h1>Data Drill</h1>
  //     <input
  //       type="text" // Use text type for custom validation
  //       value={pageNumberInput} // Bind value to state
  //       onChange={handleInputChange} // Handle input changes
  //       // onKeyDown={handleKeyDown} // Handle key down events
  //       placeholder="Enter page number only"
  //       style={{ width: "200px", padding: "8px", fontSize: "16px" }} // Optional styling
  //     />
  //      {/* Display error message if it exists */}
  //      {error && (
  //       <div style={{ color: "red", margin: "10px 0" }}>
  //         Error: {error}
  //       </div>
  //     )}
  //     <div style={{ height: 400, width: "100%" }}>
  //       <DataGrid
  //         rows={data} // Use the fetched data as rows
  //         columns={columns} // Use the generated columns
  //         // pageSize={5} // Set the number of rows per page
  //         // rowsPerPageOptions={[5, 10, 20]} // Options for rows per page
  //         // checkboxSelection // Optional: add checkbox selection
  //         // rows={rowData} // Use the fetched data as rows
  //         // columns={columndefs} // Use the generated columns
  //       />
  //     </div>
  //   </>
  // );
  return (
    <>

      {/* Display error message if it exists */}
      {error && (
        <div style={{ color: "red", margin: "10px 0" }}>
          Error: {error}
        </div>
      )}
      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={data} // Use the fetched data as rows
          columns={columns} // Use the generated columns
          // defaultColDef={defaultColDefs}
          onGridReady={onGridReady}
        // floatingFilter={true}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <input
          type="text" // Use text type for custom validation
          value={pageNumberInput} // Bind value to state
          onChange={handleInputChange} // Handle input changes
          placeholder="Enter page number only"
          style={{
            width: "90px",
            height: "30px",
            padding: "8px",
            fontSize: "16px",
            marginBottom: "10px",
          }}
        />
      </div>

      <SlideOutPanel open={isPanelOpen} onClose={handleClosePanel} handleSubmit={handleSubmit} />

    </>
  );

};

DevDatadrilldown.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DevDatadrilldown;