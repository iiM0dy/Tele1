"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
    HiOutlineCube, 
    HiOutlineCollection, 
    HiOutlinePhotograph, 
    HiOutlineShoppingCart,
    HiOutlineLogout,
    HiOutlineChartBar
} from "react-icons/hi";

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HiOutlineChartBar },
    { name: "Products", href: "/admin/dashboard/products", icon: HiOutlineCube },
    { name: "Categories", href: "/admin/dashboard/categories", icon: HiOutlineCollection },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-64 bg-zinc-50 border-r border-zinc-200 min-h-screen">
            <div className="flex items-center justify-center h-20 border-b border-zinc-200">
                <h1 className="text-sm font-bold uppercase tracking-[0.3em]">Admin Panel</h1>
            </div>
            <div className="flex flex-col flex-grow pt-8">
                <nav className="flex-1 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                                    isActive 
                                    ? "bg-black text-white" 
                                    : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-zinc-200">
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="flex items-center w-full px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <HiOutlineLogout className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
