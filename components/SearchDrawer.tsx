"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { HiX, HiSearch, HiArrowRight } from 'react-icons/hi';
import { getProducts, searchCollections } from '@/lib/public-actions';

interface SearchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{
        products: any[];
        collections: any[];
    }>({
        products: [],
        collections: [],
    });
    const { t, language } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults({ products: [], collections: [] });
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        setError("");
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const [products, collections] = await Promise.all([
                        getProducts({ search: query, limit: 6 }),
                        searchCollections(query)
                    ]);

                    if (products.length === 0 && collections.length === 0) {
                        setError(t("searchDrawer.noResults"));
                    }
                    setResults({ products, collections });
                } catch (error) {
                    setError(t("searchDrawer.error"));
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults({ products: [], collections: [] });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const pagesList = [
        { id: 'aboutUs', href: 'about-us' },
        { id: 'shippingPolicy', href: 'shipping-returns' },
        { id: 'contact', href: 'contact' },
    ];

    const filteredPages = pagesList.filter(p =>
        t(`searchDrawer.pages.${p.id}`).toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div
            className={`fixed inset-0 z-100 transition-all duration-500 flex flex-col ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-white/98 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative z-10 w-full flex flex-col h-full overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[48px] pt-8 md:pt-16 pb-20">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12 md:mb-20">
                        <span className="text-2xl font-sans font-black tracking-tighter uppercase text-primary">
                            TELE1<span className="text-accent">.</span>
                        </span>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-zinc-100 rounded-full transition-all group"
                            aria-label={t("common.close")}
                        >
                            <HiX className="w-8 h-8 text-zinc-400 group-hover:text-primary group-hover:rotate-90 transition-all duration-300" />
                        </button>
                    </div>

                    {/* Search Input Area */}
                    <div className="relative max-w-4xl mx-auto mb-16 md:mb-24">
                        <div className="relative flex items-center border-b-2 border-zinc-100 focus-within:border-accent transition-colors duration-500 pb-4">
                            <HiSearch className={`w-8 h-8 md:w-10 md:h-10 me-6 transition-colors duration-500 ${query ? 'text-accent' : 'text-zinc-300'}`} />
                            <input
                                ref={inputRef}
                                type="text"
                                className="w-full bg-transparent text-3xl md:text-6xl font-black text-primary placeholder:text-zinc-200 focus:outline-none uppercase tracking-tighter"
                                placeholder={t("searchDrawer.placeholder")}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            {isLoading && (
                                <div className="absolute right-0 bottom-6">
                                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="max-w-7xl mx-auto">
                        {query.trim().length >= 2 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
                                {/* Left Column: Products */}
                                <div className="lg:col-span-8">
                                    <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                                            {t('searchDrawer.tabs.products')}
                                        </h3>
                                        {results.products.length > 0 && (
                                            <Link
                                                href={`/products?q=${query}`}
                                                onClick={onClose}
                                                className="text-[11px] font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors flex items-center gap-2"
                                            >
                                                {t('searchDrawer.viewAllResults')}
                                                <HiArrowRight className="w-3 h-3" />
                                            </Link>
                                        )}
                                    </div>

                                    {results.products.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                                            {results.products.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.slug}`}
                                                    onClick={onClose}
                                                    className="group block"
                                                >
                                                    <div className="relative aspect-4/5 bg-zinc-50 overflow-hidden rounded-2xl mb-4">
                                                        <Image
                                                            src={product.Images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400'}
                                                            alt={product.Name}
                                                            fill
                                                            unoptimized
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <h4 className="text-[13px] font-black uppercase tracking-tight text-primary mb-1 line-clamp-1 group-hover:text-accent transition-colors">
                                                        {product.Name}
                                                    </h4>
                                                    <p className="text-[12px] font-bold text-zinc-500">
                                                        ${product.discountPrice || product.Price}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : !isLoading && (
                                        <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
                                            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
                                                {t('searchDrawer.noProductsFound').replace('{query}', query)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Collections & Pages */}
                                <div className="lg:col-span-4 space-y-12">
                                    {/* Collections */}
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 border-b border-zinc-100 pb-4">
                                            {t('searchDrawer.tabs.collections')}
                                        </h3>
                                        <div className="space-y-4">
                                            {results.collections.length > 0 ? (
                                                results.collections.map((col) => (
                                                    <Link
                                                        key={col.id}
                                                        href={`/collections/${col.slug}`}
                                                        onClick={onClose}
                                                        className="group flex items-center justify-between p-5 bg-zinc-50 hover:bg-white border border-transparent hover:border-accent/10 rounded-2xl transition-all duration-300"
                                                    >
                                                        <span className="text-[14px] font-black uppercase tracking-tight text-primary group-hover:text-accent">
                                                            {col.name}
                                                        </span>
                                                        <HiArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest px-2">
                                                    {t('searchDrawer.noCollectionsFound')}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Pages */}
                                    <div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8 border-b border-zinc-100 pb-4">
                                            {t('searchDrawer.tabs.pages')}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {filteredPages.map((page) => (
                                                <Link
                                                    key={page.id}
                                                    href={`/${page.href}`}
                                                    onClick={onClose}
                                                    className="inline-flex items-center text-[13px] font-bold text-zinc-500 hover:text-accent transition-colors gap-2"
                                                >
                                                    <div className="w-1 h-1 bg-accent rounded-full" />
                                                    {t(`searchDrawer.pages.${page.id}`)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Suggested Search or Trending */
                            <div className="text-center py-20">
                                <p className="text-[14px] font-black uppercase tracking-[0.3em] text-zinc-200">
                                    {t('searchDrawer.placeholder')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
