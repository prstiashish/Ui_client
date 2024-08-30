import React, { useState, useEffect, useMemo, useCallback } from "react";

import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";

import { useSnackbar } from "notistack";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import L from "lodash";

import { DashboardLayout } from "src/components/dashboard-layout";
import InfoCacheWrapper from "src/components/common/wrapper";

import ScatterContainer from "src/components/sandbox/eda/scatter-container";
import PairScatterContainer from "src/components/sandbox/eda/pair-scatter-container";
import HistContainer from "src/components/sandbox/eda/hist-container";
import DistContainer from "src/components/sandbox/eda/dist-container";
import HeatmapContainer from "src/components/sandbox/eda/heatmap-container";
import WaffleContainer from "src/components/sandbox/eda/waffle-container";

import { allColumnsState, basicInfoState, targetColumnState } from "src/recoil/atoms";
import PreProcessingApiService from "src/api-service/preprocessing";
import BasicApiService from "src/api-service/basic";
import DataViewerFab from "src/components/sandbox/dataset-display/fab";
import { ProblemType } from "src/utils/sandbox/eda/chart-utils";
import BarContainer from "src/components/sandbox/eda/bar-container";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .graphset-enclosure": {
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(3),
      },
      "& .subtitle": {
        marginBottom: theme.spacing(2),
      },
      "& section.overall-graphs": {
        marginBottom: theme.spacing(4),
      },
      "& section.column-graphs": {
        marginTop: theme.spacing(4),
        "& section.form": {
          marginTop: theme.spacing(3),
          marginBottom: theme.spacing(3),
        },
      },
      "& div.page-actions": {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        display: "flex",
        justifyContent: "space-between",
      },
    },
  })
);

// TODO: Store router history in browser session storage for proper routing
const EDA = () => {
  const classes = useStyles();

  const router = useRouter();
  const { fid } = router.query;

  const { enqueueSnackbar } = useSnackbar();

  const allColumns = useRecoilValue(allColumnsState);
  const basicInfo = useRecoilValue(basicInfoState);
  const [suggestedEDA, setSuggestedEDA] = useState(null);
  const [correlation, setCorrelation] = useState(null);
  const [featureScores, setFeatureScores] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const targetColumn = useRecoilValue(targetColumnState);

  const getEDASuggestions = () => {
    if (targetColumn === "") return;

    const edaApi = PreProcessingApiService.getEDASuggestion(fid, targetColumn, () => {
      enqueueSnackbar("Hardware could not process the huge data", { variant: "error" });
      setIsLoading(false);
    });
    const corrApi = PreProcessingApiService.getCorrelationValues(fid);
    const featureSelectApi = PreProcessingApiService.getFeatureSelectionScores(fid, targetColumn);

    Promise.all([edaApi, corrApi, featureSelectApi])
      .then((responses) => {
        setSuggestedEDA(responses[0].items);
        setCorrelation(responses[1]);
        setFeatureScores(responses[2].items);
      })
      .then(() => setIsLoading(false));
  };

  const relatedPlots = useMemo(() => {
    if (!suggestedEDA) return [];

    return suggestedEDA
      .map((plotCategoryObject) => {
        const plotType = plotCategoryObject.type;
        return {
          type: plotType,
          plots:
            plotType === "heatmap"
              ? plotCategoryObject.plots
              : plotCategoryObject.plots.filter(
                  (plot) => plot.axis1 === selectedColumn || plot.axis2 === selectedColumn
                ),
          overallInsights: plotCategoryObject.overall_insights,
        };
      })
      .filter((categoryObject) => !L.isEmpty(categoryObject.plots));
  }, [suggestedEDA, selectedColumn]);

  const getDataset = () => {
    BasicApiService.getPaginatedDataset(fid, 0, 1500).then((res) => setData(res.items));
  };

  useEffect(() => {
    if (fid) {
      getEDASuggestions();
      getDataset();
    }
  }, [fid, targetColumn]);
  useEffect(() => {
    if (L.isEmpty(allColumns) || L.isEmpty(basicInfo)) return;
    setSelectedColumn(allColumns.filter((col) => !basicInfo.unique_id_cols.includes(col))[0]);
  }, [allColumns, basicInfo]);

  const plots = useMemo(() => {
    if (data.length === 0) return [];

    return relatedPlots
      .map((plotCategoryObject) => {
        const { type } = plotCategoryObject;

        if (L.isEmpty(plotCategoryObject.plots)) return null;

        switch (type) {
          case "scatter":
            return (
              <ScatterContainer
                plotCategoryObject={plotCategoryObject}
                data={data}
                columnOfInterest={selectedColumn}
              />
            );

          case "pair_scatter":
            return (
              <PairScatterContainer
                plotCategoryObject={plotCategoryObject}
                data={data}
                columnOfInterest={selectedColumn}
              />
            );

          case "distribution":
            return (
              <HistContainer
                plotCategoryObject={plotCategoryObject}
                data={data}
                columnOfInterest={selectedColumn}
              />
            );

          case "box":
            const ViolinContainer = dynamic(
              () => import("src/components/sandbox/eda/violin-container"),
              { ssr: false }
            );
            return (
              <ViolinContainer
                data={data}
                columnOfInterest={selectedColumn}
                plotCategoryObject={plotCategoryObject}
              />
            );

          case "bar":
            return (
              <DistContainer
                plotCategoryObject={plotCategoryObject}
                data={data}
                columnOfInterest={selectedColumn}
              />
            );

          default:
            return null;
        }
      })
      .filter((el) => el);
  }, [relatedPlots, correlation, data, selectedColumn]);

  return (
    <InfoCacheWrapper>
      <Head>
        <title>EDA</title>
      </Head>
      <Box className={classes.root} component="main">
        <Typography sx={{ mb: 2 }} variant="h4">
          Exploratory Data Analysis (EDA)
        </Typography>
        <section className="overall-graphs">
          <Typography className="subtitle" variant="h5">
            Dataset level EDA
          </Typography>
          {!isLoading && Boolean(suggestedEDA) && (
            <Grid className="graphset-enclosure" container gap={3}>
              {basicInfo.problem_type === ProblemType.classification && (
                <WaffleContainer data={data} />
              )}
              {featureScores !== null && (
                <BarContainer
                  axis1Values={featureScores.plots[0].axis1}
                  axis2Values={featureScores.plots[0].axis2}
                  overallInsights={featureScores.overall_insights}
                />
              )}
              {correlation !== null && (
                <HeatmapContainer
                  correlationData={correlation}
                  overallInsights={
                    (suggestedEDA || []).find((el) => el.type === "heatmap").overall_insights
                  }
                />
              )}
            </Grid>
          )}
        </section>
        <Divider sx={{ border: "1px solid #bbb", mx: 10 }} variant="middle" />
        <section className="column-graphs">
          <Typography className="subtitle" variant="h5">
            Column level EDA
          </Typography>
          <section className="form">
            <FormControl sx={{ minWidth: "250px" }}>
              <InputLabel id="column-label">Feature of Interest</InputLabel>
              <Select
                label="Feature of Interest"
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
          </section>
          <section className="eda-display">
            {isLoading ? (
              <div style={{ display: "grid", placeItems: "center", width: "100%", height: "100%" }}>
                <CircularProgress />
              </div>
            ) : (
              Boolean(suggestedEDA) && (
                <Grid className="graphset-enclosure" container gap={3}>
                  {plots.length > 0 ? (
                    plots
                  ) : (
                    <Typography sx={{ margin: "auto", p: 1 }} component="span">
                      No graphs to display for column{" "}
                      <Typography sx={{ fontWeight: "bold" }} component="span" color="primary">
                        {selectedColumn}
                      </Typography>
                      !
                    </Typography>
                  )}
                </Grid>
              )
            )}
          </section>
        </section>
        <div className="page-actions">
          <Link href={`/sandbox/imputation/${fid}`} passHref>
            <Button variant="outlined">Prev: Null Imputation</Button>
          </Link>
          <Link href={`/sandbox/model-building/${fid}`} passHref>
            <Button variant="contained">Next: Model Building</Button>
          </Link>
        </div>
        {Boolean(fid) && <DataViewerFab fid={fid} />}
      </Box>
    </InfoCacheWrapper>
  );
};

EDA.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default EDA;
