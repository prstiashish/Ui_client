import React, { useEffect, useState } from "react";
import Head from "next/head";

import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { createStyles, makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import L from "lodash";

import { DashboardLayout } from "src/components/dashboard-layout";
import UserAuthService from "src/api-service/user-auth";
import SessionStorageService from "src/utils/browser-storage/session";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& section": {
        paddingLeft: theme.spacing(4),
        "& div.create-btn-wrapper": {
          marginBottom: theme.spacing(2),
          display: "grid",
          placeItems: "end",
        },
      },
    },
  })
);

const ManageUsers = () => {
  const classes = useStyles();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [allUsers, setAllUsers] = useState(null);

  const createUser = (email, password, role) => {
    UserAuthService.createUser(email, password, role).then(() => {
      setShowCreateUserDialog(false);
      enqueueSnackbar("User created successfully", { variant: "success" });
      fetchAllUsers();
    });
  };

  const deleteUser = (userId) => {
    UserAuthService.removeUser(userId).then(() => {
      enqueueSnackbar("User deleted successfully", { variant: "success" });
      setAllUsers(allUsers.filter((user) => user.id !== userId));
    });
  };

  const fetchAllUsers = () => {
    const session = new SessionStorageService();
    const currentUser = session.getItem("currentUser");
    UserAuthService.listAllUsers().then((users) =>
      setAllUsers(users.filter((user) => user.id !== currentUser.id))
    );
  };

  useEffect(() => {
    const session = new SessionStorageService();
    const currentUser = session.getItem("currentUser");
    if (currentUser.role === "user") {
      router.push("/app/");
      return;
    }
    fetchAllUsers();
  }, []);

  const tableHeaders =
    allUsers && allUsers.length > 0 ? Object.keys(allUsers[0]).filter((key) => key !== "id") : [];

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Box className={classes.root} component="main">
        <Typography variant="h3" gutterBottom>
          Manage Users
        </Typography>
        <section>
          <div className="create-btn-wrapper">
            <Button variant="contained" onClick={() => setShowCreateUserDialog(true)}>
              Create User
            </Button>
          </div>
          {allUsers !== null &&
            (allUsers.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((k) => (
                      <TableCell key={k}>{L.startCase(k)}</TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allUsers.map((user, i) => (
                    <TableRow key={i}>
                      {tableHeaders.map((k) => (
                        <TableCell key={k}>{user[k]}</TableCell>
                      ))}
                      <TableCell>
                        <IconButton onClick={() => deleteUser(user.id)}>
                          <DeleteForeverOutlinedIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert severity="info">No other users found</Alert>
            ))}
        </section>
      </Box>
      <CreateUserDialog
        open={showCreateUserDialog}
        handleClose={() => setShowCreateUserDialog(false)}
        handleCreate={createUser}
      />
    </>
  );
};

ManageUsers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ManageUsers;

const CreateUserDialog = ({ open, handleClose, handleCreate }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: () => {
      handleCreate(formik.values.email, formik.values.password, formik.values.role);
    },
  });

  useEffect(() => {
    if (open === false) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create new User</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            sx={{ marginTop: 1 }}
            error={Boolean(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="email"
            value={formik.values.email}
            variant="outlined"
          />
          <TextField
            sx={{ marginTop: 1 }}
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            helperText={formik.touched.password && formik.errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="password"
            value={formik.values.password}
            variant="outlined"
          />
          <FormControl sx={{ minWidth: "250px", marginTop: 1 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              label="Role"
              labelId="role-label"
              value={formik.values.role}
              name="role"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.role && formik.errors.role)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <DialogActions>
            <Button variant="text" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={formik.isSubmitting}
              type="submit"
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
