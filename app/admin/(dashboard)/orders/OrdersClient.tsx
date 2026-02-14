"use client";

import { MdPendingActions, MdLocalShipping, MdTaskAlt, MdPayments, MdExpandMore, MdVisibility, MdDelete, MdSync, MdChevronLeft, MdChevronRight } from "react-icons/md";
import Link from "next/link";
import { updateOrderStatus, deleteOrder } from "../../../../lib/admin-actions";
import { useState, useRef, useEffect } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Order {
    id: string;
    Name: string;
    phone: string;
    streetAddress: string;
    city: string;
    totalAmount: number;
    status: string;
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

export default function OrdersClient({ orders }: { orders: Order[] }) {
    const { data: session } = useSession();
    const router = useRouter();
    const canManage = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManageOrders;
    const canDelete = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeleteOrders;
    const { t, dir } = useLanguage();

    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [filter, setFilter] = useState<string>("ALL");

    // Calculate stats
    const stats = {
        pending: orders.filter(o => o.status === 'PENDING').length,
        shippedToday: orders.filter(o => {
            const date = new Date(o.createdAt);
            const today = new Date();
            return o.status === 'SHIPPED' &&
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        }).length,
        deliveredMTD: orders.filter(o => {
            const date = new Date(o.createdAt);
            const today = new Date();
            return o.status === 'DELIVERED' &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        }).length,
        totalRevenue: orders
            .filter(o => o.status === 'DELIVERED')
            .reduce((sum, o) => sum + Number(o.totalAmount), 0)
    };

    const filteredOrders = orders.filter(o => {
        if (filter === "ALL") return true;
        return o.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'gold';
            case 'PROCESSING': return 'blue';
            case 'PENDING': return 'amber';
            case 'CANCELLED': return 'red';
            case 'SHIPPED': return 'purple';
            default: return 'gray';
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const result = await updateOrderStatus(id, newStatus as OrderStatus);
            if (!result.success) {
                alert(result.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("An error occurred");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleDeleteOrder = async (id: string) => {
        const orderLabel = id.slice(-6).toUpperCase();
        if (!confirm(t('admin.confirmDeleteOrder').replace('{id}', orderLabel))) return;
        setDeletingId(id);
        try {
            const result = await deleteOrder(id);
            if (result.success) {
                toast.success(t('admin.orderDeleted'));
                setSelectedOrder(null);
                setIsDetailsModalOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || t('admin.failedDeleteOrder'));
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 scrollbar-hide">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-10">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-admin-sidebar p-6 rounded-xl border border-admin-border shadow-sm hover:border-gold/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
                                    <MdPendingActions className="text-2xl" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t('admin.pendingOrders')}</p>
                            <h3 className="text-white text-2xl font-bold mt-1 tracking-tight">{stats.pending}</h3>
                        </div>

                        <div className="bg-admin-sidebar p-6 rounded-xl border border-admin-border shadow-sm hover:border-gold/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                                    <MdLocalShipping className="text-2xl" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t('admin.shippedToday')}</p>
                            <h3 className="text-white text-2xl font-bold mt-1 tracking-tight">{stats.shippedToday}</h3>
                        </div>

                        <div className="bg-admin-sidebar p-6 rounded-xl border border-admin-border shadow-sm hover:border-gold/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gold/10 text-gold rounded-lg border border-gold/20 group-hover:bg-gold/20 transition-all">
                                    <MdTaskAlt className="text-2xl" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t('admin.deliveredMtd')}</p>
                            <h3 className="text-white text-2xl font-bold mt-1 tracking-tight">{stats.deliveredMTD}</h3>
                        </div>

                        <div className="bg-admin-sidebar p-6 rounded-xl border border-admin-border shadow-sm hover:border-gold/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gold/10 text-gold rounded-lg border border-gold/20 group-hover:bg-gold/20 transition-all">
                                    <MdPayments className="text-2xl" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t('admin.totalRevenue')}</p>
                            <h3 className="text-gold text-2xl font-bold mt-1 tracking-tight">
                                ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <h3 className="text-white text-lg font-extrabold uppercase tracking-widest">{t('admin.allOrders')} ({filteredOrders.length})</h3>
                                <div className="flex bg-admin-sidebar rounded-xl p-1 border border-admin-border">
                                    <button
                                        onClick={() => setFilter("ALL")}
                                        className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${filter === "ALL" ? "bg-gold text-white shadow-lg shadow-gold/20" : "text-gray-500 hover:text-white"}`}
                                    >
                                        {t('admin.viewAll')}
                                    </button>
                                    <button
                                        onClick={() => setFilter("PENDING")}
                                        className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${filter === "PENDING" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-gray-500 hover:text-amber-500"}`}
                                    >
                                        {t('admin.pending')}
                                    </button>
                                    <button
                                        onClick={() => setFilter("SHIPPED")}
                                        className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${filter === "SHIPPED" ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-gray-500 hover:text-purple-500"}`}
                                    >
                                        {t('admin.shipped')}
                                    </button>
                                    <button
                                        onClick={() => setFilter("DELIVERED")}
                                        className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${filter === "DELIVERED" ? "bg-gold text-white shadow-lg shadow-gold/20" : "text-gray-500 hover:text-gold"}`}
                                    >
                                        {t('admin.delivered')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <OrderDetailsModal
                            isOpen={isDetailsModalOpen}
                            onClose={() => {
                                setIsDetailsModalOpen(false);
                                setSelectedOrder(null);
                            }}
                            order={selectedOrder}
                            canDelete={canDelete}
                            onDelete={selectedOrder ? () => handleDeleteOrder(selectedOrder.id) : undefined}
                            isDeleting={selectedOrder ? deletingId === selectedOrder.id : false}
                        />

                        <div className="bg-admin-sidebar rounded-2xl border border-admin-border shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-admin-border bg-background/50">
                                            <th className={`p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.orderId')}</th>
                                            <th className={`p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.customerName')}</th>
                                            <th className={`p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.date')}</th>
                                            <th className={`p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.totalAmount')}</th>
                                            <th className={`p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.products')}</th>
                                            <th className={`p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.orderStatus')}</th>
                                            <th className={`p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-admin-border">
                                        {filteredOrders.map((order) => {
                                            const statusColor = getStatusColor(order.status);
                                            return (
                                                <tr key={order.id} className="hover:bg-background/50 transition-all group">
                                                    <td className="p-4 text-xs font-bold text-white uppercase tracking-tighter">#{order.id.slice(-6).toUpperCase()}</td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs font-bold text-white uppercase tracking-tight">{order.Name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                    <td className="p-4 text-xs font-bold text-gold uppercase tracking-tight">${Number(order.totalAmount).toFixed(2)}</td>
                                                    <td className="p-4">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-background/50 px-2.5 py-1.5 rounded-lg border border-admin-border max-w-[150px] truncate block group-hover:border-gold/30 transition-all">
                                                            {order.items.map(i => i.product?.name).join(', ') || t('admin.unknown')}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="relative w-fit">
                                                            <select
                                                                value={order.status}
                                                                disabled={updatingId === order.id || !canManage}
                                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                                className={`appearance-none pl-11 pr-12 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all outline-none border shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${statusColor === "blue" ? "text-blue-500 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20" :
                                                                    statusColor === "amber" ? "text-amber-500 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20" :
                                                                        statusColor === "gold" ? "text-gold bg-gold/10 border-gold/20 hover:bg-gold/20" :
                                                                            statusColor === "red" ? "text-red-500 bg-red-500/10 border-red-500/20 hover:bg-red-500/20" :
                                                                                statusColor === "purple" ? "text-purple-500 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20" :
                                                                                    "text-gray-400 bg-white/5 border-white/10 hover:bg-white/10"
                                                                    }`}
                                                            >
                                                                <option value="PENDING" className="bg-admin-sidebar text-amber-500">{t('admin.pending')}</option>
                                                                <option value="PROCESSING" className="bg-admin-sidebar text-blue-500">{t('admin.processing')}</option>
                                                                <option value="SHIPPED" className="bg-admin-sidebar text-purple-500">{t('admin.shipped')}</option>
                                                                <option value="DELIVERED" className="bg-admin-sidebar text-gold">{t('admin.delivered')}</option>
                                                                <option value="CANCELLED" className="bg-admin-sidebar text-red-500">{t('admin.cancelled')}</option>
                                                            </select>

                                                            {/* Status Dot */}
                                                            <div className={`absolute ${dir === 'rtl' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 flex items-center pointer-events-none`}>
                                                                <span className={`size-2.5 rounded-full ${statusColor === "blue" ? "bg-blue-500 animate-pulse" :
                                                                    statusColor === "amber" ? "bg-amber-500" :
                                                                        statusColor === "gold" ? "bg-gold" :
                                                                            statusColor === "red" ? "bg-red-500" :
                                                                                statusColor === "purple" ? "bg-purple-500" : "bg-gray-500"
                                                                    }`}></span>
                                                            </div>

                                                            {/* Arrow Icon */}
                                                            <div className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-transform group-hover:translate-y-[-40%] duration-200`}>
                                                                {updatingId === order.id ? (
                                                                    <MdSync className="text-[18px] text-current opacity-70 animate-spin" />
                                                                ) : (
                                                                    <MdExpandMore className="text-[18px] text-current opacity-70" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={`p-4 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <button
                                                                onClick={() => handleViewDetails(order)}
                                                                className="text-gold hover:text-gold-hover text-[10px] font-bold uppercase tracking-widest transition-colors"
                                                            >
                                                                {t('admin.viewDetails')}
                                                            </button>
                                                            {canDelete && (
                                                                <button
                                                                    onClick={() => handleDeleteOrder(order.id)}
                                                                    disabled={deletingId === order.id}
                                                                    className="p-1.5 text-text-sub dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors disabled:opacity-50"
                                                                    title={t('admin.deleteOrder')}
                                                                >
                                                                    {deletingId === order.id ? (
                                                                        <MdSync className="text-[18px] animate-spin" />
                                                                    ) : (
                                                                        <MdDelete className="text-[18px]" />
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredOrders.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="p-12 text-center text-text-sub italic">
                                                    {t('admin.noOrdersFound')}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-admin-border dark:border-gray-700 bg-background-light/30 dark:bg-gray-800/30 flex items-center justify-between">
                                <p className="text-[10px] text-text-sub dark:text-gray-400 font-bold uppercase tracking-widest">
                                    {t('admin.showingEntries').replace('{count}', filteredOrders.length.toString()).replace('{total}', orders.length.toString())}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="size-8 flex items-center justify-center rounded-lg border border-admin-border dark:border-gray-700 text-text-sub hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                        <MdChevronLeft className={`text-[18px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                    </button>
                                    <button className="size-8 flex items-center justify-center rounded-lg bg-gold text-white text-[10px] font-bold uppercase tracking-widest shadow-sm shadow-gold/20">1</button>
                                    <button className="size-8 flex items-center justify-center rounded-lg border border-admin-border dark:border-gray-700 text-text-sub hover:bg-white dark:hover:bg-gray-800 transition-colors">
                                        <MdChevronRight className={`text-[18px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
