import React from "react";
import { STATUS_LABEL } from "@/features/admin/orders/constants";

// Horizontal timeline for order statuses
export default function OrderStatusTimeline({ currentStatus }) {
  const flow = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

  // If cancelled, mark separately
  if (currentStatus === "CANCELLED") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-semibold">!
          </div>
          <div className="text-sm font-medium text-red-700">{STATUS_LABEL.CANCELLED}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 overflow-auto py-2">
      {flow.map((s, idx) => {
        const done = flow.indexOf(currentStatus) >= idx;
        return (
          <div key={s} className="flex items-center gap-3">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${done ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
              {done ? '✓' : idx + 1}
            </div>
            <div className={`text-sm font-medium ${done ? 'text-primary' : 'text-gray-500'}`}>{STATUS_LABEL[s]}</div>
            {idx < flow.length - 1 && (
              <div className={`h-px w-8 ${done ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
