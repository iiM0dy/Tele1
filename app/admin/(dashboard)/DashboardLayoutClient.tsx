"use client";

import AdminSidebar from "../components/AdminSidebar";
import { AdminSidebarProvider, useAdminSidebar } from "../context/AdminSidebarContext";
import { MdMenu } from "react-icons/md";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
    const { isOpen, openSidebar, closeSidebar } = useAdminSidebar();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background dark text-foreground">
            <AdminSidebar isOpen={isOpen} onClose={closeSidebar} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Menu Button */}
                <button
                    onClick={openSidebar}
                    className="lg:hidden fixed top-4 left-4 z-40 bg-admin-sidebar border border-admin-border text-white p-2 rounded-lg shadow-lg hover:bg-admin-hover transition-all active:scale-95"
                >
                    <MdMenu className="text-2xl" />
                </button>
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide bg-background">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminSidebarProvider>
            <DashboardLayoutInner>{children}</DashboardLayoutInner>
        </AdminSidebarProvider>
    );
}
