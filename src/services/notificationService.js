// services/notificationService.js
import api from "@/lib/axios";

export const notificationService = {
  // Get all notifications
  getAll: async () => {
    const res = await api.get("/admin/notifications");
    return res.data.data || [];
  },

  // Get unread count
  getUnreadCount: async () => {
    const res = await api.get("/admin/notifications/unread-count");
    return res.data.data || 0;
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    const res = await api.put(`/admin/notifications/${id}/read`);
    return res.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const res = await api.put("/admin/notifications/read-all");
    return res.data;
  },
};
