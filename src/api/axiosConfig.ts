import axios from "axios";

const baseUrl = import.meta.env.VITE_X_API_BASE_URL || "";
// axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((req) => {
  return req;
});

export default api;
