import api from "@/lib/axios";

export const addressService = {
  getMyAddresses: async () => {
    const res = await api.get("/user/address");
    return res.data.data;
  },

  addAddress: async (payload) => {
    const res = await api.post("/user/address", payload);
    return res.data.data;
  },

  updateAddress: async (id, payload) => {
    const res = await api.put(`/user/address/${id}`, payload);
    return res.data.data;
  },

  deleteAddress: async (id) => {
    await api.delete(`/user/address/${id}`);
  },

  setMainAddress: async (id) => {
    await api.put(`/user/address/${id}/set-main`);
  },
};
