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
};
