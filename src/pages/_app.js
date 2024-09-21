// import Head from "next/head";
// import { RecoilRoot } from "recoil";
// import { SnackbarProvider } from "notistack";

// import { CacheProvider } from "@emotion/react";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import { CssBaseline } from "@mui/material";
// import { ThemeProvider } from "@mui/material/styles";

// import { createEmotionCache } from "../utils/create-emotion-cache";
// import { theme } from "../theme";

// import "./BarChartStyle.css";

// import "./waterfallStyle.css";
// import "../assets/css/common.css";

// const clientSideEmotionCache = createEmotionCache();

// const App = (props) => {
//   const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

//   const getLayout = Component.getLayout ?? ((page) => page);

//   return (
//     <CacheProvider value={emotionCache}>
//       <Head>
//         <title>ML Ops</title>
//         <meta name="viewport" content="initial-scale=1, width=device-width" />
//       </Head>
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <RecoilRoot>
//             <SnackbarProvider>{getLayout(<Component {...pageProps} />)}</SnackbarProvider>
//           </RecoilRoot>
//         </ThemeProvider>
//       </LocalizationProvider>
//     </CacheProvider>
//   );
// };

// export default App;



import Head from "next/head";
import { RecoilRoot } from "recoil";
import { SnackbarProvider } from "notistack";

import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { createEmotionCache } from "../utils/create-emotion-cache";
import { theme } from "../theme";

import "./BarChartStyle.css";
import "./waterfallStyle.css";
import "../assets/css/common.css";

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>ML Ops</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RecoilRoot>
            <SnackbarProvider>{getLayout(<Component {...pageProps} />)}</SnackbarProvider>
          </RecoilRoot>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
