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
        if (!confirm(t('admin.confirmDeleteSubCategory') || "Are you sure you want to delete this subcategory?")) return;

        const result = await deleteSubCategory(id);
        if (result.success) {
            toast.success(t('admin.brandDeleted') || "Brand deleted");
            fetchBrands();
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
                result = await updateSubCategory(isEditing, data); // Still using updateSubCategory from lib
            } else {
                result = await createSubCategory(data); // Still using createSubCategory from lib
            }

            if (result.success) {
                toast.success(isEditing ? "Brand updated" : "Brand created");
                resetForm();
                fetchBrands();
            } else {
                toast.error(result.error || "Failed to save brand");
            }
        } catch (error) {
            console.error("Error saving brand:", error);
            toast.error("An error occurred");
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
                        <h3 className="text-xl font-bold text-gray-900">
                            {category?.name} - Brands
                        </h3>
                        <p className="text-sm text-gray-500">
                            Manage brands for this category
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
                            {isEditing ? (t('admin.editBrand') || "Edit Brand") : (t('admin.addNewBrand') || "Add New Brand")}
                        </h3>
                        <div className="bg-gray-50 p-6 border-b border-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="e.g. Nike, Dior..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Paste image link"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[80px]"
                                        placeholder="Brief description of the brand"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 h-10 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-all"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 h-10 rounded-lg bg-accent text-white font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : (isEditing ? <MdEdit /> : <MdAdd />)}
                                        {isEditing ? "Update Brand" : "Add Brand"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: List */}
                    <div className="flex-1 p-8 md:overflow-y-auto bg-black/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isLoading ? (
                                <div className="col-span-full flex justify-center py-10">
                                    <span className="animate-spin h-8 w-8 border-2 border-white/10 border-t-accent rounded-full" />
                                </div>
                            ) : brands.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-10 text-white/60">
                                    <MdSearchOff className="text-4xl mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                        {t('admin.noBrands') || "No brands found"}
                                    </p>
                                </div>
                            ) : (
                                brands.map((brand) => (
                                    <div key={brand.id} className="bg-white/2 border border-white/5 rounded-2xl p-4 flex gap-4 group hover:border-accent/30 transition-all">
                                        <div className="w-16 h-16 rounded-xl bg-white/5 relative overflow-hidden shrink-0">
                                            <Image
                                                src={brand.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"}
                                                alt={brand.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white text-[13px] font-black tracking-tight truncate">
                                                {brand.name}
                                            </h4>
                                            <p className="text-white/60 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                                                {brand.description}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBrandForTypes(brand);
                                                        setIsTypesModalOpen(true);
                                                    }}
                                                    className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-all flex items-center gap-1 text-xs font-bold"
                                                    title="Manage Types"
                                                >
                                                    Types
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(brand)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <MdEdit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(brand.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <MdDelete size={20} />
                                                </button>
                                                <div className="flex-1" />
                                                <span className="text-[10px] font-semibold tracking-wider text-white/40 bg-white/5 px-3 py-1.5 rounded-xl">
                                                    {brand._count?.products || 0} Products
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

            <TypesModal
                isOpen={isTypesModalOpen}
                onClose={() => setIsTypesModalOpen(false)}
                brand={selectedBrandForTypes}
            />
        </div>
    );
}
