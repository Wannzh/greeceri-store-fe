import api from "@/lib/axios";

export const adminDashboardService = {
  getDashboard: async () => {
    const res = await api.get("/admin/dashboard");
    return res.data.data;
  },
};
