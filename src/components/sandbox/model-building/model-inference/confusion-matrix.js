import React from "react";

import { Box } from "@mui/material";
import { ResponsiveHeatMap } from "@nivo/heatmap";

import { prepareHeatmapData } from "src/utils/sandbox/eda/chart-utils";

const ConfusionMatrix = ({ info }) => {
  const chartData = prepareHeatmapData(info);

  return (
    <Box sx={{ height: "300px" }}>
      <ResponsiveHeatMap
        data={chartData}
        colors={{
          type: "diverging",
          scheme: "blues",
        }}
        margin={{ top: 20, right: 40, bottom: 70, left: 90 }}
        theme={{
          axis: {
            legend: {
              text: { fontSize: 14, fontWeight: 600 },
            },
          },
        }}
        axisBottom={{
          legend: "Predicted",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: 50,
          legendPosition: "middle",
        }}
        axisLeft={{
          legend: "Observed",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: -60,
          legendPosition: "middle",
        }}
      />
    </Box>
  );
};

export default ConfusionMatrix;
