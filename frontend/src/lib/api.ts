import axios from "axios";

const API_VERSION = "v1";
const BASE_URL = `http://localhost:3000/${API_VERSION}`;

export const authApi = axios.create({
  baseURL: `${BASE_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete authApi.defaults.headers.common["Authorization"];
  }
};
