import PropTypes from "prop-types";

import { Box, Divider, Grid, Typography } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .wrapper": {
        height: "100%",
        borderRadius: theme.spacing(1),
        border: "1px solid rgba(0,0,0,.125)",
        "& div.header": {
          paddingBlock: theme.spacing(1.5),
          paddingInline: theme.spacing(3),
          backgroundColor: "rgba(0,0,0,.03)",
        },
        "& div.content": {
          padding: theme.spacing(3),
        },
      },
    },
  })
);

const InferenceItem = ({ title, secondaryTitle, children }) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root} item xs={6}>
      <Box className="wrapper">
        <div className="header">
          <Typography variant="h5">{title}</Typography>
          <Typography variant="subtitle1">{secondaryTitle}</Typography>
        </div>
        <Divider />
        <div className="content">{children}</div>
      </Box>
    </Grid>
  );
};

InferenceItem.propTypes = {
  title: PropTypes.string.isRequired,
  secondaryTitle: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export default InferenceItem;
