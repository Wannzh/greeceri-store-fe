/**
 * Product Service
 * ================
 * Menangani semua API call terkait produk untuk user publik dan admin.
 * 
 * Method Publik:
 * - getAll: Ambil produk dengan pagination dan filter kategori/keyword
 * - getById: Ambil detail produk berdasarkan ID
 * 
 * Method Admin:
 * - getAdminProducts: Ambil produk dengan pagination untuk panel admin
 * - getAdminProductById: Ambil produk dengan detail lengkap untuk edit
 * - uploadImage: Upload gambar produk ke Cloudinary
 * - createProduct: Buat produk baru
 * - updateProduct: Update produk yang sudah ada
 * - deleteProduct: Hapus produk berdasarkan ID
 */
import api from "@/lib/axios";

export const productService = {
  getAll: async ({ page = 0, size = 12, categoryId = null, keyword = "" } = {}) => {
    const params = { page, size };
    
    if (categoryId) {
      params.categoryId = categoryId;
    }
    if (keyword && keyword.trim() !== "") {
      params.keyword = keyword.trim();
    }
    
    const res = await api.get("/products", { params });
    return res.data.data; // Returns { content, totalElements, totalPages, size, number }
  },

  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  // Admin: Get single product by ID (with categoryId)
  getAdminProductById: async (id) => {
    const res = await api.get(`/admin/products/${id}`);
    return res.data.data;
  },

  // Admin: Get products with pagination and search
  getAdminProducts: async ({ page = 1, size = 10, keyword }) => {
    const params = {
      page: Math.max(page - 1, 0),
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

