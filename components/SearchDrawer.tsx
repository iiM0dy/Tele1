"use client";

import React, { useEffect, useState, useRef } from 'react';
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
        suggestions: string[];
    }>({
        products: [],
        collections: [],
        suggestions: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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

    // Predictive search logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true);
                try {
                    const [products, collections] = await Promise.all([
                        getProducts({ search: query, limit: 4 }),
                        searchCollections(query)
                    ]);

                    // Simple suggestions based on product names
                    const suggestions = products
                        .map(p => p.Name.toLowerCase())
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .slice(0, 5);

                    setResults({ products, collections, suggestions });
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults({ products: [], collections: [], suggestions: [] });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div 
            className={`fixed inset-0 z-[100] transition-all duration-500 ${
                isOpen ? 'visible' : 'invisible'
            }`}
        >
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-white transition-opacity duration-500 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Content Container */}
            <div 
                className={`relative w-full h-full bg-white flex flex-col transition-transform duration-500 ease-out ${
                    isOpen ? 'translate-y-0' : '-translate-y-10'
                }`}
            >
                {/* Search Header */}
                <div className="container mx-auto px-4 md:px-6 pt-12">
                    <div className="flex items-center border-b border-zinc-100 pb-4">
                        <HiSearch className="w-6 h-6 text-zinc-400 mr-4" />
                        <input 
                            ref={inputRef}
                            type="text"
                            placeholder="SEARCH FOR..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent text-[20px] md:text-[24px] font-normal uppercase tracking-[0.2em] outline-none placeholder:text-[#FADC91]/40 text-[#121212]"
                            style={{ fontFamily: '"Times New Roman", Times, serif' }}
                        />
                        <button onClick={onClose} className="ml-4 p-2 hover:bg-zinc-50 rounded-full transition-colors">
                            <HiX className="w-6 h-6 text-zinc-900" />
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="flex-1 overflow-y-auto pt-8 pb-12">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row gap-12">
                            {/* Left: Suggestions */}
                            <div className="w-full md:w-64">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FADC91] mb-6 border-b border-[#FADC91]/20 pb-2">
                                    Suggestions
                                </h3>
                                <div className="space-y-4">
                                    {results.suggestions.length > 0 ? (
                                        results.suggestions.map((suggestion, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => setQuery(suggestion)}
                                                className="block text-[14px] text-zinc-600 hover:text-black transition-colors text-left w-full"
                                            >
                                                {suggestion}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-[14px] text-zinc-400 italic">No suggestions yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Right: Tabs & Results */}
                            <div className="flex-1">
                                <div className="flex gap-8 border-b border-zinc-100 mb-8">
                                    {['products', 'collections', 'pages'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as any)}
                                            className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                                                activeTab === tab ? 'text-black' : 'text-zinc-400'
                                            }`}
                                        >
                                            {tab}
                                            {activeTab === tab && (
                                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="min-h-[300px]">
                                    {activeTab === 'products' && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {results.products.map((product) => {
                                                const mainImage = product.Images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200';

                                                return (
                                                    <Link 
                                                        key={product.id}
                                                        href={`/products/${product.slug}`}
                                                        onClick={onClose}
                                                        className="group flex flex-col"
                                                    >
                                                        <div className="relative aspect-[4/5] bg-zinc-50 mb-4 overflow-hidden">
                                                            <Image 
                                                                src={mainImage} 
                                                                alt={product.Name}
                                                                fill
                                                                unoptimized
                                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                            {product.BestSeller && (
                                                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-[8px] font-bold uppercase tracking-tighter">
                                                                    Best Seller
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h4 className="text-[12px] font-medium text-zinc-900 mb-1 line-clamp-1">{product.Name}</h4>
                                                        <p className="text-[11px] text-zinc-500">
                                                            ${product.discountPrice || product.Price}
                                                            {product.discountPrice && (
                                                                <span className="ml-2 line-through opacity-50">${product.Price}</span>
                                                            )}
                                                        </p>
                                                    </Link>
                                                );
                                            })}
                                            {query.length >= 2 && results.products.length === 0 && !isLoading && (
                                                <p className="col-span-full text-center text-zinc-400 py-12">No products found for "{query}"</p>
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
                                                    className="block p-4 border border-zinc-50 hover:border-black transition-colors"
                                                >
                                                    <h4 className="text-[14px] font-bold uppercase tracking-widest">{col.name}</h4>
                                                    {col.description && <p className="text-[12px] text-zinc-500 mt-1 line-clamp-1">{col.description}</p>}
                                                </Link>
                                            ))}
                                            {query.length >= 2 && results.collections.length === 0 && !isLoading && (
                                                <p className="text-center text-zinc-400 py-12">No collections found</p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'pages' && (
                                        <div className="space-y-4">
                                            {/* Static pages for now */}
                                            {['About Us', 'Shipping Policy', 'Contact', 'FAQ'].filter(p => p.toLowerCase().includes(query.toLowerCase())).map((page) => (
                                                <Link 
                                                    key={page}
                                                    href={`/pages/${page.toLowerCase().replace(/ /g, '-')}`}
                                                    onClick={onClose}
                                                    className="block p-4 border border-zinc-50 hover:border-black transition-colors"
                                                >
                                                    <h4 className="text-[14px] font-medium uppercase tracking-widest">{page}</h4>
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
                                            className="bg-[#121212] text-white px-12 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all rounded-sm"
                                        >
                                            View All Results
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
