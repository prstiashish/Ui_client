import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createStyles, makeStyles } from "@mui/styles";
import L from "lodash";

import MLModelApiService from "src/api-service/ml-model";
import ModelPerformance from "./model-performance";
import InferenceItem from "./inference-item";
import ConfusionMatrix from "./confusion-matrix";
import PrecisionPlot from "./precision-plot";
import AucPlot from "./auc-plot";
import { useRecoilValue } from "recoil";
import { basicInfoState } from "src/recoil/atoms";
import { ProblemType } from "src/utils/sandbox/eda/chart-utils";
import BasicApiService from "src/api-service/basic";
import { useRouter } from "next/router";
import PredictedVsPlot from "./predicted-vs-plot";
import PredictedVsChoosablePlot from "./predicted-vs-choosable-plot";
import http from "src/utils/http-common";
import { proxymlendpoint } from "src/utils/proxy-endpoint";
import MUIDataTable from "mui-datatables";
import { TableRow } from "@mui/material";
import { TableCell } from "@mui/material";
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .title": {
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      },
      "& main": {
        "& .plots": {
          marginTop: theme.spacing(3),
        },
      },
    },
    centerify: {
      height: "100%",
      width: "100%",
      display: "grid",
      placeItems: "center",
    },
  })
);

const ModelInference = ({ open, handleClose }) => {
  const classes = useStyles();

  const router = useRouter();
  const { fid } = router.query;

  const basicInfo = useRecoilValue(basicInfoState);

  const [isLoading, setIsLoading] = useState(true);
  const [inferences, setInferences] = useState(null);
  const [selectedModel, setSelectedModel] = useState("");
  const [dataset, setDataset] = useState([]);
  const [predicitiondataset, setPredicitiondataset] = useState([]);

  const [headers, setHeaders] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [dataLength, setDataLength] = useState(0);
  const [TableObject, setTableObject] = useState({
    ColumsList: [],
    RowList: [],
  });

  useEffect(async () => {
    getDropDown();
  }, []);

  async function getDropDown() {
    await MLModelApiService.getModelInferences().then(async (res) => {
      setInferences(res);
      let _SelectedModel = res.length > 0 ? res[0].model_name : "";

      await getInferenceData();
      setSelectedModel(_SelectedModel);
      setIsLoading(false);
    });
  }
  async function getInferenceData() {
    await http.get(`${proxymlendpoint}/get_inference_results`).then((res) => {
      if (res?.data?.inference) {
        let _temp = selectedModel;
        setSelectedModel(_temp);
        setPredicitiondataset(res.data.inference);
      }
    });
  }

  useEffect(() => {
    if (!fid) return;
    if (basicInfo.problem_type === ProblemType.regression) {
      BasicApiService.getPaginatedDataset(fid, 0, 1000).then((res) => setDataset(res.items));
    }
  }, [basicInfo, fid]);
  useEffect(() => {}, []);

  useEffect(() => {
    PredictionFilter();
  }, [selectedModel]);

  function PredictionFilter() {
    console.log(predicitiondataset);
    const filterData = predicitiondataset.find((x) => x.model_name == selectedModel);
    if (filterData?.inference_data) {
      const { prediction_results } = filterData.inference_data;
      if (prediction_results?.length) {
        const PreditionKeys = Object.keys(prediction_results[0]);
        const PreditionColums = [];
        PreditionKeys.forEach((ele) => {
          PreditionColums.push({
            label: ele,
            name: ele,
          });
        });

        setTableObject((pre) => ({
          ...pre,
          ColumsList: PreditionColums,
          RowList: prediction_results,
        }));
      }
    }
  }

  const renderInferenceContents = () => {
    const modelInference = inferences.find((x) => x.model_name === selectedModel);
    if (modelInference) {
      return Object.entries(modelInference.inference_data).map(([plotName, contents]) => {
        switch (plotName) {
          case "model_performance":
            return (
              <InferenceItem title={L.startCase(plotName)}>
                <ModelPerformance info={contents} />
              </InferenceItem>
            );

          case "confusion_matrix":
            return (
              <InferenceItem title={L.startCase(plotName)}>
                <ConfusionMatrix info={contents} />
              </InferenceItem>
            );

          case "precision_plot":
            return (
              <InferenceItem title={L.startCase(plotName)}>
                <PrecisionPlot info={contents} />
              </InferenceItem>
            );

          case "roc_auc_curve":
            return (
              <InferenceItem title="ROC AUC Curve">
                <AucPlot info={contents} />
              </InferenceItem>
            );

          case "pr_auc_curve":
            return (
              <InferenceItem title="PR AUC Curve">
                <AucPlot info={contents} />
              </InferenceItem>
            );

          case "predicted_vs_actual":
            return (
              <InferenceItem title={L.startCase(plotName)}>
                <PredictedVsPlot info={contents} />
              </InferenceItem>
            );

          case "predicted_vs_residuals":
            return (
              <InferenceItem title={L.startCase(plotName)}>
                <PredictedVsPlot info={contents} drawBaseline />
              </InferenceItem>
            );

          case "features_vs_residuals":
            return (
              <InferenceItem title={L.startCase(plotName)}>
                <PredictedVsChoosablePlot data={dataset} info={contents} drawBaseline />
              </InferenceItem>
            );

          default:
            return null;
        }
      });
    } else {
      return "";
    }
  };
  return (
    <Dialog className={classes.root} open={open} onClose={handleClose} maxWidth="xl" scroll="paper">
      <DialogTitle className="title">
        <Typography variant="h5" component="span">
          Model Inferences
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <div className={classes.centerify}>
            <CircularProgress />
          </div>
        ) : (
          <main>
            <FormControl sx={{ minWidth: "230px" }}>
              <InputLabel id="model-label">Model</InputLabel>
              <Select
                label="Model"
                labelId="model-label"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {inferences.map((inf, index) => (
                  <MenuItem key={index} value={inf.model_name}>
                    {inf.model_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div>
              <MUIDataTable
                title={""}
                data={TableObject.RowList ?? []}
                columns={TableObject.ColumsList ?? []}
                options={{
                  selectableRowsHideCheckboxes: true,
                  customRowRender: (data, dataIndex, rowIndex) => {
                    let style = {};
                    if (data[4] != data[5]) {
                      style.color = "red";
                    } else {
                      style.color = "";
                    }

                    return (
                      <TableRow>
                        {TableObject.ColumsList.map((ele, index) => {
                          return (
                            <>
                              <TableCell style={style}>
                                <Typography>{data[index]}</Typography>
                              </TableCell>
                            </>
                          );
                        })}
                      </TableRow>
                    );
                  },
                }}
              />
            </div>
            <Grid className="plots" container spacing={2}>
              {renderInferenceContents()}
            </Grid>
          </main>
        )}
      </DialogContent>
    </Dialog>
  );
};

ModelInference.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModelInference;
