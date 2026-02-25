"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProductCard from '@/components/collections/ProductCard';
import { useLanguage } from '@/app/context/LanguageContext';

interface Product {
    id: string;
    Name: string;
    slug: string;
    Price: any;
    discountPrice: any;
    Images: string[];
    IsTrending: boolean;
    BestSeller: boolean;
    Stock: number;
    category: {
        name: string;
        nameAr?: string | null;
    } | null;
}

interface ProductGridProps {
    products: Product[];
    title?: string;
    cols?: number;
    hideInfo?: boolean;
}

export default function ProductGrid({
    products,
    title,
    cols = 3,
    hideInfo = false
}: ProductGridProps) {
    const pathname = usePathname();
    const { t } = useLanguage();

    if (!products.length) return null;

    const isProductsPage = pathname === '/products';

    const gridColsClass = {
        1: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        2: 'grid-cols-2 lg:grid-cols-2',
        3: 'grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
    }[cols as 1 | 2 | 3 | 4 | 6] || 'grid-cols-2 lg:grid-cols-3';

    return (
        <section className="py-12 bg-white">
            <div className="w-full">
                {title && (
                    <div className="flex flex-col items-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-widest uppercase mb-4 text-center text-primary">
                            {title}
                        </h2>
                        <div className="w-12 h-[2px] bg-primary" />
                    </div>
                )}
                <div className={`grid ${gridColsClass} gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16`}>
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product as any}
                            index={index}
                            hideInfo={hideInfo}
                            layout={cols >= 4 ? 'compact' : 'medium'}
                            sizes={
                                cols === 6 ? "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw" :
                                    cols === 4 ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" :
                                        "(max-width: 1024px) 50vw, 33vw"
                            }
                        />
                    ))}
                </div>

                {!isProductsPage && (
                    <div className="mt-20 flex justify-center">
                        <Link
                            href="/products"
                            className="px-12 py-4 border border-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-xl"
                        >
                            {t('products.viewAllProducts')}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
