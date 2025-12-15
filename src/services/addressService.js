import api from "@/lib/axios";

export const addressService = {
  getMyAddresses: async () => {
    const res = await api.get("/user/address");
    return res.data.data;
  },

  getAddressById: async (addressId) => {
    const res = await api.get(`/user/address/${addressId}`);
    return res.data.data;
  },

  addAddress: async (payload) => {
    const res = await api.post("/user/address", payload);
    return res.data.data;
  },

  updateAddress: async (addresId, payload) => {
    const res = await api.put(`/user/address/${addresId}`, payload);
    return res.data.data;
  },

  deleteAddress: async (addresId) => {
    await api.delete(`/user/address/${addresId}`);
  },

  setMainAddress: async (addresId) => {
    await api.put(`/user/address/${addresId}/set-main`);
  },
};
