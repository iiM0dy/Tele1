"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiStar } from 'react-icons/hi';
import { useLanguage } from '@/app/context/LanguageContext';

interface Review {
    id: string;
    name: string;
    image: string | null;
    description: string;
    rating: number;
}

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    if (!reviews || reviews.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const containerWidth = scrollRef.current.clientWidth;
            // On mobile, scroll by a significant portion of the screen like New Releases
            const step = window.innerWidth < 768
                ? containerWidth * 0.75
                : containerWidth / (window.innerWidth >= 1024 ? 5 : 2);

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
        <div className="bg-[#F8FAFC] overflow-hidden py-24">
            <div className="w-full px-4 md:px-[48px]">
                <div className="flex flex-col items-center mb-16 relative">
                    <h2
                        className="text-[42px] font-sans font-black tracking-tighter text-[#0F172A] mb-4 text-center"
                    >
                        {t('home.customerReviews')}
                    </h2>
                    <div className="w-20 h-1.5 bg-accent rounded-full" />
                </div>
            </div>
            <div className="relative group w-full px-4 md:px-[48px]">
                {/* Navigation Buttons - Only visible on desktop/tablet where they make sense */}
                {reviews.length > 5 && (
                    <>
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border border-zinc-200 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center text-primary hover:bg-accent hover:border-accent hover:text-white"
                            aria-label={t('common.previous')}
                        >
                            <HiOutlineChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border border-zinc-200 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center text-primary hover:bg-accent hover:border-accent hover:text-white"
                            aria-label={t('common.next')}
                        >
                            <HiOutlineChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Slider Container */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 scrollbar-hide snap-x snap-mandatory touch-pan-x"
                >
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(20%-19.2px)] min-w-[85%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(20%-19.2px)] lg:max-w-[calc(20%-19.2px)] h-[420px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-zinc-100 flex flex-col"
                        >
                            {/* Review Image */}
                            {review.image && (
                                <div className="relative w-full h-[200px] bg-zinc-100 shrink-0">
                                    <Image
                                        src={review.image}
                                        alt={t('home.reviewBy').replace('{name}', review.name)}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                                </div>
                            )}

                            {/* Stars Rating - Floating over the image boundary */}
                            <div className="relative h-6 shrink-0 z-10 -mt-3">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-zinc-50 flex gap-0.5 min-w-[120px] justify-center">
                                    {[...Array(5)].map((_, i) => (
                                        <HiStar
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-zinc-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="p-8 pt-6 flex flex-col gap-4 grow text-center">
                                {/* Name */}
                                <span className="text-xl font-black text-primary tracking-tight">
                                    {review.name}
                                </span>

                                {/* Description */}
                                <p className="text-sm text-zinc-600 font-medium leading-relaxed line-clamp-4">
                                    &quot;{review.description}&quot;
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
