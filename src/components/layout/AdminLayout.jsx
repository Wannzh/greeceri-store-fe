import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { AdminSidebarProvider, useAdminSidebar } from "@/context/AdminSidebarContext";
import { cn } from "@/lib/utils";

function AdminLayoutContent() {
  const { collapsed } = useAdminSidebar();

  return (
    <div className="min-h-screen bg-background">
      {/* SIDEBAR - fixed position */}
      <AdminSidebar />

      {/* MAIN CONTENT AREA - with dynamic margin */}
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        "md:ml-60", // default margin for expanded sidebar
        collapsed && "md:ml-25" // margin for collapsed sidebar
      )}>
        {/* Mobile spacer for fixed header */}
        <div className="md:hidden h-14" />

        {/* NAVBAR */}
        <AdminNavbar />

        {/* CONTENT */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminSidebarProvider>
      <AdminLayoutContent />
    </AdminSidebarProvider>
  );
}
