import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
} from "lucide-react";

const menu = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    label: "Products",
    icon: Package,
    path: "/admin/products",
  },
  {
    label: "Categories",
    icon: Tags,
    path: "/admin/categories",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    path: "/admin/orders",
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-sm">

      {/* LOGO */}
      <div className="h-16 flex items-center px-6 font-bold text-xl border-b">
        Greeceri Admin
      </div>

      {/* MENU */}
      <nav className="p-4 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
               ${
                 isActive
                   ? "bg-primary text-white"
                   : "text-gray-600 hover:bg-gray-100"
               }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
