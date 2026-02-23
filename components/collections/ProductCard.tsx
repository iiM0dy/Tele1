"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

export interface Product {
    id: string;
    Name: string;
    slug: string;
    Price: number;
    discountPrice: number | null;
    Images: string[];
    IsTrending: boolean;
    BestSeller: boolean;
    Stock: number;
    category: {
        name: string;
    } | null;
}

interface ProductCardProps {
    product: Product;
    hideInfo?: boolean;
    index?: number;
    layout?: 'large' | 'medium' | 'compact';
    sizes?: string;
}

export default function ProductCard({ product, hideInfo, index, layout = 'medium', sizes }: ProductCardProps) {
    const { t } = useLanguage();
    const { addItem } = useCart();

    const images = [...(product.Images || [])];
    
    const mainImage = images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800';
    const price = Number(product.Price);
    const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
    const hoverImage = images[1];
    const isPriority = typeof index === 'number' && index < 4;

    const getSizes = () => {
        if (sizes) return sizes;
        if (layout === 'large') return "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";
        if (layout === 'compact') return "(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw";
        return "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            id: product.id,
            name: product.Name,
            price: discountPrice || price,
            image: mainImage,
            quantity: 1,
            slug: product.slug,
            originalPrice: discountPrice ? price : undefined
        });
        toast.success(t('products.addToCartSuccess'));
    };

    return (
        <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500">
            <div className="relative aspect-square overflow-hidden bg-zinc-50">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                        src={mainImage}
                        alt={product.Name}
                        fill
                        sizes={getSizes()}
                        priority={isPriority}
                        fetchPriority={isPriority ? "high" : undefined}
                        className={`object-cover transition-all duration-700 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
                    />
                    {hoverImage && (
                        <Image
                            src={hoverImage}
                            alt={product.Name}
                            fill
                            sizes={getSizes()}
                            className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                        />
                    )}
                </Link>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {product.BestSeller && (
                        <div className="bg-primary/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            {t('home.bestSellerLabel')}
                        </div>
                    )}
                    {discountPrice && (
                        <div className="bg-highlight text-black text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            {t('products.salePercent').replace('{percent}', Math.round((1 - discountPrice / price) * 100).toString())}
                        </div>
                    )}
                </div>

                {/* Quick Add Overlay */}
                {!hideInfo && (
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-3 bg-accent text-black text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-black hover:text-white active:scale-95 transition-all duration-300 rounded-xl"
                        >
                            {t('products.quickAdd')}
                        </button>
                    </div>
                )}
            </div>

            {!hideInfo && (
                <div className="p-6 space-y-3">
                    <Link href={`/products/${product.slug}`}>
                        <h2 className="text-[13px] font-bold tracking-tight text-[#0F172A] line-clamp-2 min-h-[40px] group-hover:text-accent transition-colors">
                            {product.Name}
                        </h2>
                    </Link>
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-50">
                        {discountPrice ? (
                            <div className="flex items-center gap-3">
                                <span className="text-base font-black text-red-600">
                                    ${discountPrice.toFixed(2)}
                                </span>
                                <span className="text-xs text-zinc-400 line-through">${price.toFixed(2)}</span>
                            </div>
                        ) : (
                            <span className="text-base font-black text-[#0F172A]">
                                ${price.toFixed(2)}
                            </span>
                        )}
                        <button 
                            onClick={handleAddToCart}
                            className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all"
                            aria-label={t('products.addToCart')}
                        >
                            <HiOutlineShoppingBag className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
