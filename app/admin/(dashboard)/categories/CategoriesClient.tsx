"use client";

import { useState } from "react";
import Image from "next/image";
import { 
    MdDelete, 
    MdCheckBox, 
    MdCheckBoxOutlineBlank, 
    MdSearch, 
    MdAdd, 
    MdCheck, 
    MdImage, 
    MdStar, 
    MdStarBorder, 
    MdEdit,
    MdSearchOff,
    MdSync,
    MdList
} from "react-icons/md";
import CategoryModal from "./CategoryModal";
import SubCategoriesModal from "./SubCategoriesModal";
import { deleteCategory, toggleCategoryFeatured, bulkFixCategoryNames, bulkDeleteCategories } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";

interface Category {
    id: string;
    name: string;
    nameAr?: string | null;
    description: string | null;
    image: string | null;
    isFeatured: boolean;
    _count: {
        products: number;
    };
}

export default function CategoriesClient({ categories }: { categories: Category[] }) {
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const canManage = true; // session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManageCategories;
    const canDelete = true; // session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeleteCategories;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isSubCategoriesModalOpen, setIsSubCategoriesModalOpen] = useState(false);
    const [selectedCategoryForSubs, setSelectedCategoryForSubs] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredCategories.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredCategories.map(c => c.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        const ids = Array.from(selectedIds);
        
        if (!confirm(t('admin.confirmBulkDeleteCategories').replace('{count}', ids.length.toString()))) {
            return;
        }

        setIsSubmittingBulk(true);
        try {
            const result = await bulkDeleteCategories(ids);
            if (result.success) {
                if (result.partial) {
                    toast(t('admin.bulkDeleteCategoriesPartial')
                        .replace('{count}', result.count?.toString() || '0')
                        .replace('{names}', result.names || ''), 
                        { icon: '⚠️', duration: 6000 }
                    );
                } else {
                    toast.success(t('admin.bulkDeleteCategoriesSuccess').replace('{count}', result.count?.toString() || '0'));
                }
                setSelectedIds(new Set());
            } else {
                toast.error(t(`admin.${result.error}`) || t('admin.bulkDeleteCategoriesError'));
            }
        } catch (error) {
            console.error("Error in bulk delete:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setIsSubmittingBulk(false);
        }
    };

    const [isFixing, setIsFixing] = useState(false);

    const handleFixGarbledNames = async () => {
        const garbled = categories.filter(c => /[^\x00-\x7F]/.test(c.name));
        if (garbled.length === 0) {
            toast.success(t('admin.noGarbledNames'));
            return;
        }

        if (!confirm(t('admin.confirmFixEncoding').replace('{count}', garbled.length.toString()))) return;

        setIsFixing(true);
        try {
            const mapping = garbled.map(c => {
                let fixedName = c.name;
                try {
                    fixedName = Buffer.from(c.name, 'binary').toString('utf8');
                } catch (e) {}
                return { id: c.id, newName: fixedName };
            }).filter(item => item.newName !== categories.find(c => c.id === item.id)?.name);

            if (mapping.length === 0) {
                toast.success(t('admin.noNamesFixed'));
                return;
            }

            const result = await bulkFixCategoryNames(mapping);
            if (result.success) {
                toast.success(t('admin.fixedCategoryNames').replace('{count}', mapping.length.toString()));
            } else {
                toast.error(t('admin.failedFixNames'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('admin.errorCleanup'));
        } finally {
            setIsFixing(false);
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.nameAr?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(t('admin.confirmDeleteCategory').replace('{name}', name))) {
            try {
                const result = await deleteCategory(id);
                if (result.success) {
                    toast.success(t('admin.categoryDeleted'));
                } else {
                    toast.error(t(`admin.${result.error}`) || t('admin.deleteCategoryError'));
                }
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error(t('admin.errorGeneric'));
            }
        }
    };

    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        setLoadingMap(prev => ({ ...prev, [id]: true }));
        try {
            const result = await toggleCategoryFeatured(id, !currentStatus);
            if (result.success) {
                toast.success(!currentStatus ? t('admin.categoryFeatured') : t('admin.categoryUnfeatured'));
            } else {
                toast.error(result.error || t('admin.failedUpdateStatus'));
            }
        } catch (error) {
            console.error("Error toggling category featured status:", error);
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
                        <div className="">
                            <h3 className="text-3xl font-black text-white uppercase tracking-[0.2em]">
                                {t('admin.productCategories')}
                            </h3>
                            <p className="text-white/60 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
                                {t('admin.manageCategories')}
                            </p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row flex-wrap gap-4 items-center justify-end">
                            {/* Group for buttons that should be side-by-side on mobile */}
                        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full md:w-auto">
                            {/* Fix Garbled Names Button */}
                            <button
                                onClick={handleFixGarbledNames}
                                disabled={isFixing}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/5 transition-all whitespace-nowrap w-full md:w-auto"
                                title={t('admin.fixGarbledNames')}
                                aria-label={t('admin.fixGarbledNames') || "Fix garbled names"}
                            >
                                {isFixing ? (
                                    <MdSync className="animate-spin text-lg" />
                                ) : (
                                    <MdSync className="text-lg" />
                                )}
                                {t('admin.fixNames')}
                            </button>

                            {/* Delete Action */}
                            {selectedIds.size > 0 && canDelete && (
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={isSubmittingBulk}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all disabled:opacity-50 whitespace-nowrap border border-red-500/20 w-full md:w-auto animate-in fade-in slide-in-from-top-2 duration-300"
                                    aria-label={t('admin.deleteSelected') || "Delete selected categories"}
                                >
                                    {isSubmittingBulk ? (
                                        <MdSync className="animate-spin text-lg" />
                                    ) : (
                                        <MdDelete className="text-lg" />
                                    )}
                                    {t('admin.deleteSelected')}
                                </button>
                            )}

                            {/* Select All Toggle & Info */}
                            <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
                                {filteredCategories.length > 0 && (
                                    <button
                                        onClick={toggleSelectAll}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/5 transition-all whitespace-nowrap flex-1 md:flex-none"
                                        aria-label={selectedIds.size === filteredCategories.length ? (t('admin.deselectAll') || "Deselect all") : (t('admin.selectAll') || "Select all")}
                                    >
                                        {selectedIds.size === filteredCategories.length ? (
                                            <MdCheckBox className="text-lg text-accent" />
                                        ) : (
                                            <MdCheckBoxOutlineBlank className="text-lg" />
                                        )}
                                        {selectedIds.size === filteredCategories.length ? t('admin.deselectAll') : t('admin.selectAll')}
                                    </button>
                                )}

                                {selectedIds.size > 0 && (
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-white/60 whitespace-nowrap animate-in fade-in slide-in-from-top-2 duration-300 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}>
                                        {selectedIds.size} {t('admin.selected')}
                                    </span>
                                )}
                            </div>
                        </div>

                            {/* Featured Count Indicator */}
                            <div className={`hidden md:flex flex-col items-end ${dir === 'rtl' ? 'ml-2' : 'mr-2'} whitespace-nowrap`}>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{t('admin.featured')}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                                    {categories.filter(c => c.isFeatured).length} / 8 {t('admin.active')}
                                </span>
                            </div>

                            <div className="relative w-full md:w-64">
                                <MdSearch className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-white/60 text-xl`} />
                                <input
                                    type="text"
                                    placeholder={t('admin.searchCategories')}
                                    className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-accent/30 transition-all text-white placeholder:text-white/60`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search categories"
                                />
                            </div>
                            {canManage && (
                                <button
                                    onClick={handleAdd}
                                    className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <MdAdd className="text-xl" />
                                    {t('admin.addCategory')}
                                </button>
                            )}
                        </div>
                    </div>

                    <CategoryModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        category={selectedCategory}
                    />
                    
                    <SubCategoriesModal
                        isOpen={isSubCategoriesModalOpen}
                        onClose={() => setIsSubCategoriesModalOpen(false)}
                        category={selectedCategoryForSubs}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => (
                            <div 
                                key={category.id} 
                                className={`bg-white/[0.02] rounded-3xl border transition-all overflow-hidden group relative flex flex-col ${selectedIds.has(category.id) ? 'border-accent' : 'border-white/5 hover:border-white/10'}`}
                            >
                                {/* Selection Checkbox */}
                                <button
                                    onClick={() => toggleSelect(category.id)}
                                    className={`absolute top-4 left-4 z-10 w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${selectedIds.has(category.id) ? 'bg-accent border-accent text-white' : 'bg-black/40 backdrop-blur-md border-white/10 text-transparent hover:border-accent/50'}`}
                                    aria-label={`Select category ${category.name}`}
                                >
                                    <MdCheck className="text-lg" />
                                </button>

                                <div className="aspect-[16/10] w-full overflow-hidden bg-white/[0.01] flex items-center justify-center border-b border-white/5 relative">
                                    {category.image ? (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <MdImage className="text-4xl text-white/20" />
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex flex-col">
                                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">{category.name}</h3>
                                            {category.nameAr && (
                                                <span className="text-[10px] text-white/60 mt-1 font-medium">{category.nameAr}</span>
                                            )}
                                        </div>
                                        <span className="shrink-0 bg-white/[0.05] text-white/60 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-white/5">
                                            {category._count.products}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/60 line-clamp-2 mb-6 font-black uppercase tracking-[0.2em] leading-relaxed">
                                        {category.description || t('admin.noDescription')}
                                    </p>
                                    
                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-1">
                                            {canManage && (
                                                <button
                                                    onClick={() => handleToggleFeatured(category.id, category.isFeatured)}
                                                    disabled={loadingMap[category.id]}
                                                    className={`p-2.5 rounded-xl transition-all ${category.isFeatured ? 'text-accent bg-accent/10 border border-accent/20' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
                                                    title={category.isFeatured ? t('admin.removeFromHome') : t('admin.featureOnHome')}
                                                    aria-label={category.isFeatured ? t('admin.removeFromHome') : t('admin.featureOnHome')}
                                                >
                                                    {loadingMap[category.id] ? (
                                                        <MdSync className="animate-spin text-lg" />
                                                    ) : (
                                                        category.isFeatured ? <MdStar className="text-lg" /> : <MdStarBorder className="text-lg" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            {canManage && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategoryForSubs(category);
                                                        setIsSubCategoriesModalOpen(true);
                                                    }}
                                                    className="p-2.5 text-white/60 hover:text-accent hover:bg-accent/5 rounded-xl transition-all border border-transparent hover:border-accent/10"
                                                    title={t('admin.manageSubCategories') || "Manage Subcategories"}
                                                    aria-label={t('admin.manageSubCategories') || "Manage Subcategories"}
                                                >
                                                    <MdList className="text-lg" />
                                                </button>
                                            )}
                                            {canManage && (
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5"
                                                    title={t('admin.editCategory')}
                                                    aria-label={t('admin.editCategory')}
                                                >
                                                    <MdEdit className="text-lg" />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
                                                    className="p-2.5 text-white/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all border border-transparent hover:border-red-500/10"
                                                    title={t('admin.deleteCategory')}
                                                    aria-label={t('admin.deleteCategory')}
                                                >
                                                    <MdDelete className="text-lg" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-32 bg-white/[0.01] rounded-[2rem] border-2 border-dashed border-white/5">
                            <MdSearchOff className="text-6xl text-white/20 mb-6 mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                {searchQuery ? t('admin.noCategoriesFound') : t('admin.noCategoriesCreated')}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={handleAdd}
                                    className="mt-6 text-accent font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
                                >
                                    {t('admin.createFirstCategory')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
