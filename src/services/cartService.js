import api from "@/lib/axios";

export const cartService = {
  // Ambil data keranjang
  getCart: async () => {
    const response = await api.get("/cart");
    return response.data.data;
  },

  // Tambah item / Update quantity
  addItem: async (productId, quantity) => {
    const response = await api.post("/cart/item", {
      productId,
      quantity,
    });
    return response.data.data;
  },

  // Hapus item berdasarkan CartItemId
  removeItem: async (cartItemId) => {
    const response = await api.delete(`/cart/item/${cartItemId}`);
    return response.data.data;
  },

  // Kosongkan keranjang
  clearCart: async () => {
    const response = await api.delete("/cart");
    return response.data.data;
  },
};