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
    };
}

export default function BestSellerCard({ product }: { product: any }) {
    const { t } = useLanguage();
    const { addItem, setIsDrawerOpen } = useCart();

    const mainImage = product.Images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800';
    const hoverImage = product.supImage1 || product.Images?.[1];
    const price = Number(product.Price);
    const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            id: product.id,
            name: product.Name,
            price: discountPrice || price,
            image: mainImage,
            quantity: 1,
            slug: product.slug
        });
        setIsDrawerOpen(true);
        toast.success(t('products.addToCartSuccess') || 'Added to cart');
    };

    return (
        <div className="flex flex-col group h-full">
            {/* Figure / Media Area */}
            <div className="relative aspect-square overflow-hidden bg-zinc-50 mb-4">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10">
                    {product.BestSeller && (
                        <span className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                            best seller
                        </span>
                    )}
                </div>

                {/* Main Image */}
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                        src={mainImage}
                        alt={product.Name}
                        fill
                        unoptimized
                        className={`object-cover transition-all duration-700 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                        sizes="(max-width: 699px) 74vw, (max-width: 999px) 38vw, 25vw"
                    />
                    {hoverImage && (
                        <Image
                            src={hoverImage}
                            alt={product.Name}
                            fill
                            unoptimized
                            className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                            sizes="(max-width: 699px) 74vw, (max-width: 999px) 38vw, 25vw"
                        />
                    )}
                </Link>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    type="submit"
                    className="absolute bottom-3 right-3 w-8 h-8 bg-white text-black flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Add to cart"
                >
                    <span className="sr-only">Add to cart</span>
                    <svg aria-hidden="true" focusable="false" fill="none" width="12" height="12" viewBox="0 0 12 12" className="icon icon-plus">
                        <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.1"></path>
                    </svg>
                </button>
            </div>

            {/* Info Area */}
            <div className="flex flex-col items-center text-center space-y-1">
                <Link 
                    href={`/products/${product.slug}`}
                    className="text-xs font-bold uppercase tracking-[0.1em] text-black hover:text-gold transition-colors"
                >
                    {product.Name}
                </Link>
                
                <div className="flex items-center gap-2">
                    {discountPrice ? (
                        <>
                            <span className="text-[11px] text-zinc-400 line-through">${price.toFixed(2)}</span>
                            <span className="text-[11px] font-bold text-red-600">${discountPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="text-[11px] font-bold text-black">${price.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
