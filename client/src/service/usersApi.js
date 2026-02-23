import axios from "./apiClient";

const AuthService = {
  async getUsers() {
    const response = await axios.get("auth/users");
    return response.data;
  },
  async userRegister(user) {
    const response = await axios.post("/auth/login", user);
    return response.data;
  },
  async userLogin(user) {
    const response = await axios.post("/auth/login", user);
    return response.data;
  },
  async getUser() {
    const response = await axios.get("auth/user");
    return response.data;
  },

  async getUserID(id) {
    const response = axios.get(`/auth/user/${id}`);
    return response.data;
  },
  async getAuth() {
    const response = await axios.get("auth/check");
    return response.data;
  },
  async getRegions() {
    const response = await axios.get("/region/regions");
    return response.data;
  },
  async getDistricts() {
    const response = await axios.get("/district/districts");
    return response.data;
  },
  async getStatistics() {
    const response = await axios.get("/statistics");
    return response.data;
  },
  async putUser(id, user) {
    const response = await axios.put(`/auth/user/${id}`, user);
    return response.data;
  },
  async deleteUser(id) {
    const response = await axios.delete(`/auth/user/${id}`);
    return response.data;
  },
  async getSelectRegion(id) {
    const response = axios.get(`/district/districts/region/${id}`);
    return response.data;
  },
};

export function getUserDetails() {
  return axios.get("auth/user");
}
export function getUsers() {
  return axios.get("auth/users");
}

export function getAuth() {
  return axios.get("auth/check");
}
export function getUserID(id) {
  return axios.get(`/auth/user/${id}`);
}
export function postLogin(credentials) {
  return axios.post("/auth/login", credentials);
}
export function postRegister(credentials) {
  return axios.post("/auth/add_user", credentials);
}
export function getRegions() {
  return axios.get("/region/regions");
}
export function getDistricts() {
  return axios.get("/district/districts");
}
export function getStatistics() {
  return axios.get("/statistics");
}
export function putUser(id, updatedUser) {
  return axios.put(`/auth/user/${id}`, updatedUser);
}
export function deleteUser(id) {
  return axios.delete(`/auth/user/${id}`);
}
export function getSelectRegion(id) {
  return axios.get(`/district/districts/region/${id}`);
}

export default AuthService;
