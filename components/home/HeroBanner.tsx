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
    const { language } = useLanguage();

    if (!banners.length) return null;

    const banner = banners[0];
    const title = language === 'ar' ? banner.titleAr || banner.title : banner.title;
    const subtitle = language === 'ar' ? banner.subtitleAr || banner.subtitle : banner.subtitle;

    return (
        <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-black">
            <Image
                src={banner.image}
                alt={title || "Banner"}
                fill
                unoptimized
                className="object-cover opacity-80"
                priority
            />
            <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="container mx-auto px-4 max-w-4xl space-y-8">
                    {banner.badge && (
                        <p className="text-[10px] md:text-xs font-bold uppercase-tracking text-gold animate-fade-in">
                            {banner.badge}
                        </p>
                    )}
                    <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-tight uppercase tracking-widest">
                        {title}
                    </h1>
                    <p className="text-lg md:text-2xl text-white/80 font-light max-w-2xl mx-auto italic font-serif">
                        {subtitle}
                    </p>
                    {banner.link && (
                        <div className="pt-8">
                            <Link
                                href={banner.link}
                                className="inline-block px-12 py-5 bg-white text-black text-xs font-bold uppercase-tracking hover:bg-gold hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {banner.buttonText || "Discover Collection"}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-[8px] font-bold uppercase-tracking text-white/40">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
            </div>
        </section>
    );
}
