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
    MdLogout,
    MdPerson,
    MdStar,
    MdLibraryBooks
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
        { href: "/admin/reviews", icon: MdStar, label: t('admin.reviews'), permission: "canManageProducts" },
        { href: "/admin/promocodes", icon: MdLocalOffer, label: t('admin.promoCodes'), permission: "canManagePromoCodes" },
        { href: "/admin/blogs", icon: MdLibraryBooks, label: t('admin.blogs'), permission: "canManageBlogs" },
        { href: "/admin/site-content", icon: MdEditNote, label: t('admin.siteContent') },
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
                className={`fixed lg:static inset-y-0 ${dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-64 shrink-0 border-white/5 bg-[#202126] flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : (dir === 'rtl' ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0")
                    }`}
            >
                <div className="h-full flex flex-col justify-between p-6">
                    <div className="flex flex-col gap-8">
                        {/* Logo & Brand */}
                        <div className="flex items-center justify-between px-2">
                            <div className="flex flex-col">
                                <h1
                                    dir="ltr"
                                    className="text-white text-2xl font-logo font-black tracking-tighter leading-tight uppercase"
                                >
                                    TELE1<span className="text-accent">.</span>
                                </h1>
                                <p className="text-white/60 text-[11px] font-semibold tracking-wider">
                                    {t('admin.adminPanel')}
                                </p>
                            </div>
                            {/* Close button for mobile */}
                            <button
                                onClick={onClose}
                                className="lg:hidden text-white/60 hover:text-white"
                                aria-label={t('admin.closeSidebar')}
                            >
                                <MdClose className="text-2xl" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item: any) => {
                                // Filter based on superAdminOnly flag
                                // if (item.superAdminOnly && !isSuperAdmin) return null;

                                // Filter based on granular permissions if not super admin
                                // if (item.permission && !isSuperAdmin && !(session?.user as any)?.[item.permission]) {
                                //     return null;
                                // }

                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? "bg-accent text-white"
                                            : "text-white/60 hover:bg-white/3 hover:text-white"
                                            } group`}
                                    >
                                        <item.icon
                                            className={`text-xl ${isActive ? "text-white" : "text-white/40 group-hover:text-accent transition-colors"}`}
                                        />
                                        <p
                                            className={`text-[11px] leading-normal ${isActive ? "font-black" : "font-bold"
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
                    <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between px-4 py-2">
                            <p className="text-[11px] font-semibold tracking-wider text-white/60">
                                {t('language.switchTo')}
                            </p>
                            <LanguageToggle />
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-2xl font-black tracking-wider text-[11px] hover:opacity-90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <MdLogout className={`text-xl ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                            <p>{t('admin.signOut')}</p>
                        </button>

                        <div className="flex items-center gap-4 px-4 py-4 bg-white/2 rounded-2xl border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
                                <MdPerson className="text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-white text-[12px] font-black uppercase tracking-wider leading-tight">
                                    {session?.user?.name || "Admin"}
                                </p>
                                <p className="text-white/60 mt-2 tracking-wider text-[11px] font-semibold">
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
