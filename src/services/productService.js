import api from "@/lib/axios";

export const productService = {
  getAll: async () => {
    const res = await api.get("/products");
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  createProduct: async (payload) => {
    const res = await api.post("/admin/products", payload);
    return res.data.data;
  },

  updateProduct: async (id, payload) => {
    const res = await api.put(`/admin/products/${id}`, payload);
    return res.data.data;
  },

  deleteProduct: async (id) => {
    await api.delete(`/admin/products/${id}`);
  },
};
