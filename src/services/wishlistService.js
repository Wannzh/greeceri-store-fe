import api from "@/lib/axios";

export const wishlistService = {
  // Get all wishlist items
  getAll: async () => {
    const response = await api.get("/wishlist");
    return response.data.data;
  },

  // Add product to wishlist
  add: async (productId) => {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  },

  // Remove product from wishlist
  remove: async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },

  // Check if product is in wishlist
  check: async (productId) => {
    const response = await api.get(`/wishlist/check/${productId}`);
    const data = response.data;
    // Handle various response formats
    if (typeof data === 'boolean') return data;
    if (data?.isInWishlist !== undefined) return data.isInWishlist;
    if (typeof data?.data === 'boolean') return data.data;
    if (data?.data?.isInWishlist !== undefined) return data.data.isInWishlist;
    return false;
  },

  // Get wishlist count
  getCount: async () => {
    const response = await api.get("/wishlist/count");
    const data = response.data;
    if (typeof data === 'number') return data;
    if (data?.data !== undefined) return data.data;
    if (data?.count !== undefined) return data.count;
    return 0;
  },
};
