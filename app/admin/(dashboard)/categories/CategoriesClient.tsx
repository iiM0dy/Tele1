"use client";

import { useState } from "react";
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
    MdSync
} from "react-icons/md";
import CategoryModal from "./CategoryModal";
import { deleteCategory, toggleCategoryFeatured, bulkFixCategoryNames, bulkDeleteCategories } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";

interface Category {
    id: string;
    name: string;
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
    const canManage = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManageCategories;
    const canDelete = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeleteCategories;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto pb-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                        <div className="">
                            <h3 className="text-3xl font-extrabold text-white uppercase tracking-tight">
                                {t('admin.productCategories')}
                            </h3>
                            <p className="text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">
                                {t('admin.manageCategories')}
                            </p>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row flex-wrap gap-4 items-center justify-end">
                            {/* Selection Info and Actions */}
                            {selectedIds.size > 0 && (
                                <div className={`flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`}>
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap text-[10px]">
                                        {selectedIds.size} {t('admin.selected')}
                                    </span>
                                    {canDelete && (
                                        <button
                                            onClick={handleBulkDelete}
                                            disabled={isSubmittingBulk}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-md shadow-red-500/20 disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {isSubmittingBulk ? (
                                                <MdSync className="animate-spin text-[18px]" />
                                            ) : (
                                                <MdDelete className="text-[18px]" />
                                            )}
                                            {t('admin.deleteSelected')}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Select All Toggle */}
                            {filteredCategories.length > 0 && (
                                <button
                                    onClick={toggleSelectAll}
                                    className="flex items-center gap-2 px-4 py-2 bg-admin-sidebar border border-admin-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-white hover:bg-gold/10 hover:text-gold transition-all whitespace-nowrap"
                                >
                                    {selectedIds.size === filteredCategories.length ? (
                                        <MdCheckBox className="text-[18px]" />
                                    ) : (
                                        <MdCheckBoxOutlineBlank className="text-[18px]" />
                                    )}
                                    {selectedIds.size === filteredCategories.length ? t('admin.deselectAll') : t('admin.selectAll')}
                                </button>
                            )}

                            {/* Featured Count Indicator */}
                            <div className={`hidden md:flex flex-col items-end ${dir === 'rtl' ? 'ml-2' : 'mr-2'} whitespace-nowrap`}>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t('admin.featured')}</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-gold">
                                    {categories.filter(c => c.isFeatured).length} / 8 {t('admin.active')}
                                </span>
                            </div>

                            <div className="relative w-full md:w-64">
                                <MdSearch className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gold text-xl`} />
                                <input
                                    type="text"
                                    placeholder={t('admin.searchCategories')}
                                    className={`w-full ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-admin-sidebar border border-admin-border rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-gold/20 focus:border-gold/30 transition-all text-white placeholder:text-gray-600`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {canManage && (
                                <button
                                    onClick={handleAdd}
                                    className="w-full md:w-auto bg-gold text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gold/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/25 whitespace-nowrap"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filteredCategories.map((category) => (
                            <div 
                                key={category.id} 
                                className={`bg-admin-sidebar rounded-xl border ${selectedIds.has(category.id) ? 'border-gold shadow-md shadow-gold/20' : 'border-admin-border shadow-sm'} hover:border-gold/30 transition-all overflow-hidden group relative`}
                            >
                                {/* Selection Checkbox */}
                                <button
                                    onClick={() => toggleSelect(category.id)}
                                    className={`absolute top-4 left-4 z-10 w-6 h-6 rounded-md border flex items-center justify-center transition-all ${selectedIds.has(category.id) ? 'bg-gold border-gold text-white' : 'bg-background/80 border-admin-border text-transparent hover:border-gold'}`}
                                >
                                    <MdCheck className="text-[18px]" />
                                </button>

                                <div className="category-card-image w-full h-[200px] overflow-hidden bg-background flex items-center justify-center border-b border-admin-border">
                                    {category.image ? (
                                        <img
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            src={category.image}
                                        />
                                    ) : (
                                        <MdImage className="text-4xl text-gray-700" />
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">{category.name}</h3>
                                    <p className="text-[10px] text-gray-500 line-clamp-2 mb-4 font-bold uppercase tracking-widest">
                                        {category.description || t('admin.noDescription')}
                                    </p>
                                    <div className="w-full flex items-center justify-between pt-4 border-t border-admin-border">
                                        <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-gold/30">
                                            {category._count.products} {t('admin.products')}
                                        </span>
                                        <div className="flex items-center flex-wrap justify-end gap-2">
                                            {canManage && (
                                                <button
                                                    onClick={() => handleToggleFeatured(category.id, category.isFeatured)}
                                                    disabled={loadingMap[category.id]}
                                                    className={`p-2 rounded-lg transition-colors ${category.isFeatured ? 'text-gold bg-gold/20 hover:bg-gold/30 border border-gold/30' : 'text-gray-400 hover:text-gold hover:bg-gold/10'}`}
                                                    title={category.isFeatured ? t('admin.removeFromHome') : t('admin.featureOnHome')}
                                                >
                                                    {loadingMap[category.id] ? (
                                                        <MdSync className="animate-spin text-[20px]" />
                                                    ) : (
                                                        category.isFeatured ? <MdStar className="text-[20px]" /> : <MdStarBorder className="text-[20px]" />
                                                    )}
                                                </button>
                                            )}
                                            {canManage && (
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                                                    title={t('admin.editCategory')}
                                                >
                                                    <MdEdit className="text-[20px]" />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title={t('admin.deleteCategory')}
                                                >
                                                    <MdDelete className="text-[20px]" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-20 bg-admin-sidebar rounded-2xl border border-dashed border-admin-border">
                            <MdSearchOff className="text-5xl text-gray-700 mb-4 mx-auto" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 italic">
                                {searchQuery ? t('admin.noCategoriesFound') : t('admin.noCategoriesCreated')}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={handleAdd}
                                    className="mt-4 text-gold font-bold uppercase tracking-widest text-xs hover:underline"
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
