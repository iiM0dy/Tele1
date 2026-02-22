"use client";

import { useState } from "react";
import { 
    MdDelete, 
    MdSearch, 
    MdAdd, 
    MdImage, 
    MdEdit,
    MdStar,
    MdStarOutline,
    MdSync
} from "react-icons/md";
import ReviewModal from "./ReviewModal";
import { deleteReview } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";

interface Review {
    id: string;
    name: string;
    image: string | null;
    description: string;
    rating: number;
    productId: string | null;
    productName: string | null;
    createdAt: string;
}

interface Product {
    id: string;
    Name: string;
}

export default function ReviewsClient({ 
    reviews: initialReviews, 
    products,
    pagination 
}: { 
    reviews: Review[], 
    products: Product[],
    pagination: { total: number, pages: number, page: number, limit: number }
}) {
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const canManage = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManageProducts; // Using product permission for reviews
    const canDelete = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeleteProducts;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const filteredReviews = initialReviews.filter(review =>
        review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (review.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    const handleAdd = () => {
        setSelectedReview(null);
        setIsModalOpen(true);
    };

    const handleEdit = (review: Review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm(t('admin.confirmDeleteReview'))) {
            setIsDeleting(id);
            try {
                const result = await deleteReview(id);
                if (result.success) {
                    toast.success(t('admin.reviewDeleted'));
                } else {
                    toast.error(t('admin.errorGeneric'));
                }
            } catch (error) {
                console.error("Error deleting review:", error);
                toast.error(t('admin.errorGeneric'));
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= rating ? (
                        <MdStar key={star} className="text-accent text-sm" />
                    ) : (
                        <MdStarOutline key={star} className="text-white/10 text-sm" />
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto pb-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                        <div className="">
                            <h3 className="text-3xl font-black text-white uppercase tracking-[0.2em]">
                                {t('admin.reviews')}
                            </h3>
                            <p className="text-white/40 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
                                {t('admin.manageReviews')}
                            </p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4 items-center justify-end">
                            <div className="relative w-full md:w-64">
                                <MdSearch className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/20 text-xl`} />
                                <input
                                    type="text"
                                    placeholder={t('admin.searchPlaceholder')}
                                    className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-accent/30 transition-all text-white placeholder:text-white/20`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {canManage && (
                                <button
                                    onClick={handleAdd}
                                    className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <MdAdd className="text-xl" />
                                    {t('admin.addReview')}
                                </button>
                            )}
                        </div >
                    </div>

                    <ReviewModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        review={selectedReview}
                        products={products}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <div 
                                    key={review.id} 
                                    className="bg-white/[0.02] rounded-3xl border border-white/5 transition-all overflow-hidden group relative flex flex-col hover:border-white/10"
                                >
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center shrink-0">
                                                    {review.image ? (
                                                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <MdImage className="text-white/20 text-xl" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.1em] truncate">
                                                        {review.name}
                                                    </span>
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {canManage && (
                                                    <button
                                                        onClick={() => handleEdit(review)}
                                                        className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                        title={t('admin.editReview')}
                                                    >
                                                        <MdEdit className="text-lg" />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        disabled={isDeleting === review.id}
                                                        className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all disabled:opacity-50"
                                                        title={t('admin.deleteReview')}
                                                    >
                                                        {isDeleting === review.id ? (
                                                            <MdSync className="animate-spin text-lg" />
                                                        ) : (
                                                            <MdDelete className="text-lg" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-white/40 line-clamp-3 mb-6 leading-relaxed font-medium italic">
                                            "{review.description}"
                                        </p>

                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em] mb-1">
                                                    {t('admin.product')}
                                                </span>
                                                <span className="text-[9px] font-black text-accent uppercase tracking-[0.1em] truncate max-w-[150px]">
                                                    {review.productName || t('admin.none')}
                                                </span>
                                            </div>
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.1em]">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-white/20 bg-white/[0.01] rounded-[40px] border border-dashed border-white/5">
                                <MdSearch className="text-6xl mb-4 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    {t('admin.noReviewsFound')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
