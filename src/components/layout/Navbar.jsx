import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, LogOut, Menu, User, Package, ChevronDown, Search, MapPin, Heart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { wishlistService } from "@/services/wishlistService";
import { useState, useEffect } from "react";

const LOGO_URL = "https://res.cloudinary.com/dimtuwrap/image/upload/v1762286348/Icon_Greeceri_nrrl2u.jpg";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Reset input after search
    }
  };

  // Cek apakah sedang di halaman produk
  const isProductPage = location.pathname === "/products";

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="hidden md:block bg-gray-900 text-white text-xs">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              Pengiriman ke Dakota dan sekitarnya (maks. 5 km)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/orders/my" className="hover:text-zinc-400 transition-colors">Lacak Pesanan</Link>
            <span>|</span>
            <a href="mailto:support@greeceri.store" className="hover:text-zinc-400 transition-colors">Bantuan</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Greeceri</span>
              <p className="text-[10px] text-gray-500 -mt-1">Fresh & Quality Products</p>
            </div>
          </Link>

          {/* Search Bar - Desktop (HIDDEN ON PRODUCT PAGE) */}
          {!isProductPage ? (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Cari produk segar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-12 h-11 rounded-full border-2 border-gray-200 focus:border-primary bg-gray-50 transition-all focus:bg-white"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full shadow-sm"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          ) : (
            <div className="hidden md:flex flex-1"></div> // Spacer agar layout tidak bergeser
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Cart - Hidden for Admin */}
            {user?.role !== "ADMIN" && (
              <>
                {/* Cart */}
                <Link to="/cart" className="relative group">
                  <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 h-10 w-10">
                    <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
                    {cart.items.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in">
                        {cart.items.length}
                      </span>
                    )}
                  </Button>
                </Link>
              </>
            )}

            {/* Auth Buttons / User Menu - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="font-medium text-gray-700">Masuk</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="font-semibold rounded-full px-6">Daftar</Button>
                  </Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 rounded-full border hover:bg-gray-50 h-10 transition-all">
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={user.name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <Link to="/user/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Profil Saya
                      </DropdownMenuItem>
                    </Link>

                    <Link to="/wishlist">
                      <DropdownMenuItem className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" /> Wishlist
                      </DropdownMenuItem>
                    </Link>

                    <Link to="/orders/my">
                      <DropdownMenuItem className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" /> Pesanan Saya
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-gray-700">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="p-4 border-b bg-gray-50">
                  <SheetTitle className="flex items-center gap-3">
                    <img src={LOGO_URL} alt="Greeceri" className="h-10 w-10 rounded-lg" />
                    <div>
                      <span className="text-lg font-bold">Greeceri</span>
                      <p className="text-xs text-gray-500 font-normal">Fresh & Quality Products</p>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="sr-only">Menu navigasi mobile</SheetDescription>
                </SheetHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Mobile Search - Only show if NOT on product page */}
                  {!isProductPage && (
                    <form onSubmit={handleSearch} className="mb-6">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Cari produk..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-4 pr-10 h-10"
                        />
                        <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-10">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* User Info Card (if logged in) */}
                  {isAuthenticated && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl mb-6">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="space-y-1 mb-6">
                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider px-2 mb-2">Menu</h4>
                    <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-colors">
                      Beranda
                    </Link>
                    <Link to="/products" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-colors">
                      Semua Produk
                    </Link>
                  </div>

                  {/* Account */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider px-2 mb-2">Akun</h4>

                    {!isAuthenticated ? (
                      <div className="grid grid-cols-2 gap-3 px-2">
                        <Link to="/login">
                          <Button variant="outline" className="w-full h-10">Masuk</Button>
                        </Link>
                        <Link to="/register">
                          <Button className="w-full h-10">Daftar</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <Link to="/user/profile" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                          <User size={18} /> Profil Saya
                        </Link>
                        <Link to="/orders/my" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                          <Package size={18} /> Pesanan Saya
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer - Logout Button (if logged in) */}
                {isAuthenticated && (
                  <div className="p-4 border-t bg-gray-50">
                    <Button onClick={handleLogout} variant="destructive" className="w-full h-11">
                      <LogOut className="mr-2 h-4 w-4" /> Keluar
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>

      {/* Bottom Navigation - Categories */}
      <div className="hidden md:block border-t bg-gray-50">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-8 h-12">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-gray-600"}`
              }
            >
              Beranda
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-gray-600"}`
              }
            >
              Semua Produk
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}