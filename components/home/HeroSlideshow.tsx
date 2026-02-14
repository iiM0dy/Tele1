"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';

interface Banner {
    id: string;
    title: string | null;
    subtitle: string | null;
    titleAr: string | null;
    subtitleAr: string | null;
    image: string;
    buttonText: string | null;
    link: string | null;
    isActive: boolean;
}

export default function HeroSlideshow({ banners = [] }: { banners?: Banner[] }) {
    const { dir, currentLocale } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const activeBanners = banners.filter(b => b.isActive);
    
    // Default fallback if no active banners
    const fallbackBanner = {
        id: 'fallback',
        title: "VALENTINE'S SALE",
        subtitle: "PREMIUM GOLD PLATED MEN'S JEWELRY",
        titleAr: "تخفيضات الفالنتاين",
        subtitleAr: "مجوهرات رجالية مطلية بالذهب الفاخر",
        image: "https://julivno.com/cdn/shop/files/asaas.webp?v=1706603702&width=3824",
        buttonText: "Shop Now",
        link: "/collections/all",
        isActive: true
    };

    const displayBanners = activeBanners.length > 0 ? activeBanners : [fallbackBanner];

    useEffect(() => {
        if (displayBanners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [displayBanners.length]);

    return (
        <section id="hero-slideshow" className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden bg-black">
            {displayBanners.map((banner, index) => {
                const displayTitle = currentLocale === 'ar' ? (banner.titleAr || banner.title) : banner.title;
                const displaySubtitle = currentLocale === 'ar' ? (banner.subtitleAr || banner.subtitle) : banner.subtitle;
                
                return (
                    <div 
                        key={banner.id}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
                    >
                        {/* Background Image Container */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={banner.image}
                                alt={displayTitle || "Hero Banner"}
                                fill
                                priority={index === 0}
                                unoptimized
                                className="object-cover object-center"
                                sizes="100vw"
                            />
                            {/* Gradient Overlay */}
                            <div 
                                className="absolute inset-0 z-10" 
                                style={{ 
                                    background: 'linear-gradient(180deg, rgba(54, 54, 54, 0.2), rgba(4, 4, 4, 0.65) 100%)' 
                                }} 
                            />
                        </div>

                        {/* Content Area */}
                        <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 text-center text-[#EAEAEA]">
                            <div className={`max-w-[780px] space-y-6 transition-all duration-1000 delay-300 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                {displaySubtitle && (
                                    <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-90">
                                        {displaySubtitle}
                                    </p>
                                )}
                                
                                {displayTitle && (
                                    <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-[0.1em] uppercase leading-tight">
                                        {displayTitle}
                                    </h1>
                                )}

                                <div className="pt-4">
                                    <Link 
                                        href={banner.link || "/collections/all"}
                                        className="inline-block px-10 py-4 bg-[#1C1C1C] text-[#FFEC99] text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl rounded-xl"
                                    >
                                        {banner.buttonText || "Shop Now"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Slideshow Indicators */}
            {displayBanners.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {displayBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-[#FFEC99] w-8' : 'bg-white/30 hover:bg-white/50'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
