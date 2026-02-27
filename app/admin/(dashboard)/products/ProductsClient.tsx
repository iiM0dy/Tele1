"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
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

const AddProductModal = dynamic(() => import("./AddProductModal"), {
    ssr: false,
    loading: () => null
});

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
    color?: string | null;
    model?: string | null;
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

    const canDelete = true; // session?.user?.role === 'SUPER_ADMIN' || session?.user?.canDeleteProducts;
    const canEdit = true; // session?.user?.role === 'SUPER_ADMIN' || session?.user?.canManageProducts;

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
                t('admin.name'),
                t('admin.category'),
                t('admin.brand'),
                t('admin.type'),
                t('admin.model'),
                t('admin.color'),
                t('admin.description'),
                t('admin.quantity'),
                t('admin.price'),
                t('admin.sku'),
                t('admin.images')
            ];

            // Prepare data rows
            const rows = exportData.map((p: any) => [
                `"${p.name.replace(/"/g, '""')}"`,
                `"${(p.category || 'Uncategorized').replace(/"/g, '""')}"`,
                `"${(p.brand || '').replace(/"/g, '""')}"`,
                `"${(p.type || '').replace(/"/g, '""')}"`,
                `"${(p.model || '').replace(/"/g, '""')}"`,
                `"${(p.color || '').replace(/"/g, '""')}"`,
                `"${(p.description || '').replace(/"/g, '""')}"`,
                p.stock,
                p.price,
                `"${(p.sku || '').replace(/"/g, '""')}"`,
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
                [t('admin.name')]: p.name,
                [t('admin.category')]: p.category || t('admin.uncategorized'),
                [t('admin.brand')]: p.brand || '',
                [t('admin.type')]: p.type || '',
                [t('admin.model')]: p.model || '',
                [t('admin.color')]: p.color || '',
                [t('admin.description')]: p.description || '',
                [t('admin.quantity')]: p.stock,
                [t('admin.price')]: p.price,
                [t('admin.sku')]: p.sku || '',
                [t('admin.images')]: p.images || ''
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

                    // Simple CSV parsing that handles quotes
                    const parseCSVLine = (line: string) => {
                        const result = [];
                        let cur = "";
                        let inQuotes = false;
                        for (let i = 0; i < line.length; i++) {
                            const char = line[i];
                            if (char === '"') {
                                inQuotes = !inQuotes;
                            } else if (char === ',' && !inQuotes) {
                                result.push(cur.trim());
                                cur = "";
                            } else {
                                cur += char;
                            }
                        }
                        result.push(cur.trim());
                        return result;
                    };

                    const headers = parseCSVLine(lines[0]);
                    data = lines.slice(1).filter(line => line.trim()).map(line => {
                        const values = parseCSVLine(line);
                        const obj: any = {};
                        headers.forEach((header, i) => {
                            if (header) obj[header] = values[i];
                        });
                        return obj;
                    });
                } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
                    const XLSX = await import('xlsx');
                    const arrayBuffer = event.target?.result as ArrayBuffer;
                    const wb = XLSX.read(arrayBuffer, { type: 'array' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    data = XLSX.utils.sheet_to_json(ws);
                }

                if (!data || data.length === 0) {
                    toast.error(t('admin.fileEmpty'));
                    return;
                }

                // Normalize data keys to match what server expects (case-insensitive and map common translations)
                const normalizedData = data.map(item => {
                    const normalized: any = {};
                    Object.keys(item).forEach(key => {
                        const value = item[key];
                        const k = key.trim().toLowerCase();

                        // Map various header names to the canonical ones
                        if (k === 'name' || k === t('admin.name').toLowerCase() || k === 'product name' || k === 'الاسم' || k === 'اسم المنتج') {
                            normalized.Name = value;
                        } else if (k === 'description' || k === 'الوصف' || k === t('admin.description').toLowerCase()) {
                            normalized.Description = value;
                        } else if (k === 'price' || k === 'السعر' || k === t('admin.price').toLowerCase()) {
                            normalized.Price = value;
                        } else if (k === 'sku' || k === 'sku code' || k === 'رمز المنتج' || k === t('admin.sku').toLowerCase()) {
                            normalized.SKU = value;
                        } else if (k === 'category' || k === 'الفئة' || k === 'القسم' || k === t('admin.category').toLowerCase()) {
                            normalized.Category = value;
                        } else if (k === 'sub category' || k === 'subcategory' || k === 'brand' || k === 'الماركة' || k === 'البراند' || k === t('admin.subCategory').toLowerCase() || k === 'brand') {
                            normalized.Brand = value;
                        } else if (k === 'type' || k === 'النوع' || k === 'نوع المنتج') {
                            normalized.Type = value;
                        } else if (k === 'images' || k === 'الصور' || k === t('admin.images').toLowerCase()) {
                            normalized.Images = value;
                        } else if (k === 'color' || k === 'اللون') {
                            normalized.color = value;
                        } else if (k === 'model' || k === 'الموديل') {
                            normalized.model = value;
                        } else if (k === 'qty' || k === 'quantity' || k === 'stock' || k === 'المخزون' || k === 'الكمية' || k === t('admin.addProductModal.stockQuantity').toLowerCase()) {
                            normalized.Stock = value;
                        } else if (k === 'is trending' || k === 'trending' || k === 'رائج') {
                            normalized.IsTrending = value;
                        } else if (k === 'best seller' || k === 'best sellers' || k === 'الأكثر مبيعاً' || k === 'الأكثر مبيعا') {
                            normalized.BestSeller = value;
                        } else if (k === 'discount price' || k === 'سعر الخصم') {
                            normalized.DiscountPrice = value;
                        } else if (k === 'discount type' || k === 'نوع الخصم') {
                            normalized.DiscountType = value;
                        } else if (k === 'discount value' || k === 'قيمة الخصم') {
                            normalized.DiscountValue = value;
                        } else if (k === 'badge' || k === 'شارة') {
                            normalized.Badge = value;
                        } else {
                            // Keep other keys as is
                            normalized[key] = value;
                        }
                    });
                    return normalized;
                });

                const result = await bulkCreateProducts(normalizedData);
                if (result.success) {
                    toast.success(t('admin.importSuccess').replace('{count}', result.count?.toString() || '0'));
                    router.refresh();
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
            reader.readAsArrayBuffer(file);
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

                            <h2 className="text-3xl font-black text-white tracking-tight uppercase">{t('admin.products')}</h2>
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.manageCatalog')}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="bg-white/[0.02] border border-white/5 hover:bg-white/5 text-white h-12 px-6 rounded-2xl font-black text-[11px] tracking-wider flex items-center gap-2 transition-all shadow-sm hover:border-accent/30"
                                    aria-label="Export data options"
                                    aria-expanded={showExportMenu}
                                    aria-haspopup="true"
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
                            <label className="bg-white/2 border border-white/5 hover:bg-white/5 text-white h-12 px-6 rounded-2xl font-black text-[11px] tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer hover:border-accent/30 disabled:opacity-50">
                                {isSubmittingBulk ? (
                                    <MdSync className="text-[20px] text-accent animate-spin" />
                                ) : (
                                    <MdFileDownload className="text-[20px] text-accent" />
                                )}
                                {isSubmittingBulk ? t('admin.importing') || "Importing..." : t('admin.importData')}
                                <input
                                    type="file"
                                    accept=".csv, .xlsx, .xls"
                                    className="hidden"
                                    onChange={handleImportFile}
                                    disabled={isSubmittingBulk}
                                    aria-label="Import products from file"
                                />
                            </label>
                            {canEdit && (
                                <button
                                    onClick={() => {
                                        setSelectedProduct(null);
                                        setIsAddModalOpen(true);
                                    }}
                                    className="bg-accent hover:bg-accent/90 text-white h-12 px-6 rounded-2xl font-black text-[11px] tracking-wider flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
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
                        <div className="bg-white/2 p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1 min-h-[90px]">
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.totalProducts')}</p>
                            <p className="text-2xl font-black text-white tracking-tight">{stats.total.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/2 p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1 min-h-[90px]">
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.trending')}</p>
                            <p className="text-2xl font-black text-accent tracking-tight">{products.filter(p => p.isTrending).length}</p>
                        </div>
                        <div className="bg-white/2 p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1 min-h-[90px]">
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.outOfStock')}</p>
                            <p className="text-2xl font-black text-red-500 tracking-tight">{stats.outOfStock.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/2 p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1 min-h-[90px]">
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.lowInventory')}</p>
                            <p className="text-2xl font-black text-orange-500 tracking-tight">{stats.lowStock.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/2 p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1 min-h-[90px]">
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.categories')}</p>
                            <p className="text-2xl font-black text-white tracking-tight">{stats.categories.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/2 p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm flex flex-col gap-1 min-h-[90px]">
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">{t('admin.bestSeller')}</p>
                            <p className="text-2xl font-black text-accent tracking-tight">{stats.bestSellers.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Filters & Table Container */}
                    <div className="bg-white/2 border border-white/5 rounded-3xl shadow-sm overflow-hidden">
                        {/* Toolbar */}
                        <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                            <div className="relative w-full lg:w-80">
                                <span className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                    <MdSearch className="text-accent text-[20px]" />
                                </span>
                                <input
                                    className={`block w-full ${dir === 'rtl' ? 'pr-12 pl-3' : 'pl-12 pr-3'} py-3 border border-white/5 rounded-2xl bg-white/2 text-[13px] font-medium tracking-normal text-white placeholder-white/20 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all outline-none`}
                                    placeholder={t('admin.searchPlaceholder')}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search products"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Category Filter */}
                                <div className="relative flex-1 sm:flex-initial">
                                    <select
                                        className={`appearance-none w-full ${dir === 'rtl' ? 'pr-3 pl-10' : 'pl-3 pr-10'} py-3 bg-white/2 border border-white/5 rounded-2xl text-[12px] font-medium tracking-normal text-white focus:ring-1 focus:ring-accent/20 focus:border-accent/30 hover:border-accent/30 cursor-pointer min-w-[140px] outline-none transition-all`}
                                        value={selectedCategory}
                                        onChange={(e) => updateUrl({ category: e.target.value })}
                                        aria-label="Filter by category"
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
                                        className={`appearance-none w-full ${dir === 'rtl' ? 'pr-3 pl-10' : 'pl-3 pr-10'} py-3 bg-white/2 border border-white/5 rounded-2xl text-[12px] font-medium tracking-normal text-white focus:ring-1 focus:ring-accent/20 focus:border-accent/30 hover:border-accent/30 cursor-pointer min-w-[140px] outline-none transition-all`}
                                        value={selectedStockStatus}
                                        onChange={(e) => updateUrl({ stock: e.target.value })}
                                        aria-label="Filter by stock status"
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
                                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-semibold tracking-wider transition-all ${showTrendingOnly
                                        ? 'bg-accent text-white'
                                        : 'bg-white/2 border border-white/5 text-white hover:border-accent/30 hover:text-accent'
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
                                        : 'bg-white/2 border border-white/5 text-white hover:border-accent/30 hover:text-accent'
                                        }`}
                                >
                                    <MdStar className={`text-[20px] ${showBestSellerOnly ? 'text-white' : 'text-accent'}`} />
                                    <span className="hidden sm:inline">{t('admin.bestSellerOnly')}</span>
                                </button>
                            </div>
                        </div >

                        {/* Bulk Actions Bar */}
                        {
                            selectedIds.size > 0 && (
                                <div className="bg-accent/10 border-b border-white/5 px-6 py-4 flex items-center justify-between animate-in slide-in-from-top duration-300">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center size-6 bg-accent text-white text-[10px] font-black rounded-full">{selectedIds.size}</span>
                                        <span className="text-[11px] font-semibold tracking-wider text-white">{t('admin.selected')}</span>
                                        <button
                                            onClick={() => setSelectedIds(new Set())}
                                            className="text-[11px] text-white/40 hover:text-accent transition-colors font-semibold tracking-wider ml-2 underline"
                                        >
                                            {t('admin.deselectAll')}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {canEdit && (
                                            <button
                                                onClick={handleBulkRemoveTrending}
                                                disabled={isSubmittingBulk}
                                                className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent text-[11px] font-semibold tracking-wider rounded-xl hover:bg-accent/30 transition-all border border-accent/30 disabled:opacity-50"
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
                            )
                        }

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-bold text-white/40 tracking-wider">
                                    <tr>
                                        <th className="p-3 sm:p-5 w-10 sm:w-12 text-center">
                                            <input
                                                className="rounded border-white/10 bg-transparent text-accent focus:ring-accent size-3 sm:size-4 cursor-pointer"
                                                type="checkbox"
                                                checked={currentItems.length > 0 && currentItems.every(p => selectedIds.has(p.id))}
                                                onChange={toggleSelectAll}
                                                aria-label="Select all products"
                                            />
                                        </th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.productName')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.categoryName')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.priceValue')}</th>
                                        <th className={`p-3 sm:p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.addProductModal.stockQuantity') || "Quantity"}</th>
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
                                                        aria-label={`Select product ${product.name}`}
                                                    />
                                                </td>
                                                <td className="p-3 sm:p-5">
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <div className="relative size-10 sm:size-12 rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden shrink-0">
                                                            <Image
                                                                src={(() => {
                                                                    if (!product.images) return '/placeholder.jpg';
                                                                    try {
                                                                        const imgStr = product.images.trim();
                                                                        if (imgStr.startsWith('[') && imgStr.endsWith(']')) {
                                                                            const parsed = JSON.parse(imgStr);
                                                                            if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].trim();
                                                                        }
                                                                    } catch (e) { }
                                                                    return product.images.split(',')[0].trim() || '/placeholder.jpg';
                                                                })()}
                                                                alt={product.name || 'Product Image'}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized={product.images?.includes('postimg.cc') || product.images?.includes('postimg.org')}
                                                                sizes="(max-width: 640px) 40px, 48px"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="font-semibold text-white text-xs sm:text-sm line-clamp-1 tracking-tight">{product.name}</span>
                                                            <div className="flex flex-wrap gap-x-2 gap-y-1">
                                                                <span className="text-[10px] text-white/60 font-semibold tracking-wider">{t('admin.sku')}: {product.sku || 'N/A'}</span>
                                                                {product.color && (
                                                                    <span className="text-[10px] text-accent font-semibold tracking-wider">| {product.color}</span>
                                                                )}
                                                                {product.model && (
                                                                    <span className="text-[10px] text-white/40 font-semibold tracking-wider">| {product.model}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 sm:p-5">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] font-bold tracking-wider bg-accent/10 text-accent border border-accent/20">
                                                            {product.category?.name || 'Uncategorized'}
                                                        </span>
                                                        {product.subCategory && (
                                                            <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] font-bold tracking-wider bg-white/10 text-white/60 border border-white/10">
                                                                {product.subCategory.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3 sm:p-5 text-xs sm:text-sm font-black text-white">
                                                    {product.discountPrice !== null && product.discountPrice !== undefined ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-accent">${Number(product.discountPrice).toFixed(2)}</span>
                                                            <span className="text-[10px] text-white/40 line-through decoration-red-500/50">${Number(product.price).toFixed(2)}</span>
                                                        </div>
                                                    ) : (
                                                        <span>${Number(product.price).toFixed(2)}</span>
                                                    )}
                                                </td>
                                                <td className="p-3 sm:p-5">
                                                    <div className="flex flex-col gap-1 w-full max-w-[140px]">
                                                        <div className="flex flex-wrap items-center text-[10px] font-bold tracking-wider">
                                                            <span className={`font-black ${Number(product.stock) === 0 ? 'text-red-500' :
                                                                Number(product.stock) <= 10 ? 'text-orange-500' :
                                                                    'text-accent'
                                                                }`}>
                                                                {Number(product.stock) === 0 ? t('admin.outOfStock') : `${product.stock} ${t('admin.inStock')}`}
                                                            </span>
                                                            {Number(product.stock) > 0 && Number(product.stock) <= 10 && (
                                                                <span className="text-orange-500 text-[10px] font-bold ml-1 sm:ml-2">Low</span>
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
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider border ${Number(product.stock) > 0
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
                    </div >
                </div >
            </div >
        </div >
    );
}
