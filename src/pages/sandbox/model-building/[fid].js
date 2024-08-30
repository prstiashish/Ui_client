import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useRecoilValue } from "recoil";

import { useSnackbar } from "notistack";
import { Box, Button, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { makeStyles, createStyles } from "@mui/styles";

import InfoCacheWrapper from "src/components/common/wrapper";
import { DashboardLayout } from "src/components/dashboard-layout";
import DataViewerFab from "src/components/sandbox/dataset-display/fab";
import FullPipelineResults from "src/components/sandbox/model-building/full-pipeline";
import BasicModelsResults from "src/components/sandbox/model-building/basic-models";

import sandboxHistory from "src/utils/browser-storage/sandbox-history";
import MLModelApiService from "src/api-service/ml-model";
import { targetColumnState } from "src/recoil/atoms";
import ModelInference from "src/components/sandbox/model-building/model-inference";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& div.page-actions": {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        display: "flex",
        justifyContent: "space-between",
      },
    },
  })
);

const ModelBuilding = () => {
  const classes = useStyles();

  const router = useRouter();
  const { fid } = router.query;

  const { enqueueSnackbar } = useSnackbar();

  const targetColumn = useRecoilValue(targetColumnState);

  const [origFid, setOrigFid] = useState(null);
  const [selectedTab, setSelectedTab] = useState("1");
  const [pipelineResults, setPipelineResults] = useState(null);
  const [shouldPipelineTabLoad, setShouldPipelineTabLoad] = useState(false);
  const [basicResults, setBasicResults] = useState(null);
  const [shouldBasicTabLoad, setShouldBasicTabLoad] = useState(false);

  const [modelInferenceOpen, setModelInferenceOpen] = useState(false);

  const handleModelInferenceOpen = () => setModelInferenceOpen(true);
  const handleModelInferenceClose = () => setModelInferenceOpen(false);

  useEffect(() => {
    const hist = sandboxHistory.getFromHistory("data-loader");
    setOrigFid(hist.fid || fid);
  }, []);

  const getFullPipelineResults = () => {
    if (!origFid) return;
    setShouldPipelineTabLoad(true);
    MLModelApiService.getFullPipelineModelResults(origFid, targetColumn, () => {
      enqueueSnackbar("Hardware could not process the huge data", { variant: "error" });
      setShouldPipelineTabLoad(false);
    }).then((res) => {
      setPipelineResults(res);
      setShouldPipelineTabLoad(false);
    });
  };

  const getBasicResults = () => {
    if (!fid) return;
    setShouldBasicTabLoad(true);
    MLModelApiService.getBasicModelResults(fid, targetColumn, () => {
      enqueueSnackbar("Hardware could not process the huge data", { variant: "error" });
      setShouldBasicTabLoad(false);
    }).then((res) => {
      setBasicResults(res);
      setShouldBasicTabLoad(false);
    });
  };

  return (
    <InfoCacheWrapper>
      <Head>
        <title>Model Building</title>
      </Head>
      <Box className={classes.root} component="main">
        <Typography sx={{ mb: 2 }} variant="h4">
          Model Building
        </Typography>
        <section>
          <TabContext value={selectedTab}>
            <Box>
              <TabList onChange={(e, v) => setSelectedTab(v)}>
                <Tab label="Full Pipeline Model" value="1" />
                <Tab label="Basic Model" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <FullPipelineResults
                results={pipelineResults}
                fetchResults={getFullPipelineResults}
                isLoading={shouldPipelineTabLoad}
              />
            </TabPanel>
            <TabPanel value="2">
              <BasicModelsResults
                results={basicResults}
                fetchResults={getBasicResults}
                isLoading={shouldBasicTabLoad}
              />
            </TabPanel>
          </TabContext>
        </section>
        <div className="page-actions">
          <Link href={`/sandbox/eda/${fid}`} passHref>
            <Button variant="outlined">Prev: Exploratory Data Analysis</Button>
          </Link>

          {selectedTab === "2" && Boolean(basicResults) && (
            <Button variant="contained" onClick={handleModelInferenceOpen}>
              See Model Inference
            </Button>
          )}
        </div>
        {modelInferenceOpen && (
          <ModelInference open={modelInferenceOpen} handleClose={handleModelInferenceClose} />
        )}
        <DataViewerFab fid={fid} />
      </Box>
    </InfoCacheWrapper>
  );
};

ModelBuilding.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ModelBuilding;
