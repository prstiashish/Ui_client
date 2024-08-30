import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

import BasicApiService from "src/api-service/basic";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      overflowX: "auto",
    },
    progress: {
      display: "grid",
      placeItems: "center",
    },
  })
);

const offsetIncrement = 300;

const DataViewer = ({ fid, initData = [], total = 0 }) => {
  const classes = useStyles();

  const getInitPreviewData = useCallback(() => {
    if (initData.length) {
      if (initData.length >= rowsPerPage) return initData.slice(0, rowsPerPage);
      else return initData;
    }
    return [];
  }, []);

  const [data, setData] = useState(initData);
  const [dataTotal, setDataTotal] = useState(total);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [previewData, setPreviewData] = useState(getInitPreviewData());
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);

  const getDataset = useCallback(() => {
    BasicApiService.getPaginatedDataset(fid, offset, offsetIncrement).then((res) => {
      const tempData = data.concat(res.items);
      setData(tempData);
      setDataTotal(res.total);
    });
  }, [data, offset]);

  useEffect(getDataset, [offset]);

  useEffect(() => {
    if (!dataTotal) return;

    let start = page * rowsPerPage,
      end = Math.min(dataTotal, start + rowsPerPage);
    setPreviewData(data.slice(start, end));

    // Pre-cache the next page of data
    if (dataTotal !== null && end + rowsPerPage > data.length) {
      setOffset(offset + offsetIncrement);
    }
  }, [data, page, rowsPerPage, dataTotal]);

  const renderTableBody = (data) => {
    return (
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            {Object.values(row).map((col, i) => (
              <TableCell key={i}>{col}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return previewData.length > 0 ? (
    <Paper className={classes.root} elevation={5}>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(previewData[0]).map((col, i) => (
              <TableCell key={i}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {renderTableBody(previewData)}
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(e.target.value)}
        count={dataTotal}
        page={page}
        onPageChange={(_e, p) => setPage(p)}
      />
    </Paper>
  ) : (
    <div className={classes.progress}>
      <CircularProgress />
    </div>
  );
};

DataViewer.propTypes = {
  fid: PropTypes.string.isRequired,
  initData: PropTypes.arrayOf(PropTypes.object),
  total: PropTypes.number,
};

export default DataViewer;
