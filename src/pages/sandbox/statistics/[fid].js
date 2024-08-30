import { useState, useEffect, useCallback, useMemo } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Tooltip,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { createStyles, makeStyles } from "@mui/styles";
import { ResponsiveLine } from "@nivo/line";
import L from "lodash";

import { DashboardLayout } from "src/components/dashboard-layout";

import PreProcessingApiService from "src/api-service/preprocessing";
import { useRecoilValue } from "recoil";
import { allColumnsState } from "src/recoil/atoms";
import InfoCacheWrapper from "src/components/common/wrapper";
import DataViewerFab from "src/components/sandbox/dataset-display/fab";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& main": {
        marginTop: theme.spacing(3),
        "& section.form": {
          marginBottom: theme.spacing(3),
        },
        "& section.stats-display": {
          "& .accordion": {
            marginBottom: theme.spacing(2),
            borderRadius: "8px",
          },
          "& .accordion::before": {
            opacity: 0,
          },
        },
        "& div.page-actions": {
          marginTop: theme.spacing(6),
          marginBottom: theme.spacing(6),
          display: "flex",
          justifyContent: "space-between",
        },
      },
    },
  })
);

const Statistics = () => {
  const router = useRouter();
  const fid = router.query.fid || null;

  const classes = useStyles();

  const columnNames = useRecoilValue(allColumnsState);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [columnStats, setColumnStats] = useState({});

  const fetchStatistics = useCallback(() => {
    PreProcessingApiService.getStatistics(fid, selectedColumn).then((res) => {
      // Remove types of measures which does not have any statistics
      setColumnStats(
        Object.fromEntries(
          Object.entries(res.stats)
            .map(([key, value]) => (L.isEmpty(value) ? null : [L.startCase(key), value]))
            .filter((el) => el)
        )
      );
    });
  }, [fid, selectedColumn]);

  const quantileChartData = useMemo(() => {
    if (!columnStats?.["Quantile Measures"]) return [];

    const data = Object.entries(columnStats["Quantile Measures"]).map(([k, v]) => ({
      x: parseInt(k.replace("%", "")),
      y: v,
    }));
    return [{ id: selectedColumn, data }];
  }, [columnStats]);

  useEffect(() => {
    if (columnNames.length > 0) setSelectedColumn(columnNames[0]);
  }, [columnNames]);

  useEffect(() => {
    if (selectedColumn) fetchStatistics();
  }, [selectedColumn]);

  const getMessageAndColor = (key, value) => {
    if (key === "kurtosis") {
      if (value > 1) return { message: "Too Peaky", color: "secondary" };
      if (value < -1) return { message: "Too Flat", color: "secondary" };
    }
    if (key === "skew") {
      if (value > 1 || value < -1) return { message: "Too Skewed", color: "secondary" };
    }
    return { message: "", color: "text.primary" };
  };

  return (
    <InfoCacheWrapper>
      <Head>
        <title>Statistics</title>
      </Head>
      <Box className={classes.root}>
        <Typography variant="h3">Statistics and Measures</Typography>
        <main>
          <section className="form">
            <FormControl sx={{ minWidth: "250px" }}>
              <InputLabel id="column-label">Column</InputLabel>
              <Select
                label="Column"
                labelId="column-label"
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
              >
                {columnNames.map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </section>
          <section className="stats-display">
            <div>
              {columnStats &&
                Object.entries(columnStats).map(([key, value], index) => (
                  <Accordion className="accordion" key={index} elevation={3}>
                    <AccordionSummary expandIcon={<ExpandMore />}>{key}</AccordionSummary>
                    <AccordionDetails>
                      {key === "Quantile Measures" ? (
                        <Box style={{ display: "grid", placeItems: "center" }}>
                          <div style={{ height: "400px", width: "100%" }}>
                            <ResponsiveLine
                              theme={{
                                axis: {
                                  legend: {
                                    text: { fontSize: 14, fontWeight: 600 },
                                  },
                                },
                              }}
                              colors={{ scheme: "category10" }}
                              data={quantileChartData}
                              margin={{ top: 50, right: 110, bottom: 60, left: 130 }}
                              xScale={{ type: "linear" }}
                              xFormat={(x) => x + "%"}
                              yScale={{
                                type: "linear",
                                min: "auto",
                                max: "auto",
                                reverse: false,
                              }}
                              yFormat=">,.2f"
                              axisBottom={{
                                orient: "bottom",
                                format: (x) => x + "%",
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "Quantiles",
                                legendOffset: 50,
                                legendPosition: "middle",
                              }}
                              axisLeft={{
                                orient: "left",
                                format: ">-,",
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "Data Value",
                                legendOffset: -110,
                                legendPosition: "middle",
                              }}
                              pointSize={6}
                              pointBorderWidth={3}
                              pointLabelYOffset={-12}
                              enableSlices={false}
                              useMesh={true}
                              curve="linear"
                              tooltipFormat=">,.2f"
                            />
                          </div>
                        </Box>
                      ) : (
                        <Grid container>
                          {Object.entries(value).map(([k, v], i) => {
                            const { message, color } = getMessageAndColor(k, v);
                            return (
                              <Grid key={i} item xs={3}>
                                <Typography variant="subtitle1" sx={{ display: "inline" }}>
                                  {k}:{"    "}
                                </Typography>
                                <Tooltip title={message} placement="top-end">
                                  <Typography
                                    style={{ fontWeight: message ? "bold" : "normal" }}
                                    variant="body1"
                                    sx={{ display: "inline" }}
                                    color={color}
                                  >
                                    {v}
                                  </Typography>
                                </Tooltip>
                              </Grid>
                            );
                          })}
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
            </div>
          </section>
          <div className="page-actions">
            <Link href={`/sandbox?fid=${fid}`} passHref>
              <Button variant="outlined">Prev: Data Loading</Button>
            </Link>
            <Link href={`/sandbox/encoding/${fid}`} passHref>
              <Button variant="contained">Next: Data Encoding</Button>
            </Link>
          </div>
        </main>
        <DataViewerFab fid={fid} />
      </Box>
    </InfoCacheWrapper>
  );
};

Statistics.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Statistics;
