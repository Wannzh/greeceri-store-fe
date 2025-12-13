import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">

        {/* ========== LOGO ========== */}
        <Link to="/" className="text-xl font-bold text-primary">
          Greeceri
        </Link>

        {/* ========== MENU DESKTOP ========== */}
        <nav className="hidden md:flex items-center gap-6">

          <Link to="/" className="hover:text-primary transition">Home</Link>

          <Link to="/products" className="hover:text-primary transition">Products</Link>

          {/* Admin Only */}
          {isAuthenticated && user?.role === "ADMIN" && (
            <Link to="/admin" className="hover:text-primary transition font-medium">
              Admin Dashboard
            </Link>
          )}

          {/* Jika belum login */}
          {!isAuthenticated && (
            <Button asChild variant="default">
              <Link to="/login">Login</Link>
            </Button>
          )}

          {/* Jika sudah login */}
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6" />

                {/* Badge jumlah item cart (sementara statis) */}
                <span className="absolute -top-1 -right-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                  3
                </span>
              </Link>

              {/* Logout */}
              <Button onClick={logout} variant="outline" size="sm" className="flex items-center gap-2">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          )}
        </nav>

        {/* ========== MOBILE (HAMBURGER MENU) ========== */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>

          <SheetContent side="right" className="p-6">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-lg" >Home</Link>
              <Link to="/products" className="text-lg">Products</Link>

              {isAuthenticated && user?.role === "ADMIN" && (
                <Link to="/admin" className="text-lg">Admin Dashboard</Link>
              )}

              {!isAuthenticated ? (
                <Button asChild className="w-full">
                  <Link to="/login">Login</Link>
                </Button>
              ) : (
                <>
                  <Link to="/cart" className="flex items-center gap-2 text-lg">
                    <ShoppingCart size={18} /> Cart
                  </Link>

                  <Button onClick={logout} variant="destructive" className="w-full">
                    Logout
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
