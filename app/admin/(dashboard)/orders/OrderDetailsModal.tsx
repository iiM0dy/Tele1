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
            case 'DELIVERED': return 'gold';
            case 'PROCESSING': return 'blue';
            case 'PENDING': return 'amber';
            case 'CANCELLED': return 'red';
            case 'SHIPPED': return 'gold';
            default: return 'gray';
        }
    };

    const statusColor = getStatusColor(order.status);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose}></div>
            <div className="relative bg-admin-sidebar w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-admin-border">

                {/* Header */}
                <div className="px-6 py-5 border-b border-admin-border flex items-center justify-between bg-black/20">
                    <div>
                        <h3 className="text-xl font-extrabold text-white tracking-tight uppercase tracking-widest">
                            {t('admin.orderDetails')}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            #{order.id.toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gold hover:bg-gold/10 rounded-full transition-colors"
                    >
                        <MdClose className="text-[24px]" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">

                    {/* Status & Total */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/20 border border-admin-border">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('admin.currentStatus')}</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                statusColor === "blue" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                statusColor === "amber" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                statusColor === "gold" ? "bg-gold/10 text-gold border-gold/20 shadow-[0_0_10px_rgba(212,175,55,0.1)]" :
                                statusColor === "red" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <div className={`space-y-1 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('admin.totalAmount')}</p>
                            <p className="text-2xl font-black text-gold" dir="ltr">${order.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                                <MdPerson className="text-gold text-[18px]" />
                                {t('admin.customerInformation')}
                            </h4>
                            <div className={`space-y-1 ${dir === 'rtl' ? 'mr-6' : 'ml-6'}`}>
                                <p className="text-sm font-bold text-white">{order.Name}</p>
                                <p className="text-sm text-gray-400" dir="ltr">{order.phone}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                                <MdLocationOn className="text-gold text-[18px]" />
                                {t('admin.shippingAddress')}
                            </h4>
                            <div className={`space-y-1 ${dir === 'rtl' ? 'mr-6' : 'ml-6'}`}>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {order.streetAddress}<br />
                                    {order.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                            <MdInventory2 className="text-gold text-[18px]" />
                            {t('admin.itemsCount').replace('{count}', order.items.length.toString())}
                        </h4>
                        <div className="border border-admin-border rounded-2xl overflow-hidden bg-black/20">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/20 border-b border-admin-border">
                                        <th className={`p-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.product')}</th>
                                        <th className="p-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-center">{t('admin.qty')}</th>
                                        <th className={`p-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.price')}</th>
                                        <th className={`p-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.total')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-admin-border">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gold/5 transition-colors">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-lg bg-black/20 border border-admin-border overflow-hidden shrink-0">
                                                        <img
                                                            src={item.product?.images.split(',')[0] || '/placeholder.jpg'}
                                                            alt={item.product?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white line-clamp-1">
                                                        {item.product?.name || 'Deleted Product'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                {item.quantity}
                                            </td>
                                            <td className={`p-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                                                ${Number(item.price).toFixed(2)}
                                            </td>
                                            <td className={`p-3 text-[10px] font-black uppercase tracking-widest text-white ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
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
                <div className={`px-6 py-4 bg-black/20 border-t border-admin-border flex items-center gap-3 ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                    {canDelete && onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="h-10 px-5 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 flex items-center gap-2"
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
                        className="bg-gold hover:bg-gold/90 text-white h-10 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-gold/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {t('admin.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
