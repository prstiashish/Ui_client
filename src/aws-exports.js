import { Amplify } from "aws-amplify";
const awsconfig = {
  Auth: {
    region: "Mumbai",
    userPoolId: "ap-south-1_J5ZthLaH3",
    userPoolWebClientId: "7s7cl2l71f9gvm754cofuoden7",
    mandatorySignIn: true,
  },
};

Amplify.configure(awsconfig);

export default awsconfig;
