import api from "@/lib/axios";

export const addressService = {
  getMyAddresses: async () => {
    const res = await api.get("/user/address");
    return res.data.data;
  },
};