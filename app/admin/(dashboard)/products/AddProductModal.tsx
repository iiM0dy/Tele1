"use client";

import { useState, useEffect } from "react";
import { MdClose, MdExpandMore, MdSync, MdCheckCircle } from "react-icons/md";
import { createProduct, updateProduct } from "../../../../lib/admin-actions";
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
    price: number;
    discountPrice: number | null;
    discountType: string | null;
    discountValue: number | null;
    stock: number;
    sku: string | null;
    images: string;
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
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryId: "",
        price: "",
        discountType: "NONE", // NONE, PERCENTAGE, FIXED
        discountValue: "",
        stock: "",
        sku: "",
        images: "", // Comma separated links
        supImage1: "",
        supImage2: "",
    });

    const [imageLink, setImageLink] = useState("");

    // Effect to pre-fill data when editing
    useEffect(() => {
        if (product && isOpen) {
            setFormData({
                name: product.name,
                description: product.description || "",
                categoryId: product.categoryId,
                price: product.price.toString(),
                discountType: product.discountType || "NONE",
                discountValue: product.discountValue?.toString() || "",
                stock: product.stock.toString(),
                sku: product.sku || "",
                images: product.images,
                supImage1: product.supImage1 || "",
                supImage2: product.supImage2 || "",
            });
        } else if (isOpen) {
            // Reset for new product
            setFormData({
                name: "",
                description: "",
                categoryId: "",
                price: "",
                discountType: "NONE",
                discountValue: "",
                stock: "0",
                sku: "",
                images: "",
                supImage1: "",
                supImage2: "",
            });
        }
    }, [product, isOpen]);

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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-text-main/40 dark:bg-black/60 backdrop-blur-[2px]" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-surface-dark w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-[#e6dbdf] dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-extrabold text-text-main dark:text-white tracking-tight">
                            {product ? t("admin.addProductModal.titleEdit") : t("admin.addProductModal.titleAdd")}
                        </h3>
                        <p className="text-sm text-text-sub dark:text-gray-400">
                            {product ? t("admin.addProductModal.subtitleEdit") : t("admin.addProductModal.subtitleAdd")}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-sub dark:text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    >
                        <MdClose className="text-[24px]" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">

                    {/* Images Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-text-main dark:text-white">{t("admin.addProductModal.productImages")}</label>

                        {/* Image Gallery */}
                        {formData.images && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                {formData.images.split(',').filter(Boolean).map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl border border-[#e6dbdf] dark:border-gray-700 overflow-hidden group">
                                        <img src={url} alt={`${t("admin.addProductModal.imagePreviewAlt")} ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(url)}
                                            className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MdClose className="text-xs" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {/* Image Link Input */}
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 h-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all px-4 text-sm font-medium dark:text-white outline-none"
                                    placeholder={t("admin.addProductModal.pasteImageUrlPlaceholder")}
                                    type="text"
                                    value={imageLink}
                                    onChange={(e) => setImageLink(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageLink())}
                                />
                                <button
                                    type="button"
                                    onClick={addImageLink}
                                    className="px-4 h-12 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors"
                                >
                                    {t("admin.addProductModal.addLink")}
                                </button>
                            </div>

                            {/* Supplementary Image 1 */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-sub dark:text-gray-400">{t('admin.addProductModal.supplementaryImage1')}</label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 h-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all px-4 text-sm font-medium dark:text-white outline-none"
                                        placeholder={t('admin.addProductModal.supplementaryImagePlaceholder')}
                                        type="text"
                                        value={formData.supImage1}
                                        onChange={(e) => setFormData({ ...formData, supImage1: e.target.value })}
                                    />
                                    {formData.supImage1 && (
                                        <div className="size-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 overflow-hidden">
                                            <img src={formData.supImage1} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Supplementary Image 2 */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-sub dark:text-gray-400">{t('admin.addProductModal.supplementaryImage2')}</label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 h-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all px-4 text-sm font-medium dark:text-white outline-none"
                                        placeholder={t('admin.addProductModal.supplementaryImagePlaceholder')}
                                        type="text"
                                        value={formData.supImage2}
                                        onChange={(e) => setFormData({ ...formData, supImage2: e.target.value })}
                                    />
                                    {formData.supImage2 && (
                                        <div className="size-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 overflow-hidden">
                                            <img src={formData.supImage2} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-text-main dark:text-white flex items-center gap-1">
                                {t("admin.addProductModal.productName")} <span className="text-primary">*</span>
                            </label>
                            <input
                                className="w-full h-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all px-4 text-sm font-medium dark:text-white outline-none"
                                placeholder={t("admin.addProductModal.productNamePlaceholder")}
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-text-main dark:text-white">{t("admin.addProductModal.description")}</label>
                            <textarea
                                className="w-full rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all px-4 py-3 text-sm font-medium leading-relaxed dark:text-white outline-none"
                                placeholder={t("admin.addProductModal.descriptionPlaceholder")}
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-main dark:text-white">{t("admin.addProductModal.category")} <span className="text-primary">*</span></label>
                            <div className="relative">
                                <select
                                    className="w-full h-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all px-4 text-sm font-medium dark:text-white appearance-none outline-none cursor-pointer"
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                >
                                    <option value="">{t("admin.addProductModal.selectCategory")}</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-sub text-[20px]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-main dark:text-white">{t("admin.addProductModal.price")} <span className="text-primary">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub font-bold text-sm">$</span>
                                <input
                                    className="w-full h-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all pl-8 pr-4 text-sm font-bold dark:text-white outline-none"
                                    placeholder={t("admin.addProductModal.pricePlaceholder")}
                                    step="0.01"
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-main dark:text-white">{t("admin.addProductModal.discountType")}</label>
                                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl border border-[#e6dbdf] dark:border-gray-700">
                                    {(["NONE", "PERCENTAGE", "FIXED"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, discountType: type, discountValue: type === "NONE" ? "" : formData.discountValue })}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.discountType === type
                                                ? "bg-primary text-white shadow-soft shadow-primary/25"
                                                : "text-text-sub hover:bg-gray-50 dark:hover:bg-gray-900"
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
                                    <label className="text-sm font-bold text-text-main dark:text-white">
                                        {formData.discountType === "PERCENTAGE" ? t("admin.addProductModal.percentageDiscount") : t("admin.addProductModal.discountPrice")}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub font-bold text-sm">
                                            {formData.discountType === "PERCENTAGE" ? "%" : "$"}
                                        </span>
                                        <input
                                            className="w-full h-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all pl-8 pr-4 text-sm font-bold dark:text-white outline-none"
                                            placeholder={formData.discountType === "PERCENTAGE" ? t("admin.addProductModal.percentagePlaceholder") : t("admin.addProductModal.discountPricePlaceholder")}
                                            step="0.01"
                                            type="number"
                                            required
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        />
                                    </div>
                                    {formData.discountType === "PERCENTAGE" && formData.price && formData.discountValue && (
                                        <p className="text-[10px] font-bold text-primary mt-1">
                                            {t("admin.addProductModal.discountPrice")}: ${(parseFloat(formData.price) - (parseFloat(formData.price) * parseFloat(formData.discountValue) / 100)).toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-main dark:text-white">{t("admin.addProductModal.stockQuantity")}</label>
                            <input
                                className="w-full h-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all px-4 text-sm font-medium dark:text-white outline-none"
                                placeholder={t("admin.addProductModal.stockPlaceholder")}
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-main dark:text-white">{t("admin.addProductModal.skuNumber")}</label>
                            <input
                                className="w-full h-12 rounded-xl border border-[#e6dbdf] dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary focus:border-primary transition-all px-4 text-sm font-medium dark:text-white outline-none"
                                placeholder={t("admin.addProductModal.skuPlaceholder")}
                                type="text"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 bg-background-light dark:bg-gray-800/50 border-t border-[#e6dbdf] dark:border-gray-700 flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 h-12 rounded-xl text-sm font-bold text-text-main dark:text-white hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-[#e6dbdf] dark:hover:border-gray-700 transition-all"
                    >
                        {t("admin.addProductModal.cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white h-12 px-8 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
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
