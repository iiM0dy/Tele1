"use client";

import React, { useRef } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import BestSellerCard from '../home/BestSellerCard';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

export default function RelatedProducts({ products }: { products: any[] }) {
    const { t } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!products || products.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
            // Scroll by one item width (approx 25% of container on desktop)
            const itemWidth = clientWidth / 4;
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
        <section className="py-24 bg-white overflow-hidden">
            <div className="w-full px-4 md:px-[48px]">
                <div className="flex flex-col items-center mb-16 relative">
                    <h2
                        className="text-[35px] font-sans font-black tracking-tighter text-[#0F172A] mb-4 text-center uppercase"
                    >
                        {t('products.youMayAlsoLike')}
                    </h2>
                    <div className="w-12 h-1 bg-accent rounded-full" />
                </div>

                {/* Slider Container */}
                <div className="relative group/carousel px-4 md:px-0">
                    {/* Navigation Buttons - Circular and centered on sides */}
                    {products.length > 1 && (
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
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className="min-w-[75%] md:min-w-[calc(25%-18px)] snap-start"
                            >
                                <BestSellerCard product={product} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
