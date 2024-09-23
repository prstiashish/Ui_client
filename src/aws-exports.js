import { Amplify } from "aws-amplify";
const awsconfig = {
  Auth: {
    region: "Mumbai",
    userPoolId: "ap-south-1_BcdMGSPra",
    userPoolWebClientId: "5psbh9r0qv6hi9i5b9s7lk1bmr",
    mandatorySignIn: true,
  },
};

Amplify.configure(awsconfig);

export default awsconfig;
