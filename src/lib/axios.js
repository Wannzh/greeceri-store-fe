import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.request.use((config) => {
  // Gunakan key "access_token"
  const token = localStorage.getItem("access_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Gunakan key "refresh_token"
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
            { refreshToken }
          );

          // Ambil token baru dari response BE
          const newAccess = res.data.data.accessToken;
          const newRefresh = res.data.data.refreshToken;

          // PERBAIKAN: Simpan dengan key yang konsisten
          localStorage.setItem("access_token", newAccess);
          if (newRefresh) {
             localStorage.setItem("refresh_token", newRefresh);
          }

          isRefreshing = false;
          onRefreshed(newAccess);
          
        } catch (refreshErr) {
          isRefreshing = false;
          handleLogout();
          return Promise.reject(refreshErr);
        }
      }

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

function handleLogout() {
  // PERBAIKAN: Hapus key yang benar saat logout
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  window.location.href = "/login"; // Lebih baik ke login daripada home
}

export default api;