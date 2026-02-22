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

interface PromoCodesClientProps {
    promoCodes: PromoCode[];
    categoriesCount?: number;
}

export default function PromoCodesClient({ promoCodes, categoriesCount }: PromoCodesClientProps) {
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const canManage = true; // session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManagePromoCodes;
    const canDelete = true; // session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeletePromoCodes;

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
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto pb-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                        <div className="">
                            <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                                {t('admin.promoCodes')}
                            </h3>
                            <p className="text-white/60 mt-2 tracking-wider text-[11px] font-semibold">
                                {t('admin.manageCodes')}
                            </p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row flex-wrap gap-4 items-center justify-end">
                            <div className="relative w-full md:w-64">
                                <MdSearch className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/40 text-xl`} />
                                <input
                                    type="text"
                                    placeholder={t('admin.searchCodes')}
                                    className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-white/2 border border-white/5 rounded-2xl text-[13px] font-medium focus:outline-none focus:border-accent/30 transition-all text-white placeholder:text-white/40`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {canManage && (
                                <button
                                    onClick={handleAdd}
                                    className="flex items-center justify-center gap-2 flex-1 px-6 py-4 rounded-2xl border border-white/5 text-white/60 font-semibold text-[11px] tracking-wider hover:bg-white/5 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] w-full md:w-auto"
                                    aria-label={t('admin.addNewPromoCode') || "Add promo code"}
                                >
                                    <MdAdd className="text-xl" />
                                    {t('admin.addNewPromoCode')}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white/2 p-6 rounded-3xl border border-white/5 flex flex-col gap-2">
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.totalSales')}</p>
                            <p className="text-2xl font-black text-white tracking-wider">
                                ${promoCodes.reduce((sum, pc) => sum + pc.totalSales, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-white/2 p-6 rounded-3xl border border-white/5 flex flex-col gap-2">
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.totalCategories')}</p>
                            <p className="text-2xl font-black text-white tracking-wider">
                                {categoriesCount || 0}
                            </p>
                        </div>
                        <div className="bg-white/2 p-6 rounded-3xl border border-white/5 flex flex-col gap-2">
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.activeCodes')}</p>
                            <p className="text-2xl font-black text-accent tracking-wider">
                                {promoCodes.filter(pc => pc.isActive).length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/2 rounded-[2.5rem] border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className={`w-full text-left border-collapse ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/1">
                                        <th className={`p-6 text-[10px] font-semibold text-white/40 tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.code')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/40 tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.discount')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/40 tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.delegate')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/40 tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.totalSales')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/40 tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.thisMonth')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/40 tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.usage')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/40 tracking-widest ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.status')}</th>
                                        <th className={`p-6 text-sm font-semibold text-white tracking-wider ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredPromoCodes.map((pc) => (
                                        <tr key={pc.id} className="group hover:bg-white/2 transition-colors">
                                            <td className="p-6">
                                                <span className="font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-xl text-[10px] tracking-wider border border-accent/10">
                                                    {pc.code}
                                                </span>
                                            </td>
                                            <td className="p-6 font-black text-accent text-[11px] tracking-wider">
                                                {pc.discountPercentage}%
                                            </td>
                                            <td className="p-6 text-white font-semibold text-[11px] tracking-wider">
                                                {pc.delegateName || <span className="text-white/40 lowercase font-medium">{t('admin.none')}</span>}
                                            </td>
                                            <td className="p-6 font-black text-white text-[11px] tracking-wider">
                                                ${pc.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-6 font-black text-accent text-[11px] tracking-wider">
                                                ${pc.thisMonthSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-6 text-white/60 font-black text-[11px] tracking-wider">
                                                {pc.usageCount}
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold tracking-wider border ${pc.isActive
                                                    ? "bg-accent/10 text-accent border-accent/20"
                                                    : "bg-white/5 text-white/40 border-white/10"
                                                    }`}>
                                                    {pc.isActive ? t('admin.active') : t('admin.inactive')}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className={`flex gap-1 items-center ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                                                    {canManage && (
                                                        <button
                                                            onClick={() => handleToggleStatus(pc.id, pc.isActive)}
                                                            disabled={loadingMap[pc.id]}
                                                            className={`p-2.5 rounded-xl transition-all ${pc.isActive ? 'text-accent hover:bg-accent/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                                            title={pc.isActive ? t('admin.deactivate') : t('admin.activate')}
                                                        >
                                                            {loadingMap[pc.id] ? (
                                                                <MdSync className="animate-spin text-xl" />
                                                            ) : (
                                                                pc.isActive ? <MdToggleOn className="text-2xl" /> : <MdToggleOff className="text-2xl" />
                                                            )}
                                                        </button>
                                                    )}
                                                    {canManage && (
                                                        <button
                                                            onClick={() => handleEdit(pc)}
                                                            className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5"
                                                            title={t('admin.editPromoCode')}
                                                        >
                                                            <MdEdit className="text-xl" />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDelete(pc.id, pc.code)}
                                                            className="p-2.5 text-white/40 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all border border-transparent hover:border-red-500/10"
                                                            title={t('admin.deletePromoCode')}
                                                        >
                                                            <MdDelete className="text-xl" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPromoCodes.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center py-20 bg-white/1">
                                                <p className="text-[11px] font-semibold tracking-wider text-white/20">
                                                    {searchQuery ? t('admin.noCodesFound') : t('admin.noCodesCreated')}
                                                </p>
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
