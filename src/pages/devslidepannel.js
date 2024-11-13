import { Drawer, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DevVisualization from "./devvisualization";
import React, { useState } from "react";
import AIDashboard from "./ai.dashboard";

const DevSlideOutPanel = ({ open, onClose, handleSubmit, onNewClick }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 230,
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "30px",
          // borderBottomLeftRadius: "30px",
          padding: "10px",
        },
      }}
    >
      <Box
        sx={{
          width: 230,
          padding: "16px",
          position: "relative",
          border: "1px solid gray",
          borderTopLeftRadius: "30px",
          // borderBottomLeftRadius: "30px",
          display: "flex",
          flexDirection: "column",
          // height: "100%",
          background:
            "linear-gradient(to bottom,#d9d9d9, #d9d9d9, #f3f1f1, #ffffff, #ffffff, #ffffff)", // Gradient from darker gray to lighter gray
        }}
        role="presentation"
      >
        <IconButton onClick={onClose} sx={{ position: "absolute", top: "6px", right: "13px" }}>
          <CloseIcon />
        </IconButton>

        {/* Bottom Half with Regular Content */}
        <Box>
          <DevVisualization onSubmit={handleSubmit} onClose={onClose} onNewClick={onNewClick} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default DevSlideOutPanel;
