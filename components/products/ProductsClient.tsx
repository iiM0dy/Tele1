"use client";

import React, { useState, useMemo, useEffect } from 'react';
import ProductGrid from '../home/ProductGrid';
import { LuFilter, LuX, LuChevronDown, LuArrowDownUp } from 'react-icons/lu';
import { useLanguage } from '@/app/context/LanguageContext';

interface Product {
    id: string;
    Name: string;
    slug: string;
    Price: any;
    discountPrice: any;
    Images: string[];
    IsTrending: boolean;
    BestSeller: boolean;
    Stock: number;
    category: {
        name: string;
        nameAr?: string | null;
    } | null;
}

interface ProductsClientProps {
    initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
    const { t, language } = useLanguage();
    const [cols, setCols] = useState(4);

    useEffect(() => {
        // Set default to 2 columns on mobile
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setCols(2);
        }
    }, []);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Sort state
    const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'best-seller'>('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Filter states
    const [availability, setAvailability] = useState<'all' | 'in-stock'>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 1000]);

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const price = Number(product.discountPrice || product.Price);
            const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
            const matchesAvailability = availability === 'all' || product.Stock > 0;
            return matchesPrice && matchesAvailability;
        });
    }, [initialProducts, priceRange, availability]);

    const sortedProducts = useMemo(() => {
        const products = [...filteredProducts];
        switch (sortBy) {
            case 'price-low':
                return products.sort((a, b) => Number(a.discountPrice || a.Price) - Number(b.discountPrice || b.Price));
            case 'price-high':
                return products.sort((a, b) => Number(b.discountPrice || b.Price) - Number(a.discountPrice || a.Price));
            case 'best-seller':
                return products.sort((a, b) => (b.BestSeller ? 1 : 0) - (a.BestSeller ? 1 : 0));
            default: // newest
                return products;
        }
    }, [filteredProducts, sortBy]);

    const handleApplyFilters = () => {
        setPriceRange(tempPriceRange);
        setIsFilterOpen(false);
    };

    return (
        <div className="relative">
            {/* Control Bar - Sticky */}
            <div className={`sticky top-[90px] z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4 transition-all duration-300`}>
                <div className="w-full px-4 md:px-[48px] flex justify-between items-center">
                    {/* Grid Controls (Left) */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <button
                            onClick={() => setCols(1)}
                            className={`p-2 rounded-lg transition-all md:hidden ${cols === 1 ? 'bg-primary text-white shadow-lg' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                        >
                            <div className="w-5 h-5 border-2 border-current rounded-sm" />
                        </button>
                        <button
                            onClick={() => setCols(2)}
                            className={`p-2 rounded-lg transition-all md:hidden ${cols === 2 ? 'bg-primary text-white shadow-lg' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                        >
                            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                                <div className="w-full h-full border border-current rounded-[1px]" />
                                <div className="w-full h-full border border-current rounded-[1px]" />
                            </div>
                        </button>
                        <button
                            onClick={() => setCols(3)}
                            className={`p-2 rounded-lg transition-all hidden md:block ${cols === 3 ? 'bg-primary text-white shadow-lg' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                        >
                            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                                <div className="w-full h-full bg-current rounded-sm" />
                                <div className="w-full h-full bg-current rounded-sm" />
                                <div className="w-full h-full bg-current rounded-sm" />
                                <div className="w-full h-full bg-current rounded-sm" />
                            </div>
                        </button>
                        <button
                            onClick={() => setCols(4)}
                            className={`p-2 rounded-lg transition-all hidden md:block ${cols === 4 ? 'bg-primary text-white shadow-lg' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                        >
                            <div className="grid grid-cols-3 gap-0.5 w-5 h-5 items-center">
                                <div className="w-1 h-1 bg-current rounded-full" />
                                <div className="w-1 h-1 bg-current rounded-full" />
                                <div className="w-1 h-1 bg-current rounded-full" />
                                <div className="w-1 h-1 bg-current rounded-full" />
                                <div className="w-1 h-1 bg-current rounded-full" />
                                <div className="w-1 h-1 bg-current rounded-full" />
                                <div className="w-1 h-1 bg-current rounded-full" />
                                <div className="w-1 h-1 bg-current rounded-full" />
                                <div className="w-1 h-1 bg-current rounded-full" />
                            </div>
                        </button>
                        <button
                            onClick={() => setCols(6)}
                            className={`p-2 rounded-lg transition-all hidden md:block ${cols === 6 ? 'bg-primary text-white shadow-lg' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                        >
                            <div className="grid grid-cols-3 gap-0.5 w-5 h-5">
                                <div className="w-full h-full border border-current rounded-[1px]" />
                                <div className="w-full h-full border border-current rounded-[1px]" />
                                <div className="w-full h-full border border-current rounded-[1px]" />
                                <div className="w-full h-full border border-current rounded-[1px]" />
                                <div className="w-full h-full border border-current rounded-[1px]" />
                                <div className="w-full h-full border border-current rounded-[1px]" />
                            </div>
                        </button>
                    </div>

                    {/* Right Controls (Sort & Filter) */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 text-primary border border-zinc-100 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-95"
                            >
                                <LuArrowDownUp className="w-4 h-4" />
                                <span className="hidden md:inline">{t('products.sortBy') || 'Sort By'}</span>
                                <LuChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSortOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsSortOpen(false)}
                                    />
                                    <div className={`absolute top-full mt-2 ${language === 'ar' ? 'left-0' : 'right-0'} w-48 bg-white rounded-2xl shadow-2xl border border-zinc-100 py-2 z-20 animate-in fade-in slide-in-from-top-2`}>
                                        {[
                                            { id: 'newest', label: t('products.newestArrivals') || 'Newest' },
                                            { id: 'price-low', label: t('products.priceLowHigh') || 'Price: Low to High' },
                                            { id: 'price-high', label: t('products.priceHighLow') || 'Price: High to Low' },
                                            { id: 'best-seller', label: t('products.bestSellers') || 'Best Sellers' }
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    setSortBy(option.id as any);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`w-full px-5 py-3 text-[11px] font-bold text-left uppercase tracking-wider transition-colors hover:bg-zinc-50 ${sortBy === option.id ? 'text-accent' : 'text-primary'} ${language === 'ar' ? 'text-right' : 'text-left'}`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-xl shadow-black/10"
                        >
                            <LuFilter className="w-4 h-4" />
                            <span className="hidden md:inline">{t('common.filter') || 'Filter'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Grid or Empty State */}
            <div className="w-full px-4 md:px-[48px] min-h-[60vh]">
                {sortedProducts.length > 0 ? (
                    <ProductGrid
                        products={sortedProducts}
                        cols={cols}
                        hideInfo={cols === 6}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-zinc-50 rounded-3xl flex items-center justify-center mb-8 text-zinc-300 rotate-12 transition-transform hover:rotate-0 duration-500">
                            <LuFilter className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-primary mb-3">
                            {t('products.noProducts') || 'No Products Found'}
                        </h3>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto font-medium">
                            Try adjusting your filters to find what you&apos;re looking for.
                        </p>
                        <button
                            onClick={() => {
                                setAvailability('all');
                                setPriceRange([0, 1000]);
                                setTempPriceRange([0, 1000]);
                            }}
                            className="mt-10 px-8 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary transition-all active:scale-95 shadow-xl shadow-black/10"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Filter Sidebar (Drawer) */}
            <div
                className={`fixed inset-0 z-100 transition-visibility duration-300 ${isFilterOpen ? 'visible' : 'invisible'}`}
            >
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsFilterOpen(false)}
                />

                {/* Content */}
                <div
                    className={`absolute top-0 bottom-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-full max-w-[400px] bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isFilterOpen ? 'translate-x-0' : (language === 'ar' ? '-translate-x-full' : 'translate-x-full')}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                        <h2 className="text-xl font-black uppercase tracking-tighter text-primary">
                            {t('common.filter') || 'Filter'}
                        </h2>
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                            <LuX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Filter Sections */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-12">
                        {/* Availability */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                                {t('common.availability') || 'Availability'}
                            </h3>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="availability"
                                        checked={availability === 'all'}
                                        onChange={() => setAvailability('all')}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${availability === 'all' ? 'border-accent bg-accent' : 'border-zinc-200 group-hover:border-accent'}`}>
                                        <div className={`w-2 h-2 rounded-full bg-white transition-transform ${availability === 'all' ? 'scale-100' : 'scale-0'}`} />
                                    </div>
                                    <span className={`text-[13px] font-bold uppercase tracking-wider transition-colors ${availability === 'all' ? 'text-primary' : 'text-zinc-500'}`}>
                                        {t('common.all') || 'All'}
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="availability"
                                        checked={availability === 'in-stock'}
                                        onChange={() => setAvailability('in-stock')}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${availability === 'in-stock' ? 'border-accent bg-accent' : 'border-zinc-200 group-hover:border-accent'}`}>
                                        <div className={`w-2 h-2 rounded-full bg-white transition-transform ${availability === 'in-stock' ? 'scale-100' : 'scale-0'}`} />
                                    </div>
                                    <span className={`text-[13px] font-bold uppercase tracking-wider transition-colors ${availability === 'in-stock' ? 'text-primary' : 'text-zinc-500'}`}>
                                        {t('common.inStock') || 'In Stock Only'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                                    {t('common.price') || 'Price'}
                                </h3>
                                <span className="text-[11px] font-black text-accent bg-accent/5 px-2 py-1 rounded-md">
                                    ${tempPriceRange[0]} - ${tempPriceRange[1]}
                                </span>
                            </div>

                            <div className="space-y-8 px-2">
                                <div className="relative h-1.5 bg-zinc-100 rounded-full">
                                    <div
                                        className="absolute h-full bg-accent rounded-full"
                                        style={{
                                            left: `${(tempPriceRange[0] / 2000) * 100}%`,
                                            right: `${100 - (tempPriceRange[1] / 2000) * 100}%`
                                        }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="2000"
                                        value={tempPriceRange[0]}
                                        onChange={(e) => setTempPriceRange([Number(e.target.value), tempPriceRange[1]])}
                                        className="absolute top-1/2 -translate-y-1/2 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="2000"
                                        value={tempPriceRange[1]}
                                        onChange={(e) => setTempPriceRange([tempPriceRange[0], Number(e.target.value)])}
                                        className="absolute top-1/2 -translate-y-1/2 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {/* Custom thumbs */}
                                    <div
                                        className="absolute w-5 h-5 bg-white border-2 border-accent rounded-full top-1/2 -translate-y-1/2 -ml-2.5 shadow-md pointer-events-none"
                                        style={{ left: `${(tempPriceRange[0] / 2000) * 100}%` }}
                                    />
                                    <div
                                        className="absolute w-5 h-5 bg-white border-2 border-accent rounded-full top-1/2 -translate-y-1/2 -ml-2.5 shadow-md pointer-events-none"
                                        style={{ left: `${(tempPriceRange[1] / 2000) * 100}%` }}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1 space-y-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Min Price</span>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                                            <input
                                                type="number"
                                                value={tempPriceRange[0]}
                                                onChange={(e) => setTempPriceRange([Number(e.target.value), tempPriceRange[1]])}
                                                className="w-full pl-6 pr-3 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Max Price</span>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">$</span>
                                            <input
                                                type="number"
                                                value={tempPriceRange[1]}
                                                onChange={(e) => setTempPriceRange([tempPriceRange[0], Number(e.target.value)])}
                                                className="w-full pl-6 pr-3 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-accent/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
                        <button
                            onClick={handleApplyFilters}
                            className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-accent transition-all active:scale-[0.98] shadow-2xl shadow-primary/20"
                        >
                            {t('common.viewResults') || 'View Results'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
