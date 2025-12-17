import api from "@/lib/axios";

export const adminDashboardService = {
  getDashboard: async () => {
    const res = await api.get("/admin/dashboard");
    return res.data.data;
  },

  getBestSellers: async (limit = 5) => {
    const res = await api.get("/admin/dashboard/best-sellers", {
      params: { limit },
    });
    return res.data.data;
  },

  getUserGrowth: async () => {
    const res = await api.get("/admin/dashboard/user-growth");
    return res.data.data;
  },
};
