import { CancelToken } from "axios";

import httpCommon from "src/utils/http-common";
import { proxymlendpoint } from "src/utils/proxy-endpoint";

class MLModelApiService {
  static async getFullPipelineModelResults(fid, targetCol, timeoutCallback) {
    const source = CancelToken.source();
    // 5 min timeout
    const timeout = setTimeout(() => {
      source.cancel();
      timeoutCallback();
    }, 300000);

    const res = await httpCommon.get(
      `${proxymlendpoint}/build_auto_pipeline_models/${fid}/${targetCol}`
    );
    clearTimeout(timeout);
    return res.data;
  }

  static async getBasicModelResults(fid, targetCol, timeoutCallback) {
    const source = CancelToken.source();
    // 5 min timeout
    const timeout = setTimeout(() => {
      source.cancel();
      timeoutCallback();
    }, 300000);

    const res = await httpCommon.get(`${proxymlendpoint}/build_models/${fid}/${targetCol}`);
    clearTimeout(timeout);
    return res.data;
  }

  static async getModelInferences() {
    const res = await httpCommon.get(`${proxymlendpoint}/get_inference_results/`);
    return res.data.inference;
  }
}

export default MLModelApiService;
