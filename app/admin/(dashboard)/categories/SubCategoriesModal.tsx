"use client";

import { useState, useEffect } from "react";
import { MdClose, MdAdd, MdDelete, MdEdit, MdImage, MdSearchOff } from "react-icons/md";
import { createSubCategory, updateSubCategory, deleteSubCategory, getSubCategories } from "../../../../lib/subcategory-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import Image from "next/image";

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

export default function SubCategoriesModal({ isOpen, onClose, category }: SubCategoriesModalProps) {
    const { t, dir } = useLanguage();
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [isEditing, setIsEditing] = useState<string | null>(null); // ID of subcategory being edited
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && category) {
            fetchSubCategories();
        } else {
            resetForm();
            setSubCategories([]);
        }
    }, [isOpen, category]);

    const fetchSubCategories = async () => {
        if (!category) return;
        setIsLoading(true);
        const result = await getSubCategories(category.id);
        if (result.success) {
            setSubCategories(result.subCategories || []);
        } else {
            toast.error(result.error || "Failed to fetch subcategories");
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
        if (!confirm(t('admin.confirmDeleteSubCategory') || "Are you sure you want to delete this subcategory?")) return;

        const result = await deleteSubCategory(id);
        if (result.success) {
            toast.success(t('admin.subCategoryDeleted') || "Subcategory deleted");
            fetchSubCategories();
        } else {
            toast.error(result.error || "Failed to delete subcategory");
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
                result = await updateSubCategory(isEditing, data);
            } else {
                result = await createSubCategory(data);
            }

            if (result.success) {
                toast.success(isEditing ? (t('admin.subCategoryUpdated') || "Subcategory updated") : (t('admin.subCategoryCreated') || "Subcategory created"));
                resetForm();
                fetchSubCategories();
            } else {
                toast.error(result.error || `Failed to ${isEditing ? "update" : "create"} subcategory`);
            }
        } catch (error) {
            console.error("Error submitting subcategory:", error);
            toast.error("An unexpected error occurred");
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
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            {t('admin.manageSubCategories') || "Manage Subcategories"}
                        </h2>
                        <p className="text-white/40 text-[11px] font-semibold tracking-wider mt-1">
                            {category?.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/60 hover:text-white"
                        aria-label={t('admin.close') || "Close"}
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-y-auto md:overflow-hidden flex-col md:flex-row">
                    {/* Left: Form */}
                    <div className="w-full md:w-80 p-8 border-r border-white/5 md:overflow-y-auto shrink-0">
                        <h3 className="text-[11px] font-semibold text-white/40 tracking-wider mb-6">
                            {isEditing ? (t('admin.editSubCategory') || "Edit Subcategory") : (t('admin.addNewSubCategory') || "Add New Subcategory")}
                        </h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <label className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                    {t('admin.name') || "Name"}
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('admin.subCategoryName') || "Subcategory Name"}
                                    required
                                    aria-label={t('admin.subCategoryName') || "Subcategory Name"}
                                    className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white text-[13px] font-medium focus:border-accent/30 transition-all outline-none placeholder:text-white/40"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                    {t('admin.imageLink') || "Image Link"}
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        placeholder="https://..."
                                        required
                                        aria-label={t('admin.imageLink') || "Image Link"}
                                        className={`w-full ${dir === 'rtl' ? 'pl-12' : 'pr-12'} px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white text-[13px] font-medium focus:border-accent/30 transition-all outline-none placeholder:text-white/40`}
                                    />
                                    <div className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-4' : 'right-4'} text-white/20 pointer-events-none`}>
                                        <MdImage className="text-xl" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className={`text-[11px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                    {t('admin.description') || "Description"}
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={t('admin.describeSubCategory') || "Describe the subcategory..."}
                                    rows={3}
                                    aria-label={t('admin.description') || "Description"}
                                    className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-white/2 text-white text-[13px] font-medium focus:border-accent/30 transition-all outline-none resize-none placeholder:text-white/40 leading-relaxed"
                                />
                            </div>

                            <div className="flex gap-3 mt-2">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/5 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                                    >
                                        {t('admin.cancel') || "Cancel"}
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-accent text-white py-3.5 rounded-2xl font-black uppercase tracking-wider text-[11px] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                    ) : (
                                        <>
                                            {isEditing ? <MdEdit className="text-lg" /> : <MdAdd className="text-lg" />}
                                            {isEditing ? (t('admin.update') || "Update") : (t('admin.add') || "Add")}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: List */}
                    <div className="flex-1 p-8 md:overflow-y-auto bg-black/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isLoading ? (
                                <div className="col-span-full flex justify-center py-10">
                                    <span className="animate-spin h-8 w-8 border-2 border-white/10 border-t-accent rounded-full" />
                                </div>
                            ) : subCategories.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-10 text-white/60">
                                    <MdSearchOff className="text-4xl mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                        {t('admin.noSubCategories') || "No subcategories found"}
                                    </p>
                                </div>
                            ) : (
                                subCategories.map((sub) => (
                                    <div key={sub.id} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex gap-4 group hover:border-accent/30 transition-all">
                                        <div className="w-16 h-16 rounded-xl bg-white/5 relative overflow-hidden shrink-0">
                                            {sub.image ? (
                                                <Image
                                                    src={sub.image}
                                                    alt={sub.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/60">
                                                    <MdImage className="text-2xl" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white text-[13px] font-black tracking-tight truncate">
                                                {sub.name}
                                            </h4>
                                            <p className="text-white/60 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                                                {sub.description}
                                            </p>
                                            <div className="flex items-center gap-3 mt-3">
                                                <button
                                                    onClick={() => handleEdit(sub)}
                                                    className="text-white/60 hover:text-accent transition-colors"
                                                    aria-label={t('admin.editSubCategory') || "Edit subcategory"}
                                                >
                                                    <MdEdit className="text-lg" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sub.id)}
                                                    className="text-white/60 hover:text-red-500 transition-colors"
                                                    aria-label={t('admin.deleteSubCategory') || "Delete subcategory"}
                                                >
                                                    <MdDelete className="text-lg" />
                                                </button>
                                                <div className="flex-1" />
                                                <span className="text-[10px] font-semibold tracking-wider text-white/40 bg-white/5 px-3 py-1.5 rounded-xl">
                                                    {sub._count?.products || 0} Products
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
