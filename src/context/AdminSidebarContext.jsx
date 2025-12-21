import { createContext, useContext, useState } from "react";

const AdminSidebarContext = createContext({
    collapsed: false,
    setCollapsed: () => { },
    mobileOpen: false,
    setMobileOpen: () => { },
});

export function AdminSidebarProvider({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <AdminSidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
            {children}
        </AdminSidebarContext.Provider>
    );
}

export function useAdminSidebar() {
    return useContext(AdminSidebarContext);
}
