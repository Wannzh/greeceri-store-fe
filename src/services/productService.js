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
};
