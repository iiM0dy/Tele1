"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import FilterDrawer from './FilterDrawer';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductCard = dynamic(() => import('./ProductCard'), {
    loading: () => <ProductCardSkeleton />,
    ssr: true
});

export interface Product {
    id: string;
    Name: string;
    slug: string;
    Price: number;
    discountPrice: number | null;
    Images: string[];
    IsTrending: boolean;
    BestSeller: boolean;
    Stock: number;
    category: {
        name: string;
    } | null;
}

interface Brand {
    id: string;
    name: string;
    image: string;
    slug: string;
    description?: string | null;
}

interface Type {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
}

interface CollectionPageProps {
    products: Product[];
    collectionName: string;
    collectionNameAr?: string | null;
    totalPages: number;
    currentPage: number;
    categorySlug?: string;
    brandSlug?: string;
    subCategories?: Brand[];
    types?: Type[];
}

export default function CollectionPage({
    products,
    collectionName,
    collectionNameAr,
    totalPages,
    currentPage,
    categorySlug,
    brandSlug,
    subCategories,
    types
}: CollectionPageProps) {
    const { t, language } = useLanguage();
    const [sortBy, setSortBy] = useState('featured');
    const [layout, setLayout] = useState<'large' | 'medium' | 'compact'>('medium');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        inStockOnly: false,
        priceRange: { min: 0, max: 200000 }
    });

    const isAr = language === 'ar';
    const displayName = isAr && collectionNameAr ? collectionNameAr : collectionName;

    // Filtering and Sorting logic
    const processedProducts = useMemo(() => {
        let filtered = [...products];

        // Apply filters
        if (filters.inStockOnly) {
            filtered = filtered.filter(product => product.Stock > 0);
        }

        // Filter by price
        filtered = filtered.filter(product => {
            const price = product.discountPrice || product.Price;
            return price >= filters.priceRange.min && price <= filters.priceRange.max;
        });

        // Apply sorting
        switch (sortBy) {
            case 'best-selling':
                filtered.sort((a, b) => (b.BestSeller ? 1 : 0) - (a.BestSeller ? 1 : 0));
                break;
            case 'title-ascending':
                filtered.sort((a, b) => a.Name.localeCompare(b.Name));
                break;
            case 'title-descending':
                filtered.sort((a, b) => b.Name.localeCompare(a.Name));
                break;
            case 'price-ascending':
                filtered.sort((a, b) => (a.discountPrice || a.Price) - (b.discountPrice || b.Price));
                break;
            case 'price-descending':
                filtered.sort((a, b) => (b.discountPrice || b.Price) - (a.discountPrice || a.Price));
                break;
            case 'created-ascending':
                break;
            case 'created-descending':
                filtered.reverse();
                break;
            default:
                break;
        }
        return filtered;
    }, [products, sortBy, filters]);

    const getGridCols = () => {
        if (layout === 'large') return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        if (layout === 'medium') return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
        return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6';
    };

    // If we have types and we are currently on a Brand page (but not a Type page yet)
    if (brandSlug && types && types.length > 0) {
        return (
            <div className="flex flex-col min-h-screen bg-white pt-[90px]">
                <div className="w-full px-4 md:px-[48px] py-8">
                    <div className="flex flex-col items-center mb-16 relative">
                        <h1 className="text-[32px] md:text-[42px] font-sans font-black tracking-tighter text-[#0F172A] mb-4 text-center uppercase">{displayName}</h1>
                        <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase mb-4">{t('collection.chooseType')}</p>
                        <div className="w-20 h-1.5 bg-accent rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {types.map((type) => (
                            <Link href={`/collections/${categorySlug}/${brandSlug}/${type.slug}`} key={type.id} className="group block text-center">
                                <div className="relative aspect-square overflow-hidden rounded-full bg-gray-50 mb-6 border-2 border-transparent group-hover:border-accent transition-all p-4">
                                    <div className="w-full h-full relative overflow-hidden rounded-full">
                                        <Image
                                            src={type.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80'}
                                            alt={type.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-black text-[#0F172A] group-hover:text-accent transition-colors uppercase tracking-tight">{type.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // If we have brands and we are on a Category page (not inside a brand)
    if (!brandSlug && subCategories && subCategories.length > 0) {
        return (
            <div className="flex flex-col min-h-screen bg-white pt-[90px]">
                <div className="w-full px-4 md:px-[48px] py-8">
                    <div className="flex flex-col items-center mb-16 relative">
                        <h1 className="text-[32px] md:text-[42px] font-sans font-black tracking-tighter text-[#0F172A] mb-4 text-center uppercase">{displayName}</h1>
                        <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase mb-4">{t('collection.exploreBrands')}</p>
                        <div className="w-20 h-1.5 bg-accent rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {subCategories.map((sub) => (
                            <Link href={`/collections/${categorySlug}/${sub.slug}`} key={sub.id} className="group block">
                                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                                    <Image
                                        src={sub.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80'}
                                        alt={sub.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-center group-hover:text-accent transition-colors">{sub.name}</h3>
                                {sub.description && <p className="text-sm text-gray-500 text-center mt-1 line-clamp-2">{sub.description}</p>}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white pt-[90px]">
            {/* Sticky Toolbar */}
            <div className="sticky top-[90px] z-40 bg-white border-y border-zinc-100 collection-toolbar full-bleed mb-8">
                <div className="w-full px-4 md:px-[48px]">
                    <div className="flex items-center justify-between h-14 collection-toolbar__button-list">
                        {/* Layout Switchers (Moved to Left) */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Layout Switcher */}
                            <div className="collection-toolbar__layout-switch-list md:hidden flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setLayout('large')}
                                    className={`collection-toolbar__button p-1 transition-colors ${layout === 'large' ? 'is-active text-primary' : 'text-zinc-300'}`}
                                    aria-label="Switch to larger product images"
                                >
                                    <svg role="presentation" width="18" viewBox="0 0 18 18" fill="none">
                                        <path fill="currentColor" d="M0 0h18v18H0z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLayout('medium')}
                                    className={`collection-toolbar__button p-1 transition-colors ${layout === 'medium' ? 'is-active text-primary' : 'text-zinc-300'}`}
                                    aria-label="Switch to smaller product images"
                                >
                                    <svg role="presentation" width="18" viewBox="0 0 18 18" fill="none">
                                        <path fill="currentColor" d="M0 0h8v8H0zM0 10h8v8H0zM10 0h8v8h-8zM10 10h8v8h-8z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Desktop Layout Switcher */}
                            <div className="collection-toolbar__layout-switch-list hidden md:flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setLayout('large')}
                                    className={`collection-toolbar__button p-1 transition-colors ${layout === 'large' ? 'is-active text-black' : 'text-zinc-300'}`}
                                    aria-label="Switch to larger product images"
                                >
                                    <svg role="presentation" width="18" viewBox="0 0 18 18" fill="none">
                                        <path fill="currentColor" d="M0 0h8v8H0zM0 10h8v8H0zM10 0h8v8h-8zM10 10h8v8h-8z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLayout('medium')}
                                    className={`collection-toolbar__button p-1 transition-colors ${layout === 'medium' ? 'is-active text-black' : 'text-zinc-300'}`}
                                    aria-label="Switch to smaller product images"
                                >
                                    <svg role="presentation" width="18" viewBox="0 0 18 18" fill="none">
                                        <path fill="currentColor" d="M0 0h4v4H0zM0 7h4v4H0zM0 14h4v4H0zM7 0h4v4H7zM7 7h4v4H7zM7 14h4v4H7zM14 0h4v4h-4zM14 7h4v4h-4zM14 14h4v4h-4z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLayout('compact')}
                                    className={`collection-toolbar__button p-1 transition-colors ${layout === 'compact' ? 'is-active text-primary' : 'text-zinc-300'}`}
                                    aria-label="Switch to compact product images"
                                >
                                    <svg role="presentation" width="18" viewBox="0 0 18 18" fill="none">
                                        <path fill="currentColor" d="M0 0h18v2H0zm0 4h18v2H0zm0 4h18v2H0zm0 4h18v2H0zm0 4h18v2H0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Filter & Sort (Moved to Right) */}
                        <div className="flex items-center divide-x divide-zinc-100 grow md:grow-0 justify-end">
                            <div className="collection-toolbar__button-container relative flex-1 md:flex-none pr-8">
                                <button
                                    type="button"
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-zinc-500 transition-colors w-full collection-toolbar__button heading text-xxs"
                                    aria-haspopup="dialog"
                                >
                                    <span className="text-with-icon justify-center">
                                        {t('collection.sortBy')}
                                        <svg aria-hidden="true" focusable="false" fill="none" width="10" className="icon icon-chevron-down ml-2 inline-block transition-transform duration-300" style={{ transform: isSortOpen ? 'rotate(180deg)' : 'none' }} viewBox="0 0 10 10">
                                            <path d="m1 3 4 4 4-4" stroke="currentColor" strokeLinecap="square" />
                                        </svg>
                                    </span>
                                </button>

                                {isSortOpen && (
                                    <div id="sort-by-popover" className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-full md:w-56 bg-white border border-zinc-100 shadow-xl py-2 z-50 popover popover--bottom-end">
                                        <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-50 mb-2">{t('collection.sortBy')}</p>
                                        <div className="popover__value-list">
                                            {[
                                                { label: t('collection.sortOptions.featured'), value: 'featured' },
                                                { label: t('collection.sortOptions.bestSelling'), value: 'best-selling' },
                                                { label: t('collection.sortOptions.alphabeticallyAZ'), value: 'title-ascending' },
                                                { label: t('collection.sortOptions.alphabeticallyZA'), value: 'title-descending' },
                                                { label: t('collection.sortOptions.priceLowHigh'), value: 'price-ascending' },
                                                { label: t('collection.sortOptions.priceHighLow'), value: 'price-descending' },
                                                { label: t('collection.sortOptions.dateOldNew'), value: 'created-ascending' },
                                                { label: t('collection.sortOptions.dateNewOld'), value: 'created-descending' }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`popover-listbox__option group w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest transition-colors hover:bg-zinc-50 ${sortBy === option.value ? 'text-primary font-bold' : 'text-zinc-500'}`}
                                                >
                                                    <span className="reversed-link">{option.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="collection-toolbar__button-container flex-1 md:flex-none pl-8">
                                <button
                                    type="button"
                                    onClick={() => setIsFilterOpen(true)}
                                    className="text-[11px] font-bold uppercase tracking-widest hover:text-zinc-500 transition-colors w-full text-center md:text-left collection-toolbar__button heading text-xxs"
                                >
                                    {t('collection.filter')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={(newFilters) => setFilters(newFilters)}
            />

            {/* Product Grid */}
            <div className="grow pt-16 pb-24">
                <div className="w-full px-4 md:px-[48px]">
                    {processedProducts.length > 0 ? (
                        <>
                            <div className={`grid ${getGridCols()} gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16`}>
                                {processedProducts.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        hideInfo={layout === 'compact'}
                                        index={index}
                                        layout={layout}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-24 flex justify-center">
                                    <nav className="pagination flex items-center gap-4" role="navigation" aria-label={t('collection.pagination.navigation')}>
                                        {currentPage > 1 ? (
                                            <Link
                                                href={`/collections/${categorySlug || 'all'}?page=${currentPage - 1}`}
                                                className="pagination__link h6 flex items-center justify-center w-10 h-10 border border-zinc-100 hover:bg-zinc-50 transition-colors"
                                                aria-label={t('collection.pagination.previous')}
                                            >
                                                <svg aria-hidden="true" focusable="false" fill="none" width="11" className="icon icon-chevron-right rotate-180" viewBox="0 0 10 10">
                                                    <path d="m3 9 4-4-4-4" stroke="currentColor" strokeLinecap="square" />
                                                </svg>
                                            </Link>
                                        ) : null}

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            page === currentPage ? (
                                                <span
                                                    key={page}
                                                    className="pagination__link pagination__link--disabled h6 flex items-center justify-center w-10 h-10 bg-accent text-white font-bold text-[11px] uppercase tracking-widest rounded-lg"
                                                    aria-current="page"
                                                >
                                                    {page}
                                                </span>
                                            ) : (
                                                <Link
                                                    key={page}
                                                    href={`/collections/${categorySlug || 'all'}?page=${page}`}
                                                    className="pagination__link h6 flex items-center justify-center w-10 h-10 border border-zinc-100 hover:bg-accent/5 transition-colors text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-accent rounded-lg"
                                                    aria-label={t('collection.pagination.goToPage').replace('{page}', page.toString())}
                                                >
                                                    {page}
                                                </Link>
                                            )
                                        ))}

                                        {currentPage < totalPages ? (
                                            <Link
                                                href={`/collections/${categorySlug || 'all'}?page=${currentPage + 1}`}
                                                className="pagination__link h6 flex items-center justify-center w-10 h-10 border border-zinc-100 hover:bg-accent/5 transition-colors rounded-lg"
                                                aria-label={t('collection.pagination.next')}
                                                rel="next"
                                            >
                                                <svg aria-hidden="true" focusable="false" fill="none" width="11" className="icon icon-chevron-right" viewBox="0 0 10 10">
                                                    <path d="m3 9 4-4-4-4" stroke="currentColor" strokeLinecap="square" />
                                                </svg>
                                            </Link>
                                        ) : null}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <h3 className="text-xl font-bold text-[#0F172A] mb-2">{t('products.noProductsFound')}</h3>
                            <p className="text-zinc-500">{t('products.tryDifferentFilter')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}