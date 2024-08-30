import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";

import { Grid, Box, Paper, Typography, Collapse, IconButton, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createStyles, makeStyles } from "@mui/styles";
import { ResponsiveHeatMap } from "@nivo/heatmap";

import { prepareHeatmapData } from "src/utils/sandbox/eda/chart-utils";

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
        height: "1000px",
      },
    },
  })
);

const HeatmapContainer = ({ correlationData, overallInsights }) => {
  const classes = useStyles();

  const [isExpanded, setIsExpanded] = useState(false);
  const chartData = useMemo(() => prepareHeatmapData(correlationData), [correlationData]);

  return (
    <Grid item xs={12}>
      <Box className={classes.root} component="div">
        <Stack className="stack" direction="column" gap={0.5}>
          <Paper className="name-enclosure">
            <Typography variant="h6" component="span">
              Heatmap of Correlation
            </Typography>{" "}
            <IconButton onClick={() => setIsExpanded(!isExpanded)}>
              <ExpandMoreIcon />
            </IconButton>
          </Paper>
          {Boolean(overallInsights) && (
            <Paper className="name-enclosure overall-insights">
              <Typography variant="subtitle1">{overallInsights}</Typography>
            </Paper>
          )}
        </Stack>
        <Collapse in={isExpanded}>
          <Paper className="chart-wrapper">
            {isExpanded && (
              <ResponsiveHeatMap
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 60, left: 100 }}
                colors={{
                  type: "diverging",
                  scheme: "red_yellow_blue",
                  divergeAt: 0.5,
                  minValue: -1,
                  maxValue: 1,
                }}
                enableLabels={false}
                animate={false}
                hoverTarget="cell"
                inactiveOpacity={1}
                legends={[
                  {
                    anchor: "bottom",
                    translateX: 0,
                    translateY: 30,
                    length: 400,
                    thickness: 8,
                    direction: "row",
                    tickPosition: "after",
                    tickSize: 3,
                    tickSpacing: 4,
                    tickOverlap: false,
                    tickFormat: ">-.2s",
                    title: "Value →",
                    titleAlign: "start",
                    titleOffset: 4,
                  },
                ]}
              />
            )}
          </Paper>
        </Collapse>
      </Box>
    </Grid>
  );
};

HeatmapContainer.propTypes = {
  correlationData: PropTypes.object.isRequired,
  overallInsights: PropTypes.string,
};

export default HeatmapContainer;
