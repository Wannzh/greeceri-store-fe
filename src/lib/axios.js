import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Auth Token
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.warn("Unable to read token from localStorage", e);
  }

  return config;
});

// Auth Refresh Token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.response?.status == 401) {
      console.warn("API unauthorized (401). Token may be invalid/expired.");
    }
    return Promise.reject(err);
  }
);

export default api;
