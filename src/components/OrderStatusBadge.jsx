import React from "react";
import { STATUS_LABEL, STATUS_COLOR } from "@/features/admin/orders/constants";

/**
 * OrderStatusBadge
 * - Reusable status pill
 */
export default function OrderStatusBadge({ status, className = "" }) {
  const label = STATUS_LABEL[status] || status || "-";
  const color = STATUS_COLOR[status] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium uppercase ${color} ${className}`}
    >
      {label}
    </span>
  );
}
