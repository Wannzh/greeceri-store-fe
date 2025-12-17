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

  // Alias for backward compatibility
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  // Admin: Get products with pagination and search
  getAdminProducts: async ({ page = 1, size = 10, keyword }) => {
    const params = {
      page: Math.max(page - 1, 0), // FE 1-based → BE 0-based
      size,
    };

    if (keyword && keyword.trim() !== "") {
      params.keyword = keyword.trim();
    }

    const res = await api.get("/admin/products", { params });
    return res.data.data;
  },

  // Upload image to Cloudinary via backend
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data; // { url: "https://..." }
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

