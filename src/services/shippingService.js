import api from "@/lib/axios";

export const shippingService = {
  /**
   * Validate address for delivery eligibility
   * @param {string} addressId - UUID of the address
   * @returns {Promise<{isDeliverable: boolean, distanceKm: number, shippingCost: number, message: string}>}
   */
  validateAddress: async (addressId) => {
    const res = await api.post("/shipping/validate-address", { addressId });
    return res.data.data;
  },

  /**
   * Get available delivery slots for a specific date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<string[]>} - Array of slot names e.g. ["MORNING", "AFTERNOON"]
   */
  getDeliverySlots: async (date) => {
    const res = await api.get("/shipping/slots", { params: { date } });
    return res.data.data;
  },
};

// Delivery slot display labels
export const DELIVERY_SLOT_LABELS = {
  MORNING: "Pagi (07:00 - 10:00)",
  AFTERNOON: "Siang (14:00 - 17:00)",
};

// Shipping cost reference (for display only, actual cost from API)
export const SHIPPING_RATES = [
  { minKm: 0, maxKm: 2, cost: 5000 },
  { minKm: 2, maxKm: 3, cost: 7000 },
  { minKm: 3, maxKm: 4, cost: 9000 },
  { minKm: 4, maxKm: 5, cost: 12000 },
];

export const SERVICE_FEE = 1000;
export const MIN_ORDER_AMOUNT = 10000;
export const MAX_DELIVERY_DISTANCE = 5; // km
