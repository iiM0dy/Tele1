import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from "@/lib/public-actions";
import { getI18n } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
    const categories = await getAllCategories();
    const { t, language } = await getI18n();
    const isAr = language === 'ar';

    return (
        <div className="flex flex-col min-h-screen bg-white pt-[110px]">
            <div className="w-full px-4 md:px-[48px] pb-24">
                <div className="flex flex-col items-center mb-16 relative">
                    <h1 className="text-[32px] md:text-[42px] font-sans font-black tracking-tighter text-[#0F172A] mb-4 text-center uppercase">
                        {t('common.allCollections') || "ALL COLLECTIONS"}
                    </h1>
                    <div className="w-20 h-1.5 bg-accent rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => {
                        const displayName = isAr && category.nameAr ? category.nameAr : category.name;
                        return (
                            <Link
                                key={category.id}
                                href={`/collections/${category.slug}`}
                                className="group relative w-full aspect-square bg-[#E5E5E5] overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                {category.image && (
                                    <div className="absolute inset-0">
                                        <Image
                                            src={category.image}
                                            alt={displayName}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        {/* Black filter with low opacity */}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-1" />
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <span className="px-10 py-4 bg-accent text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transform translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl shadow-accent/20">
                                        {displayName}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
