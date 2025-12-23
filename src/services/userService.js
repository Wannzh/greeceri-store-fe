/**
 * User Service
 * =============
 * Menangani operasi profil user untuk user yang login.
 * 
 * Method:
 * - getProfile: Ambil data profil user saat ini
 * - updateProfile: Update profil user (nama, telepon, gender, tanggal lahir)
 * - changePassword: Ubah password user
 */
import api from "@/lib/axios";

export const userService = {
  getProfile: async () => {
    const res = await api.get("/user/profile");
    return res.data.data;
  },

  updateProfile: async (payload) => {
    const res = await api.put("/user/profile", payload);
    return res.data.data;
  },

  changePassword: async (payload) => {
    const res = await api.put("/user/password", payload);
    return res.data;
  },
};
