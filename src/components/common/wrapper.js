import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import L from "lodash";

import { allColumnsState, basicInfoState, targetColumnState } from "src/recoil/atoms";
import BasicApiService from "src/api-service/basic";

const InfoCacheWrapper = ({ children }) => {
  const router = useRouter();
  const { fid } = router.query;

  const [basicInfo, setBasicInfo] = useRecoilState(basicInfoState);
  const [allColumns, setAllColumns] = useRecoilState(allColumnsState);
  const [targetColumn, setTargetColumn] = useRecoilState(targetColumnState);
  const [localTargetColumn, setLocalTargetColumn] = useState(targetColumn);
  const [targetDialogOpen, setTargetDialogOpen] = useState(false);

  useEffect(() => {
    if (fid) {
      if ((!basicInfo || L.isEmpty(basicInfo)) && Boolean(targetColumn))
        BasicApiService.getBasicInfo(fid, targetColumn).then((res) => {
          setBasicInfo(res.info);
        });

      if (!allColumns || L.isEmpty(allColumns))
        BasicApiService.getColumnNames(fid).then((res) => setAllColumns(res.columns));
    }
  }, [fid, targetColumn]);

  useEffect(() => {
    if (targetColumn === "" && allColumns.length > 0) setTargetDialogOpen(true);
  }, [targetColumn, allColumns]);

  const onConfirmClick = () => {
    if (localTargetColumn === "") return;
    setTargetDialogOpen(false);
    setTargetColumn(localTargetColumn);
  };

  return (
    <>
      {children}
      {router.pathname !== "/sandbox" && (
        <Dialog open={targetDialogOpen}>
          <DialogContent>
            <Typography variant="h6">Select the Target Column: </Typography>
            <FormControl sx={{ minWidth: "250px", marginTop: 1 }}>
              <Select
                value={localTargetColumn}
                onChange={(e) => setLocalTargetColumn(e.target.value)}
                autoFocus
              >
                {allColumns.map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              variant="contained"
              disabled={localTargetColumn === ""}
              onClick={onConfirmClick}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default InfoCacheWrapper;
