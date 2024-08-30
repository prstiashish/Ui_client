import { CancelToken } from "axios";

import http from "src/utils/http-common";
import { proxymlendpoint } from "src/utils/proxy-endpoint";

class PreProcessingApiService {
  static async getStatistics(fid, col_name) {
    const params = new URLSearchParams({
      col_name,
    }).toString();

    const res = await http.get(`${proxymlendpoint}/get_statistics/${fid}?${params}`);
    return res.data;
  }

  static async getEDASuggestion(fid, targetCol, timeoutCallback) {
    const source = CancelToken.source();
    // 5 min timeout
    const timeout = setTimeout(() => {
      source.cancel();
      timeoutCallback();
    }, 300000);

    const res = await http.get(`${proxymlendpoint}/get_eda_plots/${fid}/${targetCol}`, {
      cancelToken: source.token,
    });
    clearTimeout(timeout);
    return res.data;
  }

  static async getCorrelationValues(fid) {
    const res = await http.get(`${proxymlendpoint}/get_corr_values/${fid}`);
    return res.data;
  }

  static async getFeatureSelectionScores(fid, targetCol) {
    const res = await http.get(`${proxymlendpoint}/get_feature_selection/${fid}/${targetCol}`);
    return res.data;
  }
}

export default PreProcessingApiService;
