import { useEffect } from "react";
import dynamic from "next/dynamic";
import { GetAuthToken } from "src/components/charts/AuthDetails";



const SplashScreen = () => {
  useEffect(() => {
    setTimeout(() => {
      debugger;
      const authToken = GetAuthToken();

      if (!authToken || authToken.trim() === "") {
        window.location.href = "/login/";
      } else {
      }
    }, 200);
  });
  return <></>;
};

export default SplashScreen;
