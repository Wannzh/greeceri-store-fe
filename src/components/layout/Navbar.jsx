import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, Menu, User, Package, ChevronDown, Search, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
import { useState } from "react";

const LOGO_URL = "https://res.cloudinary.com/dimtuwrap/image/upload/v1762286348/Icon_Greeceri_nrrl2u.jpg";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="hidden md:block bg-gray-900 text-white text-xs">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Pengiriman ke seluruh Indonesia
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
            <img
              src={LOGO_URL}
              alt="Greeceri"
              className="h-10 w-10 md:h-12 md:w-12 rounded-lg object-cover"
            />
            <div className="hidden sm:block">
              <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Greeceri</span>
              <p className="text-[10px] text-gray-500 -mt-1">Fresh & Quality Products</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Cari produk segar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 h-11 rounded-full border-2 border-gray-200 focus:border-primary bg-gray-50"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Cart - Hidden for Admin */}
            {user?.role !== "ADMIN" && (
              <Link to="/cart" className="relative group">
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 h-10 w-10">
                  <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
                  {cart.items.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                      {cart.items.length}
                    </span>
                  )}
                </Button>
              </Link>
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
                    <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 rounded-full border hover:bg-gray-50 h-10">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
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

                    <Link to="/orders/my">
                      <DropdownMenuItem className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" /> Pesanan Saya
                      </DropdownMenuItem>
                    </Link>

                    <Link to="/user/addresses">
                      <DropdownMenuItem className="cursor-pointer">
                        <MapPin className="mr-2 h-4 w-4" /> Alamat Saya
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

              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="mb-6 text-left border-b pb-4">
                  <SheetTitle className="flex items-center gap-3">
                    <img src={LOGO_URL} alt="Greeceri" className="h-10 w-10 rounded-lg" />
                    <span>Menu</span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-4 pr-10"
                    />
                    <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>

                <div className="flex flex-col gap-6">
                  {/* Navigation */}
                  <div className="flex flex-col space-y-1">
                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">Menu</h4>
                    <Link to="/" className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary font-medium">
                      Beranda
                    </Link>
                    <Link to="/products" className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary font-medium">
                      Semua Produk
                    </Link>
                  </div>

                  {/* Account */}
                  <div className="flex flex-col space-y-1">
                    <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">Akun</h4>

                    {!isAuthenticated ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Link to="/login">
                          <Button variant="outline" className="w-full">Masuk</Button>
                        </Link>
                        <Link to="/register">
                          <Button className="w-full">Daftar</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          </div>
                        </div>

                        <Link to="/user/profile" className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary">
                          <User size={18} /> Profil Saya
                        </Link>
                        <Link to="/orders/my" className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary">
                          <Package size={18} /> Pesanan Saya
                        </Link>
                        <Link to="/user/addresses" className="flex items-center gap-3 py-2 text-gray-700 hover:text-primary">
                          <MapPin size={18} /> Alamat Saya
                        </Link>

                        <Button onClick={handleLogout} variant="destructive" className="w-full mt-4">
                          <LogOut className="mr-2 h-4 w-4" /> Keluar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
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