// services/adminUserService.js
import api from "@/lib/axios";

export const adminUserService = {
  // Get paginated users with search
  getUsers: async ({ page = 1, size = 10, keyword }) => {
    const params = {
      page: Math.max(page - 1, 0), // FE 1-based → BE 0-based
      size,
    };

    if (keyword && keyword.trim() !== "") {
      params.keyword = keyword.trim();
    }

    const res = await api.get("/admin/users", { params });
    return res.data.data;
  },

  // Get user detail by ID
  getUserById: async (userId) => {
    const res = await api.get(`/admin/users/${userId}`);
    return res.data.data;
  },

  // Enable/disable user
  updateUserStatus: async (userId, enabled) => {
    const res = await api.patch(`/admin/users/${userId}/status`, { enabled });
    return res.data;
  },
};
