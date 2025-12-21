import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, ShoppingCart, Package, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/notificationService";

// Simple time ago function
const formatTimeAgo = (dateString) => {
    try {
        let date = new Date(dateString);
        if (dateString && !dateString.endsWith('Z') && !dateString.includes('+')) {
            date = new Date(dateString + 'Z');
        }
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return "Baru saja";
        if (diffMin < 60) return `${diffMin} menit lalu`;
        if (diffHour < 24) return `${diffHour} jam lalu`;
        if (diffDay < 7) return `${diffDay} hari lalu`;
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
        return "";
    }
};

// Get icon based on notification type
const getNotificationIcon = (type) => {
    switch (type) {
        case "NEW_ORDER":
        case "PAYMENT_CONFIRMED":
            return <ShoppingCart className="h-5 w-5" />;
        case "LOW_STOCK":
            return <Package className="h-5 w-5" />;
        default:
            return <Bell className="h-5 w-5" />;
    }
};

export default function AdminNotificationsPage() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const result = await notificationService.getAll();
            const notifs = Array.isArray(result) ? result : result?.content || [];
            setNotifications(notifs);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            fetchNotifications();
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            fetchNotifications();
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const handleNotificationClick = (notif) => {
        if (notif.type === "NEW_ORDER" || notif.type === "PAYMENT_CONFIRMED") {
            if (notif.referenceId) {
                navigate(`/admin/orders/${notif.referenceId}`);
            } else {
                navigate("/admin/orders");
            }
        } else if (notif.type === "LOW_STOCK") {
            navigate("/admin/products");
        }

        if (notif.isRead === false) {
            notificationService.markAsRead(notif.id);
        }
    };

    const unreadCount = notifications.filter(n => n.isRead === false).length;

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="h-9 w-9"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Bell className="h-6 w-6" />
                            Notifikasi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" onClick={handleMarkAllAsRead}>
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Tandai Semua Dibaca
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">Tidak ada notifikasi</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {notifications.map((notif) => {
                            const isUnread = notif.isRead === false;
                            return (
                                <div
                                    key={notif.id}
                                    className={`p-4 flex items-start gap-4 hover:bg-muted cursor-pointer transition-colors ${isUnread ? "bg-primary/5" : ""}`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    {/* Icon */}
                                    <div className={`p-2.5 rounded-full flex-shrink-0 ${isUnread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                        {getNotificationIcon(notif.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className={`text-sm ${isUnread ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-0.5">
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground/70 mt-1">
                                                    {formatTimeAgo(notif.createdAt)}
                                                </p>
                                            </div>

                                            {/* Mark as Read Button */}
                                            {isUnread && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 flex-shrink-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(notif.id);
                                                    }}
                                                    title="Tandai sudah dibaca"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Unread indicator */}
                                    {isUnread && (
                                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
