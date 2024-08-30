import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import styled from "@emotion/styled";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  ButtonBase,
  IconButton,
  Toolbar,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import { Bell as BellIcon } from "../icons/bell";
import { UserCircle as UserCircleIcon } from "../icons/user-circle";
import { Users as UsersIcon } from "../icons/users";

import SessionStorageService from "src/utils/browser-storage/session";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;

  const router = useRouter();

  const [avatarLetter, setAvatarLetter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    handleClose();
    const session = new SessionStorageService();
    session.removeItem("currentUser");
    session.removeItem("IdToken");
    router.push("/login/");
  };

  useEffect(() => {
    const session = new SessionStorageService();
    const currentUser = session.getItem("currentUser");

    if (currentUser) {
      //setAvatarLetter(currentUser.email.toUpperCase());
      let firstLetter = currentUser.charAt(0);
      setAvatarLetter(firstLetter.toUpperCase());
      //setAvatarLetter("VINEETH@GMAIL.COM");
    }
  });

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 180,
          },
          width: {
            lg: "calc(100% - 180px)",  //Ankita
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
            py: 1.5,
            display: "block",
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <ButtonBase sx={{ float: "right" }} onClick={handleClick}>
            <Avatar
              sx={{
                height: 40,
                width: 40,
                ml: 1,
                color: "text.primary",
                backgroundColor: "background.third",
              }}
            >
              {avatarLetter}
            </Avatar>
          </ButtonBase>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
