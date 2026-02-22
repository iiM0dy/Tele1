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
            case 'DELIVERED': return 'accent';
            case 'PROCESSING': return 'blue';
            case 'PENDING': return 'indigo';
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
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#202126]">
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 scrollbar-hide">
                <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-10">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 shadow-sm hover:border-accent/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                                    <MdPendingActions className="text-2xl" />
                                </div>
                            </div>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.pendingOrders')}</p>
                            <h3 className="text-white text-2xl font-black mt-1 tracking-tight">{stats.pending}</h3>
                        </div>

                        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 shadow-sm hover:border-accent/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                                    <MdLocalShipping className="text-2xl" />
                                </div>
                            </div>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.shippedToday')}</p>
                            <h3 className="text-white text-2xl font-black mt-1 tracking-tight">{stats.shippedToday}</h3>
                        </div>

                        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 shadow-sm hover:border-accent/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-accent/10 text-accent rounded-xl border border-accent/20 group-hover:bg-accent/20 transition-all">
                                    <MdTaskAlt className="text-2xl" />
                                </div>
                            </div>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.deliveredMtd')}</p>
                            <h3 className="text-white text-2xl font-black mt-1 tracking-tight">{stats.deliveredMTD}</h3>
                        </div>

                        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 shadow-sm hover:border-accent/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-accent/10 text-accent rounded-xl border border-accent/20 group-hover:bg-accent/20 transition-all">
                                    <MdPayments className="text-2xl" />
                                </div>
                            </div>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.totalRevenue')}</p>
                            <h3 className="text-accent text-2xl font-black mt-1 tracking-tight">
                                ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </h3>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <h3 className="text-white text-sm font-black uppercase tracking-[0.2em]">{t('admin.allOrders')} ({filteredOrders.length})</h3>
                                <div className="flex bg-white/[0.02] rounded-xl p-1 border border-white/5">
                                    <button
                                        onClick={() => setFilter("ALL")}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filter === "ALL" ? "bg-accent text-white" : "text-white/40 hover:text-white"}`}
                                    >
                                        {t('admin.viewAll')}
                                    </button>
                                    <button
                                        onClick={() => setFilter("PENDING")}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filter === "PENDING" ? "bg-indigo-500 text-white" : "text-white/40 hover:text-indigo-500"}`}
                                    >
                                        {t('admin.pending')}
                                    </button>
                                    <button
                                        onClick={() => setFilter("SHIPPED")}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filter === "SHIPPED" ? "bg-purple-500 text-white" : "text-white/40 hover:text-purple-500"}`}
                                    >
                                        {t('admin.shipped')}
                                    </button>
                                    <button
                                        onClick={() => setFilter("DELIVERED")}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filter === "DELIVERED" ? "bg-accent text-white" : "text-white/40 hover:text-accent"}`}
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

                        <div className="bg-white/[0.02] rounded-3xl border border-white/5 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.01]">
                                            <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.orderId')}</th>
                                            <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.customerName')}</th>
                                            <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.date')}</th>
                                            <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.totalAmount')}</th>
                                            <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.products')}</th>
                                            <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.orderStatus')}</th>
                                            <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredOrders.map((order) => {
                                            const statusColor = getStatusColor(order.status);
                                            return (
                                                <tr key={order.id} className="hover:bg-white/[0.02] transition-all group">
                                                    <td className="p-4 text-xs font-black text-white uppercase tracking-tighter">#{order.id.slice(-6).toUpperCase()}</td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="text-xs font-black text-white uppercase tracking-tight">{order.Name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-[11px] font-black text-white/40 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                    <td className="p-4 text-xs font-black text-accent uppercase tracking-tight">${Number(order.totalAmount).toFixed(2)}</td>
                                                    <td className="p-4">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 max-w-[150px] truncate block group-hover:border-accent/30 transition-all">
                                                            {order.items.map(i => i.product?.name).join(', ') || t('admin.unknown')}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="relative w-fit">
                                                            <select
                                                                value={order.status}
                                                                disabled={updatingId === order.id || !canManage}
                                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                                className={`appearance-none pl-11 pr-12 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all outline-none border shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${statusColor === "blue" ? "text-blue-500 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20" :
                                                                    statusColor === "indigo" ? "text-indigo-500 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20" :
                                                                        statusColor === "accent" ? "text-accent bg-accent/10 border-accent/20 hover:bg-accent/20" :
                                                                            statusColor === "red" ? "text-red-500 bg-red-500/10 border-red-500/20 hover:bg-red-500/20" :
                                                                                statusColor === "purple" ? "text-purple-500 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20" :
                                                                                    "text-white/40 bg-white/5 border-white/10 hover:bg-white/10"
                                                                    }`}
                                                            >
                                                                <option value="PENDING" className="bg-[#0F172A] text-indigo-500">{t('admin.pending')}</option>
                                                                <option value="PROCESSING" className="bg-[#0F172A] text-blue-500">{t('admin.processing')}</option>
                                                                <option value="SHIPPED" className="bg-[#0F172A] text-purple-500">{t('admin.shipped')}</option>
                                                                <option value="DELIVERED" className="bg-[#0F172A] text-accent">{t('admin.delivered')}</option>
                                                                <option value="CANCELLED" className="bg-[#0F172A] text-red-500">{t('admin.cancelled')}</option>
                                                            </select>

                                                            {/* Status Dot */}
                                                            <div className={`absolute ${dir === 'rtl' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 flex items-center pointer-events-none`}>
                                                                <span className={`size-2.5 rounded-full ${statusColor === "blue" ? "bg-blue-500 animate-pulse" :
                                                                    statusColor === "indigo" ? "bg-indigo-500" :
                                                                        statusColor === "accent" ? "bg-accent" :
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
                                                                className="text-accent hover:text-accent/80 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                                                            >
                                                                {t('admin.viewDetails')}
                                                            </button>
                                                            {canDelete && (
                                                                <button
                                                                    onClick={() => handleDeleteOrder(order.id)}
                                                                    disabled={deletingId === order.id}
                                                                    className="p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50 border border-transparent hover:border-red-500/20"
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
                                                <td colSpan={7} className="p-12 text-center text-white/20 italic text-[11px] font-black uppercase tracking-[0.2em]">
                                                    {t('admin.noOrdersFound')}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
                                    {t('admin.showingEntries').replace('{count}', filteredOrders.length.toString()).replace('{total}', orders.length.toString())}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="size-8 flex items-center justify-center rounded-xl border border-white/5 text-white/40 hover:bg-white/5 hover:text-white transition-all">
                                        <MdChevronLeft className={`text-[18px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                    </button>
                                    <button className="size-8 flex items-center justify-center rounded-xl bg-accent text-white text-[10px] font-black uppercase tracking-widest">1</button>
                                    <button className="size-8 flex items-center justify-center rounded-xl border border-white/5 text-white/40 hover:bg-white/5 hover:text-white transition-all">
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
