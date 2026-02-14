"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import BestSellerCard from './BestSellerCard';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

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

export default function BestSellerSection({ products }: { products: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!products || products.length === 0) return null;

    // Limit to 8 products max as requested
    const displayProducts = products.slice(0, 8);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            // Scroll by one full page (approx clientWidth)
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
                        className="tracking-[0.2em] uppercase mb-4 text-center"
                        style={{ 
                            fontFamily: "'Times New Roman', Times, serif", 
                            fontWeight: 400,
                            fontSize: '31px',
                            color: 'rgb(18, 18, 18)'
                        }}
                    >
                        BEST SELLERS
                    </h2>
                    <div className="w-12 h-[1px] bg-gold" />
                </div>

                {/* Slider Container */}
                <div className="relative group/carousel px-4 md:px-0">
                    {/* Navigation Buttons - Circular and centered on sides */}
                    {displayProducts.length > 1 && (
                        <>
                            <button 
                                onClick={() => scroll('left')}
                                className="absolute left-4 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-1/2 z-20 w-10 h-10 bg-white border border-zinc-200 rounded-full hidden md:flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 md:opacity-0 group-hover/carousel:opacity-100"
                                aria-label="Previous"
                            >
                                <HiOutlineChevronLeft className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => scroll('right')}
                                className="absolute right-4 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-1/2 z-20 w-10 h-10 bg-white border border-zinc-200 rounded-full hidden md:flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300 md:opacity-0 group-hover/carousel:opacity-100"
                                aria-label="Next"
                            >
                                <HiOutlineChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-4 md:gap-6 scrollbar-hide snap-x snap-mandatory touch-pan-x"
                    >
                        {displayProducts.map((product) => (
                            <div 
                                key={product.id} 
                                className="min-w-[75%] md:min-w-[calc(25%-18px)] snap-start"
                            >
                                <BestSellerCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <Link 
                        href="/products" 
                        className="px-12 py-4 border border-zinc-200 text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </section>
    );
}
