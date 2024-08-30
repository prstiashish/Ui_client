import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const ModelPerformance = ({ info }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Metric</TableCell>
          <TableCell>Score</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(info).map(([metric, score]) => (
          <TableRow key={metric}>
            <TableCell>{metric}</TableCell>
            <TableCell>{score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ModelPerformance;
