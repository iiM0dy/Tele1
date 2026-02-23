"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { HiX, HiSearch } from 'react-icons/hi';
import { getProducts, searchCollections } from '@/lib/public-actions';

interface SearchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'products' | 'collections' | 'pages'>('products');
    const [results, setResults] = useState<{
        products: any[];
        collections: any[];
        suggestions: any[];
    }>({
        products: [],
        collections: [],
        suggestions: []
    });
    const { t, language } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");

    // Focus input when drawer opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults({ products: [], collections: [], suggestions: [] });
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        setError("");
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true);
                try {
                    const [products, collections] = await Promise.all([
                        getProducts({ search: query, limit: 4 }),
                        searchCollections(query)
                    ]);
                    const suggestions = products.map((p: any) => p.Name.toLowerCase());
                    if (products.length === 0 && collections.length === 0) {
                        setError(t("searchDrawer.noResults"));
                    }
                    setResults({ products, collections, suggestions });
                } catch (error) {
                    setError(t("searchDrawer.error"));
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults({ products: [], collections: [], suggestions: [] });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = () => {
        // This is a placeholder for the Enter key handler, actual search is handled by useEffect
    };
    
    const pagesList = [
        { id: 'aboutUs', href: 'about-us', defaultLabel: 'About Us' },
        { id: 'shippingPolicy', href: 'shipping-policy', defaultLabel: 'Shipping Policy' },
        { id: 'contact', href: 'contact', defaultLabel: 'Contact' },
        { id: 'faq', href: 'faq', defaultLabel: 'FAQ' }
    ];

    return (
        <div 
            className={`fixed inset-0 z-100 transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}
        >
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-white transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            {/* Content Container */}
            <div className="relative z-10 max-w-2xl mx-auto mt-24 bg-white rounded-2xl shadow-xl p-8 flex flex-col">
                <div className="flex items-center mb-6">
                    <h2 className="text-lg font-semibold flex-1">{t("common.search")}</h2>
                    <button onClick={onClose} className="ml-4 p-2 hover:bg-zinc-50 rounded-full transition-colors" aria-label={t("common.close")}>
                        <HiX className="w-6 h-6 text-zinc-500" />
                    </button>
                </div>
                <div className="flex gap-2 mb-4">
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t("searchDrawer.placeholder")}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                    <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        <HiSearch className="w-5 h-5" />
                    </button>
                </div>
                {isLoading && <div className="text-gray-500">{t("common.loading")}</div>}
                {error && <div className="text-red-500 mt-2">{error}</div>}

                {/* Tabs and Results Section */}
                <div className="flex-1">
                    <div className="flex gap-8 border-b border-zinc-100 mb-8">
                        {['products', 'collections', 'pages'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                                    activeTab === tab ? 'text-primary' : 'text-zinc-400'
                                }`}
                            >
                                {t(`searchDrawer.tabs.${tab}`)}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                    {/* Tab Content */}
                    <div className="min-h-75">
                        {activeTab === 'products' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {results.products.map((product) => {
                                    const mainImage = product.Images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200';
                                    return (
                                        <Link 
                                            key={product.id}
                                            href={`/products/${product.slug}`}
                                            onClick={onClose}
                                            className="group flex flex-col bg-white p-4 rounded-2xl border border-zinc-50 hover:border-accent/20 hover:shadow-xl transition-all duration-500"
                                        >
                                            <div className="relative aspect-square bg-zinc-50 mb-4 overflow-hidden rounded-xl">
                                                <Image 
                                                    src={mainImage} 
                                                    alt={product.Name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                {product.BestSeller && (
                                                    <div className="absolute top-2 left-2 bg-accent text-white px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                        {t('home.bestSellerLabel')}
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="text-[13px] font-sans font-black text-primary mb-1 line-clamp-1 group-hover:text-accent transition-colors uppercase tracking-tight">{product.Name}</h4>
                                            <p className="text-[12px] font-sans font-bold text-accent">
                                                ${product.discountPrice || product.Price}
                                                {product.discountPrice && (
                                                    <span className="ml-2 line-through text-zinc-400 font-medium">${product.Price}</span>
                                                )}
                                            </p>
                                        </Link>
                                    );
                                })}
                                {query.length >= 2 && results.products.length === 0 && !isLoading && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                                        <p className="text-[14px] font-sans font-black text-primary/40 uppercase tracking-widest">{t('searchDrawer.noProductsFound').replace('{query}', query)}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'collections' && (
                            <div className="space-y-4">
                                {results.collections.map((col) => (
                                    <Link 
                                        key={col.id}
                                        href={`/collections/${col.slug}`}
                                        onClick={onClose}
                                        className="block p-4 border border-zinc-50 hover:border-accent hover:bg-accent/5 transition-all rounded-xl"
                                    >
                                        <h4 className="text-[14px] font-bold uppercase tracking-widest">{col.name}</h4>
                                        {col.description && <p className="text-[12px] text-zinc-500 mt-1 line-clamp-1">{col.description}</p>}
                                    </Link>
                                ))}
                                {query.length >= 2 && results.collections.length === 0 && !isLoading && (
                                    <p className="text-center text-zinc-400 py-12">{t('searchDrawer.noCollectionsFound')}</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'pages' && (
                            <div className="space-y-4">
                                {/* Static pages for now */}
                                {pagesList.filter(p => p.defaultLabel.toLowerCase().includes(query.toLowerCase()) || t(`searchDrawer.pages.${p.id}`).toLowerCase().includes(query.toLowerCase())).map((page) => (
                                    <Link 
                                        key={page.id}
                                        href={`/pages/${page.href}`}
                                        onClick={onClose}
                                        className="block p-4 border border-zinc-50 hover:border-accent hover:bg-accent/5 transition-all rounded-xl"
                                    >
                                        <h4 className="text-[14px] font-medium uppercase tracking-widest">{t(`searchDrawer.pages.${page.id}`)}</h4>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* View All Results Button */}
                    {query.length >= 2 && (
                        <div className="mt-12 flex justify-center">
                            <Link 
                                href={`/products?q=${query}`}
                                onClick={onClose}
                                className="bg-accent text-white px-12 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent/90 transition-all rounded-xl shadow-lg shadow-accent/20"
                            >
                                {t('searchDrawer.viewAllResults')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
