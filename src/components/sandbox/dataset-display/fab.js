import { useState } from "react";
import PropTypes from "prop-types";

import { Fab } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import TableViewIcon from "@mui/icons-material/TableView";

import DataDialog from "./data-dialog";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "fixed",
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
  })
);

const DataViewerFab = ({ fid }) => {
  const classes = useStyles();

  const [showDataDialog, setShowDataDialog] = useState(false);

  return (
    <>
      <Fab
        className={classes.root}
        color="secondary"
        size="large"
        variant="extended"
        onClick={() => setShowDataDialog(true)}
      >
        <TableViewIcon sx={{ mr: 1 }} />
        Data Viewer
      </Fab>
      <DataDialog open={showDataDialog} fid={fid} onClose={() => setShowDataDialog(false)} />
    </>
  );
};

DataViewerFab.propTypes = {
  fid: PropTypes.string.isRequired,
};

export default DataViewerFab;
