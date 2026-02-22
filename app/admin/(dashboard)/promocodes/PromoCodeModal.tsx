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
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-[#202126] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        {promoCode ? t('admin.editPromoCode') : t('admin.addNewPromoCode')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[80vh] scrollbar-hide">
                    <div className="flex flex-col gap-2">
                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.code')}
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                            placeholder={t('admin.codePlaceholder')}
                            required
                            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-white focus:outline-none focus:border-accent/30 transition-all uppercase font-mono text-xs tracking-widest placeholder:text-white/10"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
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
                                className={`w-full py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-white focus:outline-none focus:border-accent/30 transition-all text-xs font-black uppercase tracking-[0.2em] placeholder:text-white/10 ${dir === 'rtl' ? 'pr-5 pl-10' : 'pl-5 pr-10'}`}
                            />
                            <span className={`absolute top-1/2 -translate-y-1/2 text-white/20 font-black text-xs ${dir === 'rtl' ? 'left-5' : 'right-5'}`}>
                                %
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.delegateName')}
                        </label>
                        <input
                            type="text"
                            value={delegateName}
                            onChange={(e) => setDelegateName(e.target.value)}
                            placeholder={t('admin.delegatePlaceholder')}
                            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-white focus:outline-none focus:border-accent/30 transition-all text-xs font-black uppercase tracking-[0.2em] placeholder:text-white/10"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.status')}
                        </label>
                        <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsActive(!isActive)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${isActive ? 'bg-accent' : 'bg-white/10'}`}
                            >
                                <span
                                    className={`${isActive ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                                />
                            </button>
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                {isActive ? t('admin.active') : t('admin.hidden')}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl border border-white/5 text-white/40 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                        >
                            {t('admin.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] bg-accent text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
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
