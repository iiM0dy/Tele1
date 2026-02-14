"use client";

import { useState } from "react";
import { 
    MdAdd, 
    MdSync, 
    MdVisibility, 
    MdVisibilityOff, 
    MdEdit, 
    MdDelete, 
    MdViewCarousel 
} from "react-icons/md";
import BannerModal from "./BannerModal";
import { deleteBanner, toggleBannerStatus } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";

interface Banner {
    id: string;
    title: string | null;
    subtitle: string | null;
    titleAr: string | null;
    subtitleAr: string | null;
    image: string;
    buttonText: string | null;
    link: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function BannersClient({ banners }: { banners: Banner[] }) {
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const canManage = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManageBanners;
    const canDelete = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeleteBanners;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const handleAdd = () => {
        setSelectedBanner(null);
        setIsModalOpen(true);
    };

    const handleEdit = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(t('admin.confirmDeleteBanner').replace('{title}', title))) {
            try {
                const result = await deleteBanner(id);
                if (result.success) {
                    toast.success(t('admin.bannerDeleted'));
                } else {
                    toast.error(result.error || t('admin.failedDeleteBanner'));
                }
            } catch (error) {
                console.error("Error deleting banner:", error);
                toast.error(t('admin.errorGeneric'));
            }
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        setLoadingMap(prev => ({ ...prev, [id]: true }));
        try {
            const result = await toggleBannerStatus(id, !currentStatus);
            if (result.success) {
                toast.success(t('admin.bannerStatusUpdated').replace('{status}', !currentStatus ? t('admin.activated') : t('admin.deactivated')));
            } else {
                toast.error(result.error || t('admin.failedUpdateStatus'));
            }
        } catch (error) {
            console.error("Error toggling banner status:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto pb-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-3xl font-extrabold text-white uppercase tracking-tight">
                                {t('admin.heroBanners')}
                            </h3>
                            <p className="text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">
                                {t('admin.controlHero')}
                            </p>
                        </div>
                        {canManage && (
                            <button
                                onClick={handleAdd}
                                className="w-full md:w-auto bg-gold text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/25 whitespace-nowrap"
                            >
                                <MdAdd className="text-xl" />
                                {t('admin.createNewAd')}
                            </button>
                        )}
                    </div>

                    <BannerModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        banner={selectedBanner}
                    />

                    <div className="grid grid-cols-1 gap-6 sm:gap-8">
                        {banners.map((banner) => (
                            <div key={banner.id} className="bg-admin-sidebar rounded-2xl border border-admin-border shadow-sm hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all overflow-hidden flex flex-col lg:flex-row group">
                                <div className="lg:w-1/3 aspect-21/9 lg:aspect-auto overflow-hidden bg-background border-b lg:border-b-0 lg:border-r border-admin-border">
                                    <img
                                        alt={banner.title || "Banner"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        src={banner.image}
                                    />
                                </div>
                                <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            {!banner.isActive && (
                                                <span className="bg-white/5 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                                    {t('admin.hidden')}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mt-1 uppercase tracking-widest">{banner.title}</h3>
                                        <p className="text-xs text-gray-400 line-clamp-2 uppercase tracking-widest font-bold opacity-70">
                                            {banner.subtitle || t('admin.noSubtitle')}
                                        </p>
                                        {banner.titleAr && (
                                            <>
                                                <h3 className="text-lg font-bold text-white mt-3 text-right" dir="rtl">{banner.titleAr}</h3>
                                                <p className="text-sm text-gray-400 line-clamp-2 text-right" dir="rtl">
                                                    {banner.subtitleAr || t('admin.noSubtitle')}
                                                </p>
                                            </>
                                        )}
                                        <div className="flex gap-4 mt-4 p-4 bg-background/50 rounded-xl border border-admin-border">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">{t('admin.button')}</span>
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-300">{banner.buttonText}</span>
                                            </div>
                                            <div className="w-px bg-admin-border h-full mx-2" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">{t('admin.link')}</span>
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-300 truncate max-w-[200px]">{banner.link}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-admin-border">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                                                disabled={loadingMap[banner.id] || !canManage}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${banner.isActive
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                                                    : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                {loadingMap[banner.id] ? (
                                                    <MdSync className="animate-spin text-[18px]" />
                                                ) : (
                                                    banner.isActive ? <MdVisibility className="text-[18px]" /> : <MdVisibilityOff className="text-[18px]" />
                                                )}
                                                {banner.isActive ? t('admin.active') : t('admin.hidden')}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {canManage && (
                                                <button
                                                    onClick={() => handleEdit(banner)}
                                                    className="p-3 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-xl transition-colors"
                                                    title={t('admin.editBanner')}
                                                >
                                                    <MdEdit className="text-[22px]" />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(banner.id, banner.title || "Banner")}
                                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                                    title={t('admin.deleteBanner')}
                                                >
                                                    <MdDelete className="text-[22px]" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {banners.length === 0 && (
                        <div className="text-center py-20 bg-admin-sidebar rounded-2xl border border-dashed border-admin-border">
                            <MdViewCarousel className="text-5xl text-gray-600 mb-4 mx-auto" />
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 italic">
                                {t('admin.noBanners')}
                            </p>
                            <button
                                onClick={handleAdd}
                                className="mt-4 text-gold font-bold uppercase tracking-widest text-xs hover:underline"
                            >
                                {t('admin.addFirstBanner')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
