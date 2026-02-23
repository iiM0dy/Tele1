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
    category: {
        name: string;
    };
}

export default function ProductGrid({ products, title }: { products: Product[], title: string }) {
    const pathname = usePathname();
    const { t } = useLanguage();
    if (!products.length) return null;

    const isProductsPage = pathname === '/products';

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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product as any}
                            index={index}
                            sizes="(max-width: 1024px) 50vw, 33vw"
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
