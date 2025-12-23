/**
 * Auth Service
 * =============
 * Menangani API call terkait autentikasi.
 * 
 * Method:
 * - login: Autentikasi dengan email dan password
 * - googleLogin: Autentikasi dengan Google OAuth token
 * - register: Registrasi user baru
 * - forgotPassword: Kirim email reset password
 * - resetPassword: Reset password dengan token
 */
import api from "@/lib/axios";

export const authService = {
  // Login dengan email dan password
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data.data;
  },

  // Login dengan Google OAuth
  googleLogin: async (idToken) => {
    const res = await api.post("/auth/google", { idToken });
    return res.data.data;
  },

  // Registrasi user baru
  register: async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },

  // Kirim email reset password
  forgotPassword: async (email) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  // Reset password dengan token
  resetPassword: async (token, newPassword) => {
    const res = await api.post("/auth/reset-password", { token, newPassword });
    return res.data;
  },
};
