import React from "react";
import { Drawer, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DataVisualization from "./datavisualization";


const SlideOutPanel = ({ open, onClose,handleSubmit,onNewClick }) => {

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ width: 400 }}
    >
      <Box sx={{ width: 400, padding: "16px", position: "relative" }} role="presentation">
        <IconButton onClick={onClose} sx={{ position: "absolute", top: "16px", right: "16px" }}>
          <CloseIcon />
        </IconButton>
        <DataVisualization onSubmit={handleSubmit} onClose={onClose}   onNewClick={onNewClick} /> 
      </Box>
    </Drawer>
  );
};

export default SlideOutPanel;
