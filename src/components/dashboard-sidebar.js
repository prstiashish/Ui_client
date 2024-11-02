import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CodeIcon from "@mui/icons-material/Code";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Cog as CogIcon } from "../icons/cog";
import { Lock as LockIcon } from "../icons/lock";
import { Selector as SelectorIcon } from "../icons/selector";
import { ShoppingBag as ShoppingBagIcon } from "../icons/shopping-bag";
import { User as UserIcon } from "../icons/user";
import { UserAdd as UserAddIcon } from "../icons/user-add";
import { Users as UsersIcon } from "../icons/users";
import { XCircle as XCircleIcon } from "../icons/x-circle";
import { NavItem } from "./nav-item";
import SessionStorageService from "src/utils/browser-storage/session";

import icon_logo from "src/assets/icon_logo_nobg.png";
import text_logo from "src/assets/text_logo_nobg.png";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TableViewIcon from "@mui/icons-material/TableView";
import { FaFileAlt } from "react-icons/fa";

import ExploreIcon from "@mui/icons-material/Explore";

import TimelineIcon from '@mui/icons-material/Timeline';



const items = [
  // {
  //   href: "/app",
  //   icon: <AccountTreeIcon fontSize="small" />,
  //   title: "Projects",
  // },
  // {
  //   href: "/sandbox",
  //   icon: <CodeIcon fontSize="small" />,
  //   title: "Sandbox",
  // },
  // {
  //   href: "/dashboardscharts",
  //   icon: <CodeIcon fontSize="small" />,
  //   title: "Charts",
  // },
  // {
  //   href: "/PrcCharts",
  //   icon: <CodeIcon fontSize="small" />,
  //   title: "Procurement Charts",
  // },
  // {
  //   href: "/chart",
  //   icon: <CodeIcon fontSize="small" />,
  //   title: "Chart V1",
  // },
  // {
  //   href: "/thickChart",
  //   icon: <CodeIcon fontSize="small" />,
  //   title: "Thick Shake Charts",
  // },

  // old dashborad
  // {
  //   href: "/tssalesvisualization",
  //   icon: <EqualizerIcon fontSize="small" />,
  //   title: "Sales Data Visualization",
  // },

  // {
  //   href: "/devdashboard",
  //   icon: <EqualizerIcon fontSize="small" />,
  //   title: "Enterprise Dashboard",
  // },
  {
    href: "/ai.dashboard",
    icon: <EqualizerIcon fontSize="small" />,
    title: "Enterprise Dashboard",
  },


  {
    href: "/devDatadrilldown",
   icon: <TableViewIcon fontSize="small" />,
    title: "Data Grid",
  },

  
  // {
  //   href: "/datadrilldown",
  //   icon: <TableViewIcon fontSize="small" />,
  //   title: "Data Grid",
  // },


  // {
  //   href: "/tstopsalesvisualization",
  //   icon: <TrendingUpIcon fontSize="small" />,
  //   title: "Top Trend Visualization",
  // },


  {
    href: "/devTopTrendsVisual",
    icon: <TrendingUpIcon fontSize="small" />,
    title: "Top Trend Visualization",
  },


  // new added
  // {
  //   href: "/datavisualization",
  //   icon: <ExploreIcon fontSize="small" />,
  //   title: "Data Visualization",
  // },

  // {
  //   href: "/devdashboard",
  //   icon: <EqualizerIcon fontSize="small" />,
  //   title: "Enterprise Dashboard",
  // },

  {
    href: "/query-analytics",
    icon: <ExploreIcon fontSize="small" />,
    title: "On Demand Reporting",
  },

  {
    href: "/plstatements",
    icon: <FaFileAlt fontSize="small" />,
    title: "P & L Statements",
  },


  {
    href: "/gridChart",
   icon: <TableViewIcon fontSize="small" />,
    title: "Data grid Chart",
  },

 {
    href: "/timeSeriesForecasting.js",
    icon: <TimelineIcon fontSize="small" />,
    title: "Time Series",
  },


  // {
  //   href: "/devDatadrilldown",
  //  icon: <TableViewIcon fontSize="small" />,
  //   title: "Grid View",
  // },





  // {
  //   href: "/PLStatementsDev",
  //   icon: <FaFileAlt fontSize="small" />,
  //   title: "P & L Statement",
  // },
  // {
  //   href: "/graphsdashboard",
  //   icon: <ExploreIcon fontSize="small" />,
  //   title: "Graphs Dashboard",
  // },

  // {
  //   href: "/ankitagraphs",
  //   icon: <ExploreIcon fontSize="small" />,
  //   title: "Dashboard",
  // },



  // {
  //   href: "/graphs",
  //   icon: <ExploreIcon fontSize="small" />,
  //   title: "Graphs",
  // },

  // {
  //   href: "/datadrilldownexcel",
  //   icon: <TableViewIcon fontSize="small" />,
  //   title: "TimeSeries",
  // },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  const [navItems, setNavItems] = useState(items);

  // Add currentUser as a recoil-state
  useEffect(() => {
    const session = new SessionStorageService();
    const currentUser = session.getItem("currentUser");
    //currentUser.role
    if (currentUser && "admin" === "admin") {
      setNavItems([
        ...items,
        // {
        //   href: "/users",
        //   icon: <ManageAccountsIcon fontSize="small" />,
        //   title: "Manage Users",
        // },
      ]);
    }
  }, []);

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "200px", //Ankita
        }}
      >
        <div>
          <Box sx={{ p: 2 }}>
            <NextLink href="" passHref>
              <a
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <img src={icon_logo.src} height={50} alt="Prsti Logo" />
                <img src={text_logo.src} height={50} alt="Prsti AI" />
              </a>
            </NextLink>
          </Box>
          {/* <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                px: 3,
                py: "11px",
                borderRadius: 1,
              }}
            >
              <div>
                <Typography color="inherit" variant="subtitle1">
                  Acme Inc
                </Typography>
                <Typography color="neutral.400" variant="body2">
                  Your tier : Premium
                </Typography>
              </div>
              <SelectorIcon
                sx={{
                  color: "neutral.500",
                  width: 14,
                  height: 14,
                }}
              />
            </Box>
          </Box> */}
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            mb: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
          ))}
        </Box>
        <Divider sx={{ borderColor: "#2D3748" }} />
        {/* <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          <Typography color="neutral.100" variant="subtitle2">
            Need more features?
          </Typography>
          <Typography color="neutral.500" variant="body2">
            Check out our Pro solution template.
          </Typography>
          <Box
            sx={{
              display: "flex",
              mt: 2,
              mx: "auto",
              width: "160px",
              "& img": {
                width: "100%",
              },
            }}
          >
            <img alt="Go to pro" src="/static/images/sidebar_pro.png" />
          </Box>
          <NextLink href="https://material-kit-pro-react.devias.io/" passHref>
            <Button
              color="secondary"
              component="a"
              endIcon={<OpenInNewIcon />}
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
            >
              Pro Live Preview
            </Button>
          </NextLink>
        </Box> */}
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 210, //Ankita
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 210, //Ankita
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
