"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

import { usePathname } from 'next/navigation';

interface Product {
    id: string;
    Name: string;
    slug: string;
    Price: any;
    discountPrice: any;
    Images: string;
    IsTrending: boolean;
    BestSeller: boolean;
    category: {
        name: string;
    };
}

export function ProductCard({ product, index }: { product: any; index: number }) {
    const { t } = useLanguage();
    const { addItem } = useCart();
    const pathname = usePathname();

    const mainImage = product.Images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800';
    const hoverImage = product.Images?.[1];
    const price = Number(product.Price);
    const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
    const isPriority = index < 4;

    console.log('ProductCard rendering:', { name: product.Name, mainImage });

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
        toast.success(t('products.addToCartSuccess') || 'Added to cart');
    };

    return (
        <Link href={`/products/${product.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500">
            <div className="relative aspect-square overflow-hidden bg-zinc-50">
                <Image
                    src={mainImage}
                    alt={product.Name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    priority={isPriority}
                    fetchPriority={isPriority ? "high" : undefined}
                    className={`object-cover transition-all duration-700 ${hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`}
                />
                {hoverImage && (
                    <Image
                        src={hoverImage}
                        alt={product.Name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                    />
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {product.BestSeller && (
                        <div className="bg-primary/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            best seller
                        </div>
                    )}
                    {discountPrice && (
                        <div className="bg-highlight text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            sale {Math.round((1 - discountPrice / price) * 100)}% off
                        </div>
                    )}
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                    <button
                        onClick={handleAddToCart}
                        className="w-full py-3 bg-accent text-black text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-black hover:text-white active:scale-95 transition-all duration-300 rounded-xl"
                    >
                        quick add
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-3">
                <h2 className="text-[13px] font-bold tracking-tight text-[#0F172A] line-clamp-2 min-h-[40px] group-hover:text-accent transition-colors">
                    {product.Name}
                </h2>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-50">
                    {discountPrice ? (
                        <div className="flex items-center gap-3">
                            <span className="text-base font-black text-accent">
                                ${discountPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-zinc-400 line-through">${price.toFixed(2)}</span>
                        </div>
                    ) : (
                        <span className="text-base font-black text-[#0F172A]">
                            ${price.toFixed(2)}
                        </span>
                    )}
                    <div className="w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                        <HiOutlineShoppingBag className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function ProductGrid({ products, title }: { products: Product[], title: string }) {
    const pathname = usePathname();
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
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
                
                {!isProductsPage && (
                    <div className="mt-20 flex justify-center">
                        <Link 
                            href="/products" 
                            className="px-12 py-4 border border-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-xl"
                        >
                            View All Products
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
