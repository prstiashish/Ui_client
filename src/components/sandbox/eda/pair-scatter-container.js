import React, { useState, useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";

import {
  Grid,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";

import { basicInfoState } from "src/recoil/atoms";
import { prepareScatterPlotData } from "src/utils/sandbox/eda/chart-utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      borderRadius: "8px",
      boxShadow: "inset 2px 2px 8px 2px rgba(0,0,0,0.1)",
      backgroundColor: "#efefef",
      gap: theme.spacing(2),
      "& .stack": {
        "& .name-enclosure": {
          display: "inline-block",
          width: "fit-content",
          padding: theme.spacing(1.5),
        },
        "& .overall-insights": {
          color: theme.palette.text.secondary,
          padding: theme.spacing(1),
          marginLeft: theme.spacing(4),
          marginBlock: theme.spacing(2),
        },
        marginBottom: theme.spacing(0.5),
      },
      "& .reactive-chart": {
        display: "flex",
        flexDirection: "row",
        "& .chart-wrapper": {
          width: "100%",
          height: "500px",
          marginRight: theme.spacing(1),
        },
      },
    },
  })
);

const PairScatterContainer = ({ plotCategoryObject, data, columnOfInterest }) => {
  const classes = useStyles();

  const [selectedYAxis, setSelectedYAxis] = useState("");

  const basicInfo = useRecoilValue(basicInfoState);

  const suggestedYCols = useMemo(() => {
    return plotCategoryObject.plots.map((obj) =>
      obj.axis1 === columnOfInterest ? obj.axis2 : obj.axis1
    );
  }, [plotCategoryObject]);

  const getChartData = useCallback(() => {
    return prepareScatterPlotData(
      data,
      columnOfInterest,
      selectedYAxis,
      basicInfo.problem_type,
      basicInfo.target_col
    );
  }, [basicInfo, data, plotCategoryObject, selectedYAxis]);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!suggestedYCols) return;
    const possibleCols = suggestedYCols.filter((col) => col !== plotCategoryObject.plots[0].axis1);
    const colsWithoutIDCols = possibleCols.filter((col) => !basicInfo.unique_id_cols.includes(col));
    if (colsWithoutIDCols.length > 0) setSelectedYAxis(colsWithoutIDCols[0]);
    else setSelectedYAxis(possibleCols[0]);
  }, [suggestedYCols]);

  useEffect(() => {
    if (Boolean(selectedYAxis)) setChartData(getChartData());
  }, [selectedYAxis, plotCategoryObject]);

  return (
    <Grid item xs={12}>
      <Box className={classes.root} component="div">
        <Stack className="stack" direction="column" gap={0.5}>
          <Paper className="name-enclosure">
            <Typography variant="h6">Pair Plot</Typography>
          </Paper>
          {Boolean(plotCategoryObject.overallInsights) && (
            <Paper className="name-enclosure overall-insights">
              <Typography variant="subtitle1">{plotCategoryObject.overallInsights}</Typography>
            </Paper>
          )}
        </Stack>
        <div className="reactive-chart">
          <Paper className="chart-wrapper">
            <ResponsiveScatterPlot
              theme={{
                axis: {
                  legend: {
                    text: { fontSize: 14, fontWeight: 600 },
                  },
                },
              }}
              colors={{ scheme: "category10" }}
              data={chartData}
              margin={{ top: 60, right: 90, bottom: 70, left: 140 }}
              xScale={{ type: "linear", min: "auto", max: "auto" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              axisBottom={{
                legend: columnOfInterest,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendOffset: 50,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: selectedYAxis,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendOffset: -100,
                legendPosition: "middle",
              }}
            />
          </Paper>
          <div>
            <FormControl sx={{ minWidth: "230px" }}>
              <InputLabel id="column-label">y-axis</InputLabel>
              <Select
                label="y-axis"
                labelId="column-label"
                value={selectedYAxis}
                onChange={(e) => setSelectedYAxis(e.target.value)}
              >
                {suggestedYCols.map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </Box>
    </Grid>
  );
};

PairScatterContainer.propTypes = {
  plotCategoryObject: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnOfInterest: PropTypes.string.isRequired,
};

export default PairScatterContainer;
