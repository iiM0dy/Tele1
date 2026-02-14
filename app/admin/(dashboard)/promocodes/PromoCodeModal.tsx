"use client";

import { useState, useEffect } from "react";
import { createPromoCode, updatePromoCode } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdClose, MdSync } from "react-icons/md";

interface PromoCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    promoCode?: {
        id: string;
        code: string;
        discountPercentage: number;
        delegateName?: string | null;
        isActive?: boolean;
    } | null;
}

export default function PromoCodeModal({ isOpen, onClose, promoCode }: PromoCodeModalProps) {
    const { t, dir } = useLanguage();
    const [code, setCode] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState<number | string>("");
    const [delegateName, setDelegateName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (promoCode) {
            setCode(promoCode.code);
            setDiscountPercentage(promoCode.discountPercentage);
            setDelegateName(promoCode.delegateName || "");
            setIsActive(promoCode.isActive ?? true);
        } else {
            setCode("");
            setDiscountPercentage("");
            setDelegateName("");
            setIsActive(true);
        }
    }, [promoCode, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = {
                code,
                discountPercentage: Number(discountPercentage),
                delegateName: delegateName || undefined,
                isActive
            };
            let result;

            if (promoCode) {
                result = await updatePromoCode(promoCode.id, data);
            } else {
                result = await createPromoCode(data);
            }

            if (result.success) {
                toast.success(promoCode ? t('admin.codeUpdated') : t('admin.codeCreated'));
                onClose();
            } else {
                toast.error(result.error || `Failed to ${promoCode ? "update" : "create"} promo code`);
            }
        } catch (error) {
            console.error("Error submitting promo code:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-admin-sidebar rounded-2xl shadow-2xl overflow-hidden border border-admin-border">
                <div className="p-6 border-b border-admin-border flex items-center justify-between bg-black/20">
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                        {promoCode ? t('admin.editPromoCode') : t('admin.addNewPromoCode')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gold hover:bg-gold/10 rounded-full transition-colors"
                    >
                        <MdClose className="text-[24px]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[80vh] scrollbar-hide">
                    <div className="flex flex-col gap-2">
                        <label className={`text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.code')}
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                            placeholder={t('admin.codePlaceholder')}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none uppercase font-mono text-sm"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className={`text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                {t('admin.discountPercentage')}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={discountPercentage}
                                    onChange={(e) => setDiscountPercentage(e.target.value)}
                                    placeholder={t('admin.discountPlaceholder')}
                                    required
                                    className={`w-full py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-sm ${dir === 'rtl' ? 'pr-4 pl-8' : 'pl-4 pr-8'}`}
                                />
                                <span className={`absolute top-1/2 -translate-y-1/2 text-gray-500 font-bold ${dir === 'rtl' ? 'left-4' : 'right-4'}`}>
                                    %
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.delegateName')}
                        </label>
                        <input
                            type="text"
                            value={delegateName}
                            onChange={(e) => setDelegateName(e.target.value)}
                            placeholder={t('admin.delegatePlaceholder')}
                            className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[10px] font-bold uppercase tracking-widest text-gray-500 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.status')}
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 hover:border-gold/30 transition-all ${isActive ? 'ring-1 ring-gold/20 border-gold/30' : ''}`}
                        >
                            <span className="text-xs text-white font-bold uppercase tracking-widest">
                                {isActive ? t('admin.active') : t('admin.inactive')}
                            </span>
                            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-gold' : 'bg-gray-700'}`}>
                                <span
                                    className={`${isActive ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform`}
                                />
                            </div>
                        </button>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-admin-border text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-black/20 transition-all"
                        >
                            {t('admin.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] bg-gold hover:bg-gold-hover text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? (
                                <>
                                    <MdSync className="animate-spin text-[18px]" />
                                    {t('admin.saving')}
                                </>
                            ) : (
                                promoCode ? t('admin.updateCode') : t('admin.createCode')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
