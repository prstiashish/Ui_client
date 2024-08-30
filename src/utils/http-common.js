import axios from "axios";
import { proxyendpoint } from "./proxy-endpoint";

export default axios.create({
  // baseURL: "http://prsti-mlops-app-lb01-1229627319.us-west-1.elb.amazonaws.com/",
  baseURL: `http://localhost:8000/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
