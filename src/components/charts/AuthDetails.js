import React, { useEffect, useState } from "react";

export const GetAuthToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("IdToken");
  }
  return null;
};

export const GetSchema = () => sessionStorage.getItem("Schema_name");

export const GetTokenExpiredTime = () => sessionStorage.getItem("TokenExpiredTime");

export const GetRefreshToken = () => sessionStorage.getItem("Refresh_Token");

export const baseURLs = () =>
  // "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/salesdata/v1/";
  "https://sk5bgnkn3c.execute-api.ap-south-1.amazonaws.com/prod/salesdata/v1/";

//dev
// export const awsClientID = () => "6sv3ru6lpuljiuea0sdmshlvh8";
//Prod


// this is using which I commit
export const awsClientID = () => "3b41g664mjtaghfbtorjnf7639";

//new one
// export const awsClientID = () => "7s7cl2l71f9gvm754cofuoden7";

export const baseAwsAuthenticateURL = () =>
  // "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/authenticate";


// this is which I commit
  "https://sk5bgnkn3c.execute-api.ap-south-1.amazonaws.com/prod/authenticate/";


// new one
// "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/";


// export const baseURLs = () => {
//   debugger;

//   if (process.env.NODE_ENV === "production") {
//     return "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/salesdata/v1/";
//   } else {
//     return "https://sk5bgnkn3c.execute-api.ap-south-1.amazonaws.com/prod/salesdata/v1/";
//   }
// };

// export const awsClientID = () => {
//   debugger;

//   if (process.env.NODE_ENV === "production") {
//     return "6sv3ru6lpuljiuea0sdmshlvh8";
//   } else {
//     return "3b41g664mjtaghfbtorjnf7639";
//   }
// };

// "6sv3ru6lpuljiuea0sdmshlvh8";

// export const baseAwsAuthenticateURL = () => {
//   debugger;
//   if (process.env.NODE_ENV === "production") {
//     return "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/authenticate";
//   } else {
//     return "https://sk5bgnkn3c.execute-api.ap-south-1.amazonaws.com/prod/authenticate/";
//   }
// };
