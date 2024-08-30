import React from "react";

import { Box } from "@mui/material";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import L from "lodash";

const PredictedVsPlot = ({ info, drawBaseline = false }) => {
  const chartData = [
    {
      id: "all",
      data: L.zip(info.axis1, info.axis2).map(([x, y]) => ({
        x: Number(x).toFixed(2),
        y: Number(y).toFixed(2),
      })),
    },
  ];
  const tickValues = chartData[0].data.map((d, i) => (i % 80 ? null : d.x)).filter((el) => el);

  return (
    <Box sx={{ height: "300px" }}>
      <ResponsiveScatterPlot
        data={chartData}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        theme={{
          axis: {
            legend: {
              text: { fontSize: 14, fontWeight: 600 },
            },
          },
        }}
        colors={{ scheme: "category10" }}
        margin={{ top: 20, right: 40, bottom: 70, left: 140 }}
        axisBottom={{
          legend: info.axis1_label,
          tickValues: tickValues,
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 90,
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
        pointSize={10}
        useMesh
        enableGridX={false}
        enableGridY={false}
      />
    </Box>
  );
};

export default PredictedVsPlot;
