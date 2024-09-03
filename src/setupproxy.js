const { createProxyMiddleware } = require("http-proxy-middleware");
import { proxyendpoint } from "./utils/proxy-endpoint";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://wex2emgh50.execute-api.ap-south-1.amazonaws.com",
      // target: "https://q76xkcimhhl5rkpjehp2ad7ziu0oqtqo.lambda-url.ap-south-1.on.aws/",

      changeOrigin: true,
    })
  );
};
