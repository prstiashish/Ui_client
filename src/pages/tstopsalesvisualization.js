import React, { useEffect, useState } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import BarChart from "src/components/charts/BarChart";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";

import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { topTrendDimensions } from "src/components/charts/ThickShakeInfo";
import StackedBarChart from "src/components/charts/StackedBarChart";
import { GetAuthToken } from "src/components/charts/AuthDetails";
import { GetSchema } from "src/components/charts/AuthDetails";
import { GetTokenExpiredTime, GetRefreshToken, baseURLs } from "src/components/charts/AuthDetails";

const TopSalesVisualization = ({ isAuthenticated }) => {
  const [dimension, setDimension] = useState(1);
  const [toplimit, setTopLimit] = useState(10);
  const baseURL = baseURLs();

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Branch Sales",
        data: [],
      },
    ],
  });

  // Handle dropdown changes
  const handelDimension = (event) => {
    setDimension(event.target.value);
  };

  const handelTopLimit = (event) => {
    setTopLimit(event.target.value);
  };

  const checkTokenExpired = () => {
    if (typeof window !== "undefined") {
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
    }
  };
  const router = useRouter();
  useEffect(() => {
    const authToken = GetAuthToken();
    if (!authToken || authToken.trim() === "") {
      router.push("/login");
    } else {
      TopDimensionsSales();
    }
  }, [dimension, toplimit]);
  const backgroundColorsz = [
    "#82aa57",
    "#e07a5f",
    "#570211",
    "#006da4",
    "#de6560",
    "#2a9d8f",
    "#e9c46a",
    "#e07a5f",
    "#cbb874",
    "#a3a398",
  ]; // Example colors

  const TopDimensionsSales = async () => {
    try {
      let conditions, returnVar, name;
      if (dimension == 1) {
        conditions = "Branch";
        returnVar = "BranchList";
        name = "branchname";
      } else if (dimension == 2) {
        conditions = "Brand";
        returnVar = "BrandList";
        name = "brandname";
      } else if (dimension == 3) {
        conditions = "FranchiseType";
        returnVar = "FranchiseTypeList";
        name = "franchisetype";
      } else if (dimension == 4) {
        conditions = "Channel";
        returnVar = "ChannelList";
        name = "channelname";
      } else if (dimension == 5) {
        conditions = "OrderSource";
        returnVar = "OrderSourceList";
        name = "ordersourcetype";
      }
      checkTokenExpired();
      var baseUrl = baseURL + "get-top-dimension-sales-list";
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
        dimension: conditions,
        limit: toplimit,
      };

      axios
        .post(baseUrl, body, config)
        .then((response) => {
          if (response.data[returnVar].length > 0) {
            const data = response.data[returnVar];
            const labels = data.map((item) => item[name]);
            const backgroundColors = generateSequentialColors(data.length);

            setChartData({
              labels: labels,
              datasets: [
                {
                  data: data.map((item) => item.totalsales),
                  backgroundColor: "#4E78A6",
                },
              ],
            });
          } else {
            setChartData({});
            console.log("Top Trend: No data found or the data is empty");
          }
        })
        .catch((error) => {
          console.error("Top Trend:", error);
          // Handle error
        });
    } catch (error) {
      console.error("Error fetching data or updating card:", error);
    }
  };

  function generateSequentialColors(count) {
    const colors = [];
    const hueStart = 270; // Hue for blue colors
    const hueEnd = 200;
    const hueIncrement = (hueEnd - hueStart) / count;
    for (let i = 0; i < count; i++) {
      const hue = hueStart + i * hueIncrement;
      const color = `hsl(${hue}, 70%, 50%)`;
      colors.push(color);
    }
    return colors;
  }

  return (
    <>
      <Grid container spacing={2} style={{ marginTop: "0%" }}>
        <Grid item xs={2} sm>
          <FormControl fullWidth>
            <InputLabel>Dimension</InputLabel>
            <Select
              value={dimension}
              onChange={handelDimension}
              label="Dimension"
              // style={{ outline: "1px solid #c7c8ca" }}
            >
              <MenuItem value={0}>Select</MenuItem>
              <MenuItem value={1}>Branch</MenuItem>
              <MenuItem value={2}>Brand</MenuItem>
              <MenuItem value={3}>FranchiseType</MenuItem>
              <MenuItem value={4}>Channel</MenuItem>
              <MenuItem value={5}>OrderSource</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2} sm>
          <FormControl fullWidth>
            <InputLabel>Top</InputLabel>
            <Select
              value={toplimit}
              onChange={handelTopLimit}
              label="Top"
              // style={{ outline: "1px solid #c7c8ca" }}
            >
              <MenuItem value={0}>Select</MenuItem>
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={30}>Top 30</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
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
            <BarChart chartData={chartData} title="Top Trend Visualization" />
          </div>
        </Grid>
      </Grid>
    </>
  );
};
TopSalesVisualization.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TopSalesVisualization;
