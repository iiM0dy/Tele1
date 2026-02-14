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
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Dashboard Content */}
            <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Revenue Card */}
                        <div className="flex flex-col gap-4 rounded-xl p-5 md:p-6 bg-surface-light dark:bg-surface-dark shadow-sm border border-admin-border hover:border-gold/30 transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-gold/10 rounded-lg text-gold">
                                    <MdAttachMoney className="text-[24px]" />
                                </div>
                            </div>
                            <div>
                                <p className="text-text-sub dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.totalRevenue')}
                                </p>
                                <h3 className="text-text-main dark:text-white text-xl md:text-2xl font-bold mt-1">
                                    ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                            </div>
                        </div>

                        {/* Orders Card */}
                        <div className="flex flex-col gap-4 rounded-xl p-5 md:p-6 bg-surface-light dark:bg-surface-dark shadow-sm border border-admin-border hover:border-gold/30 transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-gold/10 rounded-lg text-gold">
                                    <MdShoppingBag className="text-[24px]" />
                                </div>
                            </div>
                            <div>
                                <p className="text-text-sub dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.totalOrders')}
                                </p>
                                <h3 className="text-text-main dark:text-white text-xl md:text-2xl font-bold mt-1">
                                    {stats.totalOrders}
                                </h3>
                            </div>
                        </div>

                        {/* Products Card */}
                        <div className="flex flex-col gap-4 rounded-xl p-5 md:p-6 bg-surface-light dark:bg-surface-dark shadow-sm border border-admin-border hover:border-gold/30 transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-gold/10 rounded-lg text-gold">
                                    <MdCheckroom className="text-[24px]" />
                                </div>
                            </div>
                            <div>
                                <p className="text-text-sub dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.activeProducts')}
                                </p>
                                <h3 className="text-text-main dark:text-white text-xl md:text-2xl font-bold mt-1">
                                    {stats.totalProducts}
                                </h3>
                            </div>
                        </div>

                        {/* Categories Card */}
                        <div className="flex flex-col gap-4 rounded-xl p-5 md:p-6 bg-surface-light dark:bg-surface-dark shadow-sm border border-admin-border hover:border-gold/30 transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-gold/10 rounded-lg text-gold">
                                    <MdCategory className="text-[24px]" />
                                </div>
                            </div>
                            <div>
                                <p className="text-text-sub dark:text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    {t('admin.categories')}
                                </p>
                                <h3 className="text-text-main dark:text-white text-xl md:text-2xl font-bold mt-1">
                                    {stats.totalCategories}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-text-main dark:text-white text-base md:text-lg font-bold leading-tight tracking-tight uppercase">
                                {t('admin.recentOrders')}
                            </h3>
                            <Link
                                href="/admin/orders"
                                className="text-gold hover:text-gold/80 text-sm font-bold transition-colors uppercase tracking-widest"
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

                        <div className="rounded-xl border border-admin-border bg-surface-light dark:bg-surface-dark overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[640px]">
                                    <thead>
                                        <tr className="border-b border-admin-border bg-admin-hover/50">
                                            <th className={`p-3 md:p-4 text-[10px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.orderId')}
                                            </th>
                                            <th className={`p-3 md:p-4 text-[10px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.customer')}
                                            </th>
                                            <th className={`p-3 md:p-4 text-[10px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.product')}
                                            </th>
                                            <th className={`p-3 md:p-4 text-[10px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.date')}
                                            </th>
                                            <th className={`p-3 md:p-4 text-[10px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.amount')}
                                            </th>
                                            <th className={`p-3 md:p-4 text-[10px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                                {t('admin.status')}
                                            </th>
                                            <th className={`p-3 md:p-4 text-[10px] font-bold uppercase tracking-widest text-text-sub dark:text-gray-400`}></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-admin-border">
                                        {stats.recentOrders.length > 0 ? (
                                            stats.recentOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-admin-hover transition-colors"
                                                >
                                                    <td className="p-3 md:p-4 text-sm font-bold text-text-main dark:text-white">
                                                        #{order.id.slice(-6).toUpperCase()}
                                                    </td>
                                                    <td className="p-3 md:p-4 text-sm text-text-main dark:text-white">
                                                        {order.customer}
                                                    </td>
                                                    <td className="p-3 md:p-4 text-sm text-text-sub dark:text-gray-400">
                                                        {order.items.length > 0
                                                            ? (order.items[0]?.product?.name || t('admin.unknown')) + (order.items.length > 1 ? ` + ${order.items.length - 1} ${t('common.more')}` : '')
                                                            : t('admin.unknown')}
                                                    </td>
                                                    <td className="p-3 md:p-4 text-sm text-text-sub dark:text-gray-400">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3 md:p-4 text-sm font-bold text-text-main dark:text-white">
                                                        ${order.totalAmount.toFixed(2)}
                                                    </td>
                                                    <td className="p-3 md:p-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                                                            order.statusColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                                                                order.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                                    order.statusColor === 'red' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {t(`admin.${order.status.toLowerCase()}`) || order.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 md:p-4 text-right">
                                                        <button
                                                            onClick={() => handleViewDetails(order)}
                                                            className="text-gold hover:text-gold/80 p-2 rounded-lg hover:bg-gold/10 transition-colors"
                                                        >
                                                            <MdChevronRight className={`text-xl ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-text-sub dark:text-gray-400 italic">
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
