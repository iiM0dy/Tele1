"use client";

import { useState } from "react";
import { MdImage, MdImageNotSupported, MdVerified, MdSchedule, MdLocalShipping, MdWarning, MdCleanHands, MdAssignmentReturn } from "react-icons/md";
import { updateSiteSettings } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";

interface SiteSettings {
    id: string;
    categoriesCtaTitle: string | null;
    categoriesCtaDesc: string | null;
    categoriesCtaTitleAr: string | null;
    categoriesCtaDescAr: string | null;
    categoriesCtaImage: string | null;
    shippingTitle: string | null;
    shippingDesc: string | null;
    shippingTitleAr: string | null;
    shippingDescAr: string | null;
    verificationTitle: string | null;
    verificationDesc: string | null;
    verificationTitleAr: string | null;
    verificationDescAr: string | null;
    standardShippingTime: string | null;
    expressShippingTime: string | null;
    returnsTitle: string | null;
    returnsDesc: string | null;
    returnsTitleAr: string | null;
    returnsDescAr: string | null;
    finalSaleTitle: string | null;
    finalSaleDesc: string | null;
    finalSaleTitleAr: string | null;
    finalSaleDescAr: string | null;
    hygieneTitle: string | null;
    hygieneDesc: string | null;
    hygieneTitleAr: string | null;
    hygieneDescAr: string | null;
    shippingReturnsImage: string | null;
}

export default function SiteContentClient({ 
    initialSettings 
}: { 
    initialSettings: SiteSettings | null
}) {
    const { t } = useLanguage();

    // Site Settings State - Categories CTA
    const [ctaTitle, setCtaTitle] = useState(initialSettings?.categoriesCtaTitle || "");
    const [ctaDesc, setCtaDesc] = useState(initialSettings?.categoriesCtaDesc || "");
    const [ctaTitleAr, setCtaTitleAr] = useState(initialSettings?.categoriesCtaTitleAr || "");
    const [ctaDescAr, setCtaDescAr] = useState(initialSettings?.categoriesCtaDescAr || "");
    const [ctaImage, setCtaImage] = useState(initialSettings?.categoriesCtaImage || "");

    // Site Settings State - Shipping & Returns
    const [shippingTitle, setShippingTitle] = useState(initialSettings?.shippingTitle || "");
    const [shippingDesc, setShippingDesc] = useState(initialSettings?.shippingDesc || "");
    const [shippingTitleAr, setShippingTitleAr] = useState(initialSettings?.shippingTitleAr || "");
    const [shippingDescAr, setShippingDescAr] = useState(initialSettings?.shippingDescAr || "");

    const [verificationTitle, setVerificationTitle] = useState(initialSettings?.verificationTitle || "");
    const [verificationDesc, setVerificationDesc] = useState(initialSettings?.verificationDesc || "");
    const [verificationTitleAr, setVerificationTitleAr] = useState(initialSettings?.verificationTitleAr || "");
    const [verificationDescAr, setVerificationDescAr] = useState(initialSettings?.verificationDescAr || "");

    const [standardShippingTime, setStandardShippingTime] = useState(initialSettings?.standardShippingTime || "");
    const [expressShippingTime, setExpressShippingTime] = useState(initialSettings?.expressShippingTime || "");

    const [returnsTitle, setReturnsTitle] = useState(initialSettings?.returnsTitle || "");
    const [returnsDesc, setReturnsDesc] = useState(initialSettings?.returnsDesc || "");
    const [returnsTitleAr, setReturnsTitleAr] = useState(initialSettings?.returnsTitleAr || "");
    const [returnsDescAr, setReturnsDescAr] = useState(initialSettings?.returnsDescAr || "");

    const [finalSaleTitle, setFinalSaleTitle] = useState(initialSettings?.finalSaleTitle || "");
    const [finalSaleDesc, setFinalSaleDesc] = useState(initialSettings?.finalSaleDesc || "");
    const [finalSaleTitleAr, setFinalSaleTitleAr] = useState(initialSettings?.finalSaleTitleAr || "");
    const [finalSaleDescAr, setFinalSaleDescAr] = useState(initialSettings?.finalSaleDescAr || "");

    const [hygieneTitle, setHygieneTitle] = useState(initialSettings?.hygieneTitle || "");
    const [hygieneDesc, setHygieneDesc] = useState(initialSettings?.hygieneDesc || "");
    const [hygieneTitleAr, setHygieneTitleAr] = useState(initialSettings?.hygieneTitleAr || "");
    const [hygieneDescAr, setHygieneDescAr] = useState(initialSettings?.hygieneDescAr || "");

    const [shippingReturnsImage, setShippingReturnsImage] = useState(initialSettings?.shippingReturnsImage || "");

    const [isSubmittingSettings, setIsSubmittingSettings] = useState(false);

    const handleSiteSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingSettings(true);

        try {
            const result = await updateSiteSettings({
                categoriesCtaTitle: ctaTitle,
                categoriesCtaDesc: ctaDesc,
                categoriesCtaTitleAr: ctaTitleAr,
                categoriesCtaDescAr: ctaDescAr,
                categoriesCtaImage: ctaImage,
                shippingTitle,
                shippingDesc,
                shippingTitleAr,
                shippingDescAr,
                verificationTitle,
                verificationDesc,
                verificationTitleAr,
                verificationDescAr,
                standardShippingTime,
                expressShippingTime,
                returnsTitle,
                returnsDesc,
                returnsTitleAr,
                returnsDescAr,
                finalSaleTitle,
                finalSaleDesc,
                finalSaleTitleAr,
                finalSaleDescAr,
                hygieneTitle,
                hygieneDesc,
                hygieneTitleAr,
                hygieneDescAr,
                shippingReturnsImage,
            });

            if (result.success) {
                toast.success(t('admin.settingsUpdated') || "Settings updated successfully");
            } else {
                toast.error(result.error || t('admin.failedToUpdate') || "Failed to update");
            }
        } catch (error) {
            console.error("Error updating site settings:", error);
            toast.error(t('admin.failedToUpdate') || "Failed to update");
        } finally {
            setIsSubmittingSettings(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-black">
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 scrollbar-hide">
                <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-10">
                    {/* Page Heading */}
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
                            {t('admin.siteContent')}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                            {t('admin.manageStaticContent')}
                        </p>
                    </div>

                    {/* Site Content Settings */}
                    <div className="space-y-8">
                        {/* Categories Page CTA */}
                        <div className="bg-admin-sidebar rounded-2xl border border-admin-border p-5 sm:p-8 shadow-2xl">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                                    {t('admin.categoriesPageCta')}
                                </h2>
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                                    {t('admin.categoriesCtaDescription')}
                                </p>
                            </div>

                            <form onSubmit={handleSiteSettingsSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* English Content */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">EN</span>
                                            <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.englishContent')}</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                            <input
                                                type="text"
                                                value={ctaTitle}
                                                onChange={(e) => setCtaTitle(e.target.value)}
                                                className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                            <textarea
                                                rows={5}
                                                value={ctaDesc}
                                                onChange={(e) => setCtaDesc(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    {/* Arabic Content */}
                                    <div className="space-y-6" dir="rtl">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">AR</span>
                                            <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.arabicContent')}</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                            <input
                                                type="text"
                                                value={ctaTitleAr}
                                                onChange={(e) => setCtaTitleAr(e.target.value)}
                                                className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                            <textarea
                                                rows={5}
                                                value={ctaDescAr}
                                                onChange={(e) => setCtaDescAr(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Image Settings */}
                                <div className="border-t border-admin-border pt-8 mt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MdImage className="text-gold text-2xl" />
                                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">{t('admin.ctaImage')}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.imageUrl')}</label>
                                                <input
                                                    type="text"
                                                    value={ctaImage}
                                                    onChange={(e) => setCtaImage(e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                                                    {t('admin.ctaImageDescription')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.preview')}</label>
                                            <div className="aspect-video rounded-2xl border border-admin-border overflow-hidden bg-black/40 flex items-center justify-center group relative">
                                                {ctaImage ? (
                                                    <img 
                                                        src={ctaImage} 
                                                        alt={t('admin.ctaPreview')} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Invalid+Image+URL';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="text-center p-6">
                                                        <MdImageNotSupported className="text-4xl text-gray-500/30 mb-2 mx-auto" />
                                                        <p className="text-[10px] text-gray-500/50 uppercase tracking-widest font-bold">{t('admin.noImageProvided') || "No image URL provided"}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingSettings}
                                        className="px-10 bg-gold hover:bg-gold-hover text-white h-12 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-gold/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-w-[200px]"
                                    >
                                        {isSubmittingSettings ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                                {t('admin.saving')}
                                            </span>
                                        ) : (
                                            t('admin.saveChanges')
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Shipping & Returns Page Content */}
                        <div className="bg-admin-sidebar rounded-2xl border border-admin-border p-5 sm:p-8 shadow-2xl">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                                    {t('admin.shippingReturnsContent')}
                                </h2>
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
                                    {t('admin.shippingReturnsDescription')}
                                </p>
                            </div>

                            <form onSubmit={handleSiteSettingsSubmit} className="space-y-12">
                                {/* Shipping & Returns Page Image */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MdImage className="text-gold text-2xl" />
                                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">{t('admin.pageHeaderImage')}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.imageUrl')}</label>
                                                <input
                                                    type="text"
                                                    value={shippingReturnsImage}
                                                    onChange={(e) => setShippingReturnsImage(e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                                                    {t('admin.shippingReturnsImageHint')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.preview')}</label>
                                            <div className="aspect-video rounded-2xl border border-admin-border overflow-hidden bg-black/40 flex items-center justify-center group relative">
                                                {shippingReturnsImage ? (
                                                    <img 
                                                        src={shippingReturnsImage} 
                                                        alt="Shipping & Returns Preview" 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Invalid+Image+URL';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="text-center p-6">
                                                        <MdImageNotSupported className="text-4xl text-gray-500/30 mb-2 mx-auto" />
                                                        <p className="text-[10px] text-gray-500/50 uppercase tracking-widest font-bold">{t('admin.noImageProvided') || "No image URL provided"}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 1. Verification Section */}
                                <div className="space-y-6 border-t border-admin-border pt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MdVerified className="text-gold text-2xl" />
                                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">{t('admin.verificationSection')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">EN</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.englishContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={verificationTitle}
                                                    onChange={(e) => setVerificationTitle(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={verificationDesc}
                                                    onChange={(e) => setVerificationDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">AR</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.arabicContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={verificationTitleAr}
                                                    onChange={(e) => setVerificationTitleAr(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={verificationDescAr}
                                                    onChange={(e) => setVerificationDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Shipping Times */}
                                <div className="space-y-6 border-t border-admin-border pt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MdSchedule className="text-gold text-2xl" />
                                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">{t('admin.shippingTimes')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.standardTime')}</label>
                                            <input
                                                type="text"
                                                value={standardShippingTime}
                                                onChange={(e) => setStandardShippingTime(e.target.value)}
                                                placeholder="e.g. 3-5 Business Days"
                                                className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.expressTime')}</label>
                                            <input
                                                type="text"
                                                value={expressShippingTime}
                                                onChange={(e) => setExpressShippingTime(e.target.value)}
                                                placeholder="e.g. 1-2 Business Days"
                                                className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Shipping Section */}
                                <div className="space-y-6 border-t border-admin-border pt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MdLocalShipping className="text-gold text-2xl" />
                                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">{t('admin.shippingSection')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">EN</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.englishContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={shippingTitle}
                                                    onChange={(e) => setShippingTitle(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={shippingDesc}
                                                    onChange={(e) => setShippingDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">AR</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.arabicContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={shippingTitleAr}
                                                    onChange={(e) => setShippingTitleAr(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={shippingDescAr}
                                                    onChange={(e) => setShippingDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Final Sale Section */}
                                <div className="space-y-6 border-t border-admin-border pt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MdWarning className="text-gold text-2xl" />
                                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">{t('admin.finalSaleSection')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">EN</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.englishContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={finalSaleTitle}
                                                    onChange={(e) => setFinalSaleTitle(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={finalSaleDesc}
                                                    onChange={(e) => setFinalSaleDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">AR</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.arabicContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={finalSaleTitleAr}
                                                    onChange={(e) => setFinalSaleTitleAr(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={finalSaleDescAr}
                                                    onChange={(e) => setFinalSaleDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Hygiene Section */}
                                <div className="space-y-6 border-t border-admin-border pt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MdCleanHands className="text-gold text-2xl" />
                                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">{t('admin.hygieneProtocols')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">EN</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.englishContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.hygieneImage')}</label>
                                                <input
                                                    type="text"
                                                    value={hygieneTitle}
                                                    onChange={(e) => setHygieneTitle(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={hygieneDesc}
                                                    onChange={(e) => setHygieneDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">AR</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.arabicContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.hygieneImage')}</label>
                                                <input
                                                    type="text"
                                                    value={hygieneTitleAr}
                                                    onChange={(e) => setHygieneTitleAr(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={hygieneDescAr}
                                                    onChange={(e) => setHygieneDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 6. Returns Section */}
                                <div className="space-y-6 border-t border-admin-border pt-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MdAssignmentReturn className="text-gold text-2xl" />
                                        <h3 className="font-bold text-white text-sm uppercase tracking-widest">{t('admin.returnsSection')}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">EN</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.englishContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={returnsTitle}
                                                    onChange={(e) => setReturnsTitle(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={returnsDesc}
                                                    onChange={(e) => setReturnsDesc(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4" dir="rtl">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-[10px] tracking-widest">AR</span>
                                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">{t('admin.arabicContent')}</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.title')}</label>
                                                <input
                                                    type="text"
                                                    value={returnsTitleAr}
                                                    onChange={(e) => setReturnsTitleAr(e.target.value)}
                                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">{t('admin.description')}</label>
                                                <textarea
                                                    rows={3}
                                                    value={returnsDescAr}
                                                    onChange={(e) => setReturnsDescAr(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none resize-none text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingSettings}
                                        className="px-10 bg-gold hover:bg-gold-hover text-white h-12 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-gold/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 min-w-[200px]"
                                    >
                                        {isSubmittingSettings ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                                {t('admin.saving')}
                                            </span>
                                        ) : (
                                            t('admin.saveChanges')
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
