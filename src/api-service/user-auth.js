import httpCommon from "src/utils/http-common";
import { proxyendpoint } from "src/utils/proxy-endpoint";


class UserAuthService {
  static async login(email, password) {
    const res = await httpCommon.post("/users/login", { username: email, password: password });
    return { ...res.data, email: res.data.username };
  }

  static async createUser(email, password, role) {
    const res = await httpCommon.post("/users/register", {
      username: email,
      password: password,
      role: role,
    });
    return { ...res.data, email: res.data.username };
  }

  static async listAllUsers() {
    const res = await httpCommon.get("/users/list");
    return res.data.map((r) => ({ id: r.id, email: r.username, role: r.role }));
  }

  static async removeUser(userId) {
    await httpCommon.delete(`/users/delete/${userId}`);
  }
}

export default UserAuthService;
