import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";

import { Grid, Box, Paper, Typography, Stack } from "@mui/material";
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
      "& .chart-wrapper": {
        width: "100%",
        height: "300px",
      },
    },
  })
);

const ScatterContainer = ({ plotCategoryObject, data, columnOfInterest }) => {
  const classes = useStyles();

  const basicInfo = useRecoilValue(basicInfoState);

  const plotObj = plotCategoryObject.plots[0];
  const axis2 = plotObj.axis1 === columnOfInterest ? plotObj.axis2 : plotObj.axis1;

  const chartData = useMemo(() => {
    return prepareScatterPlotData(
      data,
      columnOfInterest,
      axis2,
      basicInfo.problem_type,
      basicInfo.target_col
    );
  }, [basicInfo, data, plotCategoryObject]);

  return (
    <Grid item xs={12}>
      <Box className={classes.root} component="div">
        <Stack className="stack" direction="column" gap={0.5}>
          <Paper className="name-enclosure">
            <Typography variant="h6">Plot against Target variable</Typography>
          </Paper>
          {Boolean(plotCategoryObject.overallInsights) && (
            <Paper className="name-enclosure overall-insights">
              <Typography variant="subtitle1">{plotCategoryObject.overallInsights}</Typography>
            </Paper>
          )}
        </Stack>
        <Paper>
          <div className="chart-wrapper">
            {Boolean(chartData) && (
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
                  legend: axis2,
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legendOffset: -100,
                  legendPosition: "middle",
                }}
              />
            )}
          </div>
          <Typography sx={{ mx: 6, py: 3 }} color="primary" variant="subtitle1">
            {plotObj.insights}
          </Typography>
        </Paper>
      </Box>
    </Grid>
  );
};

ScatterContainer.propTypes = {
  plotCategoryObject: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnOfInterest: PropTypes.string.isRequired,
};

export default ScatterContainer;
