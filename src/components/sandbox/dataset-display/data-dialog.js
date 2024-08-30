import React from "react";
import PropTypes from "prop-types";

import { Dialog, DialogContent, DialogTitle, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import DataViewer from "./data-viewer";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .title": {
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      },
      "& .content": {
        padding: theme.spacing(3),
        paddingTop: 0,
      },
    },
  })
);

const DataDialog = ({ open, fid, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{ sx: { backgroundColor: "#e7e7e7" } }}
    >
      <DialogTitle className="title">
        <Typography variant="h5" component="span">
          Data Viewer
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="content">
        <DataViewer fid={fid} />
      </DialogContent>
    </Dialog>
  );
};

DataDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  fid: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DataDialog;
