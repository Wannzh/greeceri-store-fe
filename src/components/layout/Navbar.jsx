import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, Menu, User, Package, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-bold text-sm transition-colors"
      : "text-gray-600 font-medium text-sm hover:text-primary transition-colors";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
            G
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Greeceri</span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>
            Beranda
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Produk
          </NavLink>
          {/* Menu Admin */}
          {isAuthenticated && user?.role === "ADMIN" && (
            <NavLink to="/admin" className={navLinkClass}>
              Dashboard Admin
            </NavLink>
          )}
        </nav>

        {/* --- ACTIONS (Cart & User) --- */}
        <div className="flex items-center gap-4">
          
          {/* KERANJANG BELANJA */}
          {user?.role !== "ADMIN" && (
            <Link to="/cart" className="relative group">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                
                {/* Badge Cart Count */}
                {cart.items.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                    {cart.items.length}
                  </span>
                )}
              </Button>
            </Link>
          )}

          <div className="hidden md:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-medium text-gray-600">Masuk</Button>
                </Link>
                <Link to="/register">
                  <Button className="font-bold">Daftar</Button>
                </Link>
              </>
            ) : (
              // --- USER DROPDOWN MENU ---
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 rounded-full border hover:bg-gray-50">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
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
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Menu Item */}
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

          {/* --- MOBILE MENU (HAMBURGER) --- */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-600">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-6 text-left border-b pb-4">
                <SheetTitle className="flex items-center gap-2">
                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
                    G
                  </div>
                  Greeceri Menu
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6">
                {/* Navigasi Mobile */}
                <div className="flex flex-col space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Navigasi</h4>
                  <NavLink to="/" className={navLinkClass}>Beranda</NavLink>
                  <NavLink to="/products" className={navLinkClass}>Semua Produk</NavLink>
                  {user?.role === "ADMIN" && (
                    <NavLink to="/admin" className={navLinkClass}>Admin Dashboard</NavLink>
                  )}
                </div>

                {/* Akun Mobile */}
                <div className="flex flex-col space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Akun</h4>
                  
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
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>

                      <Link to="/user/profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary">
                        <User size={18} /> Profil Saya
                      </Link>
                      <Link to="/orders/my" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary">
                        <Package size={18} /> Pesanan Saya
                      </Link>
                      
                      <Button onClick={handleLogout} variant="destructive" className="w-full mt-2">
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
    </header>
  );
}