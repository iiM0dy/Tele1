"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddProductModal from "./AddProductModal";
import { 
    deleteProduct, 
    toggleProductTrending, 
    bulkToggleTrending, 
    bulkCreateProducts, 
    bulkRemoveSale, 
    bulkDeleteProducts, 
    toggleBestSeller, 
    bulkToggleBestSeller,
    getAllAdminProductsForExport 
} from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";
import { 
    MdChevronRight, 
    MdChevronLeft, 
    MdFileUpload, 
    MdFileDownload, 
    MdAdd, 
    MdSearch, 
    MdExpandMore, 
    MdLocalFireDepartment, 
    MdSell, 
    MdTrendingDown, 
    MdMoneyOff, 
    MdDelete, 
    MdEdit,
    MdSync,
    MdStar,
    MdStarOutline
} from 'react-icons/md';

interface Product {
    id: string;
    name: string;
    description: string | null;
    categoryId: string;
    subCategoryId?: string | null;
    sku: string | null;
    price: number;
    discountPrice: number | null;
    discountType: string | null;
    discountValue: number | null;
    stock: number;
    images: string;
    isTrending: boolean;
    bestSeller: boolean;
    category: {
        id: string;
        name: string;
    } | null;
    subCategory?: {
        id: string;
        name: string;
    } | null;
}

interface Category {
    id: string;
    name: string;
}

interface Pagination {
    total: number;
    pages: number;
    page: number;
    limit: number;
}

interface Stats {
    total: number;
    outOfStock: number;
    lowStock: number;
    categories: number;
    bestSellers: number;
}

export default function ProductsClient({ 
    products = [], 
    categories = [],
    pagination = { total: 0, pages: 1, page: 1, limit: 20 },
    initialStats = { total: 0, outOfStock: 0, lowStock: 0, categories: 0, bestSellers: 0 }
}: { 
    products: Product[], 
    categories: Category[],
    pagination: Pagination,
    initialStats: Stats
}) {
    const { data: session } = useSession();
    const { t, dir } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const canDelete = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeleteProducts;
    const canEdit = session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManageProducts;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    
    // Initialize filters from URL
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const selectedCategory = searchParams.get('category') || "all";
    const selectedStockStatus = searchParams.get('stock') || "all";
    const showTrendingOnly = searchParams.get('trending') === "true";
    const showBestSellerOnly = searchParams.get('bestSeller') === "true";
    
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
    
    // Update searchQuery when URL changes (e.g. back button)
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || "");
    }, [searchParams]);

    // Update URL helper
    const updateUrl = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        
        // Reset page to 1 when filters change (unless page is explicitly updated)
        if (!updates.page && (updates.search !== undefined || updates.category !== undefined || updates.stock !== undefined || updates.trending !== undefined || updates.bestSeller !== undefined)) {
            params.set('page', '1');
        }
        
        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router, searchParams]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== (searchParams.get('search') || "")) {
                updateUrl({ search: searchQuery || null });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, updateUrl, searchParams]);

    const stats = initialStats;

    // Get unique categories for filter dropdown - use all available categories
    const uniqueCategories = useMemo(() => {
        return categories.map(c => c.name).sort();
    }, [categories]);

    // Use products directly as they are already filtered by server
    const currentItems = products;

    // Pagination helpers
    const currentPage = pagination.page;
    const totalPages = pagination.pages;
    const itemsPerPage = pagination.limit;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const totalItems = pagination.total;

    const handlePageChange = (page: number) => {
        updateUrl({ page: page.toString() });
        // Find the main scroll container
        const container = document.querySelector('.overflow-y-auto');
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsAddModalOpen(true);
    };

    const toggleSelectAll = () => {
        const allOnPageSelected = currentItems.length > 0 && currentItems.every(p => selectedIds.has(p.id));
        const newSelected = new Set(selectedIds);

        if (allOnPageSelected) {
            currentItems.forEach(p => newSelected.delete(p.id));
        } else {
            currentItems.forEach(p => newSelected.add(p.id));
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectOne = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(t('admin.confirmDeleteProduct').replace('{name}', name))) {
            try {
                const result = await deleteProduct(id);
                if (result.success) {
                    toast.success(t('admin.productDeleted'));
                } else {
                    toast.error(t(`admin.${result.error}`) || t('admin.deleteProductError'));
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error(t('admin.errorGeneric'));
            }
        }
    }

    const handleBulkRemoveTrending = async () => {
        if (selectedIds.size === 0) return;

        const ids = Array.from(selectedIds);
        setIsSubmittingBulk(true);
        try {
            const result = await bulkToggleTrending(ids, false);
            if (result.success) {
                toast.success(t('admin.bulkRemoveTrendingSuccess').replace('{count}', ids.length.toString()));
                setSelectedIds(new Set());
            } else {
                toast.error(t(`admin.${result.error}`) || t('admin.errorGeneric'));
            }
        } catch (error) {
            console.error("Error in bulk update:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setIsSubmittingBulk(false);
        }
    };

    const handleBulkRemoveSale = async () => {
        if (selectedIds.size === 0) return;
        const ids = Array.from(selectedIds);
        setIsSubmittingBulk(true);
        try {
            const result = await bulkRemoveSale(ids);
            if (result.success) {
                toast.success(t('admin.bulkRemoveSaleSuccess').replace('{count}', ids.length.toString()));
                setSelectedIds(new Set());
            } else {
                toast.error(t(`admin.${result.error}`) || t('admin.errorGeneric'));
            }
        } catch (error) {
            console.error("Error in bulk update:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setIsSubmittingBulk(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        const ids = Array.from(selectedIds);
        
        if (!confirm(t('admin.confirmBulkDelete').replace('{count}', ids.length.toString()))) {
            return;
        }

        setIsSubmittingBulk(true);
        try {
            const result = await bulkDeleteProducts(ids);
            if (result.success) {
                if (result.partial) {
                    toast(t('admin.bulkDeleteProductsPartial')
                        .replace('{count}', result.count?.toString() || '0')
                        .replace('{names}', result.names || ''), 
                        { icon: '⚠️', duration: 6000 }
                    );
                } else {
                    toast.success(t('admin.bulkDeleteProductsSuccess').replace('{count}', result.count?.toString() || '0'));
                }
                setSelectedIds(new Set());
            } else {
                toast.error(t(`admin.${result.error}`) || t('admin.bulkDeleteProductsError'));
            }
        } catch (error) {
            console.error("Error in bulk delete:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setIsSubmittingBulk(false);
        }
    };

    const handleToggleTrending = async (id: string, currentStatus: boolean) => {
        setLoadingMap(prev => ({ ...prev, [id]: true }));
        try {
            const result = await toggleProductTrending(id, !currentStatus);
            if (result.success) {
                const message = !currentStatus ? t('admin.markedTrendingSuccess') : t('admin.removedTrendingSuccess');
                toast.success(message);
            } else {
                toast.error(t(`admin.${result.error}`) || t('admin.errorGeneric'));
            }
        } catch (error) {
            console.error("Error toggling product trending status:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleToggleBestSeller = async (id: string, currentStatus: boolean) => {
        setLoadingMap(prev => ({ ...prev, [id]: true }));
        try {
            const result = await toggleBestSeller(id, !currentStatus);
            if (result.success) {
                const message = !currentStatus ? t('admin.markedBestSellerSuccess') : t('admin.removedBestSellerSuccess');
                toast.success(message);
            } else {
                toast.error(t(`admin.${result.error}`) || t('admin.errorGeneric'));
            }
        } catch (error) {
            console.error("Error toggling best seller status:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleBulkToggleBestSeller = async (bestSeller: boolean) => {
        if (selectedIds.size === 0) return;
        const ids = Array.from(selectedIds);
        setIsSubmittingBulk(true);
        try {
            const result = await bulkToggleBestSeller(ids, bestSeller);
            if (result.success) {
                toast.success(t('admin.bulkBestSellerSuccess').replace('{count}', ids.length.toString()));
                setSelectedIds(new Set());
            } else {
                toast.error(t(`admin.${result.error}`) || t('admin.errorGeneric'));
            }
        } catch (error) {
            console.error("Error in bulk best seller update:", error);
            toast.error(t('admin.errorGeneric'));
        } finally {
            setIsSubmittingBulk(false);
        }
    };

    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleExportCSV = async () => {
        try {
            const exportData = await getAllAdminProductsForExport();
            if (!exportData || exportData.length === 0) {
                toast.error(t('admin.noDataToExport'));
                return;
            }

            // Prepare headers
            const headers = [
                t('admin.name') || "Name",
                t('admin.sku') || "SKU",
                t('admin.category') || "Category",
                t('admin.subCategory') || "Sub Category",
                t('admin.price') || "Price",
                t('admin.stock') || "Stock",
                t('admin.images') || "Images"
            ];

            // Prepare data rows
            const rows = exportData.map((p: any) => [
                `"${p.name.replace(/"/g, '""')}"`,
                `"${(p.sku || '').replace(/"/g, '""')}"`,
                `"${(p.category || 'Uncategorized').replace(/"/g, '""')}"`,
                `"${(p.subCategory || '').replace(/"/g, '""')}"`,
                p.price,
                p.stock,
                `"${(p.images || '').replace(/"/g, '""')}"`
            ]);

            // Combine into CSV string
            const csvContent = [
                headers.join(","),
                ...rows.map(r => r.join(","))
            ].join("\n");

            // Create download link with UTF-8 BOM for Excel/Arabic support
            const BOM = "\uFEFF";
            const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `tele1_products_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(t('admin.exportSuccess'));
            setShowExportMenu(false);
        } catch (error) {
            console.error("Export failed:", error);
            toast.error(t('admin.exportError'));
        }
    };

    const handleExportExcel = async () => {
        try {
            const exportData = await getAllAdminProductsForExport();
            if (!exportData || exportData.length === 0) {
                toast.error(t('admin.noDataToExport'));
                return;
            }

            const XLSX = await import('xlsx');
            
            // Prepare data for Excel
            const excelData = exportData.map((p: any) => ({
                [t('admin.name') || "Name"]: p.name,
                [t('admin.sku') || "SKU"]: p.sku || '',
                [t('admin.category') || "Category"]: p.category || 'Uncategorized',
                [t('admin.subCategory') || "Sub Category"]: p.subCategory || '',
                [t('admin.price') || "Price"]: p.price,
                [t('admin.stock') || "Stock"]: p.stock,
                [t('admin.images') || "Images"]: p.images || ''
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
            
            // Generate Excel file and trigger download
            XLSX.writeFile(workbook, `tele1_products_${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success(t('admin.exportSuccess'));
            setShowExportMenu(false);
        } catch (error) {
            console.error("Excel export failed:", error);
            toast.error(t('admin.exportError'));
        }
    };

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSubmittingBulk(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                let data: any[] = [];
                const fileName = file.name.toLowerCase();

                if (fileName.endsWith('.csv')) {
                    const text = event.target?.result as string;
                    const lines = text.split('\n');
                    if (lines.length < 2) {
                        toast.error(t('admin.fileEmpty'));
                        return;
                    }

                    const headers = lines[0].split(',').map(h => h.trim());
                    data = lines.slice(1).filter(line => line.trim()).map(line => {
                        const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
                        const obj: any = {};
                        headers.forEach((header, i) => {
                            obj[header] = values[i];
                        });
                        return obj;
                    });
                } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
                    const XLSX = await import('xlsx');
                    const bstr = event.target?.result;
                    const wb = XLSX.read(bstr, { type: 'binary' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    data = XLSX.utils.sheet_to_json(ws);
                }

                if (data.length === 0) {
                    toast.error(t('admin.fileEmpty'));
                    return;
                }

                const result = await bulkCreateProducts(data);
                if (result.success) {
                    toast.success(t('admin.importSuccess').replace('{count}', result.count?.toString() || '0'));
                } else {
                    toast.error(result.error || t('admin.importError'));
                }
            } catch (error) {
                console.error("Import error:", error);
                toast.error(t('admin.fileParseError'));
            } finally {
                setIsSubmittingBulk(false);
                if (e.target) e.target.value = '';
            }
        };

        if (file.name.toLowerCase().endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#202126]">
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8 pb-10">

                    {/* Page Heading & Breadcrumbs */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="flex flex-col gap-1">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-sm text-white/40 mb-1">
                                <Link href="/admin/dashboard" className="hover:text-accent cursor-pointer transition-colors uppercase tracking-[0.2em] text-[10px] font-black">{t('admin.dashboard')}</Link>
                                <MdChevronRight className={`text-[12px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                <span className="text-white font-black uppercase tracking-[0.2em] text-[10px]">{t('admin.products')}</span>
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase">{t('admin.products')}</h2>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.manageCatalog')}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="bg-white/[0.02] border border-white/5 hover:bg-white/5 text-white h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-sm hover:border-accent/30"
                                >
                                    <MdFileUpload className="text-[20px] text-accent" />
                                    {t('admin.exportData')}
                                    <MdExpandMore className={`text-[16px] transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {showExportMenu && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setShowExportMenu(false)}
                                        />
                                        <div className="absolute top-full mt-2 right-0 w-48 bg-[#0F172A] border border-white/5 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <button
                                                onClick={handleExportCSV}
                                                className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/5 hover:text-accent transition-colors flex items-center gap-3"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                                                    <span className="text-accent text-[10px]">CSV</span>
                                                </div>
                                                CSV File
                                            </button>
                                            <button
                                                onClick={handleExportExcel}
                                                className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/5 hover:text-accent transition-colors flex items-center gap-3 border-t border-white/5"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                                                    <span className="text-green-500 text-[10px]">XLSX</span>
                                                </div>
                                                Excel File
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <label className="bg-white/[0.02] border border-white/5 hover:bg-white/5 text-white h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all shadow-sm cursor-pointer hover:border-accent/30">
                                <MdFileDownload className="text-[20px] text-accent" />
                                {t('admin.importData')}
                                <input
                                    type="file"
                                    accept=".csv, .xlsx, .xls"
                                    className="hidden"
                                    onChange={handleImportFile}
                                    disabled={isSubmittingBulk}
                                />
                            </label>
                            {canEdit && (
                                <button
                                    onClick={() => {
                                        setSelectedProduct(null);
                                        setIsAddModalOpen(true);
                                    }}
                                    className="bg-accent hover:bg-accent/90 text-white h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <MdAdd className="text-[20px]" />
                                    {t('admin.addNewProduct')}
                                </button>
                            )}
                        </div>
                    </div>

                    <AddProductModal
                        isOpen={isAddModalOpen}
                        onClose={() => {
                            setIsAddModalOpen(false);
                            setSelectedProduct(null);
                        }}
                        categories={categories}
                        product={selectedProduct}
                    />

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1">
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.totalProducts')}</p>
                            <p className="text-2xl font-black text-white tracking-tight">{stats.total.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1">
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.trending')}</p>
                            <p className="text-2xl font-black text-accent tracking-tight">{products.filter(p => p.isTrending).length}</p>
                        </div>
                        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1">
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.outOfStock')}</p>
                            <p className="text-2xl font-black text-red-500 tracking-tight">{stats.outOfStock.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1">
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.lowInventory')}</p>
                            <p className="text-2xl font-black text-orange-500 tracking-tight">{stats.lowStock.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1">
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.categories')}</p>
                            <p className="text-2xl font-black text-white tracking-tight">{stats.categories.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1">
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{t('admin.bestSeller')}</p>
                            <p className="text-2xl font-black text-accent tracking-tight">{stats.bestSellers.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Filters & Table Container */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl shadow-sm overflow-hidden">
                        {/* Toolbar */}
                        <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                            <div className="relative w-full lg:w-80">
                                <span className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                    <MdSearch className="text-accent text-[20px]" />
                                </span>
                                <input
                                    className={`block w-full ${dir === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-white/5 rounded-2xl bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder-white/20 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all outline-none`}
                                    placeholder={t('admin.searchPlaceholder')}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Category Filter */}
                                <div className="relative flex-1 sm:flex-initial">
                                    <select
                                        className={`appearance-none w-full ${dir === 'rtl' ? 'pr-3 pl-10' : 'pl-3 pr-10'} py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white focus:ring-1 focus:ring-accent/20 focus:border-accent/30 hover:border-accent/30 cursor-pointer min-w-[140px] outline-none transition-all`}
                                        value={selectedCategory}
                                        onChange={(e) => updateUrl({ category: e.target.value })}
                                    >
                                        <option value="all" className="bg-[#0F172A]">{t('admin.allCategories')}</option>
                                        <option value="uncategorized" className="bg-[#0F172A]">{t('admin.uncategorized')}</option>
                                        {uniqueCategories.map(cat => <option key={cat} value={cat} className="bg-[#0F172A]">{cat}</option>)}
                                    </select>
                                    <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-2' : 'right-0 pr-2'} flex items-center pointer-events-none text-accent`}>
                                        <MdExpandMore className="text-[20px]" />
                                    </div>
                                </div>
                                {/* Stock Filter */}
                                <div className="relative flex-1 sm:flex-initial">
                                    <select
                                        className={`appearance-none w-full ${dir === 'rtl' ? 'pr-3 pl-10' : 'pl-3 pr-10'} py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white focus:ring-1 focus:ring-accent/20 focus:border-accent/30 hover:border-accent/30 cursor-pointer min-w-[140px] outline-none transition-all`}
                                        value={selectedStockStatus}
                                        onChange={(e) => updateUrl({ stock: e.target.value })}
                                    >
                                        <option value="all" className="bg-[#0F172A]">{t('admin.stockStatus')}</option>
                                        <option value="inStock" className="bg-[#0F172A]">{t('admin.inStock')}</option>
                                        <option value="lowStock" className="bg-[#0F172A]">{t('admin.lowStock')}</option>
                                        <option value="outOfStock" className="bg-[#0F172A]">{t('admin.outOfStock')}</option>
                                    </select>
                                    <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-2' : 'right-0 pr-2'} flex items-center pointer-events-none text-accent`}>
                                        <MdExpandMore className="text-[20px]" />
                                    </div>
                                </div>

                                {/* Trending Filter Toggle */}
                                <button
                                    onClick={() => updateUrl({ trending: !showTrendingOnly ? 'true' : null })}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${showTrendingOnly
                                        ? 'bg-accent text-white'
                                        : 'bg-white/[0.02] border border-white/5 text-white hover:border-accent/30 hover:text-accent'
                                        }`}
                                >
                                    <MdLocalFireDepartment className={`text-[20px] ${showTrendingOnly ? 'text-white' : 'text-accent'}`} />
                                    <span className="hidden sm:inline">{t('admin.trendingOnly')}</span>
                                </button>

                                {/* Best Seller Filter Toggle */}
                                <button
                                    onClick={() => updateUrl({ bestSeller: !showBestSellerOnly ? 'true' : null })}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${showBestSellerOnly
                                        ? 'bg-accent text-white'
                                        : 'bg-white/[0.02] border border-white/5 text-white hover:border-accent/30 hover:text-accent'
                                        }`}
                                >
                                    <MdStar className={`text-[20px] ${showBestSellerOnly ? 'text-white' : 'text-accent'}`} />
                                    <span className="hidden sm:inline">{t('admin.bestSellerOnly')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Bulk Actions Bar */}
                        {selectedIds.size > 0 && (
                            <div className="bg-accent/10 border-b border-white/5 px-6 py-4 flex items-center justify-between animate-in slide-in-from-top duration-300">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center size-6 bg-accent text-white text-[10px] font-black rounded-full">{selectedIds.size}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{t('admin.selected')}</span>
                                    <button
                                        onClick={() => setSelectedIds(new Set())}
                                        className="text-[10px] text-white/40 hover:text-accent transition-colors font-black uppercase tracking-[0.2em] ml-2 underline"
                                    >
                                        {t('admin.deselectAll')}
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    {canEdit && (
                                        <button
                                            onClick={handleBulkRemoveTrending}
                                            disabled={isSubmittingBulk}
                                            className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-accent/30 transition-all border border-accent/30 disabled:opacity-50"
                                        >
                                            {isSubmittingBulk ? (
                                                <MdSync className="animate-spin text-[18px]" />
                                            ) : (
                                                <MdTrendingDown className="text-[18px]" />
                                            )}
                                            {t('admin.removeTrending')}
                                        </button>
                                    )}
                                    {canEdit && (
                                        <button
                                            onClick={() => handleBulkToggleBestSeller(false)}
                                            disabled={isSubmittingBulk}
                                            className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-accent/30 transition-all border border-accent/30 disabled:opacity-50"
                                        >
                                            {isSubmittingBulk ? (
                                                <MdSync className="animate-spin text-[18px]" />
                                            ) : (
                                                <MdStarOutline className="text-[18px]" />
                                            )}
                                            {t('admin.removeBestSeller')}
                                        </button>
                                    )}
                                    {canEdit && (
                                        <button
                                            onClick={handleBulkRemoveSale}
                                            disabled={isSubmittingBulk}
                                            className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-accent/30 transition-all border border-accent/30 disabled:opacity-50"
                                        >
                                            {isSubmittingBulk ? (
                                                <MdSync className="animate-spin text-[18px]" />
                                            ) : (
                                                <MdMoneyOff className="text-[18px]" />
                                            )}
                                            {t('admin.removeSale')}
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button
                                            onClick={handleBulkDelete}
                                            disabled={isSubmittingBulk}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all disabled:opacity-50"
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
                            </div>
                        )}

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="p-3 sm:p-5 w-10 sm:w-12 text-center">
                                            <input
                                                className="rounded border-white/10 bg-transparent text-accent focus:ring-accent size-3 sm:size-4 cursor-pointer"
                                                type="checkbox"
                                                checked={currentItems.length > 0 && currentItems.every(p => selectedIds.has(p.id))}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.productName')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.categoryName')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.priceValue')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.inventory')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.trending')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.bestSeller')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.statusValue')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {currentItems.length > 0 ? (
                                        currentItems.map((product) => (
                                            <tr key={product.id} className={`group hover:bg-white/[0.02] transition-colors ${selectedIds.has(product.id) ? 'bg-white/[0.04]' : ''}`}>
                                                <td className="p-3 sm:p-5 text-center px-3 sm:px-5">
                                                    <input
                                                        className="rounded border-white/10 bg-transparent text-accent focus:ring-accent size-3 sm:size-4 cursor-pointer"
                                                        type="checkbox"
                                                        checked={selectedIds.has(product.id)}
                                                        onChange={() => toggleSelectOne(product.id)}
                                                    />
                                                </td>
                                                <td className="p-3 sm:p-5">
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <div className="relative size-10 sm:size-12 rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden shrink-0">
                                                            <Image
                                                                src={product.images ? (product.images.includes(',') && !product.images.startsWith('http') ? product.images.split(',')[0].trim() : product.images.trim()) : '/placeholder.jpg'}
                                                                alt={product.name || 'Product Image'}
                                                                fill
                                                                className="object-cover"
                                                                sizes="48px"
                                                                unoptimized
                                                            />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="font-black text-white text-xs sm:text-sm line-clamp-1 uppercase tracking-tight">{product.name}</span>
                                                            <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">{t('admin.sku')}: {product.sku || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 sm:p-5">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-accent/10 text-accent border border-accent/20">
                                                            {product.category?.name || 'Uncategorized'}
                                                        </span>
                                                        {product.subCategory && (
                                                            <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 text-white/60 border border-white/10">
                                                                {product.subCategory.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3 sm:p-5 text-xs sm:text-sm font-black text-white">
                                                    {product.discountPrice !== null && product.discountPrice !== undefined ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-accent">${Number(product.discountPrice).toFixed(2)}</span>
                                                            <span className="text-[10px] text-white/20 line-through decoration-red-500/50">${Number(product.price).toFixed(2)}</span>
                                                        </div>
                                                    ) : (
                                                        <span>${Number(product.price).toFixed(2)}</span>
                                                    )}
                                                </td>
                                                <td className="p-3 sm:p-5">
                                                    <div className="flex flex-col gap-1 w-full max-w-[140px]">
                                                        <div className="flex flex-wrap items-center text-[10px] font-black uppercase tracking-[0.2em]">
                                                            <span className={`font-black ${Number(product.stock) === 0 ? 'text-red-500' :
                                                                Number(product.stock) <= 10 ? 'text-orange-500' :
                                                                    'text-accent'
                                                                }`}>
                                                                {Number(product.stock) === 0 ? t('admin.outOfStock') : `${product.stock} ${t('admin.inStock')}`}
                                                            </span>
                                                            {Number(product.stock) > 0 && Number(product.stock) <= 10 && (
                                                                <span className="text-orange-500 text-[10px] font-black uppercase ml-1 sm:ml-2">Low</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 sm:p-5">
                                                    <button
                                                        onClick={() => handleToggleTrending(product.id, product.isTrending)}
                                                        disabled={loadingMap[product.id]}
                                                        className={`p-1.5 rounded-xl transition-colors ${product.isTrending ? 'text-accent bg-accent/10 hover:bg-accent/20 border border-accent/20' : 'text-white/20 hover:text-accent hover:bg-white/5'}`}
                                                        title={product.isTrending ? "Remove from Trending" : "Mark as Trending"}
                                                    >
                                                        {loadingMap[product.id] ? (
                                                            <MdSync className="animate-spin text-[20px]" />
                                                        ) : (
                                                            <MdLocalFireDepartment className="text-[20px]" />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="p-3 sm:p-5">
                                                    <button
                                                        onClick={() => handleToggleBestSeller(product.id, product.bestSeller)}
                                                        disabled={loadingMap[product.id]}
                                                        className={`p-1.5 rounded-xl transition-colors ${product.bestSeller ? 'text-accent bg-accent/10 hover:bg-accent/20 border border-accent/20' : 'text-white/20 hover:text-accent hover:bg-white/5'}`}
                                                        title={product.bestSeller ? "Remove from Best Seller" : "Mark as Best Seller"}
                                                    >
                                                        {loadingMap[product.id] ? (
                                                            <MdSync className="animate-spin text-[20px]" />
                                                        ) : (
                                                            product.bestSeller ? <MdStar className="text-[20px]" /> : <MdStarOutline className="text-[20px]" />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="p-3 sm:p-5">
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] border ${Number(product.stock) > 0
                                                        ? 'bg-accent/10 text-accent border-accent/20'
                                                        : 'bg-white/[0.02] text-white/20 border-white/10'
                                                        }`}>
                                                        <span className={`size-1 sm:size-1.5 rounded-full ${Number(product.stock) > 0 ? 'bg-accent' : 'bg-white/20'}`}></span>
                                                        {Number(product.stock) > 0 ? t('admin.active') : t('admin.draft')}
                                                    </span>
                                                </td>
                                                <td className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                                                    <div className={`flex items-center ${dir === 'rtl' ? 'justify-start' : 'justify-end'} gap-1 sm:gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity`}>
                                                        {canEdit && (
                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="p-1.5 sm:p-2 text-white/40 hover:text-accent hover:bg-white/5 rounded-xl transition-colors" title={t('admin.editProduct')}
                                                            >
                                                                <MdEdit className="text-[18px] sm:text-[20px]" />
                                                            </button>
                                                        )}
                                                        {canDelete && (
                                                            <button
                                                                onClick={() => handleDelete(product.id, product.name)}
                                                                className="p-1.5 sm:p-2 text-white/40 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors" title={t('admin.deleteProduct')}
                                                            >
                                                                <MdDelete className="text-[18px] sm:text-[20px]" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="p-10 text-center text-white/20 italic uppercase tracking-[0.2em] text-[10px] font-black">
                                                {t('admin.noProductsMatch')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-3 sm:p-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 order-2 sm:order-1">
                                {t('admin.showingProducts')
                                    .replace('{start}', (startIndex + 1).toString())
                                    .replace('{end}', Math.min(startIndex + itemsPerPage, totalItems).toString())
                                    .replace('{total}', totalItems.toString())}
                            </span>
                            <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-1.5 sm:p-2 border border-white/5 rounded-xl text-white/20 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <MdChevronLeft className={`text-[18px] sm:text-[20px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                        let pageNum = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
                                        if (pageNum > totalPages) pageNum = totalPages - (Math.min(3, totalPages) - 1 - i);
                                        if (pageNum <= 0) return null;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`size-8 sm:size-9 flex items-center justify-center rounded-xl text-xs sm:text-sm font-black transition-all ${currentPage === pageNum
                                                    ? 'bg-accent text-white'
                                                    : 'border border-white/5 text-white/20 hover:bg-white/5'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 3 && currentPage < totalPages - 1 && (
                                        <>
                                            <span className="text-white/10 px-0.5 sm:px-1">...</span>
                                            <button
                                                onClick={() => handlePageChange(totalPages)}
                                                className={`size-8 sm:size-9 flex items-center justify-center rounded-xl border border-white/5 text-white/20 hover:bg-white/5 text-xs sm:text-sm font-black`}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-1.5 sm:p-2 border border-white/5 rounded-xl text-white/20 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <MdChevronRight className={`text-[18px] sm:text-[20px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
