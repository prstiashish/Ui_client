import { Amplify } from "aws-amplify";
const awsconfig = {
  Auth: {
    region: "Mumbai",
    userPoolId: "ap-south-1_BcdMGSPra",
    userPoolWebClientId: "6sv3ru6lpuljiuea0sdmshlvh8",
    mandatorySignIn: true,
  },
};

Amplify.configure(awsconfig);

export default awsconfig;
