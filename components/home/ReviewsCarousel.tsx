"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiStar } from 'react-icons/hi';

interface Review {
    id: string;
    name: string;
    image: string | null;
    description: string;
    rating: number;
}

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!reviews || reviews.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const containerWidth = scrollRef.current.clientWidth;
            // On mobile, scroll by a significant portion of the screen like New Releases
            const step = window.innerWidth < 768 
                ? containerWidth * 0.75 
                : containerWidth / (window.innerWidth >= 1024 ? 4 : 2);
            
            const { scrollLeft } = scrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - step 
                : scrollLeft + step;
            
            scrollRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-white overflow-hidden py-16">
            <div className="max-w-[1100px] mx-auto">
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
                        REAL REVIEWS FROM REAL CUSTOMERS
                    </h2>
                    <div className="w-12 h-[1px] bg-gold" />
                </div>
            </div>
            <div className="relative group max-w-[1100px] mx-auto">
                    {/* Navigation Buttons - Only visible on desktop/tablet where they make sense */}
                    <button 
                        onClick={() => scroll('left')}
                        className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-20 p-3 bg-white border border-zinc-100 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center"
                        aria-label="Previous"
                    >
                        <HiOutlineChevronLeft className="w-6 h-6 text-zinc-400" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-20 p-3 bg-white border border-zinc-100 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center"
                        aria-label="Next"
                    >
                        <HiOutlineChevronRight className="w-6 h-6 text-zinc-400" />
                    </button>

                    {/* Slider Container */}
                    <div 
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-4 md:gap-6 scrollbar-hide snap-x snap-mandatory touch-pan-x"
                    >
                        {reviews.map((review) => (
                            <div 
                                key={review.id} 
                                className="w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] min-w-[85%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] lg:max-w-[calc(25%-18px)] h-[395px] shrink-0 snap-start bg-white border border-zinc-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                            >
                                {/* Review Image */}
                                {review.image && (
                                    <div className="relative w-full h-[175px] bg-zinc-100 shrink-0">
                                        <Image 
                                            src={review.image} 
                                            alt={`Review by ${review.name}`}
                                            fill
                                            className="object-cover"
                                            sizes="245px"
                                        />
                                    </div>
                                )}

                                {/* Stars Rating - Floating over the image boundary */}
                                <div className="relative h-6 shrink-0 z-10">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-md border border-zinc-100 flex gap-0.5 min-w-[140px] justify-center">
                                        {[...Array(5)].map((_, i) => (
                                            <HiStar 
                                                key={i} 
                                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-zinc-200'}`} 
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="p-6 pt-8 flex flex-col gap-3 flex-grow text-center">
                                    {/* Name - Now above the description as per image */}
                                    <span className="text-lg font-bold text-black">
                                        {review.name}
                                    </span>

                                    {/* Description */}
                                    <p className="text-sm md:text-base text-zinc-800 font-medium leading-relaxed line-clamp-4">
                                        {review.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
        </div>
    );
}
