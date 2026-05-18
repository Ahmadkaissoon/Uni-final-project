import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL ?? "https://yousef.pythonanywhere.com";
const authTokenStorageKeys = ["access_token", "token", "auth_token"];

function readStoredAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  for (const key of authTokenStorageKeys) {
    const token =
      window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);

    if (token?.trim()) {
      return token;
    }
  }

  return null;
}

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = readStoredAuthToken();

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
