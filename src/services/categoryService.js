// services/categoryService.js
import api from "@/lib/axios";

export const categoryService = {
  getAllCategories: async () => {
    const res = await api.get("/categories");
    return res.data.data;
  },

  getCategoryById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data.data;
  },

  createCategory: async (payload) => {
    const res = await api.post("/admin/categories", payload);
    return res.data.data;
  },

  updateCategory: async (id, payload) => {
    const res = await api.put(`/admin/categories/${id}`, payload);
    return res.data.data;
  },

  deleteCategory: async (id) => {
    await api.delete(`/admin/categories/${id}`);
  },
};
