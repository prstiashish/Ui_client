import React, { useEffect, useState } from "react";
import { DashboardLayout } from "src/components/dashboard-layout";
import { useRouter } from "next/router";
import { Tabs, Tab, Typography } from "@mui/material";
import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
// import ChartJsBarChart from "./ChartJsBarChart";
// import CanvasJSReact from "@canvasjs/react-charts";

const salesvisual = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [nestedTab, setNestedTab] = useState(0);
  const [Can, setCan] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleNestedTabChange = (event, newValue) => {
    setNestedTab(newValue);
  };

  return (
    <>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Sales" />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
        <Tab label="Tab 4" />
        <Tab label="Tab 5" />
      </Tabs>
      {selectedTab === 0 && (
        <>
          <Tabs
            value={nestedTab}
            onChange={handleNestedTabChange}
            centered
            style={{ marginTop: 20 }}
          >
            <Tab label="Stacked bar Visual" />
            <Tab label="Nested Tab 2" />
            <Tab label="Nested Tab 3" />
            <Tab label="Nested Tab 4" />
            <Tab label="Nested Tab 5" />
          </Tabs>
          <TabPanel value={nestedTab} index={0}>
            <Typography>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  overflowX: "auto",
                }}
              >
                {/* {<ChartJsBarChart />} */}
                <h2>Test12345 </h2>
              </div>
            </Typography>
          </TabPanel>
          <TabPanel value={nestedTab} index={1}></TabPanel>
          <TabPanel value={nestedTab} index={2}>
            <Typography>Content for Nested Tab 3</Typography>
          </TabPanel>
          <TabPanel value={nestedTab} index={3}>
            <Typography>Content for Nested Tab 4</Typography>
          </TabPanel>
          <TabPanel value={nestedTab} index={4}>
            <Typography>Content for Nested Tab 5</Typography>
          </TabPanel>
        </>
      )}
      {selectedTab !== 0 && (
        <TabPanel value={selectedTab} index={selectedTab}>
          <Typography>Content for Tab {selectedTab + 1}</Typography>
        </TabPanel>
      )}
    </>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
};

salesvisual.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default salesvisual;
