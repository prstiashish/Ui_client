import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import L from "lodash";

import { allColumnsState } from "src/recoil/atoms";

const PredictedVsChoosablePlot = ({ data, info }) => {
  const allColumns = useRecoilValue(allColumnsState);
  const [selectedColumn, setSelectedColumn] = useState("");

  useEffect(() => setSelectedColumn(allColumns[0]), [allColumns]);

  const minLength = data.length < info.axis2.length ? data.length : info.axis2.length;
  const chartData =
    selectedColumn === ""
      ? []
      : [
          {
            id: "all",
            data: L.zip(
              data.map((d) => d[selectedColumn]).slice(0, minLength),
              info.axis2.slice(0, minLength)
            ).map(([x, y]) => ({
              x: Number(x).toFixed(2),
              y: Number(y).toFixed(2),
            })),
          },
        ];
  const tickValues = chartData[0]
    ? chartData[0].data.map((d, i) => (i % 80 ? null : d.x)).filter((el) => el)
    : [];

  return (
    <div>
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
            legend: selectedColumn,
            tickValues: tickValues,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 90,
            legendOffset: 50,
            legendPosition: "middle",
          }}
          axisLeft={{
            legend: info.axis2_label,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -60,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enableGridY={false}
        />
      </Box>
      <FormControl sx={{ minWidth: "230px" }}>
        <InputLabel id="column-label">x-Axis</InputLabel>
        <Select
          label="x-Axis"
          labelId="column-label"
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
        >
          {allColumns.map((column) => (
            <MenuItem key={column} value={column}>
              {column}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default PredictedVsChoosablePlot;
