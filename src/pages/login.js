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
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google"; //
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const user_pool_id = "ap-south-1_BcdMGSPra";

const client_id = "5psbh9r0qv6hi9i5b9s7lk1bmr";
const api_gateway_url = "https://1ifjijlle1.execute-api.ap-south-1.amazonaws.com/dev/";

// const Login = () => {
//   const router = useRouter();
//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
//       password: Yup.string().max(255).required("Password is required"),
//     }),
//     onSubmit: () => {
//       const authenticationData = {
//         Username: formik.values.email, //formik.values.email,
//         Password: formik.values.password, //formik.values.password,
//       };
//       debugger;
//       const encoded = btoa(`${formik.values.email}:${formik.values.password}`);
//       // const baseAwsURL = baseAwsAuthenticateURL();
//       const baseAwsURL = api_gateway_url;

//       console.log("baseAwsURL", baseAwsURL);
//       // const baseAwsURL = "https://bgtt3g5zttpiymvskanaq7fipq0abrgr.lambda-url.ap-south-1.on.aws/";

//       const authToken = encoded; //"dmluZWV0aEBnbWFpbC5jb206V2VsY29tZUAyMDI0";
//       console.log("authToken", authToken);

//       // const ClientIds = awsClientID();
//       const ClientIds = client_id;

//       console.log("ClientIds", ClientIds);

//       // const ClientIds = "7s7cl2l71f9gvm754cofuoden7";

//       const config = {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//           // 'Content-Type': 'application/json',
//           clientid: ClientIds,

//           // "Access-Control-Allow-Origin": "*",
//         },
//       };

//       // axios
//       //   .post(baseAwsURL, null, config)
//       //   .then((response) => {
//       //     console.log("Response:", response.data);

//       //     // -----
//       //     const accessToken = response.data.AuthenticationResult.AccessToken;
//       //     // console.log("AccessToken:", accessToken);
//       //     console.log("response.data.AuthenticationResult.IdToken", response.data.AuthenticationResult.IdToken);
//       //     console.log('response.data.schema_name',response.data.schema_name)
//       //     // --------

//       //     sessionStorage.setItem("IdToken", response.data.AuthenticationResult.IdToken);
//       //     sessionStorage.setItem("Schema_name", response.data.schema_name);
//       //     sessionStorage.setItem("Refresh_Token", response.data.AuthenticationResult.RefreshToken);
//       //     const decodedIdToken = jwtDecode(response.data.AuthenticationResult.IdToken);
//       //     sessionStorage.setItem("TokenExpiredTime", decodedIdToken.exp);
//       //     const session = new SessionStorageService();
//       //     session.setItem("currentUser", formik.values.email);
//       //     // router.push("/tssalesvisualization");
//       //     // router.push("devdashboard/");
//       //     router.push("ai.dashboard/");

//       //   })
//       //   // .catch((error) => {
//       //   //   console.error("Error:", error);
//       //   //   window.location.href = "/login";
//       //   //   // Handle error
//       //   // });
//       //   .catch((error) => {
//       //     if (error.response) {
//       //       // Server responded with a status other than 2xx
//       //       console.error("Error response from server:");
//       //       console.error("Status:", error.response.status); // HTTP status code
//       //       console.error("Headers:", error.response.headers); // Response headers
//       //       console.error("Data:", error.response.data); // Server's response payload
//       //     } else if (error.request) {
//       //       // No response received from server
//       //       console.error("No response received from server:", error.request);
//       //     } else {
//       //       // Error setting up the request
//       //       console.error("Error setting up request:", error.message);
//       //     }
//       //   });

//       axios
//         .post(baseAwsURL, null, config)
//         .then((response) => {
//           console.log("Response:", response.data);

//           // Safely check for the expected properties
//           const authenticationResult = response.data.AuthenticationResult;
//           if (authenticationResult) {
//             const accessToken = authenticationResult.AccessToken;
//             const idToken = authenticationResult.IdToken;
//             const refreshToken = authenticationResult.RefreshToken;

//             console.log("AccessToken:", accessToken);
//             console.log("IdToken:", idToken);
//             console.log("Schema name:", response.data.schema_name);

//             sessionStorage.setItem("IdToken", idToken);
//             sessionStorage.setItem("Schema_name", response.data.schema_name);
//             sessionStorage.setItem("Refresh_Token", refreshToken);

//             const decodedIdToken = jwtDecode(idToken);
//             sessionStorage.setItem("TokenExpiredTime", decodedIdToken.exp);
//             const session = new SessionStorageService();
//             session.setItem("currentUser", formik.values.email);
//             router.push("ai.dashboard/");
//           } else {
//             console.error("Authentication result is undefined", response.data);
//           }
//         })
//         .catch((error) => {
//           if (error.response) {
//             console.error("Error response from server:", error.response);
//           } else if (error.request) {
//             console.error("No response received from server:", error.request);
//           } else {
//             console.error("Error setting up request:", error.message);
//           }
//         });

//       //

//       // UserAuthService.login(formik.values.email, formik.values.password).then((user) => {
//       //   if (!user.id) {
//       //     formik.setErrors({ password: "Wrong Credentials" });
//       //   } else {
//       //     const session = new SessionStorageService();
//       //     session.setItem("currentUser", user);
//       //     router.push("/tssalesvisualization");
//       //   }
//       //   formik.setSubmitting(false);
//       // });
//     },
//   });
//   function base64Encode(str) {
//     let encoded;

//     // Check if we're in a Node.js-like environment
//     if (typeof Buffer !== "undefined") {
//       // Node.js
//       encoded = Buffer.from(str).toString("base64");
//     } else {
//       // Browser
//       // Assume btoa is available (modern browsers)
//       encoded = btoa(str);
//     }

//     return encoded;
//   }
//   return (
//     <>
//       <Head>
//         <title>Prsti AI | Login</title>
//       </Head>
//       <Box
//         component="main"
//         sx={{
//           alignItems: "center",
//           display: "flex",
//           flexGrow: 1,
//           minHeight: "100%",
//         }}
//       >
//         <Container maxWidth="sm">
//           {/* <NextLink href="/" passHref>
//             <Button component="a" startIcon={<ArrowBackIcon fontSize="small" />}>
//               Dashboard
//             </Button>
//           </NextLink> */}
//           <form onSubmit={formik.handleSubmit}>
//             {/* <Box sx={{ my: 3 }}>
//               <Typography color="textPrimary" variant="h4">
//                 Sign in
//               </Typography>
//               <Typography color="textSecondary" gutterBottom variant="body2">
//                 Sign in on the internal platform
//               </Typography>
//             </Box> */}
//             {/* <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <Button
//                   color="info"
//                   fullWidth
//                   startIcon={<FacebookIcon />}
//                   onClick={formik.handleSubmit}
//                   size="large"
//                   variant="contained"
//                 >
//                   Login with Facebook
//                 </Button>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <Button
//                   fullWidth
//                   color="error"
//                   startIcon={<GoogleIcon />}
//                   onClick={formik.handleSubmit}
//                   size="large"
//                   variant="contained"
//                 >
//                   Login with Google
//                 </Button>
//               </Grid>
//             </Grid> */}
//             <Box
//               sx={{
//                 pb: 1,
//                 pt: 3,
//               }}
//             >
//               <Typography
//                 align="center"
//                 color="textSecondary"
//                 variant="h4"
//                 sx={{ marginBottom: 4 }}
//               >
//                 Login with email address
//               </Typography>
//             </Box>
//             <TextField
//               error={Boolean(formik.touched.email && formik.errors.email)}
//               fullWidth
//               helperText={formik.touched.email && formik.errors.email}
//               label="Email Address"
//               margin="normal"
//               name="email"
//               onBlur={formik.handleBlur}
//               onChange={formik.handleChange}
//               type="email"
//               value={formik.values.email}
//               variant="outlined"
//             />
//             <TextField
//               error={Boolean(formik.touched.password && formik.errors.password)}
//               fullWidth
//               helperText={formik.touched.password && formik.errors.password}
//               label="Password"
//               margin="normal"
//               name="password"
//               onBlur={formik.handleBlur}
//               onChange={formik.handleChange}
//               type="password"
//               value={formik.values.password}
//               variant="outlined"
//             />
//             <Box sx={{ py: 2 }}>
//               <Button
//                 color="primary"
//                 disabled={formik.isSubmitting}
//                 fullWidth
//                 size="large"
//                 type="submit"
//                 variant="contained"
//               >
//                 Log in
//               </Button>
//             </Box>
//             {/* <Typography color="textSecondary" variant="body2">
//               Don&apos;t have an account?{" "}
//               <NextLink href="/register">
//                 <Link
//                   to="/register"
//                   variant="subtitle2"
//                   underline="hover"
//                   sx={{
//                     cursor: "pointer",
//                   }}
//                 >
//                   Sign Up
//                 </Link>
//               </NextLink>
//             </Typography> */}
//           </form>
//         </Container>
//       </Box>
//     </>
//   );
// };

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
      debugger;
      const encoded = btoa(`${formik.values.email}:${formik.values.password}`);
      // const baseAwsURL = api_gateway_url;
      // const baseAwsURL = "https://e5nreiwxb9.execute-api.ap-south-1.amazonaws.com/dev/authenticate"
      const baseAwsURL = baseAwsAuthenticateURL();


      console.log("baseAwsURL", baseAwsURL);

      const authToken = encoded;
      console.log("authToken", authToken);

      // const ClientIds = client_id;
      // const ClientIds = "5psbh9r0qv6hi9i5b9s7lk1bmr"
      const ClientIds = awsClientID();

      console.log("ClientIds", ClientIds);

      // const payload = {
      //   email: formik.values.email,
      //   password: formik.values.password,
      // };


      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          clientid: ClientIds,
        },
      };

      // console.log("Making request to:", baseAwsURL);
      // console.log("Request headers:", config.headers);


      axios
        .post(baseAwsURL, null, config)
        .then((response) => {
          console.log("Response:", response.data);

          // Safely check for the expected properties
          const authenticationResult = response.data.AuthenticationResult;
          if (authenticationResult) {
            const accessToken = authenticationResult.AccessToken;
            const idToken = authenticationResult.IdToken;
            const refreshToken = authenticationResult.RefreshToken;

            console.log("AccessToken:", accessToken);
            console.log("IdToken:", idToken);
            console.log("Schema name:", response.data.schema_name);

            sessionStorage.setItem("IdToken", idToken);
            sessionStorage.setItem("Schema_name", response.data.schema_name);
            sessionStorage.setItem("Refresh_Token", refreshToken);

            const decodedIdToken = jwtDecode(idToken);
            sessionStorage.setItem("TokenExpiredTime", decodedIdToken.exp);
            const session = new SessionStorageService();
            session.setItem("currentUser", formik.values.email);
            router.push("ai.dashboard/");
          } else {
            console.error("Authentication result is undefined", response.data);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.error("Error response from server:", error.response);
          } else if (error.request) {
            console.error("No response received from server:", error.request);
          } else {
            console.error("Error setting up request:", error.message);
          }
        });

      // const requestBody = {
      //   clientid: ClientIds, // Moved clientid to the request body
      // };

      // axios
      //   .post(baseAwsURL, requestBody, {
      //     headers: {
      //       Authorization: `Bearer ${authToken}`, // Only the Authorization header is sent
      //     },
      //   })
      //   .then((response) => {
      //     console.log("Response:", response.data);
      //     // Handle the response
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //   });


      //
    },
  });

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
          <form onSubmit={formik.handleSubmit}>
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
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
