import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Flag supaya tidak loop refresh terus
let isRefreshing = false;
let refreshSubscribers = [];

// Fungsi push request yang nunggu refresh
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auth Token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Kalau token expired → 401
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // Kalau tidak ada refreshToken → logout user
      if (!refreshToken) {
        console.warn("No refresh token found → Need login");
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refreshToken }
          );

          const newAccess = res.data.data.accessToken;
          const newRefresh = res.data.data.refreshToken;

          // Simpan token baru
          localStorage.setItem("accessToken", newAccess);
          localStorage.setItem("refreshToken", newRefresh);

          isRefreshing = false;

          onRefreshed(newAccess);
        } catch (refreshErr) {
          isRefreshing = false;
          return Promise.reject(refreshErr);
        }
      }

      // Return promise untuk request yang sedang menunggu refresh
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = "Bearer " + newToken;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
