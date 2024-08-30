import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { Grid, Box, Paper, Typography, Stack } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { ResponsiveBar } from "@nivo/bar";

import { prepareFeatureScoreData } from "src/utils/sandbox/eda/chart-utils";

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
        height: "700px",
      },
    },
  })
);

const BarContainer = ({ axis1Values, axis2Values, overallInsights }) => {
  const classes = useStyles();

  const chartData = useMemo(() => {
    return prepareFeatureScoreData(axis1Values, axis2Values);
  }, [axis1Values, axis2Values]);

  return (
    <Grid item xs={12}>
      <Box className={classes.root} component="div">
        <Stack className="stack" direction="column" gap={0.5}>
          <Paper className="name-enclosure">
            <Typography variant="h6">Feature Selection Scores</Typography>
          </Paper>
          {Boolean(overallInsights) && (
            <Paper className="name-enclosure overall-insights">
              <Typography variant="subtitle1">{overallInsights}</Typography>
            </Paper>
          )}
        </Stack>
        <Paper className="chart-wrapper">
          <ResponsiveBar
            theme={{
              axis: {
                legend: {
                  text: { fontSize: 14, fontWeight: 600 },
                },
              },
            }}
            colors={{ scheme: "category10" }}
            layout="horizontal"
            data={chartData}
            keys={["score"]}
            indexBy="id"
            margin={{ top: 60, right: 90, bottom: 70, left: 140 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            crosshairType="cross"
            // label={(d) => {
            //
            //   return <tspan style={{ right: 0 }}>{d.value}</tspan>;
            // }}
            barComponent={BarComponent}
            axisBottom={{
              legend: "Features",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: 50,
              legendPosition: "middle",
            }}
            axisLeft={{
              legend: "Scores",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: -100,
              legendPosition: "middle",
            }}
          />
        </Paper>
      </Box>
    </Grid>
  );
};

const BarComponent = ({ bar, label }) => {
  const { x, y, height, width, color, data } = bar;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={width} height={height} fill={color} strokeWidth="0" stroke="white" />

      <text
        x={width + label.length * 4}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 12,
          pointerEvents: "none",
          fill: "black",
          opacity: 0.75,
        }}
      >
        {label}
      </text>
    </g>
  );
};

BarContainer.propTypes = {
  axis1Values: PropTypes.arrayOf(PropTypes.string).isRequired,
  axis2Values: PropTypes.arrayOf(PropTypes.number).isRequired,
  overallInsights: PropTypes.string,
};

export default BarContainer;
