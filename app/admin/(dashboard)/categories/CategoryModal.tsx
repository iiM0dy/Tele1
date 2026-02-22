"use client";

import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { createCategory, updateCategory } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: {
        id: string;
        name: string;
        nameAr?: string | null;
        description: string | null;
        image: string | null;
        isFeatured?: boolean;
    } | null;
}

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
    const { t, dir } = useLanguage();
    const [name, setName] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setNameAr(category.nameAr || "");
            setDescription(category.description || "");
            setImage(category.image || "");
            setIsFeatured(category.isFeatured ?? false);
        } else {
            setName("");
            setNameAr("");
            setDescription("");
            setImage("");
            setIsFeatured(false);
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = { name, nameAr, description, image, isFeatured };
            let result;

            if (category) {
                result = await updateCategory(category.id, data);
            } else {
                result = await createCategory(data);
            }

            if (result.success) {
                toast.success(category ? t('admin.categoryUpdated') : t('admin.categoryCreated'));
                onClose();
            } else {
                toast.error(result.error || `Failed to ${category ? "update" : "create"} category`);
            }
        } catch (error) {
            console.error("Error submitting category:", error);
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

            <div className="relative w-full max-w-md bg-[#202126] rounded-[2rem] shadow-2xl overflow-hidden border border-white/5">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        {category ? t('admin.editCategory') : t('admin.addNewCategory')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
                    <div className="flex flex-col gap-3">
                        <label className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.categoryName')}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('admin.categoryPlaceholder')}
                            required
                            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-accent/30 transition-all outline-none placeholder:text-white/10"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.categoryNameAr') || "Category Name (Arabic)"}
                        </label>
                        <input
                            type="text"
                            value={nameAr}
                            onChange={(e) => setNameAr(e.target.value)}
                            placeholder={t('admin.categoryPlaceholderAr') || "أدخل اسم القسم بالعربية"}
                            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-accent/30 transition-all outline-none placeholder:text-white/10"
                            dir="rtl"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.imageUrl')}
                        </label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-accent/30 transition-all outline-none placeholder:text-white/10"
                        />
                        {image && (
                            <div className="mt-2 relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
                                <img
                                    src={image}
                                    alt={t('admin.preview')}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.featuredOnHomepage')}
                        </label>
                        <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsFeatured(!isFeatured)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${isFeatured ? 'bg-accent' : 'bg-white/10'}`}
                            >
                                <span
                                    className={`${isFeatured ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                                />
                            </button>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                {isFeatured ? t('admin.featured') : t('admin.standard')}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            {t('admin.description')}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('admin.describeCategory')}
                            rows={3}
                            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:border-accent/30 transition-all outline-none resize-none placeholder:text-white/10 leading-relaxed"
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl border border-white/5 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                        >
                            {t('admin.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] bg-accent text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                    {t('admin.saving')}
                                </>
                            ) : (
                                category ? t('admin.updateCategory') : t('admin.createCategory')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
