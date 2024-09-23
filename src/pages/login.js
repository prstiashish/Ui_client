import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Grid, Link, TextField, Typography } from "@mui/material";
import SessionStorageService from "src/utils/browser-storage/session";
import UserAuthService from "src/api-service/user-auth";
import http from "src/utils/http-common";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { awsClientID, baseAwsAuthenticateURL } from "src/components/charts/AuthDetails";
import { DeblurOutlined } from "@mui/icons-material";

const Login = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: () => {
      const poolData = {
        UserPoolId: "ap-south-1_BcdMGSPra",
        // ClientId: "6sv3ru6lpuljiuea0sdmshlvh8",
        ClientId: "5psbh9r0qv6hi9i5b9s7lk1bmr",
        
        // UserPoolId: "ap-south-1_J5ZthLaH3",
        // ClientId: "7s7cl2l71f9gvm754cofuoden7",
      };

      const authenticationData = {
        Username: formik.values.email, //formik.values.email,
        Password: formik.values.password, //formik.values.password,
      };
      debugger;
      const encoded = btoa(`${formik.values.email}:${formik.values.password}`);
      const baseAwsURL = baseAwsAuthenticateURL();
      console.log("baseAwsURL", baseAwsURL);
            // const baseAwsURL = "https://bgtt3g5zttpiymvskanaq7fipq0abrgr.lambda-url.ap-south-1.on.aws/";

      const authToken = encoded; //"dmluZWV0aEBnbWFpbC5jb206V2VsY29tZUAyMDI0";
      console.log("authToken", authToken);
      const ClientIds = awsClientID();
      console.log("ClientIds", ClientIds);
      // const ClientIds = "7s7cl2l71f9gvm754cofuoden7";

      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          clientid: ClientIds,
          // "Access-Control-Allow-Origin": "*",
        },
      };

      axios
        .post(baseAwsURL, null, config)
        .then((response) => {
          console.log("Response:", response.data);
          sessionStorage.setItem("IdToken", response.data.AuthenticationResult.IdToken);
          sessionStorage.setItem("Schema_name", response.data.schema_name);
          sessionStorage.setItem("Refresh_Token", response.data.AuthenticationResult.RefreshToken);
          const decodedIdToken = jwtDecode(response.data.AuthenticationResult.IdToken);
          sessionStorage.setItem("TokenExpiredTime", decodedIdToken.exp);
          const session = new SessionStorageService();
          session.setItem("currentUser", formik.values.email);
          // router.push("/tssalesvisualization");
          router.push("devdashboard/");

        })
        .catch((error) => {
          console.error("Error:", error);
          window.location.href = "/login";
          // Handle error
        });

      //

      // UserAuthService.login(formik.values.email, formik.values.password).then((user) => {
      //   if (!user.id) {
      //     formik.setErrors({ password: "Wrong Credentials" });
      //   } else {
      //     const session = new SessionStorageService();
      //     session.setItem("currentUser", user);
      //     router.push("/tssalesvisualization");
      //   }
      //   formik.setSubmitting(false);
      // });
    },
  });
  function base64Encode(str) {
    let encoded;

    // Check if we're in a Node.js-like environment
    if (typeof Buffer !== "undefined") {
      // Node.js
      encoded = Buffer.from(str).toString("base64");
    } else {
      // Browser
      // Assume btoa is available (modern browsers)
      encoded = btoa(str);
    }

    return encoded;
  }
  return (
    <>
      <Head>
        <title>Prsti AI | Login</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          {/* <NextLink href="/" passHref>
            <Button component="a" startIcon={<ArrowBackIcon fontSize="small" />}>
              Dashboard
            </Button>
          </NextLink> */}
          <form onSubmit={formik.handleSubmit}>
            {/* <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                Sign in
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Sign in on the internal platform
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Button
                  color="info"
                  fullWidth
                  startIcon={<FacebookIcon />}
                  onClick={formik.handleSubmit}
                  size="large"
                  variant="contained"
                >
                  Login with Facebook
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  color="error"
                  startIcon={<GoogleIcon />}
                  onClick={formik.handleSubmit}
                  size="large"
                  variant="contained"
                >
                  Login with Google
                </Button>
              </Grid>
            </Grid> */}
            <Box
              sx={{
                pb: 1,
                pt: 3,
              }}
            >
              <Typography
                align="center"
                color="textSecondary"
                variant="h4"
                sx={{ marginBottom: 4 }}
              >
                Login with email address
              </Typography>
            </Box>
            <TextField
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
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Log in
              </Button>
            </Box>
            {/* <Typography color="textSecondary" variant="body2">
              Don&apos;t have an account?{" "}
              <NextLink href="/register">
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography> */}
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
