"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { HiOutlineShoppingBag } from 'react-icons/hi';
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
    category: {
        name: string;
    };
}

export function ProductCard({ product }: { product: any }) {
    const { t } = useLanguage();
    const { addItem } = useCart();

    const mainImage = product.Images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800';
    const hoverImage = product.supImage1 || product.Images?.[1];
    const price = Number(product.Price);
    const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;

    console.log('ProductCard rendering:', { name: product.Name, mainImage });

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
        toast.success(t('products.addToCartSuccess') || 'Added to cart');
    };

    return (
        <Link href={`/products/${product.slug}`} className="group flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50 mb-6">
                <Image
                    src={mainImage}
                    alt={product.Name}
                    fill
                    unoptimized
                    className={`object-cover transition-all duration-700 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
                />
                {hoverImage && (
                    <Image
                        src={hoverImage}
                        alt={product.Name}
                        fill
                        unoptimized
                        className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                    />
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-0 flex flex-col gap-1">
                    {product.BestSeller && (
                        <div className="bg-black text-white text-[8px] font-bold px-3 py-1 uppercase tracking-[0.2em]">
                            best seller
                        </div>
                    )}
                    {product.IsTrending && !product.BestSeller && (
                        <div className="bg-zinc-800 text-white text-[8px] font-bold px-3 py-1 uppercase tracking-[0.2em]">
                            trending
                        </div>
                    )}
                    {discountPrice && (
                        <div className="bg-gold text-white text-[8px] font-bold px-3 py-1 uppercase tracking-[0.2em]">
                            on sale
                        </div>
                    )}
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                    <button
                        onClick={handleAddToCart}
                        className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:bg-black hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                    >
                        quick add
                    </button>
                </div>
            </div>

            <div className="space-y-2 text-center">
                <h3 className="text-sm font-medium tracking-wide text-zinc-900 uppercase-tracking">
                    {product.Name}
                </h3>
                <div className="flex flex-col items-center gap-1">
                    {discountPrice ? (
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-zinc-400">Sale price</span>
                            <span className="text-sm font-bold text-gold font-serif">
                                ${discountPrice.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-zinc-400">Regular price</span>
                                <span className="text-[10px] text-zinc-500 line-through">${price.toFixed(2)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="text-xs text-zinc-400">Price</span>
                            <span className="text-sm font-bold text-black font-serif">
                                ${price.toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function ProductGrid({ products, title }: { products: Product[], title: string }) {
    if (!products.length) return null;

    return (
        <section className="py-12 bg-white">
            <div className="w-full">
                {title && (
                    <div className="flex flex-col items-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-widest uppercase mb-4 text-center text-black">
                            {title}
                        </h2>
                        <div className="w-12 h-[2px] bg-gold" />
                    </div>
                )}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                
                <div className="mt-20 flex justify-center">
                    <Link 
                        href="/products" 
                        className="px-12 py-4 border border-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
}
