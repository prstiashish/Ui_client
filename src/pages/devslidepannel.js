import { Drawer, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DevVisualization from "./devvisualization";
import React, { useState } from "react";
import AIDashboard from "./ai.dashboard";

const DevSlideOutPanel = ({ open, onClose, handleSubmit, onNewClick }) => {
  return (
    // <Drawer anchor="right" open={open} onClose={onClose} sx={{ width: 200,  }}>
    // <Drawer
    //   anchor="right"
    //   open={open}
    //   onClose={onClose}
    //   sx={{
    //     width: 200,
    //     "& .MuiDrawer-paper": {
    //       borderTopLeftRadius: "30px", // Top-left corner radius
    //       borderBottomLeftRadius: "30px", // Bottom-left corner radius
    //     },
    //   }}
    // >
    //   <Box sx={{ width: 230, padding: "16px", position: "relative" }} role="presentation">
    //     <IconButton onClick={onClose} sx={{ position: "absolute", top: "6px", right: "13px" }}>
    //       <CloseIcon />
    //     </IconButton>
    //     <DevVisualization onSubmit={handleSubmit} onClose={onClose} onNewClick={onNewClick} />
    //   </Box>
    // </Drawer>
    //     <Drawer
    //   anchor="right"
    //   open={open}
    //   onClose={onClose}
    //   sx={{
    //     width: 200,
    //     "& .MuiDrawer-paper": {
    //       borderTopLeftRadius: "30px",
    //       // borderBottomLeftRadius: "30px",
    //       padding: '7px'
    //     },
    //   }}
    // >
    //   <Box
    //     sx={{
    //       width: 230,
    //       padding: "16px",
    //       position: "relative",
    //       border: "1px solid gray",
    //       borderTopLeftRadius: "30px",
    //       // borderBottomLeftRadius: "30px",
    //     }}
    //     role="presentation"
    //   >
    //     <IconButton onClick={onClose} sx={{ position: "absolute", top: "6px", right: "6px" }}>
    //       <CloseIcon />
    //     </IconButton>
    //     <DevVisualization onSubmit={handleSubmit} onClose={onClose} onNewClick={onNewClick} />
    //   </Box>
    // </Drawer>
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 230,
        "& .MuiDrawer-paper": {
          borderTopLeftRadius: "30px", // Top-left corner radius
          // borderBottomLeftRadius: "30px", // Bottom-left corner radius
          padding: "7px",
        },
      }}
    >
      <Box
        sx={{
          width: 230,
          padding: "16px",
          position: "relative",
          border: "1px solid gray", // Thin gray border inside the Drawer
          borderTopLeftRadius: "30px", // Top-left corner radius
          // borderBottomLeftRadius: "30px", // Bottom-left corner radius
          display: "flex",
          flexDirection: "column", // Aligns content vertically
          // height: "100%", // Make sure the Box takes full height
          background:
            "linear-gradient(to bottom,#d9d9d9, #d9d9d9, #f3f1f1, #ffffff, #ffffff, #ffffff)", // Gradient from darker gray to lighter gray
        }}
        role="presentation"
      >
        {/* Top Half */}
        <Box
        // sx={{
        //   padding: "8px 16px",
        //   flex: 1, // Takes up half of the available space
        // }}
        >
          {/* Content for the top half */}
          <IconButton onClick={onClose} sx={{ position: "absolute", top: "6px", right: "13px" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Bottom Half with Regular Content */}
        <Box>
          <DevVisualization onSubmit={handleSubmit} onClose={onClose} onNewClick={onNewClick} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default DevSlideOutPanel;
