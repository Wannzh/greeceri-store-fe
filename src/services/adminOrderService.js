// services/adminOrderService.js
import api from "@/lib/axios";

export const adminOrderService = {
  getOrders: async ({ page = 1, size = 10, status, keyword }) => {
    // Buat params object, HANYA isi yang ada nilainya
    const params = {
      page: Math.max(page - 1, 0), // FE 1-based → BE 0-based
      size: size,
    };

    // Hanya tambahkan status jika BUKAN "ALL" dan ada nilainya
    if (status && status !== "ALL" && status.trim() !== "") {
      params.status = status.trim().toUpperCase();
    }

    // Hanya tambahkan keyword jika ada nilainya
    if (keyword && keyword.trim() !== "") {
      params.keyword = keyword.trim();
    }

    const res = await api.get("/admin/orders", { params });
    return res.data.data;
  },

  getOrderById: async (orderId) => {
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      return res.data?.data ?? null;
    } catch (err) {
      const msg = err.response?.data?.message || "Order tidak ditemukan";
      throw new Error(msg);
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      // Backend expects status in request body
      const res = await api.put(`/admin/orders/${orderId}/status`, { status });
      return res.data?.data ?? null;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui status";
      throw new Error(msg);
    }
  },

  // Untuk analytics dashboard - ambil semua order
  getAllOrders: async () => {
    const res = await api.get("/admin/orders", {
      params: {
        page: 0,
        size: 10000, // Ambil semua data
      },
    });
    return res.data.data?.content || [];
  },
};
