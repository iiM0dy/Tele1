"use client";

import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { createBanner, updateBanner, BannerInput } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";

interface BannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    banner?: {
        id: string;
        title: string | null;
        subtitle: string | null;
        titleAr: string | null;
        subtitleAr: string | null;
        image: string;
        buttonText: string | null;
        link: string | null;
        isActive: boolean;
    } | null;
}

export default function BannerModal({ isOpen, onClose, banner }: BannerModalProps) {
    const { t, dir } = useLanguage();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [titleAr, setTitleAr] = useState("");
    const [subtitleAr, setSubtitleAr] = useState("");
    const [image, setImage] = useState("");
    const [buttonText, setButtonText] = useState("Shop Now");
    const [link, setLink] = useState("/products");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (banner) {
            setTitle(banner.title || "");
            setSubtitle(banner.subtitle || "");
            setTitleAr(banner.titleAr || "");
            setSubtitleAr(banner.subtitleAr || "");
            setImage(banner.image);
            setButtonText(banner.buttonText || "Shop Now");
            setLink(banner.link || "/products");
            setIsActive(banner.isActive);
        } else {
            setTitle("");
            setSubtitle("");
            setTitleAr("");
            setSubtitleAr("");
            setImage("");
            setButtonText("Shop Now");
            setLink("/products");
            setIsActive(true);
        }
    }, [banner, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data: BannerInput = {
                title,
                subtitle: subtitle || undefined,
                titleAr,
                subtitleAr: subtitleAr || undefined,
                image,
                buttonText: buttonText || undefined,
                link: link || undefined,
                isActive
            };

            let result;

            if (banner) {
                result = await updateBanner(banner.id, data);
            } else {
                result = await createBanner(data);
            }

            if (result.success) {
                toast.success(banner ? t('admin.bannerUpdated') : t('admin.bannerCreated'));
                onClose();
            } else {
                toast.error(result.error || `Failed to ${banner ? "update" : "create"} banner`);
            }
        } catch (error) {
            console.error("Error submitting banner:", error);
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

            <div className="relative w-full max-w-lg bg-[#202126] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/1">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        {banner ? t('admin.editBanner') : t('admin.addNewBanner')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/60 hover:text-white"
                        aria-label={t('admin.close') || "Close"}
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
                    <div className="flex flex-col gap-3">
                        <label className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.status')}
                        </label>
                        <div className="flex items-center gap-4 bg-white/2 p-4 rounded-2xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsActive(!isActive)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${isActive ? 'bg-accent' : 'bg-white/10'}`}
                                aria-label={t('admin.status') || "Status"}
                            >
                                <span
                                    className={`${isActive ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                                />
                            </button>
                            <span className="text-[11px] font-bold tracking-wider text-white">
                                {isActive ? t('admin.active') : t('admin.hidden')}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="titleEn" className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                {t('admin.title')} (English)
                            </label>
                            <input
                                id="titleEn"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={t('admin.titlePlaceholder')}
                                required
                                aria-label={`${t('admin.title')} (English)`}
                                className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white focus:border-accent/30 transition-all outline-none text-[13px] font-medium placeholder:text-white/40"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label htmlFor="titleAr" className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                {t('admin.title')} (العربية)
                            </label>
                            <input
                                id="titleAr"
                                type="text"
                                value={titleAr}
                                onChange={(e) => setTitleAr(e.target.value)}
                                placeholder={t('admin.titlePlaceholder')}
                                required
                                aria-label={`${t('admin.title')} (Arabic)`}
                                className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white focus:border-accent/30 transition-all outline-none text-[13px] font-medium placeholder:text-white/40"
                                dir="rtl"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="subtitleEn" className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                {t('admin.subtitle')} (English)
                            </label>
                            <textarea
                                id="subtitleEn"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                placeholder={t('admin.subtitlePlaceholder')}
                                rows={2}
                                aria-label={`${t('admin.subtitle')} (English)`}
                                className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white focus:border-accent/30 transition-all outline-none resize-none text-[13px] font-medium leading-relaxed placeholder:text-white/40"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <label htmlFor="subtitleAr" className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                {t('admin.subtitle')} (العربية)
                            </label>
                            <textarea
                                id="subtitleAr"
                                value={subtitleAr}
                                onChange={(e) => setSubtitleAr(e.target.value)}
                                placeholder={t('admin.subtitlePlaceholder')}
                                rows={2}
                                aria-label={`${t('admin.subtitle')} (Arabic)`}
                                className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white focus:border-accent/30 transition-all outline-none resize-none text-[13px] font-medium leading-relaxed placeholder:text-white/40"
                                dir="rtl"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.imageUrl')}
                        </label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            required
                            aria-label={t('admin.imageUrl') || "Image URL"}
                            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white focus:border-accent/30 transition-all outline-none text-[13px] font-medium placeholder:text-white/10"
                        />
                        {image && (
                            <div className="mt-2 relative aspect-21/9 w-full rounded-2xl overflow-hidden border border-white/5 bg-white/1">
                                <img
                                    src={image}
                                    alt={t('admin.preview')}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://placehold.co/1200x500?text=Invalid+Image+URL";
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                            <label className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                {t('admin.buttonText')}
                            </label>
                            <input
                                type="text"
                                value={buttonText}
                                onChange={(e) => setButtonText(e.target.value)}
                                placeholder={t('admin.buttonTextPlaceholder')}
                                aria-label={t('admin.buttonText') || "Button Text"}
                                className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white focus:border-accent/30 transition-all outline-none text-[13px] font-medium placeholder:text-white/10"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                {t('admin.linkUrl')}
                            </label>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder={t('admin.linkUrlPlaceholder')}
                                aria-label={t('admin.linkUrl') || "Link URL"}
                                className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white focus:border-accent/30 transition-all outline-none text-[13px] font-medium placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl border border-white/5 text-white/60 font-semibold text-[11px] tracking-wider hover:bg-white/5 transition-all"
                        >
                            {t('admin.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-2 bg-accent text-white py-4 rounded-2xl font-black uppercase tracking-wider text-[11px] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                    {t('admin.saving')}
                                </>
                            ) : (
                                banner ? t('admin.updateBanner') : t('admin.createBanner')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
