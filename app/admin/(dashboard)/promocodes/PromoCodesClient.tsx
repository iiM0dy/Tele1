"use client";

import { useState } from "react";
import PromoCodeModal from "./PromoCodeModal";
import { deletePromoCode, togglePromoCodeStatus } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdSearch, MdAdd, MdSync, MdToggleOn, MdToggleOff, MdEdit, MdDelete } from "react-icons/md";

interface PromoCode {
    id: string;
    code: string;
    discountPercentage: number;
    delegateName: string | null;
    isActive: boolean;
    totalSales: number;
    thisMonthSales: number;
    usageCount: number;
    createdAt: string;
}

export default function PromoCodesClient({ promoCodes }: { promoCodes: PromoCode[] }) {
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const canManage = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManagePromoCodes;
    const canDelete = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeletePromoCodes;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const filteredPromoCodes = promoCodes.filter(pc =>
        pc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pc.delegateName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    const handleAdd = () => {
        setSelectedPromoCode(null);
        setIsModalOpen(true);
    };

    const handleEdit = (pc: PromoCode) => {
        setSelectedPromoCode(pc);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, code: string) => {
        if (confirm(t('admin.confirmDeleteCode').replace('{code}', code))) {
            try {
                const result = await deletePromoCode(id);
                if (result.success) {
                    toast.success(t('admin.codeDeleted'));
                } else {
                    toast.error(result.error || t('admin.failedDeleteCode'));
                }
            } catch (error) {
                console.error("Error deleting promo code:", error);
                toast.error(t('admin.errorGeneric'));
            }
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        setLoadingMap(prev => ({ ...prev, [id]: true }));
        try {
            const result = await togglePromoCodeStatus(id, !currentStatus);
            if (result.success) {
                toast.success(t('admin.codeStatusUpdated').replace('{status}', !currentStatus ? t('admin.activated') : t('admin.deactivated')));
            } else {
                toast.error(result.error || t('admin.failedUpdateStatus'));
            }
        } catch (error) {
            console.error("Error toggling promo code status:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8 pb-10">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
                                {t('admin.promoCodes')}
                            </h2>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                                {t('admin.manageCodes')}
                            </p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 items-center">
                            <div className="relative w-full md:w-72">
                                <MdSearch className={`absolute top-1/2 -translate-y-1/2 text-gold text-xl ${dir === 'rtl' ? 'right-3' : 'left-3'}`} />
                                <input
                                    type="text"
                                    placeholder={t('admin.searchCodes')}
                                    className={`w-full h-12 bg-admin-sidebar border border-admin-border rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all text-white ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {canManage && (
                                <button
                                    onClick={handleAdd}
                                    className="w-full md:w-auto bg-gold hover:bg-gold-hover text-white h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <MdAdd className="text-[20px]" />
                                    {t('admin.addPromoCode')}
                                </button>
                            )}
                        </div>
                    </div>

                    <PromoCodeModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        promoCode={selectedPromoCode}
                    />

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-admin-sidebar p-5 rounded-xl border border-admin-border hover:border-gold/30 transition-all shadow-sm flex flex-col gap-1 group">
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t('admin.totalSales')}</p>
                            <p className="text-2xl font-bold text-white">
                                ${promoCodes.reduce((sum, pc) => sum + pc.totalSales, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-admin-sidebar p-5 rounded-xl border border-admin-border hover:border-gold/30 transition-all shadow-sm flex flex-col gap-1 group">
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t('admin.activeCodes')}</p>
                            <p className="text-2xl font-bold text-gold">
                                {promoCodes.filter(pc => pc.isActive).length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-admin-sidebar rounded-xl border border-admin-border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className={`w-full text-left border-collapse ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                <thead>
                                    <tr className="border-b border-admin-border bg-black/20">
                                        <th className={`p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.code')}</th>
                                        <th className={`p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.discount')}</th>
                                        <th className={`p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.delegate')}</th>
                                        <th className={`p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.totalSales')}</th>
                                        <th className={`p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.thisMonth')}</th>
                                        <th className={`p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.usage')}</th>
                                        <th className={`p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.status')}</th>
                                        <th className={`p-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-admin-border">
                                    {filteredPromoCodes.map((pc) => (
                                        <tr key={pc.id} className="group hover:bg-gold/5 transition-colors">
                                            <td className="p-5">
                                                <span className="font-mono font-bold text-gold bg-gold/10 px-2 py-1 rounded text-xs uppercase tracking-widest">
                                                    {pc.code}
                                                </span>
                                            </td>
                                            <td className="p-5 font-bold text-gold text-sm">
                                                {pc.discountPercentage}%
                                            </td>
                                            <td className="p-5 text-white font-bold text-xs uppercase tracking-widest">
                                                {pc.delegateName || <span className="text-gray-500 italic lowercase font-normal">{t('admin.none')}</span>}
                                            </td>
                                            <td className="p-5 font-bold text-white text-sm">
                                                ${pc.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-5 font-bold text-gold text-sm">
                                                ${pc.thisMonthSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-5 text-gray-400 font-bold text-xs">
                                                {pc.usageCount}
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${pc.isActive
                                                    ? "bg-gold/10 text-gold border-gold/20"
                                                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                                    }`}>
                                                    {pc.isActive ? t('admin.active') : t('admin.inactive')}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className={`flex gap-1 items-center ${dir === 'rtl' ? 'justify-start' : 'justify-end'} lg:opacity-0 lg:group-hover:opacity-100 transition-opacity`}>
                                                    {canManage && (
                                                        <button
                                                            onClick={() => handleToggleStatus(pc.id, pc.isActive)}
                                                            disabled={loadingMap[pc.id]}
                                                            className={`p-2 rounded-lg transition-colors ${pc.isActive ? 'text-gold hover:bg-gold/10' : 'text-gray-500 hover:bg-black/20'}`}
                                                            title={pc.isActive ? t('admin.deactivate') : t('admin.activate')}
                                                        >
                                                            {loadingMap[pc.id] ? (
                                                                <MdSync className="animate-spin text-[20px]" />
                                                            ) : (
                                                                pc.isActive ? <MdToggleOn className="text-[22px]" /> : <MdToggleOff className="text-[22px]" />
                                                            )}
                                                        </button>
                                                    )}
                                                    {canManage && (
                                                        <button
                                                            onClick={() => handleEdit(pc)}
                                                            className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                                                            title={t('admin.editPromoCode')}
                                                        >
                                                            <MdEdit className="text-[20px]" />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDelete(pc.id, pc.code)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            title={t('admin.deletePromoCode')}
                                                        >
                                                            <MdDelete className="text-[20px]" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPromoCodes.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center py-12 text-gray-500/50 italic text-sm">
                                                {searchQuery ? t('admin.noCodesFound') : t('admin.noCodesCreated')}
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
    );
}
