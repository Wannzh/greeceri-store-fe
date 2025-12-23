import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, User, Settings, LogOut, Sun, Moon, Check, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { notificationService } from "@/services/notificationService";

// Simple time ago function - handles UTC timestamps from backend
const formatTimeAgo = (dateString) => {
    try {
        // Parse the date and handle UTC timezone
        let date = new Date(dateString);

        // If backend sends without timezone info, assume it's UTC
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
        return date.toLocaleDateString("id-ID");
    } catch {
        return "";
    }
};

export default function AdminNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Notifications state
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    // Theme state - default to light unless user explicitly set dark
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("admin-theme");
            return saved === "dark";
        }
        return false;
    });

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        try {
            setLoadingNotifications(true);
            const [notifsResult, countResult] = await Promise.all([
                notificationService.getAll(),
                notificationService.getUnreadCount(),
            ]);

            // Handle different response formats
            const notifs = Array.isArray(notifsResult) ? notifsResult :
                notifsResult?.content ? notifsResult.content : [];

            // Always count unread from the notifications array (most reliable)
            const count = notifs.filter(n => n.isRead === false).length;

            // Debug: log first notification to see structure
            if (notifs.length > 0) {
                console.log("First notification structure:", JSON.stringify(notifs[0], null, 2));
            }

            console.log("Notifications loaded:", notifs.length, "Unread:", count); // Debug

            setNotifications(notifs.slice(0, 10)); // Show latest 10
            setUnreadCount(count);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoadingNotifications(false);
        }
    }, []);

    // Fetch on mount and poll every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Apply theme on mount and change
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("admin-theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("admin-theme", "light");
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
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
        // Navigate based on notification type
        if (notif.type === "NEW_ORDER" || notif.type === "PAYMENT_CONFIRMED") {
            if (notif.referenceId) {
                navigate(`/admin/orders/${notif.referenceId}`);
            } else {
                navigate("/admin/orders");
            }
        } else if (notif.type === "LOW_STOCK") {
            navigate("/admin/products");
        }

        // Mark as read if not already
        if (!notif.isRead && !notif.read) {
            notificationService.markAsRead(notif.id);
            fetchNotifications();
        }
    };

    // Get user initials
    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
        : "AD";

    return (
        <header className="sticky top-14 md:top-0 z-20 flex h-14 md:h-16 items-center justify-end border-b border-border bg-card px-3 sm:px-4 md:px-6">
            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                    title={isDark ? "Mode Terang" : "Mode Gelap"}
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground border-2 border-card">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 max-h-[70vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-2 py-1.5">
                            <DropdownMenuLabel className="py-0">Notifikasi</DropdownMenuLabel>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-primary hover:text-primary"
                                    onClick={handleMarkAllAsRead}
                                >
                                    <CheckCheck className="h-3.5 w-3.5 mr-1" />
                                    Tandai semua
                                </Button>
                            )}
                        </div>
                        <DropdownMenuSeparator />

                        {loadingNotifications ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                Tidak ada notifikasi
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const isUnread = !notif.isRead && !notif.read;
                                return (
                                    <DropdownMenuItem
                                        key={notif.id}
                                        className={`flex items-start gap-3 p-3 cursor-pointer ${isUnread ? "bg-primary/5" : ""}`}
                                        onClick={() => handleNotificationClick(notif)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className={`text-sm ${isUnread ? "font-semibold" : "font-medium"}`}>
                                                    {notif.title}
                                                </span>
                                                {isUnread && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 flex-shrink-0"
                                                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                                                        title="Tandai sudah dibaca"
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70 mt-1">
                                                {formatTimeAgo(notif.createdAt)}
                                            </p>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })
                        )}

                        {notifications.length > 0 && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="justify-center text-primary font-medium cursor-pointer py-2"
                                    onClick={() => navigate("/admin/notifications")}
                                >
                                    Lihat semua notifikasi
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 px-2 h-9 md:h-10 hover:bg-muted">
                            <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs md:text-sm">
                                {initials}
                            </div>
                            <div className="hidden lg:flex flex-col items-start text-sm">
                                <span className="font-medium text-foreground">{user?.name || "Admin"}</span>
                                <span className="text-xs text-muted-foreground">Administrator</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/admin/settings")}>
                            <Settings className="mr-2 h-4 w-4" />
                            Pengaturan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
