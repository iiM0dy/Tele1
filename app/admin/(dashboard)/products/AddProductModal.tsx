"use client";

import { useState, useEffect } from "react";
import { MdClose, MdExpandMore, MdSync, MdCheckCircle } from "react-icons/md";
import { createProduct, updateProduct } from "../../../../lib/admin-actions";
import { getSubCategories } from "../../../../lib/subcategory-actions";
import { useLanguage } from "@/app/context/LanguageContext";
import { toast } from "react-hot-toast";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string | null;
    categoryId: string;
    subCategoryId?: string | null;
    price: number;
    discountPrice: number | null;
    discountType: string | null;
    discountValue: number | null;
    stock: number;
    sku: string | null;
    images: string;
    subCategory?: {
        id: string;
        name: string;
    } | null;
}

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    product?: Product | null; // Optional product for editing
}

export default function AddProductModal({ isOpen, onClose, categories, product }: AddProductModalProps) {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [subCategories, setSubCategories] = useState<{ id: string, name: string }[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryId: "",
        subCategoryId: "",
        price: "",
        discountType: "NONE", // NONE, PERCENTAGE, FIXED
        discountValue: "",
        stock: "",
        sku: "",
        images: "", // Comma separated links
    });

    const [imageLink, setImageLink] = useState("");

    const fetchSubCategories = async (catId: string) => {
        if (!catId) {
            setSubCategories([]);
            return;
        }
        const result = await getSubCategories(catId);
        if (result.success) {
            setSubCategories(result.subCategories || []);
        }
    };

    // Effect to pre-fill data when editing
    useEffect(() => {
        if (product && isOpen) {
            setFormData({
                name: product.name,
                description: product.description || "",
                categoryId: product.categoryId,
                subCategoryId: product.subCategoryId || product.subCategory?.id || "",
                price: product.price.toString(),
                discountType: product.discountType || "NONE",
                discountValue: product.discountValue?.toString() || "",
                stock: product.stock.toString(),
                sku: product.sku || "",
                images: product.images || "",
            });
            // Fetch subcategories for the existing category
            fetchSubCategories(product.categoryId);
        } else if (isOpen) {
            // Reset for new product
            setFormData({
                name: "",
                description: "",
                categoryId: "",
                subCategoryId: "",
                price: "",
                discountType: "NONE",
                discountValue: "",
                stock: "0",
                sku: "",
                images: "",
            });
            setSubCategories([]);
        }
    }, [product, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === "categoryId") {
            setFormData(prev => ({ ...prev, subCategoryId: "" }));
            fetchSubCategories(value);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.categoryId || !formData.price || !formData.images) {
            toast.error(t("admin.addProductModal.fillRequiredFields"));
            return;
        }

        setIsLoading(true);
        try {
            let calculatedDiscountPrice = null;
            if (formData.discountType === "FIXED") {
                calculatedDiscountPrice = parseFloat(formData.discountValue);
            } else if (formData.discountType === "PERCENTAGE") {
                const price = parseFloat(formData.price);
                const percent = parseFloat(formData.discountValue);
                calculatedDiscountPrice = price - (price * percent / 100);
            }

            const formDataToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                discountPrice: calculatedDiscountPrice,
                discountValue: formData.discountType === "NONE" ? null : parseFloat(formData.discountValue),
                stock: parseInt(formData.stock) || 0,
            };

            const result = product
                ? await updateProduct(product.id, formDataToSubmit)
                : await createProduct(formDataToSubmit);

            if (result.success) {
                toast.success(product ? t("admin.addProductModal.productUpdated") : t("admin.addProductModal.productCreated"));
                onClose();
            } else {
                toast.error(result.error || (product ? t("admin.addProductModal.failedToUpdate") : t("admin.addProductModal.failedToCreate")));
            }
        } catch (err) {
            console.error(product ? "Error updating product:" : "Error creating product:", err);
            toast.error(t("admin.addProductModal.errorGeneric"));
        } finally {
            setIsLoading(false);
        }
    };

    const addImageLink = () => {
        if (!imageLink) return;
        const currentImages = formData.images ? formData.images.split(',').filter(Boolean) : [];
        if (!currentImages.includes(imageLink)) {
            const newImages = [...currentImages, imageLink].filter(Boolean).join(',');
            setFormData({ ...formData, images: newImages });
        }
        setImageLink("");
    };

    const removeImage = (url: string) => {
        const newImages = formData.images.split(',').filter(img => img !== url).join(',');
        setFormData({ ...formData, images: newImages });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-[#202126] w-full max-w-3xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                            {product ? t("admin.addProductModal.titleEdit") : t("admin.addProductModal.titleAdd")}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                            {product ? t("admin.addProductModal.subtitleEdit") : t("admin.addProductModal.subtitleAdd")}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <MdClose className="text-[24px]" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">

                    {/* Images Section */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t("admin.addProductModal.productImages")}</label>

                        {/* Image Gallery */}
                        {formData.images && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                {formData.images.split(',').filter(Boolean).map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-2xl border border-white/5 overflow-hidden group bg-white/[0.02]">
                                        <img src={url} alt={`${t("admin.addProductModal.imagePreviewAlt")} ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(url)}
                                            className="absolute top-2 right-2 size-8 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                        >
                                            <MdClose className="text-sm" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {/* Image Link Input */}
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 h-12 rounded-2xl border border-white/5 bg-white/[0.02] focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder-white/20 outline-none"
                                    placeholder={t("admin.addProductModal.pasteImageUrlPlaceholder")}
                                    type="text"
                                    value={imageLink}
                                    onChange={(e) => setImageLink(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageLink())}
                                />
                                <button
                                    type="button"
                                    onClick={addImageLink}
                                    className="px-6 h-12 rounded-2xl bg-accent text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent/90 transition-all"
                                >
                                    {t("admin.addProductModal.addLink")}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-1">
                                {t("admin.addProductModal.productName")} <span className="text-accent">*</span>
                            </label>
                            <input
                                className="w-full h-12 rounded-2xl border border-white/5 bg-white/[0.02] focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder-white/20 outline-none"
                                placeholder={t("admin.addProductModal.productNamePlaceholder")}
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t("admin.addProductModal.description")}</label>
                            <textarea
                                className="w-full rounded-2xl border border-white/5 bg-white/[0.02] focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder-white/20 outline-none min-h-[120px]"
                                placeholder={t("admin.addProductModal.descriptionPlaceholder")}
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t("admin.addProductModal.category")} <span className="text-accent">*</span></label>
                            <div className="relative">
                                <select
                                    className="w-full h-12 rounded-2xl border border-white/5 bg-white/[0.02] focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white appearance-none outline-none cursor-pointer"
                                    required
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    name="categoryId"
                                >
                                    <option value="" className="bg-[#0F172A]">{t("admin.addProductModal.selectCategory")}</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-[#0F172A]">{cat.name}</option>
                                    ))}
                                </select>
                                <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent text-[20px]" />
                            </div>
                        </div>

                        {subCategories.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t("admin.addProductModal.subCategory") || "Subcategory"}</label>
                                <div className="relative">
                                    <select
                                        className="w-full h-12 rounded-2xl border border-white/5 bg-white/[0.02] focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white appearance-none outline-none cursor-pointer"
                                        value={formData.subCategoryId}
                                        onChange={handleChange}
                                        name="subCategoryId"
                                    >
                                        <option value="" className="bg-[#0F172A]">{t("admin.addProductModal.selectSubCategory") || "Select Subcategory"}</option>
                                        {subCategories.map(sub => (
                                            <option key={sub.id} value={sub.id} className="bg-[#0F172A]">{sub.name}</option>
                                        ))}
                                    </select>
                                    <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent text-[20px]" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t("admin.addProductModal.price")} <span className="text-accent">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-black text-xs">$</span>
                                <input
                                    className="w-full h-12 rounded-2xl border border-white/5 bg-white/[0.02] focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all pl-8 pr-4 text-xs font-black text-white outline-none"
                                    placeholder={t("admin.addProductModal.pricePlaceholder")}
                                    step="0.01"
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-accent/5 border border-white/5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t("admin.addProductModal.discountType")}</label>
                                <div className="flex bg-white/[0.02] p-1 rounded-2xl border border-white/5">
                                    {(["NONE", "PERCENTAGE", "FIXED"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, discountType: type, discountValue: type === "NONE" ? "" : formData.discountValue })}
                                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${formData.discountType === type
                                                ? "bg-accent text-white"
                                                : "text-white/20 hover:bg-white/5"
                                                }`}
                                        >
                                            {type === "NONE" ? t("admin.addProductModal.noDiscount") :
                                                type === "PERCENTAGE" ? t("admin.addProductModal.percentageDiscount") :
                                                    t("admin.addProductModal.fixedDiscount")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.discountType !== "NONE" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                        {formData.discountType === "PERCENTAGE" ? t("admin.addProductModal.percentageDiscount") : t("admin.addProductModal.discountPrice")}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-black text-xs">
                                            {formData.discountType === "PERCENTAGE" ? "%" : "$"}
                                        </span>
                                        <input
                                            className="w-full h-12 rounded-2xl border border-white/5 bg-white/[0.02] focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all pl-8 pr-4 text-xs font-black text-white outline-none"
                                            placeholder={formData.discountType === "PERCENTAGE" ? t("admin.addProductModal.percentagePlaceholder") : t("admin.addProductModal.discountPricePlaceholder")}
                                            step="0.01"
                                            type="number"
                                            required
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        />
                                    </div>
                                    {formData.discountType === "PERCENTAGE" && formData.price && formData.discountValue && (
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mt-1">
                                            {t("admin.addProductModal.discountPrice")}: ${(parseFloat(formData.price) - (parseFloat(formData.price) * parseFloat(formData.discountValue) / 100)).toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t("admin.addProductModal.stockQuantity")}</label>
                            <input
                                className="w-full h-12 rounded-2xl border border-white/5 bg-white/[0.02] focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder-white/20 outline-none"
                                placeholder={t("admin.addProductModal.stockPlaceholder")}
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{t("admin.addProductModal.skuNumber")}</label>
                            <input
                                className="w-full h-12 rounded-2xl border border-white/5 bg-white/[0.02] focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder-white/20 outline-none"
                                placeholder={t("admin.addProductModal.skuPlaceholder")}
                                type="text"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white hover:bg-white/5 border border-transparent transition-all"
                    >
                        {t("admin.addProductModal.cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isLoading ? (
                            <MdSync className="animate-spin text-[20px]" />
                        ) : (
                            <MdCheckCircle className="text-[20px]" />
                        )}
                        {isLoading ? (product ? t("admin.addProductModal.updating") : t("admin.addProductModal.saving")) : (product ? t("admin.addProductModal.updateProduct") : t("admin.addProductModal.saveProduct"))}
                    </button>
                </div>
            </div>
        </div>
    );
}
