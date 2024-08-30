import { useState, useEffect } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { GetAuthToken, GetSchema } from "src/components/charts/AuthDetails";
import { GetTokenExpiredTime, GetRefreshToken, baseURLs } from "src/components/charts/AuthDetails";
import { filter } from "lodash";
import { debounce } from "lodash";

const DataDrillDown = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 100, // Number of records per page
    totalRows: 0, // Total number of rows
  });
  const [filters, setFilters] = useState({});
  const baseURL = baseURLs();

  const checkTokenExpired = () => {
    debugger;
    const currentTime = Math.floor(Date.now() / 1000);
    const expTime = GetTokenExpiredTime();
    const remainingTime = expTime - currentTime;
    if (remainingTime <= 300) {
      var refreshTokenUrl =
        "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/refresh-token-auth";
      const config = {
        headers: {
          "x-api-key": "xyz-abcd",
          "Content-Type": "application/json",
        },
      };
      const body = {
        refresh_token: GetRefreshToken(),
      };
      axios
        .post(refreshTokenUrl, body, config)
        .then((response) => {
          sessionStorage.setItem("IdToken", response.data.AuthenticationResult.IdToken);
        })
        .catch((error) => {
          console.log("RefreshToken:", error);
        });
    } else {
    }
  };
  useEffect(() => {
    const authToken = GetAuthToken();
    if (!authToken || authToken.trim() === "") {
      router.push("/login");
    }
    fetchData();
  }, [pagination, filters]);

  const columnMapping = {
    branchname: "Branch Name",
    brandname: "Brand Name",
    franchisetype: "Franchise Type",
    channelname: "Channel Name",
    ordersourcetype: "Order Source",
    businessdate: "Date",
    sales_openorderamount: "Sales Open Amount",
    sales_grossamount: "Sales Gross Amount",
    sales_discount: "Sales Discount",
    sales_directchargeamount: "Sales Direct Charge",
    sales_otherchargeamount: "Sales Other Charge",
    sales_taxes: "Sales Taxes",
    sales_rounding: "Sales Rounding",
    sales_tip: "Sales Tip",
    sales_billedamount: "Sales Billed Amount",
    sales_totalreceivables: "Sales Total Receivable",
    cogs_material: "Material Cost",
    cogs_labour: "Labour Cost",
    cogs_overheads: "Supplies Cost",
    cogs_sellingcost: "Selling Cost",
    cogs_commisions: "Commission",
    cogs_discount: "Discount",
    cogs_totalsalescost: "Total Sales Cost",
    numberofitems: "No of Items",
    totalquantity: "Total Quantity",
    amountreturned: "Amount Returned",
    year: "year",
  };

  const fetchData = () => {
    try {
      debugger;
      checkTokenExpired();
      let filterQuery = "";
      const conditions = {};
      if (filters.Data && Object.keys(filters.Data).length > 0) {
        if (filters.Data.field) {
          conditions.field = filters.Data.field;
        }
        if (filters.Data.operator) {
          conditions.operator = filters.Data.operator;
        }
        if (filters.Data.value) {
          conditions.value = filters.Data.value;
        }
      }
      const whereClause = Object.keys(conditions).length > 0 ? conditions : {};

      const baseUrl = baseURL + "get-invoice-summary-list";
      const config = {
        headers: {
          "x-api-key": "xyz-abcd",
          Authorization: GetAuthToken(),
          "Content-Type": "application/json",
        },
      };
      const body = {
        operation: "READ",
        schema: GetSchema(),
        function: "InvoiceSummaryList",
        filter_criteria: {
          offset: pagination.offset,
          limit: pagination.limit,
          where_clause: whereClause,
        },
      };

      axios
        .post(baseUrl, body, config)
        .then((response) => {
          if (response?.data?.InvoiceSummaryListInfo?.length > 0) {
            const fetchedData = response.data.InvoiceSummaryListInfo.map((row, index) => ({
              ...row,
              id: index + 1, // Providing a custom id for each row
            }));
            setData(fetchedData);
            // Define columns dynamically based on the keys in fetchedData
            const keys = Object.keys(fetchedData[0]);
            const updatedColumns = keys
              .map((key) => {
                // Exclude the column "invdailysummarykey"
                if (key !== "invdailysummarykey" && key !== "totalrows" && key !== "id") {
                  return {
                    field: key,
                    // headerName: typeof key === "string" ? key : String(key),
                    headerName: columnMapping[key] || String(key),
                    // headerName: String(key),
                    width: 150,
                    type: (typeof fetchedData[0][key]).toString(),
                  };
                }
                return null;
              })
              .filter((column) => column !== null);

            setColumns(updatedColumns);
            setTotalRows(response.data.InvoiceSummaryListInfo[0].totalrows);
            console.log("totalrows", totalRows);
          } else {
            setData([]);
          }
        })
        .catch((error) => {
          console.error("Top Trend:", error);
          // Handle error
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to handle page change
  const handlePageChange = (paginationModel) => {
    const { page, pageSize } = paginationModel;
    const newOffset = (page + 1 - 1) * pageSize;
    setPagination({
      ...pagination,
      offset: newOffset,
      limit: pageSize,
    });
  };

  // Function to handle filtering
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({
      ...pagination,
      offset: 0,
    });
  };
  const getFilterOperator = (condition) => {
    switch (condition) {
      case "equals":
        return "equals";
      case "notEquals":
        return "!=";
      case "greaterThan":
        return ">";
      case "greaterThanOrEqual":
        return ">=";
      case "lessThan":
        return "<";
      case "lessThanOrEqual":
        return "<=";
      case "isEmpty":
        return "IS NULL";
      case "isNotEmpty":
        return "IS NOT NULL";
      case "contains":
        return "contains";
      case "startsWith":
        return "startsWith";
      case "endsWith":
        return "endsWith";
      case "isAnyOf":
        return "IN";
      default:
        return condition;
    }
  };

  const getFilterValue = (condition, value) => {
    switch (condition) {
      case "isEmpty":
      case "isNotEmpty":
        return null; // For IS NULL and IS NOT NULL conditions, value is not required
      case "contains":
        return `%${value}%`;
      case "startsWith":
        return `${value}%`;
      case "endsWith":
        return `%${value}`;
      default:
        return value;
    }
  };
  const constructFilterQuery = (field, operator, value) => {
    // Ensure the value is properly formatted for the SQL query
    const formattedValue = typeof value === "string" ? `'${value}'` : `''${value}''`;

    // Construct the query string based on the operator
    switch (operator) {
      case "=":
      case "!=":
      case ">":
      case ">=":
      case "<":
      case "<=":
        if (value === "string") {
          return `${field} ${operator} '${formattedValue}'`;
        } else {
          return `${field} ${operator} ${formattedValue}`;
        }
      case "IS NULL":
      case "IS NOT NULL":
        return `${field} ${operator}`;
      case "LIKE":
        return `${field} ${operator} '%${value}%'`;
      case "IN":
        return `${field} ${operator} (${value})`;
      default:
        return ""; // Return an empty string for unsupported operators
    }
  };
  const debouncedFilterChange = debounce(handleFilterChange, 2000); // Adjust delay time as needed

  return (
    <div
      style={{
        height: "90vh",
        width: "100%",
        padding: "10px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <DataGrid
        slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
        slots={{ toolbar: GridToolbar }}
        rows={data}
        columns={columns}
        pageSize={10}
        pagination
        onPaginationModelChange={handlePageChange}
        rowCount={totalRows}
        onFilterModelChange={(newFilterModel) => {
          const newFilters = {};
          newFilterModel.items.forEach((item) => {
            console.log("Item:", item);
            if (item.field && item.condition !== "isAnyOf") {
              const operator = getFilterOperator(item.operator);
              const value = getFilterValue(item.condition, item.value);
              const field = item.field;
              newFilters["Data"] = {
                field,
                value,
                operator,
              };
            }
          });
          debouncedFilterChange(newFilters);
        }}
        components={{ Toolbar: GridToolbar }}
        getRowId={(row) => row.id}
        filterMode="server"
        paginationMode="server"
        className="custom-datagrid"
      />
    </div>
  );
};
DataDrillDown.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DataDrillDown;
