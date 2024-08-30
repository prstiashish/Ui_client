import { useState, useEffect, useCallback } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Box,
  Collapse,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Switch,
  FormGroup,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

import { DashboardLayout } from "src/components/dashboard-layout";

import http from "src/utils/http-common";
import ColumnSpec from "src/components/sandbox/imputation/column-spec";
import { Add as AddIcon, ExpandMore } from "@mui/icons-material";

import { ArrowDown } from "src/icons/arrow-down";
import InfoCacheWrapper from "src/components/common/wrapper";
import { proxymlendpoint } from "src/utils/proxy-endpoint";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .no-null-message": {
        marginTop: theme.spacing(3),
      },
      "& section.content": {
        marginTop: theme.spacing(3),
        "& section.form": {
          marginBottom: theme.spacing(3),
          "& .all-or-col": {
            "& span.input-meta": { marginRight: theme.spacing(4) },
            "& label": {
              display: "inline",
              fontWeight: "600",
            },
          },
          "& .spec-group": {
            paddingLeft: theme.spacing(10),
            "& .add-spec-btn": {
              marginTop: theme.spacing(2),
              width: "fit-content",
              borderWidth: "3px",
              padding: "8px 0",
              "&:hover": {
                borderWidth: "3px",
              },
            },
          },
          "& .update-action-btn": {
            marginTop: theme.spacing(2),
          },
        },
        "& section.data-display": {
          "& div.table-wrapper": {
            overflowX: "auto",
          },
          "& div.arrow-container": {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            display: "grid",
            placeItems: "center",
          },
        },
      },
      "& div.page-actions": {
        marginTop: theme.spacing(6),
        display: "flex",
        justifyContent: "space-between",
      },
    },
  })
);

const offsetIncrement = 100;

const NullImputation = () => {
  const classes = useStyles();

  const router = useRouter();
  const { fid, prevFid } = router.query;

  const [nullColumns, setNullColumns] = useState(null);

  const [imputeForAll, setImputeForAll] = useState(true);
  const [colSpecs, setColSpecs] = useState({});

  const [beforeData, setBeforeData] = useState([]);
  const [bDataPreview, setBDataPreview] = useState([]);
  const [bDataTotal, setBDataTotal] = useState(null);
  const [bDataOffset, setBDataOffset] = useState(0);
  const [bDataPage, setBDataPage] = useState(0);
  const [bDataRowsPerPage, setBDataRowsPerPage] = useState(10);

  const [afterData, setAfterData] = useState([]);
  const [aDataPreview, setADataPreview] = useState([]);
  const [aDataTotal, setADataTotal] = useState(null);
  const [aDataOffset, setADataOffset] = useState(0);
  const [aDataFid, setADataFid] = useState(null);
  const [aDataPage, setADataPage] = useState(0);
  const [aDataRowsPerPage, setADataRowsPerPage] = useState(10);

  const [isLoading, setIsLoading] = useState(false);

  const initNullColumns = useCallback(() => {
    if (!fid) return;

    http.get(`${proxymlendpoint}/get_null_cols/${fid}`).then((res) => {
      setNullColumns(res.data);
    });
  }, [fid]);

  const getBeforeData = useCallback(() => {
    if (!fid || !nullColumns?.length) return;

    const params = new URLSearchParams({ offset: bDataOffset, limit: 100 }).toString();
    http.get(`${proxymlendpoint}/get-dataset/${fid}?${params}`).then((res) => {
      setBeforeData([...beforeData, ...getNullColData(res.data.items)]);
      setBDataTotal(res.data.total);
    });
  }, [bDataOffset, bDataRowsPerPage, fid, nullColumns]);

  const performImputation = useCallback(() => {
    if (!fid || !nullColumns?.length) return;

    const params = new URLSearchParams({
      offset: aDataOffset,
      limit: 100,
    }).toString();

    const body = {
      all: imputeForAll ? "algo" : null,
      columns: imputeForAll ? null : colSpecs,
    };

    setIsLoading(true);
    http.post(`${proxymlendpoint}/get_null_handled_data/${fid}?${params}`, body).then((res) => {
      setIsLoading(false);
      setADataFid(res.data.file_unique_id);
      setAfterData(getNullColData(res.data.items));
      setADataTotal(res.data.total);
    });
  }, [fid, nullColumns, aDataOffset, imputeForAll, colSpecs]);

  const getAfterData = useCallback(() => {
    if (!aDataFid || !nullColumns?.length) return;

    const params = new URLSearchParams({ offset: aDataOffset, limit: 100 }).toString();
    http.get(`${proxymlendpoint}/get-dataset/${aDataFid}?${params}`).then((res) => {
      setAfterData([...afterData, ...getNullColData(res.data.items)]);
    });
  }, [aDataOffset, aDataRowsPerPage, aDataFid, nullColumns]);

  useEffect(getBeforeData, [bDataOffset, fid]);
  useEffect(getAfterData, [aDataOffset]);

  // Set the previewData for before data
  useEffect(() => {
    let start = bDataPage * bDataRowsPerPage,
      end = Math.min(bDataTotal, start + bDataRowsPerPage);
    setBDataPreview(beforeData.slice(start, end));

    // Pre-cache the next page of data
    if (bDataTotal !== null && end + bDataRowsPerPage > beforeData.length) {
      setBDataOffset(bDataOffset + offsetIncrement);
    }
  }, [beforeData, bDataPage, bDataRowsPerPage, bDataTotal]);

  // Set the previewData for after data
  useEffect(() => {
    const start = aDataPage * aDataRowsPerPage,
      end = Math.min(aDataTotal, start + aDataRowsPerPage);
    setADataPreview(afterData.slice(start, end));

    // Pre-cache the next page of data
    if (aDataTotal !== null && end + aDataRowsPerPage > afterData.length) {
      setADataOffset(aDataOffset + offsetIncrement);
    }
  }, [afterData, aDataPage, aDataRowsPerPage, aDataTotal]);

  useEffect(() => {
    initNullColumns();
  }, [fid]);

  const getNullColData = useCallback(
    (data) => data.map((row) => Object.fromEntries(nullColumns.map((col) => [col, row[col]]))),
    [nullColumns]
  );

  useEffect(() => {
    getBeforeData();
  }, [nullColumns]);

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

  return (
    <InfoCacheWrapper>
      <Head>
        <title>Data Imputation</title>
      </Head>
      <Box className={classes.root} component="main">
        <Typography variant="h3">Null Data Imputation</Typography>
        {nullColumns && !nullColumns.length ? (
          <Alert className="no-null-message" variant="info">
            No null columns in the dataset. This step can be skipped
          </Alert>
        ) : (
          <section className="content">
            <section className="form">
              <div className="all-or-col">
                <span className="input-meta">Apply imputation for</span>
                <Typography component="label" color={!imputeForAll ? "primary" : "text.primary"}>
                  Specific columns
                </Typography>
                <Switch
                  checked={imputeForAll}
                  onChange={(e) => setImputeForAll(e.target.checked)}
                />
                <Typography component="label" color={imputeForAll ? "primary" : "text.primary"}>
                  All columns
                </Typography>
              </div>
              <Collapse in={!imputeForAll}>
                <FormGroup className="spec-group">
                  {Object.keys(colSpecs).map((column, idx) => (
                    <ColumnSpec
                      key={idx}
                      columnOptions={nullColumns}
                      selectedColumn={column}
                      setSelectedColumn={(col) => {
                        setColSpecs({ ...colSpecs, [col]: val });
                      }}
                      selectedTechnique={colSpecs[column]}
                      setSelectedTechnique={(technique) =>
                        setColSpecs({ ...colSpecs, [column]: technique })
                      }
                      showDeleteIcon
                      deleteColumnSpec={() => {
                        let _colSpecs = { ...colSpecs };
                        delete _colSpecs[column];
                        setColSpecs(_colSpecs);
                      }}
                    />
                  ))}
                  <ColumnSpec
                    columnOptions={
                      nullColumns?.filter((col) => !Object.keys(colSpecs).includes(col)) || []
                    }
                    selectedColumn=""
                    setSelectedColumn={(col) => setColSpecs({ ...colSpecs, [col]: "" })}
                    selectedTechnique=""
                    setSelectedTechnique={() => {}}
                    showDeleteIcon={false}
                  />
                  {false && (
                    <Button
                      className="add-spec-btn"
                      color="secondary"
                      variant="outlined"
                      onClick={() => {
                        setColSpecs({ ...colSpecs, "": "" });
                      }}
                    >
                      <AddIcon fontSize="medium" />
                    </Button>
                  )}
                </FormGroup>
              </Collapse>
              <Button
                className="update-action-btn"
                color="secondary"
                onClick={performImputation}
                variant="contained"
              >
                {isLoading ? <CircularProgress sx={{ color: "white" }} /> : "Apply Technique"}
              </Button>
            </section>
            <section className="data-display">
              {Boolean(bDataPreview.length) && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h5">Data Before Imputation</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Paper className="table-wrapper">
                      <Table>
                        <TableHead>
                          <TableRow>
                            {Object.keys(bDataPreview[0]).map((col, i) => (
                              <TableCell key={i}>{col}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        {renderTableBody(bDataPreview)}
                      </Table>
                      <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        rowsPerPage={bDataRowsPerPage}
                        onRowsPerPageChange={(e) => setBDataRowsPerPage(e.target.value)}
                        count={bDataTotal}
                        page={bDataPage}
                        onPageChange={(_e, p) => setBDataPage(p)}
                      />
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              )}
              {Boolean(bDataPreview.length && aDataPreview.length) && (
                <div className="arrow-container">
                  <ArrowDown sx={{ fontSize: "60px" }} />
                </div>
              )}
              {Boolean(aDataPreview.length) && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h5">Data After Imputation</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Paper className="table-wrapper">
                      <Table>
                        <TableHead>
                          <TableRow>
                            {Object.keys(aDataPreview[0]).map((col, i) => (
                              <TableCell key={i}>{col}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        {renderTableBody(aDataPreview)}
                      </Table>
                      <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        rowsPerPage={aDataRowsPerPage}
                        onRowsPerPageChange={(e) => setADataRowsPerPage(e.target.value)}
                        count={aDataTotal}
                        page={aDataPage}
                        onPageChange={(_e, p) => setADataPage(p)}
                      />
                    </Paper>
                  </AccordionDetails>
                </Accordion>
              )}
            </section>
          </section>
        )}
        <div className="page-actions">
          <Link href={`/sandbox/encoding/${prevFid}`} passHref>
            <Button variant="outlined">Prev: Data Encoding</Button>
          </Link>
          <Link href={`/sandbox/eda/${aDataFid || fid}?prevFid=${fid}`} passHref>
            <Button variant="contained">Next: Exploratory Data Analysis</Button>
          </Link>
        </div>
      </Box>
    </InfoCacheWrapper>
  );
};

NullImputation.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NullImputation;
