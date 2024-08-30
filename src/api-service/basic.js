import http from "src/utils/http-common";
import { proxymlendpoint } from "src/utils/proxy-endpoint";
class BasicApiService {
  static getBasicInfo(fid, targetCol) {
    return http
      .get(`${proxymlendpoint}/get_basic_data_info/${fid}/${targetCol}`)
      .then((res) => res.data);
  }

  static getColumnNames(fid) {
    return http.get(`${proxymlendpoint}/get-columns/${fid}`).then((res) => res.data);
  }

  static getPaginatedDataset(fid, offset, limit) {
    const params = new URLSearchParams({
      offset,
      limit,
    }).toString();

    return http.get(`${proxymlendpoint}/get-dataset/${fid}?${params}`).then((res) => res.data);
  }
}

export default BasicApiService;
