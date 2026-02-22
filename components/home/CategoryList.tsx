"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';

interface Category {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    image: string | null;
}

export default function CategoryList({ categories }: { categories: Category[] }) {
    const { t, language } = useLanguage();

    if (!categories.length) return null;

    const isAr = language === 'ar';

    return (
        <section className="py-24 bg-[#F8FAFC]">
            <div className="w-full px-4 md:px-[48px]">
                <div className="flex flex-col items-center mb-16 relative">
                    <h2
                        className="text-[42px] font-sans font-black tracking-tighter text-[#0F172A] mb-4 text-center"
                    >
                        {t('common.shopByCategory') || "SHOP BY CATEGORY"}
                    </h2>
                    <div className="w-20 h-1.5 bg-accent rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.slice(0, 3).map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/collections/${category.slug}`}
                            className={`group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 ${index === 0 ? 'md:col-span-2 md:row-span-2 aspect-4/5 md:aspect-auto' : 'aspect-4/5'
                                }`}
                        >
                            <Image
                                src={category.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80"}
                                alt={isAr && category.nameAr ? category.nameAr : category.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                                <h3 className="text-2xl md:text-3xl font-sans font-black text-white uppercase tracking-tighter mb-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    {isAr && category.nameAr ? category.nameAr : category.name}
                                </h3>
                                <div className="px-6 py-2 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    {t('common.viewAll')}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
