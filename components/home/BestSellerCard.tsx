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
    supImage1?: string | null;
    supImage2?: string | null;
    IsTrending: boolean;
    BestSeller: boolean;
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

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            id: product.id,
            name: product.Name,
            price: discountPrice || price,
            originalPrice: discountPrice ? price : undefined,
            image: mainImage,
            quantity: 1,
            slug: product.slug
        });
        setIsDrawerOpen(true);
        toast.success(t('products.addToCartSuccess') || 'Added to cart');
    };

    return (
        <div className="flex flex-col group h-full bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Figure / Media Area */}
            <div className="relative aspect-square overflow-hidden bg-zinc-50">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.BestSeller && (
                        <span className="bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                            {t('home.bestSeller')}
                        </span>
                    )}
                    {discountPrice && (
                        <span className="bg-highlight text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                            {t('products.salePercent').replace('{percent}', Math.round((1 - discountPrice / price) * 100).toString())}
                        </span>
                    )}
                </div>

                {/* Main Image */}
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                        src={mainImage}
                        alt={product.Name}
                        fill
                        className={`object-cover transition-all duration-700 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
                        sizes="(max-width: 699px) 74vw, (max-width: 999px) 38vw, 25vw"
                        priority={isPriority}
                    />
                    {hoverImage && (
                        <Image
                            src={hoverImage}
                            alt={product.Name}
                            fill
                            className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                            sizes="(max-width: 699px) 74vw, (max-width: 999px) 38vw, 25vw"
                        />
                    )}
                </Link>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    type="submit"
                    className="absolute bottom-4 right-4 w-10 h-10 bg-accent text-black flex items-center justify-center rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white hover:scale-110 active:scale-95"
                    aria-label="Add to cart"
                >
                    <span className="sr-only">Add to cart</span>
                    <svg aria-hidden="true" focusable="false" fill="none" width="16" height="16" viewBox="0 0 12 12" className="icon icon-plus">
                        <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="2"></path>
                    </svg>
                </button>
            </div>

            {/* Info Area */}
            <div className="flex flex-col p-5 space-y-2">
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    {language === 'ar' && product.category?.nameAr ? product.category.nameAr : product.category?.name}
                </div>
                <Link 
                    href={`/products/${product.slug}`}
                    className="text-sm font-bold text-primary group-hover:text-accent transition-colors line-clamp-2 min-h-[40px]"
                >
                    {product.Name}
                </Link>
                
                <div className="flex items-center gap-3 pt-1">
                    {discountPrice ? (
                        <>
                            <span className="text-base font-black text-accent">${discountPrice.toFixed(2)}</span>
                            <span className="text-xs text-zinc-400 line-through font-medium">${price.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="text-base font-black text-primary">${price.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
