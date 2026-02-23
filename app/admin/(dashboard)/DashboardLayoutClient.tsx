"use client";

import AdminSidebar from "../components/AdminSidebar";
import { AdminSidebarProvider, useAdminSidebar } from "../context/AdminSidebarContext";
import { MdMenu } from "react-icons/md";
import { useLanguage } from "@/app/context/LanguageContext";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
    const { isOpen, openSidebar, closeSidebar } = useAdminSidebar();
    const { t } = useLanguage();

    return (
        <div className="admin-panel flex h-screen w-full overflow-hidden bg-[#202126] text-white">
            <AdminSidebar isOpen={isOpen} onClose={closeSidebar} />
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center p-4 shrink-0 bg-[#202126]">
                    <button
                        onClick={openSidebar}
                        className="bg-[#202126] border border-white/5 text-white p-2 rounded-xl shadow-2xl hover:bg-white/5 transition-all active:scale-95"
                        aria-label={t('common.openMenu')}
                    >
                        <MdMenu className="text-2xl" />
                    </button>
                </div>
                <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#202126]">
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
