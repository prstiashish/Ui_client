import { useState, useEffect, useCallback } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  Paper,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { ExpandMore } from "@mui/icons-material";

import { DashboardLayout } from "src/components/dashboard-layout";

import http from "src/utils/http-common";
import { ArrowDown } from "src/icons/arrow-down";
import InfoCacheWrapper from "src/components/common/wrapper";
import { proxymlendpoint } from "src/utils/proxy-endpoint";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& section.content": {
        marginTop: theme.spacing(3),
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
      "& div.page-actions": {
        marginTop: theme.spacing(6),
        display: "flex",
        justifyContent: "space-between",
      },
    },
  })
);

const offsetIncrement = 100;

const Encoding = () => {
  const classes = useStyles();

  const router = useRouter();
  const { fid } = router.query;

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

  const getBeforeData = useCallback(() => {
    if (!fid) return;

    const params = new URLSearchParams({ offset: bDataOffset, limit: 100 }).toString();
    http.get(`${proxymlendpoint}/get-dataset/${fid}?${params}`).then((res) => {
      setBeforeData([...beforeData, ...res.data.items]);
      setBDataTotal(res.data.total);
    });
  }, [bDataOffset, bDataRowsPerPage, fid]);

  const performEncoding = useCallback(() => {
    if (!fid) return;

    const params = new URLSearchParams({
      offset: aDataOffset,
      limit: 100,
      file_unique_id: fid,
    }).toString();
    http.get(`${proxymlendpoint}/get_encoded_data/${fid}?${params}`).then((res) => {
      setADataFid(res.data.file_unique_id);
      setAfterData(res.data.items);
      setADataTotal(res.data.total);
    });
  }, [fid]);

  const getAfterData = useCallback(() => {
    if (!aDataFid) return;

    const params = new URLSearchParams({ offset: aDataOffset, limit: 100 }).toString();
    http.get(`${proxymlendpoint}/get-dataset/${aDataFid}?${params}`).then((res) => {
      setAfterData([...afterData, ...res.data.items]);
    });
  }, [aDataOffset, aDataRowsPerPage, aDataFid]);

  useEffect(getBeforeData, [bDataOffset, fid]);
  useEffect(performEncoding, [fid]);
  useEffect(getAfterData, [aDataOffset]);

  // Set the previewData for before data
  useEffect(() => {
    if (!bDataTotal) return;

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
    if (!aDataTotal) return;

    const start = aDataPage * aDataRowsPerPage,
      end = Math.min(aDataTotal, start + aDataRowsPerPage);
    setADataPreview(afterData.slice(start, end));

    // Pre-cache the next page of data
    if (aDataTotal !== null && end + aDataRowsPerPage > afterData.length) {
      setADataOffset(aDataOffset + offsetIncrement);
    }
  }, [afterData, aDataPage, aDataRowsPerPage, aDataTotal]);

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
        <title>Data Encoding</title>
      </Head>
      <Box className={classes.root} component="main">
        <Typography variant="h4">Encoding</Typography>
        <section className="content">
          {Boolean(bDataPreview.length) && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h5">Data Before Encoding</Typography>
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
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h5">Data After Encoding</Typography>
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
        <div className="page-actions">
          <Link href={`/sandbox/statistics/${fid}`} passHref>
            <Button variant="outlined">Prev: Statistics and Measures</Button>
          </Link>
          <Link href={`/sandbox/imputation/${aDataFid}?prevFid=${fid}`} passHref>
            <Button variant="contained">Next: Data Imputation</Button>
          </Link>
        </div>
      </Box>
    </InfoCacheWrapper>
  );
};

Encoding.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Encoding;
