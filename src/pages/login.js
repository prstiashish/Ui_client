

const Base64Key = process.env.NEXT_PUBLIC_BASE_KEY



import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import SessionStorageService from "src/utils/browser-storage/session";
import { loginAuthUser } from "src/components/charts/AuthDetails";

// src/pages/login.js
// const api_gateway_url = "https://vkrf2otwj6.execute-api.ap-south-1.amazonaws.com/dev/authenticate";
const api_gateway_url = loginAuthUser();


const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const base64Key = Base64Key;


    // console.log("Base64Key:", base64Key);
    const secretKey = CryptoJS.enc.Base64.parse(base64Key);

    const data = `${username}:${password}`;
    // console.log("Data:", data);
    // console.log("username:", username);
    // console.log("password:", password);
    const iv = CryptoJS.lib.WordArray.random(16); // Random IV
    const encrypted = CryptoJS.AES.encrypt(data, secretKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const encryptedData = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    // console.log("Encrypted Data:", encryptedData);
    const baseAwsURL = api_gateway_url;
    // console.log("Base AWS URL:", baseAwsURL);

    const config = {
      headers: {
        Authorization: `Bearer ${encryptedData}`,
      },
    };

    // console.log("Config:", config);


    axios.post(baseAwsURL, null, config).then((response) => {
      // console.log("Response:", response);

      if (response.data && response.data.tokens) {
        const { tokens } = response.data;
        const { access_token, id_token, refresh_token } = tokens;

        // Log tokens for debugging purposes
        // console.log("Tokens:", tokens);
        // console.log("AccessToken:", access_token);


        // console.log("IdToken:", id_token);
        // console.log("RefreshToken:", refresh_token);

        sessionStorage.setItem("IdToken", id_token);
        //   sessionStorage.setItem("Schema_name", response.data.schema_name);
        sessionStorage.setItem("Refresh_Token", refresh_token);
        sessionStorage.setItem("Access_Token", access_token);

        const session = new SessionStorageService();
        session.setItem("currentUser", username);
        router.push("ai.dashboard/");
      } else {
        console.error("Authentication result is undefined", response.data);
      }
    });
  };

  return (
    <>
      <Head>
        <title>Prsti AI | Login</title>
      </Head>
      <Box
        component="main"
        sx={{ alignItems: "center", display: "flex", flexGrow: 1, minHeight: "100%" }}
      >
        <Container maxWidth="sm">
          <form onSubmit={handleLogin}>
            <Box sx={{ pb: 1, pt: 3 }}>
              <Typography
                align="center"
                color="textSecondary"
                variant="h4"
                sx={{ marginBottom: 4 }}
              >
                Login with Username
              </Typography>
            </Box>
            <TextField
              error={Boolean(error)}
              fullWidth
              helperText={error}
              label="Username"
              margin="normal"
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              value={username}
              variant="outlined"
            />
            <TextField
              error={Boolean(error)}
              fullWidth
              helperText={error}
              label="Password"
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button color="primary" fullWidth size="large" type="submit" variant="contained">
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
