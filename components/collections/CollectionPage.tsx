"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import FilterDrawer from './FilterDrawer';

interface Product {
    id: string;
    Name: string;
    slug: string;
    Price: number;
    discountPrice: number | null;
    Images: string[];
    supImage1?: string | null;
    supImage2?: string | null;
    IsTrending: boolean;
    BestSeller: boolean;
    Stock: number;
    category: {
        name: string;
    } | null;
}

interface CollectionPageProps {
    products: Product[];
    collectionName: string;
    totalPages: number;
    currentPage: number;
    categorySlug?: string;
}

export default function CollectionPage({ products, collectionName, totalPages, currentPage, categorySlug }: CollectionPageProps) {
    const { t } = useLanguage();
    const [sortBy, setSortBy] = useState('featured');
    const [layout, setLayout] = useState<'large' | 'medium' | 'compact'>('medium');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        inStockOnly: false,
        priceRange: { min: 0, max: 10000 }
    });

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
                return filtered.sort((a, b) => (b.BestSeller ? 1 : 0) - (a.BestSeller ? 1 : 0));
            case 'title-ascending':
                return filtered.sort((a, b) => a.Name.localeCompare(b.Name));
            case 'title-descending':
                return filtered.sort((a, b) => b.Name.localeCompare(a.Name));
            case 'price-ascending':
                return filtered.sort((a, b) => (a.discountPrice || a.Price) - (b.discountPrice || b.Price));
            case 'price-descending':
                return filtered.sort((a, b) => (b.discountPrice || b.Price) - (a.discountPrice || a.Price));
            case 'created-ascending':
                return filtered;
            case 'created-descending':
                return filtered.reverse();
            default:
                return filtered;
        }
    }, [products, sortBy, filters]);

    const getGridCols = () => {
        if (layout === 'large') return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        if (layout === 'medium') return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
        return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6';
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Sticky Toolbar */}
            <div className="sticky top-[107px] z-40 bg-white border-y border-zinc-100 collection-toolbar full-bleed mt-[107px]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-14 collection-toolbar__button-list">
                        {/* Layout Switchers (Moved to Left) */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Layout Switcher */}
                            <div className="collection-toolbar__layout-switch-list md:hidden flex items-center gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setLayout('large')}
                                    className={`collection-toolbar__button p-1 transition-colors ${layout === 'large' ? 'is-active text-black' : 'text-zinc-300'}`}
                                    aria-label="Switch to larger product images"
                                >
                                    <svg role="presentation" width="18" viewBox="0 0 18 18" fill="none">
                                        <path fill="currentColor" d="M0 0h18v18H0z" />
                                    </svg>
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setLayout('medium')}
                                    className={`collection-toolbar__button p-1 transition-colors ${layout === 'medium' ? 'is-active text-black' : 'text-zinc-300'}`}
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
                                    className={`collection-toolbar__button p-1 transition-colors ${layout === 'compact' ? 'is-active text-black' : 'text-zinc-300'}`}
                                    aria-label="Switch to compact product images"
                                >
                                    <svg role="presentation" width="18" viewBox="0 0 18 18" fill="none">
                                        <path fill="currentColor" d="M0 0h18v2H0zm0 4h18v2H0zm0 4h18v2H0zm0 4h18v2H0zm0 4h18v2H0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Filter & Sort (Moved to Right) */}
                        <div className="flex items-center divide-x divide-zinc-100 flex-grow md:flex-grow-0 justify-end">
                            <div className="collection-toolbar__button-container relative flex-1 md:flex-none pr-8">
                                <button 
                                    type="button"
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center justify-center md:justify-start gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-zinc-500 transition-colors w-full collection-toolbar__button heading text-xxs"
                                    aria-haspopup="dialog"
                                >
                                    <span className="text-with-icon justify-center">
                                        Sort by
                                        <svg aria-hidden="true" focusable="false" fill="none" width="10" className="icon icon-chevron-down ml-2 inline-block transition-transform duration-300" style={{ transform: isSortOpen ? 'rotate(180deg)' : 'none' }} viewBox="0 0 10 10">
                                            <path d="m1 3 4 4 4-4" stroke="currentColor" strokeLinecap="square" />
                                        </svg>
                                    </span>
                                </button>

                                {isSortOpen && (
                                    <div id="sort-by-popover" className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-full md:w-56 bg-white border border-zinc-100 shadow-xl py-2 z-50 popover popover--bottom-end">
                                        <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-50 mb-2">Sort by</p>
                                        <div className="popover__value-list">
                                            {[
                                                { label: 'Featured', value: 'featured' },
                                                { label: 'Best selling', value: 'best-selling' },
                                                { label: 'Alphabetically, A-Z', value: 'title-ascending' },
                                                { label: 'Alphabetically, Z-A', value: 'title-descending' },
                                                { label: 'Price, low to high', value: 'price-ascending' },
                                                { label: 'Price, high to low', value: 'price-descending' },
                                                { label: 'Date, old to new', value: 'created-ascending' },
                                                { label: 'Date, new to old', value: 'created-descending' }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`popover-listbox__option group w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest transition-colors hover:bg-zinc-50 ${sortBy === option.value ? 'text-black font-bold' : 'text-zinc-500'}`}
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
                                    Filter
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
            <div className="flex-grow pt-12 pb-24">
                <div className="container mx-auto px-4 md:px-6">
                    {processedProducts.length > 0 ? (
                        <>
                            <div className={`grid ${getGridCols()} gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16`}>
                                {processedProducts.map((product) => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        hideInfo={layout === 'compact'}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-24 flex justify-center">
                                    <nav className="pagination flex items-center gap-4" role="navigation" aria-label="Pagination navigation">
                                        {currentPage > 1 ? (
                                            <Link 
                                                href={`/collections/${categorySlug || 'all'}?page=${currentPage - 1}`}
                                                className="pagination__link h6 flex items-center justify-center w-10 h-10 border border-zinc-100 hover:bg-zinc-50 transition-colors"
                                                aria-label="Go to previous page"
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
                                                    className="pagination__link pagination__link--disabled h6 flex items-center justify-center w-10 h-10 bg-black text-white font-bold text-[11px] uppercase tracking-widest" 
                                                    aria-current="page"
                                                >
                                                    {page}
                                                </span>
                                            ) : (
                                                <Link 
                                                    key={page}
                                                    href={`/collections/${categorySlug || 'all'}?page=${page}`}
                                                    className="pagination__link h6 flex items-center justify-center w-10 h-10 border border-zinc-100 hover:bg-zinc-50 transition-colors text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black"
                                                    aria-label={`Go to page ${page}`}
                                                >
                                                    {page}
                                                </Link>
                                            )
                                        ))}

                                        {currentPage < totalPages ? (
                                            <Link 
                                                href={`/collections/${categorySlug || 'all'}?page=${currentPage + 1}`}
                                                className="pagination__link h6 flex items-center justify-center w-10 h-10 border border-zinc-100 hover:bg-zinc-50 transition-colors"
                                                aria-label={`Go to page ${currentPage + 1}`}
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
                            <h3 className="text-[24px] font-normal uppercase tracking-[0.2em] text-[#121212] mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                                No products found
                            </h3>
                            <p className="text-[14px] text-zinc-500 mb-8 uppercase tracking-widest">
                                Try adjusting your filters or search criteria.
                            </p>
                            <button 
                                onClick={() => setFilters({ inStockOnly: false, priceRange: { min: 0, max: 10000 } })}
                                className="px-8 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductCard({ product, hideInfo }: { product: Product, hideInfo?: boolean }) {
    const { t } = useLanguage();
    const { addItem } = useCart();

    const images = [...(product.Images || [])];
    
    // Include supplemental images if not already present
    [product.supImage1, product.supImage2].forEach(s => {
        if (s && typeof s === 'string' && s.trim() !== '') {
            const trimmed = s.trim();
            const formatted = (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:'))
                ? trimmed
                : '/' + trimmed;
            if (!images.includes(formatted)) images.push(formatted);
        }
    });

    const mainImage = images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800';
    const price = Number(product.Price);
    const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            id: product.id,
            name: product.Name,
            price: discountPrice || price,
            image: mainImage,
            quantity: 1,
            slug: product.slug
        });
        toast.success(t('products.addToCartSuccess') || 'Added to cart');
    };

    return (
        <Link href={`/products/${product.slug}`} className="group flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 mb-6 max-h-[280px]">
                <Image
                    src={mainImage}
                    alt={product.Name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-0 flex flex-col gap-1">
                    {product.BestSeller && (
                        <div className="bg-black text-white text-[8px] font-bold px-3 py-1 uppercase tracking-[0.2em]">
                            best seller
                        </div>
                    )}
                    {product.IsTrending && !product.BestSeller && (
                        <div className="bg-zinc-800 text-white text-[8px] font-bold px-3 py-1 uppercase tracking-[0.2em]">
                            trending
                        </div>
                    )}
                    {discountPrice && (
                        <div className="bg-[#B8860B] text-white text-[8px] font-bold px-3 py-1 uppercase tracking-[0.2em]">
                            on sale
                        </div>
                    )}
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                    <button
                        onClick={handleAddToCart}
                        className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:bg-black hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                    >
                        quick add
                    </button>
                </div>
            </div>

            {!hideInfo && (
                <div className="space-y-2">
                    <div className="flex flex-col gap-1">
                        {product.category && (
                            <p className="text-[9px] text-zinc-400 uppercase tracking-widest">{product.category.name}</p>
                        )}
                        <h3 className="text-[11px] font-bold uppercase tracking-widest line-clamp-1">{product.Name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {discountPrice ? (
                            <>
                                <span className="text-[11px] font-bold text-red-600">${discountPrice.toFixed(2)}</span>
                                <span className="text-[11px] text-zinc-400 line-through">${price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-[11px] font-bold">${price.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            )}
        </Link>
    );
}