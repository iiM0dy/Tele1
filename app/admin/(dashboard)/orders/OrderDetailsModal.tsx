"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { MdClose, MdPerson, MdLocationOn, MdInventory2, MdSync, MdDelete } from "react-icons/md";

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

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    canDelete?: boolean;
    onDelete?: () => void;
    isDeleting?: boolean;
}

export default function OrderDetailsModal({ isOpen, onClose, order, canDelete, onDelete, isDeleting }: OrderDetailsModalProps) {
    const { t, dir } = useLanguage();
    if (!isOpen || !order) return null;

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'DELIVERED': return 'accent';
            case 'PROCESSING': return 'blue';
            case 'PENDING': return 'amber';
            case 'CANCELLED': return 'red';
            case 'SHIPPED': return 'purple';
            default: return 'gray';
        }
    };

    const statusColor = getStatusColor(order.status);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-[#202126] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/5">

                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                            {t('admin.orderDetails')}
                        </h3>
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">
                            #{order.id.toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <MdClose className="text-[20px]" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">

                    {/* Status & Total */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t('admin.currentStatus')}</p>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                statusColor === "blue" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                statusColor === "amber" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                statusColor === "accent" ? "bg-accent/10 text-accent border-accent/20" :
                                statusColor === "red" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                "bg-white/5 text-white/40 border-white/10"
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <div className={`space-y-1 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t('admin.totalAmount')}</p>
                            <p className="text-2xl font-black text-accent tracking-tight" dir="ltr">${order.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                    <MdPerson className="text-[16px]" />
                                </div>
                                {t('admin.customerInformation')}
                            </h4>
                            <div className={`space-y-1 ${dir === 'rtl' ? 'mr-10' : 'ml-10'}`}>
                                <p className="text-xs font-black text-white uppercase tracking-tight">{order.Name}</p>
                                <p className="text-[11px] font-black text-white/40 uppercase tracking-widest" dir="ltr">{order.phone}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                    <MdLocationOn className="text-[16px]" />
                                </div>
                                {t('admin.shippingAddress')}
                            </h4>
                            <div className={`space-y-1 ${dir === 'rtl' ? 'mr-10' : 'ml-10'}`}>
                                <p className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                                    {order.streetAddress}<br />
                                    {order.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                            <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                <MdInventory2 className="text-[16px]" />
                            </div>
                            {t('admin.itemsCount').replace('{count}', order.items.length.toString())}
                        </h4>
                        <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02] border-b border-white/5">
                                        <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.product')}</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-center">{t('admin.qty')}</th>
                                        <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.price')}</th>
                                        <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/[0.02] transition-all group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 group-hover:border-accent/30 transition-all">
                                                        <img
                                                            src={item.product?.images.split(',')[0] || '/placeholder.jpg'}
                                                            alt={item.product?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white line-clamp-1">
                                                        {item.product?.name || 'Deleted Product'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center text-[10px] font-black uppercase tracking-widest text-white/40">
                                                {item.quantity}
                                            </td>
                                            <td className={`p-4 text-[10px] font-black uppercase tracking-widest text-white/40 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                                                ${Number(item.price).toFixed(2)}
                                            </td>
                                            <td className={`p-4 text-[10px] font-black uppercase tracking-widest text-white ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                                                ${(Number(item.price) * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`px-6 py-5 bg-white/[0.01] border-t border-white/5 flex items-center gap-3 ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                    {canDelete && onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="h-11 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isDeleting ? (
                                <MdSync className="text-[18px] animate-spin" />
                            ) : (
                                <MdDelete className="text-[18px]" />
                            )}
                            {t('admin.deleteOrder')}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="bg-accent hover:bg-accent/90 text-white h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                    >
                        {t('admin.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
