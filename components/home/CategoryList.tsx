"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';

interface Category {
    id: string;
    name: string;
    image: string | null;
}

export default function CategoryList({ categories }: { categories: Category[] }) {
    const { t } = useLanguage();

    if (!categories.length) return null;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
                        {t('home.categories')}
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.slice(0, 3).map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.id}`}
                            className={`group relative overflow-hidden bg-zinc-100 ${
                                index === 0 ? 'md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto' : 'aspect-[4/5]'
                            }`}
                        >
                            {category.image && (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-500" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                <h3 className="text-xl md:text-2xl font-serif text-white uppercase tracking-widest mb-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    {category.name}
                                </h3>
                                <div className="w-8 h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                <span className="mt-4 text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {t('common.viewAll')}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
