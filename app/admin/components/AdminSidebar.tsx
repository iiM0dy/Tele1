"use client";

import Link from "next/link";
import { 
    MdDashboard, 
    MdShoppingBag, 
    MdCategory, 
    MdViewCarousel, 
    MdInventory2, 
    MdLocalOffer, 
    MdEditNote, 
    MdGroup, 
    MdSettings,
    MdClose,
    MdLogout
} from "react-icons/md";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

    const navItems = [
        { href: "/admin/dashboard", icon: MdDashboard, label: t('admin.dashboard') },
        { href: "/admin/products", icon: MdShoppingBag, label: t('admin.products'), permission: "canManageProducts" },
        { href: "/admin/categories", icon: MdCategory, label: t('admin.categories'), permission: "canManageCategories" },
        { href: "/admin/banners", icon: MdViewCarousel, label: t('admin.banners'), permission: "canManageBanners" },
        { href: "/admin/orders", icon: MdInventory2, label: t('admin.orders'), permission: "canManageOrders" },
        { href: "/admin/promocodes", icon: MdLocalOffer, label: t('admin.promoCodes'), permission: "canManagePromoCodes" },
        { href: "/admin/site-content", icon: MdEditNote, label: t('admin.siteContent'), superAdminOnly: true },
        { href: "/admin/users", icon: MdGroup, label: t('admin.users'), superAdminOnly: true },
        { href: "/admin/settings", icon: MdSettings, label: t('admin.settings'), superAdminOnly: true },
    ];

    const handleSignOut = () => {
        signOut({ callbackUrl: "/admin/login" });
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 ${dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-64 shrink-0 border-admin-border bg-admin-sidebar flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0")
                    }`}
            >
                <div className="h-full flex flex-col justify-between p-4">
                    <div className="flex flex-col gap-6">
                        {/* Logo & Brand */}
                        <div className="flex items-center justify-between px-2 py-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gold/20 rounded-lg flex items-center justify-center border border-gold/30">
                                    <MdShoppingBag className="text-gold text-2xl" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-white text-lg font-bold leading-tight">
                                        {t('header.brandName')}
                                    </h1>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                        {t('admin.adminPanel')}
                                    </p>
                                </div>
                            </div>
                            {/* Close button for mobile */}
                            <button
                                onClick={onClose}
                                className="lg:hidden text-gray-500 hover:text-white"
                            >
                                <MdClose className="text-2xl" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item: any) => {
                                // Filter based on superAdminOnly flag
                                if (item.superAdminOnly && !isSuperAdmin) return null;

                                // Filter based on granular permissions if not super admin
                                if (item.permission && !isSuperAdmin && !(session?.user as any)?.[item.permission]) {
                                    return null;
                                }

                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                            ? "bg-gold text-white shadow-md shadow-gold/20"
                                            : "text-gray-400 hover:bg-admin-hover hover:text-white"
                                            } group`}
                                    >
                                        <item.icon
                                            className={`text-xl ${!isActive ? "group-hover:text-gold transition-colors" : ""}`}
                                        />
                                        <p
                                            className={`text-sm leading-normal ${isActive ? "font-bold" : "font-medium"
                                                }`}
                                        >
                                            {item.label}
                                        </p>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-col gap-2 border-t border-admin-border pt-4">
                        <div className="flex items-center justify-between px-3 py-1 mb-2">
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{t('language.switchTo') || "Language"}</p>
                            <LanguageToggle />
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-900/10 hover:text-red-500 transition-colors group"
                        >
                            <MdLogout className={`text-xl group-hover:text-red-500 transition-colors ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                            <p className="text-sm font-medium leading-normal">{t('admin.signOut')}</p>
                        </button>

                        <div className="flex items-center gap-3 px-3 py-2 mt-2 bg-admin-hover rounded-lg border border-admin-border">
                            <div className="flex flex-col">
                                <p className="text-white text-sm font-bold leading-tight">
                                    {session?.user?.name || "Admin"}
                                </p>
                                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">
                                    {isSuperAdmin ? t('admin.superAdmin') : t('admin.editor')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
