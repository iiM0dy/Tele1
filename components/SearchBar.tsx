"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { HiSearch, HiX } from 'react-icons/hi';
import { getProducts, searchCollections } from '@/lib/public-actions';
import Image from 'next/image';
import Link from 'next/link';

interface SearchBarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
    const { t, language } = useLanguage();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{
        products: any[];
        collections: any[];
    }>({
        products: [],
        collections: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        } else {
            setQuery('');
            setResults({ products: [], collections: [] });
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            const searchTerm = query.trim();
            if (searchTerm.length >= 2) {
                setIsLoading(true);
                try {
                    const [products, collections] = await Promise.all([
                        getProducts({ search: searchTerm, limit: 4 }),
                        searchCollections(searchTerm)
                    ]);
                    setResults({ products, collections });
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults({ products: [], collections: [] });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <>
            {/* Backdrop for the search area */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 z-30 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                onClick={onClose}
                style={{ top: '90px' }}
            />

            <div
                className={`absolute top-full left-0 w-full bg-white border-t border-zinc-100 shadow-xl overflow-hidden transition-all duration-500 ease-in-out z-40 ${isOpen ? 'h-[80px]' : 'h-0 border-none'
                    }`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
                <div className="w-full h-full max-w-[1440px] mx-auto px-4 md:px-[48px] flex items-center gap-4">
                    <HiSearch className="w-6 h-6 text-zinc-400 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={t('searchDrawer.placeholder')}
                        className="flex-1 bg-transparent text-lg md:text-xl font-bold text-primary focus:outline-none tracking-tighter"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') onClose();
                        }}
                    />

                    {isLoading && (
                        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin shrink-0" />
                    )}

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-colors group"
                        aria-label={t('common.close')}
                    >
                        <HiX className="w-6 h-6 text-zinc-400 group-hover:text-primary transition-colors" />
                    </button>
                </div>
            </div>

            {/* Results Dropdown - Moved outside to prevent clipping by h-[80px] overflow */}
            {query.trim().length >= 2 && (
                <div
                    className={`absolute left-0 w-full bg-white border-t border-zinc-100 shadow-2xl transition-all duration-300 z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                        }`}
                    style={{ top: isOpen ? '170px' : '90px' }} // Header(90) + SearchBar(80)
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                    <div className="max-w-[1440px] mx-auto px-4 md:px-[48px] py-10">
                        {isLoading && results.products.length === 0 && results.collections.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-4">
                                <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t('common.loading')}</p>
                            </div>
                        ) : results.products.length > 0 || results.collections.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Products Suggestion */}
                                <div className="lg:col-span-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 border-b border-zinc-50 pb-2">
                                        {t('searchDrawer.tabs.products')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {results.products.map((product: any) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.slug}`}
                                                onClick={onClose}
                                                className="flex items-center gap-4 group p-3 hover:bg-zinc-50 rounded-2xl transition-all border border-transparent hover:border-zinc-100"
                                            >
                                                <div className="relative w-16 h-16 bg-zinc-50 rounded-xl overflow-hidden shrink-0">
                                                    <Image
                                                        src={product.Images?.[0] || '/placeholder.png'}
                                                        alt={product.Name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[13px] font-black uppercase tracking-tight text-primary truncate group-hover:text-accent transition-colors">
                                                        {product.Name}
                                                    </h4>
                                                    <p className="text-[12px] font-bold text-zinc-500">
                                                        ${product.discountPrice || product.Price}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Links & Categories */}
                                <div className="lg:col-span-4 flex flex-col gap-8">
                                    {results.collections.length > 0 && (
                                        <div>
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 border-b border-zinc-50 pb-2">
                                                {t('searchDrawer.tabs.collections')}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {results.collections.map((col: any) => (
                                                    <Link
                                                        key={col.id}
                                                        href={`/collections/${col.slug}`}
                                                        onClick={onClose}
                                                        className="px-4 py-2 bg-zinc-50 hover:bg-accent hover:text-white rounded-full text-[11px] font-bold uppercase tracking-wider transition-all"
                                                    >
                                                        {language === 'ar' && col.nameAr ? col.nameAr : col.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-auto">
                                        <Link
                                            href={`/products?q=${query}`}
                                            onClick={onClose}
                                            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-all shadow-lg"
                                        >
                                            {t('searchDrawer.viewAllResults')}
                                            <HiSearch className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : !isLoading && (
                            <div className="text-center py-10">
                                <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                                    {t('searchDrawer.noResults')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
