import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";

import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Step,
  StepButton,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { ResponsiveRadar } from "@nivo/radar";
import L from "lodash";

import { allColumnsState } from "src/recoil/atoms";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& div.nest": {
        marginLeft: theme.spacing(3),
      },
      "& div.best-model-params": {
        "& div.pipeline": {
          marginBlock: theme.spacing(4),
          "& .components-stepper": {
            marginTop: theme.spacing(2),
          },
          "& div.params-wrapper": {
            marginTop: theme.spacing(2),
            marginLeft: theme.spacing(6),
            "& div.param": {
              marginBlock: theme.spacing(1),
            },
          },
        },
      },
      "& div.all-model-metrics": {
        marginBlock: theme.spacing(4),
        "& .metrics-table": {
          marginTop: theme.spacing(2),
        },
        "& .chart-wrapper": {
          display: "grid",
          placeItems: "center",
          "& .radar-container": {
            height: "600px",
            width: "100%",
          },
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

const FullPipelineResults = ({ results, fetchResults, isLoading }) => {
  const classes = useStyles();

  const allColumns = useRecoilValue(allColumnsState);

  const [activePipeline, setActivePipeline] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState(null);
  const [tableOrder, setTableOrder] = useState("asc");
  const [tableOrderBy, setTableOrderBy] = useState();
  const [radarData, setRadarData] = useState(null);

  const handleStepChange = (index) => setActivePipeline(index);

  const { bestModelInfo, bestModelComponents, componentNames, modelMetrics } = useMemo(() => {
    if (!results)
      return {
        bestModelInfo: null,
        bestModelComponents: null,
        componentNames: null,
        modelMetrics: null,
      };

    const _bestModelInfo = results.best_model_info;
    const _modelMetrics = Object.entries(results.model_pipeline_metrics).map(([key, metrics]) => ({
      "Pipeline Name": key,
      ...metrics,
    }));

    return {
      bestModelInfo: _bestModelInfo,
      bestModelComponents: _bestModelInfo.components,
      componentNames: Object.keys(_bestModelInfo.components),
      modelMetrics: _modelMetrics,
    };
  }, [results]);

  const currentParams =
    bestModelComponents && componentNames
      ? bestModelComponents[componentNames[activePipeline]].parameters
      : null;

  const onSelectAllClick = () => {
    if (selectedIndices && selectedIndices.length === modelMetrics.length) {
      setSelectedIndices([]);
      setRadarData([]);
    } else {
      setSelectedIndices(L.range(modelMetrics.length));
      setRadarData(modelMetrics);
    }
  };
  const handleTableRowClick = (index) => {
    let tempIndices = selectedIndices;
    if (selectedIndices.includes(index)) {
      tempIndices = tempIndices.filter((x) => x !== index);
    } else {
      tempIndices.push(index);
    }
    setSelectedIndices(tempIndices);
    const chartData = modelMetrics.filter((val, i) => tempIndices.includes(i));
    setRadarData(chartData);
  };
  const handleTableSortChange = (colName) => {
    const isAsc = tableOrderBy === colName && tableOrder === "asc";
    setTableOrder(isAsc ? "desc" : "asc");
    setTableOrderBy(colName);
  };

  useEffect(() => {
    if (modelMetrics !== null && selectedIndices === null) onSelectAllClick();
  }, [modelMetrics]);

  const renderNoResultCase = () => {
    return (
      <div className={classes.centerify}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button color="secondary" variant="contained" onClick={fetchResults}>
            Run all pipelines
          </Button>
        )}
      </div>
    );
  };

  return (
    <Box className={classes.root}>
      {bestModelInfo == null || modelMetrics == null ? (
        renderNoResultCase()
      ) : (
        <>
          <div className="best-model-params">
            <Stack className="high-level-info">
              <Typography sx={{ paddingBottom: 1 }} variant="h5">
                Best Pipeline
              </Typography>
              <Stack className="nest" spacing={1.5}>
                <BoldTypography variant="h5">{bestModelInfo.name}</BoldTypography>
                <Typography variant="h6">
                  Problem Type: <BoldTypography>{bestModelInfo.problem_type}</BoldTypography>
                </Typography>
                <Typography variant="h6">
                  Model Family: <BoldTypography>{bestModelInfo.model_family}</BoldTypography>
                </Typography>
              </Stack>
            </Stack>
            <div className="pipeline nest">
              <Typography variant="h5">Pipeline Components</Typography>
              <Stepper
                className="components-stepper"
                nonLinear
                activeStep={activePipeline}
                alternativeLabel
              >
                {componentNames.map((comp, index) => (
                  <Step key={index}>
                    <StepButton color="inherit" onClick={() => handleStepChange(index)}>
                      {comp}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
              <div className="params-wrapper">
                {Object.entries(currentParams).map(([key, value]) => {
                  if (key === "columns")
                    return (
                      <div className="param">
                        <Typography variant="subtitle" component="p" sx={{ marginBottom: 1 }}>
                          Selected Columns:{" "}
                        </Typography>
                        <Stack direction="row" sx={{ flexWrap: "wrap", marginLeft: 3 }}>
                          {allColumns.map((colName, index) => {
                            const selected = value.includes(colName);
                            return (
                              <Tooltip
                                key={index}
                                placement="top"
                                title={selected ? "Column selected" : "Column not selected"}
                              >
                                <Chip
                                  sx={{ m: 0.25 }}
                                  label={colName}
                                  color={selected ? "success" : "error"}
                                  variant={selected ? "container" : "outlined"}
                                />
                              </Tooltip>
                            );
                          })}
                        </Stack>
                      </div>
                    );
                  return (
                    <div className="param" key={key}>
                      <Typography variant="subtitle">
                        {key}: <BoldTypography>{String(value)}</BoldTypography>
                      </Typography>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Divider sx={{ border: "1px solid #bbb", mx: 10 }} variant="middle" />
          <div className="all-model-metrics">
            <Typography variant="h5">All Pipelines</Typography>
            {selectedIndices !== null && (
              <Table className="metrics-table nest">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selectedIndices.length > 0 && selectedIndices.length < modelMetrics.length
                        }
                        checked={
                          modelMetrics.length > 0 && selectedIndices.length === modelMetrics.length
                        }
                        onChange={onSelectAllClick}
                      />
                    </TableCell>
                    {Object.keys(modelMetrics[0]).map((colName, index) => (
                      <TableCell key={index}>
                        <TableSortLabel
                          active={tableOrderBy === colName}
                          direction={tableOrderBy === colName ? tableOrder : "asc"}
                          onClick={() => handleTableSortChange(colName)}
                        >
                          {colName}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modelMetrics
                    .sort((a, b) =>
                      tableOrder === "asc"
                        ? a[tableOrderBy] - b[tableOrderBy]
                        : b[tableOrderBy] - a[tableOrderBy]
                    )
                    .map((row, index) => (
                      <TableRow
                        key={index}
                        hover
                        role="checkbox"
                        selected={selectedIndices.includes(index)}
                        tabIndex={-1}
                        onClick={() => handleTableRowClick(index)}
                      >
                        <Checkbox color="primary" checked={selectedIndices.includes(index)} />
                        {Object.values(row).map((val, idx) => (
                          <TableCell key={idx}>{val}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
            <Box className="chart-wrapper">
              <Box className="radar-container">
                <ResponsiveRadar
                  data={radarData}
                  keys={Object.keys(modelMetrics[0]).filter((k) => k !== "Pipeline Name")}
                  indexBy="Pipeline Name"
                  colors={{ scheme: "category10" }}
                  valueFormat=">-.2f"
                  margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                  blendMode="multiply"
                />
              </Box>
            </Box>
          </div>
        </>
      )}
    </Box>
  );
};

FullPipelineResults.propTypes = {
  results: PropTypes.object,
  fetchResults: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default FullPipelineResults;

const BoldTypography = ({ variant = "inherit", children }) => (
  <Typography color="primary" variant={variant} component="span">
    {children}
  </Typography>
);
