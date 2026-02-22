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
    const { dir, language, t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const activeBanners = banners.filter(b => b.isActive);
    
    // Default fallback if no active banners
    const fallbackBanner = {
        id: 'fallback',
        title: "NEXT-GEN TECH SALE",
        subtitle: "PREMIUM SMARTPHONES & ACCESSORIES",
        titleAr: "تخفيضات التكنولوجيا",
        subtitleAr: "هواتف ذكية وإكسسوارات مميزة",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2000&auto=format&fit=crop",
        buttonText: null,
        link: "/products",
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
        <section id="hero-slideshow" className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden bg-[#0F172A]">
            {displayBanners.map((banner, index) => {
                const displayTitle = language === 'ar' ? (banner.titleAr || banner.title) : banner.title;
                const displaySubtitle = language === 'ar' ? (banner.subtitleAr || banner.subtitle) : banner.subtitle;
                
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
                                className="object-cover object-center scale-105 animate-slow-zoom"
                                sizes="100vw"
                            />
                            {/* Gradient Overlay */}
                            <div 
                                className="absolute inset-0 z-10" 
                                style={{ 
                                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%)' 
                                }} 
                            />
                        </div>

                        {/* Content Area */}
                        <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 text-center text-white">
                            <div className={`max-w-[900px] space-y-8 transition-all duration-1000 delay-300 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                                
                                {displayTitle && (
                                    <h1 className="text-5xl md:text-8xl font-sans font-black tracking-tight leading-[0.9] drop-shadow-2xl">
                                        {displayTitle}
                                    </h1>
                                )}

                                {displaySubtitle && (
                                    <p className="text-base md:text-xl font-medium text-white/80 max-w-2xl mx-auto">
                                        {displaySubtitle}
                                    </p>
                                )}

                                <div className="pt-6">
                                    <Link 
                                        href={banner.link || "/collections/all"}
                                        className="group relative inline-flex items-center justify-center px-12 py-5 bg-black text-white text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-accent hover:text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-95 rounded-xl overflow-hidden"
                                    >
                                        <span className="relative z-10">{banner.buttonText || t('home.shopNow')}</span>
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-500" />
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
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-accent w-8' : 'bg-white/30 hover:bg-white/50'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
