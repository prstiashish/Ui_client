import React from "react";

import { Box } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import L from "lodash";

const AucPlot = ({ info }) => {
  const chartData = [
    {
      id: "all",
      data: L.sortBy(
        L.zip(info.axis1, info.axis2).map(([x, y]) => ({
          x: Number(Number(x).toFixed(2)),
          y: Number(Number(y).toFixed(2)),
        })),
        "x"
      ),
    },
  ];

  const dataLen = chartData[0].data.length;

  const divider = dataLen < 20 ? dataLen : Math.floor(dataLen / 20);
  const tickValues = chartData[0].data.map((d, i) => (i % divider ? null : d.x)).filter((el) => el);

  return (
    <Box sx={{ height: "300px" }}>
      <ResponsiveLine
        data={chartData}
        xScale={{ type: "linear" }}
        yScale={{ type: "linear" }}
        colors={{ scheme: "category10" }}
        theme={{
          axis: {
            legend: {
              text: { fontSize: 14, fontWeight: 600 },
            },
          },
        }}
        margin={{ top: 20, right: 40, bottom: 50, left: 90 }}
        axisBottom={{
          legend: info.axis1_label,
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          legend: info.axis2_label,
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: -60,
          legendPosition: "middle",
        }}
        useMesh
      />
    </Box>
  );
};

export default AucPlot;
