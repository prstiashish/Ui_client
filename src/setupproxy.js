const { createProxyMiddleware } = require("http-proxy-middleware");
import { proxyendpoint } from "./utils/proxy-endpoint";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com",
      changeOrigin: true,
    })
  );
};
