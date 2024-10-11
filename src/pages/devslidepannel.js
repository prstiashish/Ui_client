import { Drawer, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DevVisualization from "./devvisualization";
import React, { useState } from "react";
import AIDashboard from "./ai.dashboard";


const DevSlideOutPanel = ({ open, onClose, handleSubmit, onNewClick }) => {


  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ width: 200 }}>
      <Box sx={{ width: 230, padding: "16px", position: "relative" }} role="presentation">
        <IconButton onClick={onClose} sx={{ position: "absolute", top: "16px", right: "16px" }}>
          <CloseIcon />
        </IconButton>
        <DevVisualization onSubmit={handleSubmit} onClose={onClose} onNewClick={onNewClick} />
       
      </Box>
    </Drawer>
  );
};

export default DevSlideOutPanel;
