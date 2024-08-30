import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";

import SessionStorageService from "src/utils/browser-storage/session";
import { GetAuthToken } from "./charts/AuthDetails";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 35,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 185, //Ankita
  },
}));

export const DashboardLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // const session = new SessionStorageService();
    // if (!session.getItem("currentUser")?.email) {
    //   router.push("/tssalesvisulization/");
    // }

    const authToken = GetAuthToken();

    if (!authToken || authToken.trim() === "") {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
            // p: 6,
            p: 5, //Ankita

            // backgroundColor: "#eff0f2",
            backgroundColor: "#ffff",
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </>
  );
};
