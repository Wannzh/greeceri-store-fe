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

  getMyOrdersById: async (orderId) => {
    const res = await api.get(`/orders/my/${orderId}`);
    return res.data.data;
  },
};
