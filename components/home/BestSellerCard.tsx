"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'react-hot-toast';

interface Product {
    id: string;
    Name: string;
    slug: string;
    Price: any;
    discountPrice: any;
    Images: string;
    IsTrending: boolean;
    BestSeller: boolean;
    Stock: number;
    description?: string;
    category: {
        name: string;
        nameAr?: string | null;
    };
}

export default function BestSellerCard({ product, index }: { product: any; index?: number }) {
    const { t, language } = useLanguage();
    const { addItem, setIsDrawerOpen } = useCart();

    const mainImage = product.Images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800';
    const hoverImage = product.Images?.[1];
    const price = Number(product.Price);
    const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
    const isPriority = typeof index === 'number' && index < 4;
    const isOutOfStock = Number(product.Stock || 0) <= 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isOutOfStock) return;
        addItem({
            id: product.id,
            name: product.Name,
            price: discountPrice || price,
            originalPrice: discountPrice ? price : undefined,
            image: mainImage,
            quantity: 1,
            slug: product.slug
        });
    };

    return (
        <div className={`flex flex-col group w-full min-w-[240px] md:min-w-[220px] min-h-[400px] bg-white rounded-2xl border border-zinc-100 shadow-sm transition-all duration-300 overflow-hidden ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-xl hover:-translate-y-1'}`}>
            {/* Figure / Media Area */}
            <div className="relative w-full aspect-square overflow-hidden bg-white mx-auto flex-shrink-0">
                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-2xl transform -rotate-12 border-2 border-black">
                            {t('products.outOfStock')}
                        </span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
                    {product.BestSeller && (
                        <span className="bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                            {t('home.bestSellerLabel')}
                        </span>
                    )}
                    {product.IsTrending && !product.BestSeller && (
                        <span className="bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                            {t('home.newArrival')}
                        </span>
                    )}
                    {discountPrice && !isOutOfStock && (
                        <span className="bg-highlight text-black text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                            {t('products.salePercent').replace('{percent}', Math.round((1 - discountPrice / price) * 100).toString())}
                        </span>
                    )}
                </div>

                {/* Main Image */}
                <Link href={`/products/${product.slug}`} className={`block w-full h-full ${isOutOfStock ? 'cursor-not-allowed' : ''}`}>
                    <Image
                        src={mainImage}
                        alt={product.Name}
                        fill
                        className={`object-contain p-4 transition-all duration-700 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                        sizes="(max-width: 768px) 75vw, (max-width: 1024px) 33vw, 25vw"
                        priority={isPriority}
                        fetchPriority={isPriority ? "high" : undefined}
                    />
                    {hoverImage && (
                        <Image
                            src={hoverImage}
                            alt={product.Name}
                            fill
                            className="object-contain p-4 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                            sizes="(max-width: 768px) 75vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    )}
                </Link>

                {/* Quick Add Button */}
                {!isOutOfStock && (
                    <button
                        onClick={handleAddToCart}
                        type="submit"
                        className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-accent text-black flex items-center justify-center rounded-lg md:rounded-xl shadow-lg transition-all duration-300 opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:bg-black hover:text-white hover:scale-110 active:scale-95"
                        aria-label={t('products.addToCart')}
                    >
                        <span className="sr-only">{t('products.addToCart')}</span>
                        <svg aria-hidden="true" focusable="false" fill="none" width="14" height="14" viewBox="0 0 12 12" className="md:w-4 md:h-4">
                            <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2"></path>
                        </svg>
                    </button>
                )}
            </div>

            {/* Info Area */}
            <div className="flex flex-col p-5 space-y-2">
                <Link
                    href={`/products/${product.slug}`}
                    className={`text-sm font-bold text-primary transition-colors line-clamp-2 min-h-[45px] ${isOutOfStock ? 'cursor-not-allowed' : 'group-hover:text-accent'}`}
                >
                    {product.Name}
                </Link>

                <div className="flex items-center gap-3 pt-1">
                    {discountPrice ? (
                        <>
                            <span className={`text-base font-black ${isOutOfStock ? 'text-zinc-400' : 'text-red-600'}`}>${discountPrice.toFixed(2)}</span>
                            <span className="text-xs text-zinc-400 line-through font-medium">${price.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className={`text-base font-black ${isOutOfStock ? 'text-zinc-400' : 'text-primary'}`}>${price.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
