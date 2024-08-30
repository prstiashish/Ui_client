import { useState, useEffect, useMemo, useCallback } from "react";

import Head from "next/head";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { proxymlendpoint } from "src/utils/proxy-endpoint";

import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  Alert,
  Button,
  CircularProgress,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import DropZone from "react-dropzone";

import { DashboardLayout } from "../../components/dashboard-layout";

import http from "src/utils/http-common";
import InfoCacheWrapper from "src/components/common/wrapper";
import { allColumnsState, targetColumnState } from "src/recoil/atoms";
import sandboxHistory from "src/utils/browser-storage/sandbox-history";

const dropzoneStyles = {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#ABABAB",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#7A7A7A",
    transition: "border .3s ease-in-out",
  },
  active: {
    borderColor: "#2196f3",
  },
  accept: {
    borderColor: "#00e676",
  },
  reject: {
    borderColor: "#ff1744",
  },
};

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      "& section.dropzone": {
        marginBottom: theme.spacing(5),
      },
      "& section.preview": {
        "& div.target-col-selection": {
          marginBottom: theme.spacing(3),
        },
        "& aside.action": {
          marginTop: theme.spacing(3),
          display: "grid",
          placeItems: "center",
        },
      },
    },
    autoPointerEvents: {
      pointerEvents: "auto !important",
    },
  })
);

const offsetIncrement = 100;

const Sandbox = () => {
  const router = useRouter();
  const { fid } = router.query;

  const classes = useStyles();

  const [allColumns, setAllColumns] = useRecoilState(allColumnsState);

  const [file, setFile] = useState(null);
  const [dataLength, setDataLength] = useState(0);
  const [previewData, setPreviewData] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [selectedColumn, setSelectedColumn] = useRecoilState(targetColumnState);
  const [isUploading, setIsUploading] = useState(false);

  const [datasetOffset, setDatasetOffset] = useState(0);

  const handleDropFiles = (files) => {
    if (files[0].type != "text/csv") {
      alert("Only CSV files are supported now :(");
      return;
    }

    setFile(files[0]);
    setPage(0);
  };

  const readCSVFile = useCallback(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const csv = reader.result.split("\n");
      setDataLength(csv.length);
      const start = page * rowsPerPage + 1,
        end = Math.min(csv.length, start + rowsPerPage);

      let lines = [];
      if (start >= csv.length) {
        lines = csv.slice(0, rowsPerPage);
        setPage(0);
      } else {
        lines = csv.slice(start, end);
      }

      const header = csv[0].split(",");
      setHeaders(header);
      setAllColumns(header);
      setSelectedColumn("");
      setPreviewData([header, ...lines.map((line) => line.split(","))]);
    };
    if (file) reader.readAsText(file);
  }, [file, rowsPerPage, page]);

  const onStartAnalysis = () => {
    if (selectedColumn === "") return;

    if (fid) {
      sandboxHistory.pushHistory("data-loader", "statistics", fid, null, fid);
      router.push(`/sandbox/statistics/${fid}`);
      return;
    }

    setIsUploading(true);
    let formData = new FormData();
    formData.append("file", file);
    http
      .post(`${proxymlendpoint}/upload_file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setIsUploading(false);
        sandboxHistory.pushHistory(
          "data-loader",
          "statistics",
          res.data.file_unique_id,
          null,
          res.data.file_unique_id
        );
        router.push(`/sandbox/statistics/${res.data.file_unique_id}`);
      });
  };

  const getDataset = useCallback(() => {
    if (file || !fid) return;

    const params = new URLSearchParams({ offset: datasetOffset, limit: rowsPerPage }).toString();
    http.get(`${proxymlendpoint}/get-dataset/${fid}?${params}`).then((res) => {
      let _previewData = [];
      const header = Object.keys(res.data.items[0]);
      if (!previewData) {
        _previewData.push(header);
      }
      _previewData = _previewData.concat(res.data.items.map((row) => Object.values(row)));

      setHeaders(header);
      setPreviewData(_previewData);
      setDataLength(res.data.total);
    });
  }, [previewData, datasetOffset, file]);

  useEffect(() => {
    let start = page * rowsPerPage,
      end = Math.min(dataLength, start + rowsPerPage);
    if (dataLength !== 0 && end + rowsPerPage > previewData.length) {
      setDatasetOffset(datasetOffset + rowsPerPage);
    }
  }, [rowsPerPage, page]);

  useEffect(getDataset, [datasetOffset]);

  useEffect(() => readCSVFile(), [file, rowsPerPage, page]);

  return (
    <InfoCacheWrapper>
      <Head>
        <title>Sandbox</title>
      </Head>
      <Box className={classes.root} component="main">
        <Typography variant="h4" gutterBottom>
          Sandbox - Upload Data files
        </Typography>
        <section className="dropzone">
          <DropZone onDrop={handleDropFiles}>
            {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
              const style = {
                ...dropzoneStyles.base,
                ...(isDragActive ? dropzoneStyles.active : {}),
                ...(isDragAccept ? dropzoneStyles.accept : {}),
                ...(isDragReject ? dropzoneStyles.reject : {}),
              };
              return (
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} />
                  <p>Drag &apos;n&apos; drop the data file here, or click to select file</p>
                </div>
              );
            }}
          </DropZone>
        </section>
        <section className="preview">
          {previewData && previewData.length > 0 && (
            <div className="target-col-selection">
              <Typography variant="h6">Select the Target Column: </Typography>
              <FormControl sx={{ minWidth: "250px", marginTop: 1 }}>
                <Select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  autoFocus
                >
                  {headers.map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
          <aside>
            {previewData &&
              (previewData.length === 0 ? (
                <Alert severity="info">File has no data content!</Alert>
              ) : (
                <Paper>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {previewData[0].map((header, idx) => (
                            <TableCell key={idx}>{header}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewData.slice(1).map((row, index) => (
                          <TableRow key={index}>
                            {row.map((value, idx) => (
                              <TableCell key={idx}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    count={dataLength}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(e.target.value)}
                    page={page}
                    onPageChange={(e, p) => setPage(p)}
                  />
                </Paper>
              ))}
          </aside>
          <aside className="action">
            {previewData && previewData.length > 0 && (
              <Tooltip
                title={selectedColumn === "" ? "Select target column to proceed" : ""}
                placement="top"
              >
                <Button
                  classes={{ disabled: classes.autoPointerEvents }}
                  variant="contained"
                  onClick={onStartAnalysis}
                  disabled={selectedColumn === ""}
                  component="div"
                >
                  {isUploading ? <CircularProgress sx={{ color: "white" }} /> : ""}
                </Button>
              </Tooltip>
            )}
          </aside>
        </section>
      </Box>
    </InfoCacheWrapper>
  );
};

Sandbox.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Sandbox;
