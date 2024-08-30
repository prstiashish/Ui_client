import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { ResponsiveRadar } from "@nivo/radar";
import L from "lodash";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
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

const BasicModelsResults = ({ results, fetchResults, isLoading }) => {
  const classes = useStyles();

  const [selectedIndices, setSelectedIndices] = useState(null);
  const [tableOrder, setTableOrder] = useState("asc");
  const [tableOrderBy, setTableOrderBy] = useState();
  const [radarData, setRadarData] = useState(null);

  const modelMetrics = useMemo(() => {
    if (!results) return null;
    return Object.entries(results).map(([key, metrics]) => ({
      "Model Name": L.startCase(key),
      ...metrics,
    }));
  }, [results]);

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
    if (modelMetrics !== null && selectedIndices === null) {
      onSelectAllClick();
    }
  }, [modelMetrics]);

  const renderNoResultCase = () => {
    return (
      <div className={classes.centerify}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button color="secondary" variant="contained" onClick={fetchResults}>
            Fit all models
          </Button>
        )}
      </div>
    );
  };

  return (
    <Box className={classes.root}>
      {modelMetrics == null ? (
        renderNoResultCase()
      ) : (
        <div className="all-model-metrics">
          <Typography variant="h5">All Models</Typography>
          {selectedIndices !== null && (
            <Table className="metrics-table">
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
                keys={Object.keys(modelMetrics[0]).filter((k) => k !== "Model Name")}
                indexBy="Model Name"
                colors={{ scheme: "category10" }}
                valueFormat=">-.2f"
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                blendMode="multiply"
              />
            </Box>
          </Box>
        </div>
      )}
    </Box>
  );
};

BasicModelsResults.propTypes = {
  results: PropTypes.object,
  fetchResults: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default BasicModelsResults;
