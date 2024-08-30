import PropTypes from "prop-types";

import { Box, FormControl, Select, InputLabel, MenuItem, IconButton } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Close as CloseIcon } from "@mui/icons-material";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      display: "flex",
      justifyContent: "space-between",
      maxWidth: "700px",
      "& .form-element": {
        minWidth: "250px",
      },
    },
  })
);

const imputationOptions = [
  { name: "Mean", value: "mean" },
  { name: "Median", value: "median" },
  { name: "Mode", value: "most_frequent" },
  { name: "Forward Fill", value: "ffill" },
  { name: "Backward Fill", value: "bfill" },
];

const ColumnSpec = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <FormControl className="form-element">
        <InputLabel>Column</InputLabel>
        <Select
          label="Column"
          value={props.selectedColumn}
          onChange={(e) => props.setSelectedColumn(e.target.value)}
        >
          {props.columnOptions.map((col) => (
            <MenuItem key={col} value={col}>
              {col}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className="form-element">
        <InputLabel>Fill Technique</InputLabel>
        <Select
          label="Fill Technique"
          value={props.selectedTechnique}
          onChange={(e) => props.setSelectedTechnique(e.target.value)}
          disabled={props.selectedColumn === ""}
        >
          {imputationOptions.map((technique) => (
            <MenuItem key={technique.value} value={technique.value}>
              {technique.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton sx={!props.showDeleteIcon && { opacity: "0" }} onClick={props.deleteColumnSpec}>
        <CloseIcon fontSize="medium" color="red" />
      </IconButton>
    </Box>
  );
};

ColumnSpec.propTypes = {
  columnOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedColumn: PropTypes.string.isRequired,
  setSelectedColumn: PropTypes.func.isRequired,
  selectedTechnique: PropTypes.string.isRequired,
  setSelectedTechnique: PropTypes.func.isRequired,
  deleteColumnSpec: PropTypes.func,
  showDeleteIcon: PropTypes.bool,
};

ColumnSpec.defauleProps = {
  showDeleteIcon: true,
  deleteColumnSpec: () => {},
};

export default ColumnSpec;
