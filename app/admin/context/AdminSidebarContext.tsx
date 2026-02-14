"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminSidebarContextType {
    isOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(
    undefined
);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openSidebar = () => setIsOpen(true);
    const closeSidebar = () => setIsOpen(false);

    return (
        <AdminSidebarContext.Provider value={{ isOpen, openSidebar, closeSidebar }}>
            {children}
        </AdminSidebarContext.Provider>
    );
}

export function useAdminSidebar() {
    const context = useContext(AdminSidebarContext);
    if (context === undefined) {
        throw new Error(
            "useAdminSidebar must be used within an AdminSidebarProvider"
        );
    }
    return context;
}
