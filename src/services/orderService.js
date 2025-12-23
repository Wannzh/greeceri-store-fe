/**
 * Order Service
 * ==============
 * Menangani API call terkait pesanan untuk user yang login.
 * 
 * Method:
 * - createOrder: Buat pesanan baru dari checkout (terintegrasi dengan pembayaran Xendit)
 * - getMyOrders: Ambil riwayat pesanan user
 * - getOrderDetail: Ambil detail pesanan tertentu
 * - confirmDelivery: Tandai pesanan sudah diterima oleh pelanggan
 * - cancelOrder: Batalkan pesanan yang menunggu pembayaran
 */
import api from "@/lib/axios";

export const orderService = {
  createOrder: async (payload) => {
    const res = await api.post("/orders/checkout", payload);
    return res.data.data;
  },

  getMyOrders: async () => {
    const res = await api.get("/orders/my");
    return res.data.data;
  },

  getOrderDetail: async (orderId) => {
    const res = await api.get(`/orders/my/${orderId}`);
    return res.data.data;
  },

  confirmDelivery: async (orderId) => {
    const res = await api.put(`/orders/my/${orderId}/confirm-delivery`);
    return res.data.data;
  },

  cancelOrder: async (orderId) => {
    const res = await api.put(`/orders/my/${orderId}/cancel`);
    return res.data.data;
  },
};
