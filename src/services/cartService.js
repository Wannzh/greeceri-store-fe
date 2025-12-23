/**
 * Cart Service
 * =============
 * Menangani operasi keranjang belanja untuk user yang login.
 * 
 * Method:
 * - getCart: Ambil isi keranjang saat ini
 * - addItem: Tambah produk ke keranjang atau tambah jumlah
 * - updateItemQuantity: Update jumlah item keranjang tertentu
 * - removeItem: Hapus item dari keranjang berdasarkan cartItemId
 * - clearCart: Hapus semua item dari keranjang
 */
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

  // Update quantity item yang sudah ada di cart
  updateItemQuantity: async (cartItemId, quantity) => {
    const response = await api.put(`/cart/item/${cartItemId}?quantity=${quantity}`);
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