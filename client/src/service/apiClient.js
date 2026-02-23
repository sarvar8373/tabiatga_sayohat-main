import axios from "axios";
import { getItem } from "../helpers/persistans";

axios.defaults.baseURL = "http://localhost:9000";

axios.interceptors.request.use((config) => {
  const token = getItem("token");
  const autharization = token ? `Token ${token}` : "";

  config.headers.Authorization = autharization;

  return config;
});
export default axios;
