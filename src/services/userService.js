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
