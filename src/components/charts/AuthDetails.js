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

export const loginAuthUser = () =>
  "https://vkrf2otwj6.execute-api.ap-south-1.amazonaws.com/dev/authenticate";

export const baseURLs = () =>
  // "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/salesdata/v1/";
  "https://sk5bgnkn3c.execute-api.ap-south-1.amazonaws.com/prod/salesdata/v1/";

//dev
// export const awsClientID = () => "6sv3ru6lpuljiuea0sdmshlvh8";
//Prod
export const awsClientID = () => "3b41g664mjtaghfbtorjnf7639";

// export const awsClientID = () => "5psbh9r0qv6hi9i5b9s7lk1bmr";

export const baseAwsAuthenticateURL = () =>
  // "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com/dev/authenticate";

  "https://sk5bgnkn3c.execute-api.ap-south-1.amazonaws.com/prod/authenticate/";

// new
// "https://e5nreiwxb9.execute-api.ap-south-1.amazonaws.com/dev/authenticate"

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
