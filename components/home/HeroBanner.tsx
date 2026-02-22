"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    badge: string | null;
}

export default function HeroBanner({ banners }: { banners: Banner[] }) {
    const { language, t } = useLanguage();

    if (!banners.length) return null;

    const banner = banners[0];
    const title = language === 'ar' ? banner.titleAr || banner.title : banner.title;
    const subtitle = language === 'ar' ? banner.subtitleAr || banner.subtitle : banner.subtitle;

    return (
        <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-[#0F172A]">
            <Image
                src={banner.image}
                alt={title || "Banner"}
                fill
                unoptimized
                className="object-cover opacity-60 scale-105 animate-slow-zoom"
                priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />
            
            <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="container mx-auto px-4 max-w-4xl space-y-8">
                    {banner.badge && (
                        <div className="inline-block px-4 py-2 bg-accent/20 backdrop-blur-md border border-accent/30 rounded-full animate-fade-in">
                            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-accent">
                                {banner.badge}
                            </p>
                        </div>
                    )}
                    <h1 className="text-5xl md:text-8xl font-sans font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl">
                        {title}
                    </h1>
                    <p className="text-lg md:text-2xl text-white/70 font-medium max-w-2xl mx-auto font-sans">
                        {subtitle}
                    </p>
                    {banner.link && (
                        <div className="pt-8">
                            <Link 
                                href={banner.link}
                                className="group relative inline-flex items-center justify-center px-12 py-5 bg-black text-white text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-accent hover:text-black hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-95 rounded-xl overflow-hidden"
                            >
                                <span className="relative z-10">{banner.buttonText || t('home.shopNow')}</span>
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent" />
            </div>
        </section>
    );
}
