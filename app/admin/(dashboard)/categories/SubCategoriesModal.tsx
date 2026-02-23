"use client";

import { useState, useEffect } from "react";
import { MdClose, MdAdd, MdDelete, MdEdit, MdImage, MdSearchOff } from "react-icons/md";
import { createSubCategory, updateSubCategory, deleteSubCategory, getSubCategories } from "../../../../lib/subcategory-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import Image from "next/image";
import TypesModal from "./TypesModal";

interface SubCategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: {
        id: string;
        name: string;
    } | null;
}

interface SubCategory {
    id: string;
    name: string;
    description: string | null;
    image: string;
    categoryId: string;
    _count?: {
        products: number;
    };
}

export default function BrandsModal({ isOpen, onClose, category }: SubCategoriesModalProps) {
    const { t, dir } = useLanguage();
    const [brands, setBrands] = useState<SubCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [isEditing, setIsEditing] = useState<string | null>(null); // ID of subcategory being edited
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Types management state
    const [selectedBrandForTypes, setSelectedBrandForTypes] = useState<SubCategory | null>(null);
    const [isTypesModalOpen, setIsTypesModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && category) {
            fetchBrands();
        } else {
            resetForm();
            setBrands([]);
        }
    }, [isOpen, category]);

    const fetchBrands = async () => {
        if (!category) return;
        setIsLoading(true);
        const result = await getSubCategories(category.id);
        if (result.success) {
            setBrands(result.subCategories || []);
        } else {
            toast.error(result.error || "Failed to fetch brands");
        }
        setIsLoading(false);
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setImage("");
        setIsEditing(null);
    };

    const handleEdit = (sub: SubCategory) => {
        setName(sub.name);
        setDescription(sub.description || "");
        setImage(sub.image);
        setIsEditing(sub.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.brands.confirmDelete'))) return;

        const result = await deleteSubCategory(id);
        if (result.success) {
            toast.success(t('admin.brands.deleted'));
            fetchBrands();
        } else {
            toast.error(result.error || t('admin.brands.failedToSave'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category) return;
        setIsSubmitting(true);

        try {
            const data = { name, description, image, categoryId: category.id };
            let result;

            if (isEditing) {
                result = await updateSubCategory(isEditing, data); // Still using updateSubCategory from lib
            } else {
                result = await createSubCategory(data); // Still using createSubCategory from lib
            }

            if (result.success) {
                toast.success(isEditing ? t('admin.brands.updated') : t('admin.brands.created'));
                resetForm();
                fetchBrands();
            } else {
                toast.error(result.error || t('admin.brands.failedToSave'));
            }
        } catch (error) {
            console.error("Error saving brand:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-5xl bg-[#202126] rounded-4xl shadow-2xl overflow-hidden border border-white/5 flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/1">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {category?.name} - {t('admin.brands.title')}
                        </h3>
                        <p className="text-sm text-white/60">
                            {t('admin.brands.manage')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/60 hover:text-white"
                        aria-label={t('admin.close')}
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-y-auto md:overflow-hidden flex-col md:flex-row">
                    {/* Left: Form */}
                    <div className="w-full md:w-80 p-8 border-r border-white/5 md:overflow-y-auto shrink-0 bg-white/2">
                        <h3 className="text-[11px] font-semibold text-white/40 tracking-wider mb-6 uppercase">
                            {isEditing ? t('admin.brands.edit') : t('admin.brands.addNew')}
                        </h3>
                        <div className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">{t('admin.brands.name')}</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-white/20"
                                            placeholder={t('admin.brands.namePlaceholder')}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">{t('admin.imageUrl')}</label>
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all placeholder:text-white/20"
                                            placeholder={t('admin.brands.imagePlaceholder')}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 rounded-xl bg-accent text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-accent/20"
                                    >
                                        {isSubmitting ? (
                                            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                        ) : (
                                            isEditing ? <MdEdit size={18} /> : <MdAdd size={20} />
                                        )}
                                        {isEditing ? t('admin.brands.update') : t('admin.brands.add')}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="w-full h-12 rounded-xl bg-white/5 text-white/60 font-bold uppercase tracking-wider text-[10px] hover:bg-white/10 transition-all"
                                        >
                                            {t('admin.cancel')}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: List */}
                    <div className="flex-1 p-8 md:overflow-y-auto bg-black/20">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[11px] font-bold text-white/40 tracking-[0.2em] uppercase">
                                {t('admin.showingEntries')
                                    .replace('{start}', '1')
                                    .replace('{end}', brands.length.toString())
                                    .replace('{total}', brands.length.toString())}
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {isLoading ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20">
                                    <span className="animate-spin h-10 w-10 border-2 border-white/10 border-t-accent rounded-full mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('admin.brands.loading')}</p>
                                </div>
                            ) : brands.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
                                    <MdSearchOff className="text-5xl mb-4" />
                                    <p className="text-xs font-black uppercase tracking-[0.2em]">
                                        {t('admin.noBrands')}
                                    </p>
                                </div>
                            ) : (
                                brands.map((brand) => (
                                    <div key={brand.id} className="bg-white/3 border border-white/5 rounded-3xl p-5 flex gap-5 group hover:border-accent/30 hover:bg-white/5 transition-all duration-300">
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 relative overflow-hidden shrink-0 shadow-2xl">
                                            <Image
                                                src={brand.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"}
                                                alt={brand.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="mb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-white text-base font-black tracking-tight truncate">
                                                        {brand.name}
                                                    </h4>
                                                    <span className="text-[9px] font-black tracking-widest text-white/30 bg-white/5 px-2.5 py-1 rounded-lg shrink-0 uppercase">
                                                        {brand._count?.products || 0} {t('admin.products')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBrandForTypes(brand);
                                                        setIsTypesModalOpen(true);
                                                    }}
                                                    className="h-8 px-4 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all text-[10px] font-black uppercase tracking-wider"
                                                >
                                                    {t('admin.types.title')}
                                                </button>
                                                <div className="flex-1" />
                                                <button
                                                    onClick={() => handleEdit(brand)}
                                                    className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                                    title={t('admin.edit')}
                                                >
                                                    <MdEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(brand.id)}
                                                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    title={t('admin.delete')}
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TypesModal
                isOpen={isTypesModalOpen}
                onClose={() => setIsTypesModalOpen(false)}
                brand={selectedBrandForTypes}
            />
        </div>
    );
}
