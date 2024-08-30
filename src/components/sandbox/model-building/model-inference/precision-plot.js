import React, { useState } from "react";

import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import L from "lodash";

const PrecisionPlot = ({ info }) => {
  const [selectedClass, setSelectedClass] = useState(info.default_class);

  const chartData = L.zip(info.bin_ranges.slice(1), info.class_bin_values[selectedClass]).map(
    ([x, y]) => ({
      id: x,
      counts: Number(y),
    })
  );

  return (
    <div>
      <Box sx={{ height: "300px" }}>
        <ResponsiveBar
          data={chartData}
          indexBy="id"
          keys={["counts"]}
          xScale={{ type: "linear", min: "auto", max: "auto" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          theme={{
            axis: {
              legend: {
                text: { fontSize: 14, fontWeight: 600 },
              },
            },
          }}
          colors={{ scheme: "category10" }}
          margin={{ top: 20, right: 40, bottom: 70, left: 90 }}
          axisBottom={{
            legend: info.axis1_label,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
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
        />
      </Box>
      <FormControl sx={{ minWidth: "230px" }}>
        <InputLabel id="column-label">Y Class</InputLabel>
        <Select
          label="Y Class"
          labelId="column-label"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {Object.keys(info.class_bin_values).map((column) => (
            <MenuItem key={column} value={column}>
              {column}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default PrecisionPlot;
