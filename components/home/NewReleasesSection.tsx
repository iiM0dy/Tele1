"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { useLanguage } from '@/app/context/LanguageContext';
import BestSellerCardSkeleton from './BestSellerCardSkeleton';

const BestSellerCard = dynamic(() => import('./BestSellerCard'), {
  loading: () => <BestSellerCardSkeleton />,
  ssr: true
});

interface Product {
    id: string;
    Name: string;
    slug: string;
    Price: any;
    discountPrice: any;
    Images: string;
    IsTrending: boolean;
    BestSeller: boolean;
    description?: string;
    category: {
        name: string;
    };
}

export default function NewReleasesSection({ products }: { products: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    if (!products || products.length === 0) return null;

    // Show all trending products
    const displayProducts = products;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth 
                : scrollLeft + clientWidth;
            
            scrollRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-24 bg-zinc-50 overflow-hidden">
            <div className="w-full px-4 md:px-[48px]">
                <div className="flex flex-col items-center mb-16 relative">
                    <h2 
                        className="text-[42px] font-sans font-black tracking-tighter text-[#0F172A] mb-4 text-center"
                    >
                        {t('home.newReleases')}
                    </h2>
                    <div className="w-20 h-1.5 bg-accent rounded-full" />
                </div>

                {/* Slider Container */}
                <div className="relative group/carousel px-4 md:px-0">
                    {/* Navigation Buttons - Circular and centered on sides */}
                    {displayProducts.length > 1 && (
                        <>
                            <button 
                                onClick={() => scroll('left')}
                                className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-1/2 z-20 w-12 h-12 bg-white border border-zinc-200 rounded-full hidden md:flex items-center justify-center text-primary hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 md:opacity-0 group-hover/carousel:opacity-100 shadow-sm"
                                aria-label={t('common.previous')}
                            >
                                <HiOutlineChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={() => scroll('right')}
                                className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-1/2 z-20 w-12 h-12 bg-white border border-zinc-200 rounded-full hidden md:flex items-center justify-center text-primary hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 md:opacity-0 group-hover/carousel:opacity-100 shadow-sm"
                                aria-label={t('common.next')}
                            >
                                <HiOutlineChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-4 md:gap-6 scrollbar-hide snap-x snap-mandatory touch-pan-x"
                    >
                        {displayProducts.map((product, index) => (
                            <div 
                                key={product.id} 
                                className="min-w-[75%] md:min-w-[calc(25%-18px)] snap-start"
                            >
                                <BestSellerCard product={product} index={index} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* View All Button */}
                <div className="mt-12 flex justify-center">
                    <Link 
                        href="/products"
                        className="px-12 py-4 bg-accent text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 rounded-xl shadow-lg shadow-accent/20"
                    >
                        {t('common.viewAll')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
