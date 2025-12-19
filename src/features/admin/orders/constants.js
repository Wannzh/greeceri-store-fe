// Shared order status constants for admin pages
export const STATUS_OPTIONS = [
  "ALL",
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const STATUS_LABEL = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  DELIVERED: "Diterima",
  CANCELLED: "Dibatalkan",
};

export const STATUS_COLOR = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-orange-100 text-orange-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export const STATUS_FLOW = {
  PENDING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: [], // Admin cannot change to DELIVERED, only user can confirm
  DELIVERED: [],
  CANCELLED: [],
};

export default {
  STATUS_OPTIONS,
  STATUS_LABEL,
  STATUS_COLOR,
  STATUS_FLOW,
};
