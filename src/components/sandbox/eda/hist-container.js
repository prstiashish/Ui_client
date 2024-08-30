import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";

import { Grid, Box, Paper, Typography, Stack } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { ResponsiveBar } from "@nivo/bar";

import { basicInfoState } from "src/recoil/atoms";
import { prepareHistogramData } from "src/utils/sandbox/eda/chart-utils";

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

const HistContainer = ({ plotCategoryObject, data, columnOfInterest }) => {
  const classes = useStyles();

  const basicInfo = useRecoilValue(basicInfoState);

  const chartData = useMemo(() => {
    return prepareHistogramData(
      data,
      columnOfInterest,
      basicInfo.problem_type,
      basicInfo.target_col
    );
  }, [basicInfo, plotCategoryObject, data]);

  const plotObj = plotCategoryObject.plots[0];

  return (
    <Grid item xs={12}>
      <Box className={classes.root}>
        <Stack className="stack" direction="column" gap={0.5}>
          <Paper className="name-enclosure">
            <Typography variant="h6">Distribution Plot</Typography>
          </Paper>
          {Boolean(plotCategoryObject.overallInsights) && (
            <Paper className="name-enclosure overall-insights">
              <Typography variant="subtitle1">{plotCategoryObject.overallInsights}</Typography>
            </Paper>
          )}
        </Stack>
        <Paper>
          <div className="chart-wrapper">
            <ResponsiveBar
              theme={{
                axis: {
                  legend: {
                    text: { fontSize: 14, fontWeight: 600 },
                  },
                },
              }}
              colors={{ scheme: "category10" }}
              data={chartData}
              keys={["freq"]}
              enableLabel={false}
              margin={{ top: 60, right: 90, bottom: 70, left: 140 }}
              curve="natural"
              enablePoints={false}
              useMesh
              crosshairType="cross"
              axisBottom={{
                legend: columnOfInterest,
                format: (x) => (chartData.findIndex((d) => d.id === x) % 3 === 0 ? x : ""),
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendOffset: 50,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Frequency",
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendOffset: -100,
                legendPosition: "middle",
              }}
            />
          </div>
          <Typography sx={{ mx: 6, py: 3 }} color="primary" variant="subtitle1">
            {plotObj.insights}
          </Typography>
        </Paper>
      </Box>
    </Grid>
  );
};

HistContainer.propTypes = {
  plotCategoryObject: PropTypes.object.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnOfInterest: PropTypes.string.isRequired,
};

export default HistContainer;
