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
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto pb-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                        <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-[0.2em]">
                                {t('admin.heroBanners')}
                            </h3>
                            <p className="text-white/40 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
                                {t('admin.controlHero')}
                            </p>
                        </div>
                        {canManage && (
                            <button
                                onClick={handleAdd}
                                className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
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
                            <div key={banner.id} className="bg-white/[0.02] rounded-3xl border border-white/5 transition-all overflow-hidden flex flex-col lg:flex-row group hover:border-white/10">
                                <div className="lg:w-1/3 aspect-[21/9] lg:aspect-auto overflow-hidden bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-white/5">
                                    <img
                                        alt={banner.title || "Banner"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        src={banner.image}
                                    />
                                </div>
                                <div className="p-8 lg:p-10 flex-1 flex flex-col justify-between">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            {!banner.isActive && (
                                                <span className="bg-white/[0.05] text-white/40 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">
                                                    {t('admin.hidden')}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">{banner.title}</h3>
                                        <p className="text-[10px] text-white/40 line-clamp-2 uppercase tracking-[0.2em] font-black leading-relaxed">
                                            {banner.subtitle || t('admin.noSubtitle')}
                                        </p>
                                        {banner.titleAr && (
                                            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-4">
                                                <h3 className="text-xl font-black text-white text-right uppercase tracking-[0.2em]" dir="rtl">{banner.titleAr}</h3>
                                                <p className="text-[10px] text-white/40 line-clamp-2 text-right uppercase tracking-[0.2em] font-black leading-relaxed" dir="rtl">
                                                    {banner.subtitleAr || t('admin.noSubtitle')}
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex flex-col sm:flex-row gap-4 mt-4 p-5 bg-white/[0.01] rounded-2xl border border-white/5">
                                            <div className="flex-1 flex flex-col">
                                                <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-1.5">{t('admin.button')}</span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{banner.buttonText}</span>
                                            </div>
                                            <div className="hidden sm:block w-px bg-white/5 h-full self-stretch" />
                                            <div className="flex-1 flex flex-col">
                                                <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-1.5">{t('admin.link')}</span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white truncate max-w-[300px]">{banner.link}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/5">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                                                disabled={loadingMap[banner.id] || !canManage}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${banner.isActive
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'
                                                    : 'bg-white/5 text-white/20 border border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                {loadingMap[banner.id] ? (
                                                    <MdSync className="animate-spin text-lg" />
                                                ) : (
                                                    banner.isActive ? <MdVisibility className="text-lg" /> : <MdVisibilityOff className="text-lg" />
                                                )}
                                                {banner.isActive ? t('admin.active') : t('admin.hidden')}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {canManage && (
                                                <button
                                                    onClick={() => handleEdit(banner)}
                                                    className="p-3 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5"
                                                    title={t('admin.editBanner')}
                                                >
                                                    <MdEdit className="text-xl" />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(banner.id, banner.title || "Banner")}
                                                    className="p-3 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all border border-transparent hover:border-red-500/10"
                                                    title={t('admin.deleteBanner')}
                                                >
                                                    <MdDelete className="text-xl" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {banners.length === 0 && (
                        <div className="text-center py-32 bg-white/[0.01] rounded-[2rem] border-2 border-dashed border-white/5">
                            <MdViewCarousel className="text-6xl text-white/5 mb-6 mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                {t('admin.noBanners')}
                            </p>
                            <button
                                onClick={handleAdd}
                                className="mt-6 text-accent font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
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
