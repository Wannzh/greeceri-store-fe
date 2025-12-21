import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, User, Settings, LogOut, Sun, Moon } from "lucide-react";
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

export default function AdminNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Theme state - default to light unless user explicitly set dark
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("admin-theme");
            return saved === "dark";
        }
        return false;
    });

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
                            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground border-2 border-card">
                                3
                            </Badge>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 sm:w-80">
                        <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                            <span className="font-medium text-sm">Pesanan baru diterima</span>
                            <span className="text-xs text-muted-foreground">
                                Pesanan #ORD-001 dari Ahmad Rizki
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                            <span className="font-medium text-sm">Stok rendah</span>
                            <span className="text-xs text-muted-foreground">
                                Stok Salmon Fillet hampir habis
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                            <span className="font-medium text-sm">Pembayaran dikonfirmasi</span>
                            <span className="text-xs text-muted-foreground">
                                Pesanan #ORD-005 sudah dibayar
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-center text-primary font-medium cursor-pointer">
                            Lihat semua notifikasi
                        </DropdownMenuItem>
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
                            <User className="mr-2 h-4 w-4" />
                            Profil
                        </DropdownMenuItem>
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
