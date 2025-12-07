import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auth Refresh Token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status == 401) {
      console.log("Unauthorized");
    }
    return Promise.reject(err);
  }
);
