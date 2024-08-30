import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";

import { Grid, Box, Paper, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

import { basicInfoState } from "src/recoil/atoms";
import { prepareWaffleData } from "src/utils/sandbox/eda/chart-utils";
import { ResponsiveWaffle } from "@nivo/waffle";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      borderRadius: "8px",
      boxShadow: "inset 2px 2px 8px 2px rgba(0,0,0,0.1)",
      backgroundColor: "#efefef",
      gap: theme.spacing(2),
      "& .name-enclosure": {
        display: "inline-block",
        padding: theme.spacing(1.5),
        marginBottom: theme.spacing(0.5),
      },
      "& .chart-wrapper": {
        width: "100%",
        height: "300px",
      },
    },
  })
);

const WaffleContainer = ({ data }) => {
  const classes = useStyles();

  const basicInfo = useRecoilValue(basicInfoState);

  const chartData = useMemo(() => {
    return prepareWaffleData(data, basicInfo.target_col);
  }, [basicInfo, data]);

  return (
    <Grid item xs={12}>
      <Box className={classes.root} component="div">
        <Paper className="name-enclosure">
          <Typography variant="h6">Percentage Distribution of Target classes</Typography>
        </Paper>
        <Paper className="chart-wrapper">
          {Boolean(chartData) && (
            <ResponsiveWaffle
              theme={{
                axis: {
                  legend: {
                    text: { fontSize: 14, fontWeight: 600 },
                  },
                },
              }}
              total={100}
              rows={5}
              columns={20}
              fillDirection="left"
              colors={{ scheme: "category10" }}
              data={chartData}
              margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              tooltipFormat=".2f"
            />
          )}
        </Paper>
      </Box>
    </Grid>
  );
};

WaffleContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default WaffleContainer;
