"use client";

import { useState, useEffect, useRef } from "react";
import { MdClose, MdSync, MdStar, MdStarOutline, MdSearch, MdCheck } from "react-icons/md";
import { createReview, updateReview } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";

interface Review {
    id: string;
    name: string;
    image: string | null;
    description: string;
    rating: number;
    productId: string | null;
}

interface Product {
    id: string;
    Name: string;
}

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    review?: Review | null;
    products: Product[];
}

export default function ReviewModal({ isOpen, onClose, review, products }: ReviewModalProps) {
    const { t, dir } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        description: "",
        rating: 5,
        productId: ""
    });

    // Searchable Select State
    const [isProductSelectOpen, setIsProductSelectOpen] = useState(false);
    const [productSearch, setProductSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (review) {
            setFormData({
                name: review.name,
                image: review.image || "",
                description: review.description,
                rating: review.rating,
                productId: review.productId || ""
            });
        } else {
            setFormData({
                name: "",
                image: "",
                description: "",
                rating: 5,
                productId: ""
            });
        }
        setProductSearch("");
        setIsProductSelectOpen(false);
    }, [review, isOpen]);

    // Handle clicks outside dropdown to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProductSelectOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredProducts = products.filter(p =>
        p.Name.toLowerCase().includes(productSearch.toLowerCase())
    ).slice(0, 50); // Limit to 50 for performance

    const selectedProduct = products.find(p => p.id === formData.productId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.rating) {
            toast.error(t('admin.addReviewModal.fillRequiredFields'));
            return;
        }

        setIsSubmitting(true);
        try {
            const data = {
                ...formData,
                productId: formData.productId || undefined,
            };

            const result = review
                ? await updateReview(review.id, data)
                : await createReview(data);

            if (result.success) {
                toast.success(review ? t('admin.reviewUpdated') : t('admin.reviewCreated'));
                onClose();
            } else {
                toast.error(t('admin.addReviewModal.errorGeneric'));
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(t('admin.addReviewModal.errorGeneric'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

            <div className={`relative w-full max-w-xl bg-[#202126] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300`}>
                <div className="p-8 sm:p-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
                    <div className="flex items-start justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                                {review ? t('admin.addReviewModal.titleEdit') : t('admin.addReviewModal.titleAdd')}
                            </h3>
                            <p className="text-white/60 mt-2 tracking-wider text-[11px] font-semibold">
                                {review ? t('admin.addReviewModal.subtitleEdit') : t('admin.addReviewModal.subtitleAdd')}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all"
                        >
                            <MdClose className="text-2xl" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Customer Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-white/60 tracking-wider px-1">
                                    {t('admin.addReviewModal.customerName')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={t('admin.addReviewModal.customerNamePlaceholder')}
                                    className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-accent/30 transition-all"
                                />
                            </div>

                            {/* Customer Image */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-white/60 tracking-wider px-1">
                                    {t('admin.addReviewModal.customerImage')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder={t('admin.imageUrlPlaceholder')}
                                    className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-accent/30 transition-all"
                                />
                            </div>

                            {/* Rating */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-white/60 tracking-wider px-1">
                                    {t('admin.addReviewModal.rating')}
                                </label>
                                <div className="flex gap-2 p-2 bg-white/2 border border-white/5 rounded-2xl w-fit">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="p-1 hover:scale-110 transition-transform"
                                        >
                                            {star <= formData.rating ? (
                                                <MdStar className="text-accent text-2xl" />
                                            ) : (
                                                <MdStarOutline className="text-white/20 text-2xl" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-white/60 tracking-wider px-1">
                                    {t('admin.addReviewModal.comment')}
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder={t('admin.addReviewModal.commentPlaceholder')}
                                    rows={4}
                                    className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-accent/30 transition-all resize-none"
                                />
                            </div>

                            {/* Searchable Product Select */}
                            <div className="space-y-2 relative" ref={dropdownRef}>
                                <label className="text-[11px] font-semibold text-white/60 tracking-wider px-1">
                                    {t('admin.addReviewModal.product')}
                                </label>

                                <div
                                    onClick={() => setIsProductSelectOpen(!isProductSelectOpen)}
                                    className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-[13px] font-medium text-white cursor-pointer hover:border-white/10 transition-all flex items-center justify-between"
                                >
                                    <span className={selectedProduct ? "text-white" : "text-white/40"}>
                                        {selectedProduct ? selectedProduct.Name : t('admin.addReviewModal.selectProduct')}
                                    </span>
                                    <MdSearch className="text-xl text-white/40" />
                                </div>

                                {isProductSelectOpen && (
                                    <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#0F0F0F] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-110 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div className="p-4 border-b border-white/5">
                                            <div className="relative">
                                                <MdSearch className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/40`} />
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    placeholder={t('admin.searchProducts')}
                                                    value={productSearch}
                                                    onChange={(e) => setProductSearch(e.target.value)}
                                                    className={`w-full bg-white/5 border border-white/5 rounded-xl ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 text-xs text-white focus:outline-none focus:border-accent/30`}
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-[200px] overflow-y-auto scrollbar-hide py-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, productId: "" });
                                                    setIsProductSelectOpen(false);
                                                }}
                                                className="w-full px-6 py-3 text-left hover:bg-white/5 transition-all flex items-center justify-between group"
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">
                                                    {t('admin.none')}
                                                </span>
                                                {formData.productId === "" && <MdCheck className="text-accent" />}
                                            </button>

                                            {filteredProducts.map((product) => (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, productId: product.id });
                                                        setIsProductSelectOpen(false);
                                                    }}
                                                    className="w-full px-6 py-3 text-left hover:bg-white/5 transition-all flex items-center justify-between group"
                                                >
                                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${formData.productId === product.id ? 'text-accent' : 'text-white/60 group-hover:text-white'}`}>
                                                        {product.Name}
                                                    </span>
                                                    {formData.productId === product.id && <MdCheck className="text-accent" />}
                                                </button>
                                            ))}

                                            {filteredProducts.length === 0 && (
                                                <div className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/20 text-center">
                                                    {t('admin.noProductsMatch')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all"
                            >
                                {t('admin.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-2 bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <MdSync className="animate-spin text-xl" />
                                ) : (
                                    review ? t('admin.updateReview') : t('admin.addNewReview')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
