import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";

import { Grid, Box, Paper, Typography, Stack } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import createPlotlyComponent from "react-plotlyjs";
import Plotly from "plotly.js-cartesian-dist-min";

import { basicInfoState } from "src/recoil/atoms";
import { prepareViolinPlotData, ProblemType } from "src/utils/sandbox/eda/chart-utils";

const PlotlyComponent = createPlotlyComponent(Plotly);

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
        height: "500px",
      },
    },
  })
);

const ViolinContainer = ({ data, columnOfInterest, plotCategoryObject }) => {
  const classes = useStyles();

  const basicInfo = useRecoilValue(basicInfoState);

  const chartData = useMemo(
    () =>
      prepareViolinPlotData(data, columnOfInterest, basicInfo.problem_type, basicInfo.target_col),
    [data, columnOfInterest]
  );

  const chartLayout =
    basicInfo.problem_type === ProblemType.classification
      ? { xaxis: { title: basicInfo.target_col } }
      : {};

  const plotObj = plotCategoryObject.plots[0];

  return (
    <Grid item xs={12}>
      <Box className={classes.root} component="div">
        <Stack className="stack" direction="column" gap={0.5}>
          <Paper className="name-enclosure">
            <Typography variant="h6">Violin Plot</Typography>
          </Paper>
          {Boolean(plotCategoryObject.overallInsights) && (
            <Paper className="name-enclosure overall-insights">
              <Typography variant="subtitle1">{plotCategoryObject.overallInsights}</Typography>
            </Paper>
          )}
        </Stack>
        <Paper className="chart-wrapper">
          {Boolean(chartData) && <PlotlyComponent data={chartData} layout={chartLayout} />}
          <Typography sx={{ mx: 6 }} color="primary" variant="subtitle1">
            {plotObj.insights}
          </Typography>
        </Paper>
      </Box>
    </Grid>
  );
};

ViolinContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnOfInterest: PropTypes.string.isRequired,
  plotCategoryObject: PropTypes.object.isRequired,
};

export default ViolinContainer;
