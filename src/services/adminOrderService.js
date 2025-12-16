// services/adminOrderService.js
import api from "@/lib/axios";

export const adminOrderService = {
  getAllOrders: async () => {
    try {
      const res = await api.get("/admin/orders");
      // normalize to array
      return res.data?.data ?? [];
    } catch (err) {
      // bubble up friendly message
      const msg = err.response?.data?.message || "Gagal memuat daftar order";
      throw new Error(msg);
    }
  },

  getOrdersByStatus: async (status) => {
    try {
      const res = await api.get("/admin/orders", {
        params: { status },
      });
      return res.data?.data ?? [];
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memuat daftar order";
      throw new Error(msg);
    }
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
      const res = await api.put(`/admin/orders/${orderId}/status`, { status });
      return res.data?.data ?? null;
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal memperbarui status";
      throw new Error(msg);
    }
  },
};
