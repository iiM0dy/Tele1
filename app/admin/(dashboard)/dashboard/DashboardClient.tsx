"use client";

import Link from "next/link";
import { useState } from "react";
import OrderDetailsModal from "../orders/OrderDetailsModal";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdAttachMoney, MdShoppingBag, MdCheckroom, MdCategory, MdChevronRight, MdChevronLeft } from "react-icons/md";

interface RecentOrder {
    id: string;
    Name: string;
    customer: string;
    phone: string;
    streetAddress: string;
    city: string;
    product: string;
    date: string;
    amount: string;
    totalAmount: number;
    status: string;
    statusColor: string;
    createdAt: string;
    items: {
        id: string;
        quantity: number;
        price: number;
        product: {
            name: string;
            images: string;
        } | null;
    }[];
}

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCategories: number;
    recentOrders: RecentOrder[];
}

export default function DashboardClient({ stats }: { stats: DashboardStats }) {
    const { t, dir } = useLanguage();
    const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleViewDetails = (order: RecentOrder) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#202126]">
            {/* Scrollable Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Revenue Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white/2 border border-white/5 hover:border-accent/30 transition-all duration-300 min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                                    <MdAttachMoney className="text-[24px]" />
                                </div>
                            </div>
                            <div>
                                <p className="text-white/60 text-[11px] font-semibold tracking-wider">
                                    {t('admin.totalRevenue')}
                                </p>
                                <h3 className="text-white text-2xl font-black mt-1 tracking-tight">
                                    ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                            </div>
                        </div>

                        {/* Orders Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white/2 border border-white/5 hover:border-accent/30 transition-all duration-300 min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                                    <MdShoppingBag className="text-[24px]" />
                                </div>
                            </div>
                            <div>
                                <p className="text-white/60 text-[11px] font-semibold tracking-wider">
                                    {t('admin.totalOrders')}
                                </p>
                                <h3 className="text-white text-2xl font-black mt-1 tracking-tight">
                                    {stats.totalOrders}
                                </h3>
                            </div>
                        </div>

                        {/* Products Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white/2 border border-white/5 hover:border-accent/30 transition-all duration-300 min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                                    <MdCheckroom className="text-[24px]" />
                                </div>
                            </div>
                            <div>
                                <p className="text-white/60 text-[11px] font-semibold tracking-wider">
                                    {t('admin.totalCategories')}
                                </p>
                                <h3 className="text-white text-2xl font-black mt-1 tracking-tight">
                                    {stats.totalProducts}
                                </h3>
                            </div>
                        </div>

                        {/* Categories Card */}
                        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white/2 border border-white/5 hover:border-accent/30 transition-all duration-300 min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                                    <MdCategory className="text-[24px]" />
                                </div>
                            </div>
                            <div>
                                <p className="text-white/60 text-[11px] font-semibold tracking-wider">
                                    {t('admin.categories')}
                                </p>
                                <h3 className="text-white text-2xl font-black mt-1 tracking-tight">
                                    {stats.totalCategories}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Section */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white text-[11px] font-semibold tracking-wider">
                                {t('admin.recentOrders')}
                            </h3>
                            <Link
                                href="/admin/orders"
                                className="text-accent hover:text-white text-[11px] font-semibold transition-colors tracking-wider"
                            >
                                {t('admin.viewAll')}
                            </Link>
                        </div>

                        <OrderDetailsModal
                            isOpen={isDetailsModalOpen}
                            onClose={() => {
                                setIsDetailsModalOpen(false);
                                setSelectedOrder(null);
                            }}
                            order={selectedOrder as any}
                        />

                        <div className="rounded-3xl border border-white/5 bg-white/1 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[640px]">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/2">
                                            <th className={`p-5 text-[10px] font-semibold tracking-wider text-white/40 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.orderId')}
                                            </th>
                                            <th className={`p-5 text-[10px] font-semibold tracking-wider text-white/40 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.customer')}
                                            </th>
                                            <th className={`p-5 text-[10px] font-semibold tracking-wider text-white/40 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.product')}
                                            </th>
                                            <th className={`p-5 text-[10px] font-semibold tracking-wider text-white/40 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.date')}
                                            </th>
                                            <th className={`p-5 text-[10px] font-semibold tracking-wider text-white/40 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.amount')}
                                            </th>
                                            <th className={`p-5 text-[10px] font-semibold tracking-wider text-white/40 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.status')}
                                            </th>
                                            <th className={`p-5 text-[10px] font-black uppercase tracking-widest text-white/60`}></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {stats.recentOrders.length > 0 ? (
                                            stats.recentOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="group hover:bg-white/2 transition-colors"
                                                >
                                                    <td className="p-5 text-[12px] font-black text-white">
                                                        #{order.id.slice(-6).toUpperCase()}
                                                    </td>
                                                    <td className="p-5 text-[12px] font-bold text-white/60">
                                                        {order.customer}
                                                    </td>
                                                    <td className="p-5 text-[12px] text-white/60">
                                                        {order.items.length > 0
                                                            ? (order.items[0]?.product?.name || t('admin.unknown')) + (order.items.length > 1 ? ` + ${order.items.length - 1} ${t('common.more')}` : '')
                                                            : t('admin.unknown')}
                                                    </td>
                                                    <td className="p-5 text-[12px] text-white/60">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-5 text-[12px] font-black text-white">
                                                        ${order.totalAmount.toFixed(2)}
                                                    </td>
                                                    <td className="p-5">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.statusColor === 'green' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                            order.statusColor === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                                order.statusColor === 'yellow' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                                    order.statusColor === 'red' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                                        'bg-white/5 text-white/60 border border-white/10'
                                                            }`}>
                                                            {t(`admin.${order.status.toLowerCase()}`) || order.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <button
                                                            onClick={() => handleViewDetails(order)}
                                                            className="text-white/60 hover:text-accent p-2 rounded-lg transition-colors"
                                                            aria-label={`${t('admin.viewDetails')} ${order.id}`}
                                                        >
                                                            <MdChevronRight className={`text-xl ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-white/40 italic text-[11px] font-bold uppercase tracking-widest">
                                                    {t('admin.noOrdersFound')}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
