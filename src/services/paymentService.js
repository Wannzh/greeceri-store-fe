import api from "@/lib/axios";

export const paymentService = {
  createPayment: async (orderId) => {
    const res = await api.post("/payments/create-invoice", { orderId });
    return res.data.data; // invoiceUrl
  },
};
