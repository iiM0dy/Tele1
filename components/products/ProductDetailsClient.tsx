"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'react-hot-toast';
import { HiMinus, HiPlus, HiX } from 'react-icons/hi';
import RelatedProducts from './RelatedProducts';
import { getRelatedProducts } from '@/lib/public-actions';

interface Product {
    id: string;
    Category: string; // Add Category ID for related products fetch
    Name: string;
    slug: string;
    description: string | null;
    Price: number;
    discountPrice: number | null;
    Images: string[];
    supImage1?: string | null;
    supImage2?: string | null;
    badge?: string | null;
    category: {
        name: string;
    } | null;
}

export default function ProductDetailsClient({ product }: { product: Product }) {
    const { t } = useLanguage();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [previewIdx, setPreviewIdx] = useState<number | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchRelated = async () => {
            if (product.Category) {
                const related = await getRelatedProducts(product.Category, product.id, 10);
                setRelatedProducts(related);
            }
        };
        fetchRelated();
    }, [product.Category, product.id]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = e.currentTarget.scrollLeft;
        const width = e.currentTarget.offsetWidth;
        if (width > 0) {
            const newIndex = Math.round(scrollLeft / width);
            if (newIndex !== activeSlide) {
                setActiveSlide(newIndex);
            }
        }
    };

    // Use pre-validated images from transformProduct
    const images = [...(product.Images || [])];

    if (process.env.NODE_ENV === 'development') {
        console.log('ProductDetailsClient images:', images);
    }

    const price = Number(product.Price);
    const discountPrice = product.discountPrice;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.Name,
            price: discountPrice || price,
            image: images[0],
            quantity: quantity,
            slug: product.slug
        });
        toast.success(t('products.addToCartSuccess') || 'Added to cart');
    };

    const scrollToImage = (idx: number) => {
        const element = document.getElementById(`product-image-${idx}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (previewIdx !== null) {
            setPreviewIdx((previewIdx + 1) % images.length);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (previewIdx !== null) {
            setPreviewIdx((previewIdx - 1 + images.length) % images.length);
        }
    };

    const handleImageClick = (idx: number) => {
        // Only open preview on desktop (md and up)
        if (window.innerWidth >= 768) {
            setPreviewIdx(idx);
        }
    };

    return (
        <>
            <section className="bg-white min-h-screen pt-[144px] pb-12">
            {/* Image Preview Modal (PhotoSwipe Style) */}
            {previewIdx !== null && (
                <div 
                    className="fixed inset-0 z-[100] bg-[#F9F9F9] flex flex-col items-center justify-center animate-in fade-in duration-700 ease-in-out"
                    onClick={() => setPreviewIdx(null)}
                >
                    <div className="pswp__scroll-wrap relative w-full h-full flex items-center justify-center overflow-hidden">
                        <div className="pswp__container w-full h-full flex items-center justify-center transition-transform duration-500 ease-out">
                            <div className="pswp__item relative w-full h-full flex items-center justify-center p-4 md:p-12">
                                <div className="pswp__zoom-wrap relative w-full h-full max-w-[951px] max-h-[951px] animate-in zoom-in-75 fade-in duration-700 ease-out">
                                    <Image
                                        src={images[previewIdx]}
                                        alt={product.Name}
                                        fill
                                        unoptimized
                                        className="object-contain pswp__img"
                                        priority
                                        sizes="951px"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PhotoSwipe Style Controller Bar */}
                    <div className="fixed bottom-12 left-0 right-0 z-[110] flex justify-center pswp__hide-on-close" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-4">
                            {/* Previous Button */}
                            <button 
                                className="pswp__button circle-button w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-black hover:bg-black hover:text-white transition-all duration-300"
                                onClick={handlePrev}
                                type="button"
                                aria-label="Previous"
                            >
                                <svg aria-hidden="true" focusable="false" fill="none" width="16" className="icon icon--direction-aware" viewBox="0 0 16 18">
                                    <path d="M11 1 3 9l8 8" stroke="currentColor" strokeLinecap="square"></path>
                                </svg>
                            </button>

                            {/* Top Bar with Close and Preloader */}
                            <div className="pswp__top-bar flex items-center">
                                <button 
                                    className="pswp__button circle-button circle-button--xl w-16 h-16 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-black hover:bg-black hover:text-white transition-all duration-300"
                                    onClick={() => setPreviewIdx(null)}
                                    type="button"
                                    aria-label="Close gallery"
                                >
                                    <svg aria-hidden="true" focusable="false" fill="none" width="16" className="icon" viewBox="0 0 16 16">
                                        <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" strokeWidth="1"></path>
                                    </svg>
                                </button>
                                
                                <div className="pswp__preloader ml-2 hidden">
                                    <svg aria-hidden="true" className="pswp__icn animate-spin" viewBox="0 0 32 32" width="32" height="32">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M21.2 16a5.2 5.2 0 1 1-5.2-5.2V8a8 8 0 1 0 8 8h-2.8Z" id="pswp__icn-loading" fill="currentColor"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Next Button */}
                            <button 
                                className="pswp__button circle-button w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-black hover:bg-black hover:text-white transition-all duration-300"
                                onClick={handleNext}
                                type="button"
                                aria-label="Next"
                            >
                                <svg aria-hidden="true" focusable="false" fill="none" width="16" className="icon icon--direction-aware" viewBox="0 0 16 18">
                                    <path d="m5 17 8-8-8-8" stroke="currentColor" strokeLinecap="square"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* Left: Product Gallery */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start order-1 lg:order-1">
                        <div className="flex flex-col md:flex-row gap-4 items-start w-full">
                            {/* Thumbnails - Hidden on Mobile, Sticky on Desktop */}
                            {images.length > 1 && (
                                <div className="hidden md:flex md:flex-col gap-4 md:w-20 md:overflow-y-auto scrollbar-hide md:sticky md:top-32">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => scrollToImage(idx)}
                                            className="relative aspect-square w-20 md:w-full flex-shrink-0 border border-zinc-200 transition-all hover:border-black cursor-pointer"
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.Name} thumbnail ${idx + 1}`}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Big Images Carousel/Stack */}
                            <div className="flex-1 w-full flex flex-col">
                                <div 
                                    className="flex-1 flex md:flex-col flex-row gap-0 md:gap-6 w-full overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide"
                                    onScroll={handleScroll}
                                >
                                    {images.map((img, idx) => (
                                        <div 
                                            key={idx}
                                            id={`product-image-${idx}`}
                                            className="relative aspect-square bg-zinc-50 overflow-hidden md:cursor-zoom-in max-w-[631px] max-h-[631px] mx-auto w-full group scroll-mt-32 snap-center flex-shrink-0"
                                            onClick={() => handleImageClick(idx)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.Name} image ${idx + 1}`}
                                                fill
                                                unoptimized
                                                priority={idx === 0}
                                                className="object-cover transition-transform duration-700 hover:scale-105"
                                                sizes="(max-width: 631px) 100vw, 631px"
                                            />
                                            {/* Zoom Indicator - Desktop Only */}
                                            <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile Pagination Dots */}
                                <div className="flex md:hidden justify-center gap-2 mt-4">
                                    {images.map((_, idx) => (
                                        <div 
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                                activeSlide === idx ? 'bg-zinc-800 scale-125' : 'bg-zinc-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Extra Information Accordion Section - Desktop Only placement (will be duplicated for mobile bottom) */}
                        <div id="product-extra-information" className="hidden lg:block product-content-below-gallery empty:hidden scroll-margin-offset mt-12 w-full">
                            <details className="accordion accordion--lg group border-t border-zinc-100" aria-expanded="false">
                                <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                                    <span className="accordion__toggle h6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em]">
                                        <svg aria-hidden="true" focusable="false" fill="none" strokeWidth="1.1" width="16" className="icon icon-picto-shield" viewBox="0 0 24 24">
                                            <path d="M12 1.254V22.75M21 11H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path clipRule="evenodd" d="M3 4.285v7.274c0 4.708 2.284 8.928 6.882 10.618l1.041.382a3.13 3.13 0 0 0 2.154 0l1.041-.382C18.716 20.487 21 16.267 21 11.559V4.285a1.418 1.418 0 0 0-.868-1.301A18.248 18.248 0 0 0 12 1.254a18.248 18.248 0 0 0-8.132 1.73A1.418 1.418 0 0 0 3 4.285Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                        LIFE TIME&nbsp;WARRANTY GUARANTEE
                                    </span>
                                    <span className="relative w-3 h-3 flex items-center justify-center">
                                        <span className="absolute w-full h-0.5 bg-black rounded-full transition-transform duration-300 rotate-90 group-open:rotate-0"></span>
                                        <span className="absolute w-full h-0.5 bg-black rounded-full"></span>
                                    </span>
                                </summary>

                                <div className="accordion__content pb-6 prose prose-sm max-w-none text-zinc-600">
                                    <p><strong>Tele1&nbsp;is committed to providing the highest standard of jewelry – which is why we offer a Life Time Warranty for all purchases of jewelry.</strong></p>
                                    <p>If your jewelry&nbsp;<strong>fades, breaks, or becomes damaged</strong>&nbsp;under normal use, you're entitled to a&nbsp;<strong>one-time replacement</strong>&nbsp;of the same item (including the same size and color).<br />All we ask is that you cover <strong>shipping cost.</strong></p>
                                    <p>If the original item is no longer available, you may choose a replacement of&nbsp;<strong>equal or lesser value</strong>.</p>
                                    <p><strong>What’s Not Covered:</strong></p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Lost or stolen items</li>
                                        <li>Accidental damage (e.g. crushed, bent, etc.)</li>
                                        <li>Damage caused by misuse or improper care</li>
                                        <li>Additional replacements beyond the one-time warranty</li>
                                    </ul>
                                </div>
                            </details>

                            <details className="accordion accordion--lg group border-t border-b border-zinc-100" aria-expanded="false">
                                <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                                    <span className="accordion__toggle h6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em]">
                                        <svg aria-hidden="true" focusable="false" fill="none" strokeWidth="1.1" width="16" className="icon icon-picto-delivery-truck" viewBox="0 0 24 24">
                                            <path d="M23.25 13.5V6a1.5 1.5 0 0 0-1.5-1.5h-12A1.5 1.5 0 0 0 8.25 6v6m0 0V6h-3a4.5 4.5 0 0 0-4.5 4.5v6a1.5 1.5 0 0 0 1.5 1.5H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M.75 12h3a1.5 1.5 0 0 0 1.5-1.5V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path clipRule="evenodd" d="M7.5 19.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm12 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M12 18h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                        SHIPPING POLICY
                                    </span>
                                    <span className="relative w-3 h-3 flex items-center justify-center">
                                        <span className="absolute w-full h-0.5 bg-black rounded-full transition-transform duration-300 rotate-90 group-open:rotate-0"></span>
                                        <span className="absolute w-full h-0.5 bg-black rounded-full"></span>
                                    </span>
                                </summary>

                                <div className="accordion__content pb-6 prose prose-sm max-w-none text-zinc-600">
                                    <p>• Delivery time Inside Beirut: 1-3 Working Days&nbsp;</p>
                                    <p>• Delivery time Outside Beirut: 3-5 Working Days</p>
                                </div>
                            </details>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col order-2 lg:order-2">
                        <div className="sticky top-32">
                            {/* 1. Badge Image/Text Block */}
                            <div className="product-info__block-item" data-block-type="image">
                                {product.badge && (
                                    <div className="inline-block bg-black px-4 py-2 mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                                            {product.badge}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* 2. Title & Subtitle Block - 0px spacing between name and subtitle */}
                            <div className="product-info__block-item space-y-0" data-block-type="title">
                                <h1 className="text-3xl md:text-4xl font-mono font-bold text-black uppercase tracking-tight leading-tight">
                                    {product.Name}
                                </h1>
                                <div className="product-subtitle">
                                    <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-500 font-sans">
                                        {product.category?.name || 'Luxury Collection'}
                                    </span>
                                </div>
                            </div>

                            {/* 3. Price Block - 8px spacing from category name */}
                            <div className="product-info__block-item mt-[8px]" data-block-type="price">
                                <div className="flex flex-col gap-1">
                                    {discountPrice ? (
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-2xl font-bold text-black font-mono">
                                                ${discountPrice.toFixed(2)}
                                            </span>
                                            <span className="text-lg text-zinc-400 line-through font-mono">
                                                ${price.toFixed(2)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-black font-mono">
                                            ${price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 4. Reviews Placeholder - 17px spacing from price */}
                            <div className="product-info__block-item mt-[17px]" data-block-type="reviews">
                                <div className="flex items-center gap-1 text-[#f9c74b]">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                    <span className="text-xs text-zinc-400 ml-2">(22 reviews)</span>
                                </div>
                            </div>

                            {/* 5. Description Block - 30px spacing from rating, no border line */}
                            {product.description && (
                                <div className="product-info__block-item mt-[30px]" data-block-type="description">
                                    <div className="prose prose-sm text-zinc-600 leading-relaxed max-w-none">
                                        <p>{product.description}</p>
                                    </div>
                                </div>
                            )}

                            {/* 6. Customization Section (GPO Style) */}
                            <div className="product-info__block-item space-y-6 pt-6 border-t border-zinc-100 mt-8" data-block-type="variant-picker">
                                {/* Quantity Selector */}
                                <div className="space-y-3 pt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                        Quantity
                                    </span>
                                    <div className="flex items-center w-32 border border-zinc-200">
                                        <button 
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="flex-1 h-12 flex items-center justify-center hover:bg-zinc-50 transition-colors text-black"
                                        >
                                            <HiMinus className="w-3 h-3" />
                                        </button>
                                        <span className="flex-1 h-12 flex items-center justify-center text-xs font-bold border-x border-zinc-200 text-black">
                                            {quantity}
                                        </span>
                                        <button 
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="flex-1 h-12 flex items-center justify-center hover:bg-zinc-50 transition-colors text-black"
                                        >
                                            <HiPlus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 7. Action Buttons Block */}
                            <div className="product-info__block-item pt-4" data-block-type="buy-buttons">
                                <button
                                    type="submit"
                                    onClick={handleAddToCart}
                                    className="w-full h-[44px] bg-[#191919] text-white rounded-xl flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all"
                                >
                                    Add to cart
                                </button>
                            </div>

                            {/* 8. Trust Badges/Info */}
                            <div className="product-info__block-item grid grid-cols-1 gap-4 pt-8 border-t border-zinc-100">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-5 h-5 bg-black rounded-full">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-800">
                                        Free Shipping
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-1 bg-black rounded-full" />
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">30-Day Luxury Guarantee</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-1 bg-black rounded-full" />
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Authenticity Certified</span>
                                </div>
                            </div>

                            {/* Extra Information Accordion Section - Mobile Only placement */}
                            <div id="product-extra-information-mobile" className="lg:hidden product-content-below-gallery empty:hidden scroll-margin-offset mt-12 w-full">
                                <details className="accordion accordion--lg group border-t border-zinc-100" aria-expanded="false">
                                    <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                                        <span className="accordion__toggle h6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em]">
                                            <svg aria-hidden="true" focusable="false" fill="none" strokeWidth="1.1" width="16" className="icon icon-picto-shield" viewBox="0 0 24 24">
                                                <path d="M12 1.254V22.75M21 11H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path clipRule="evenodd" d="M3 4.285v7.274c0 4.708 2.284 8.928 6.882 10.618l1.041.382a3.13 3.13 0 0 0 2.154 0l1.041-.382C18.716 20.487 21 16.267 21 11.559V4.285a1.418 1.418 0 0 0-.868-1.301A18.248 18.248 0 0 0 12 1.254a18.248 18.248 0 0 0-8.132 1.73A1.418 1.418 0 0 0 3 4.285Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            LIFE TIME&nbsp;WARRANTY GUARANTEE
                                        </span>
                                        <span className="relative w-3 h-3 flex items-center justify-center">
                                            <span className="absolute w-full h-0.5 bg-black rounded-full transition-transform duration-300 rotate-90 group-open:rotate-0"></span>
                                            <span className="absolute w-full h-0.5 bg-black rounded-full"></span>
                                        </span>
                                    </summary>

                                    <div className="accordion__content pb-6 prose prose-sm max-w-none text-zinc-600">
                                        <p><strong>Tele1&nbsp;is committed to providing the highest standard of jewelry – which is why we offer a Life Time Warranty for all purchases of jewelry.</strong></p>
                                        <p>If your jewelry&nbsp;<strong>fades, breaks, or becomes damaged</strong>&nbsp;under normal use, you're entitled to a&nbsp;<strong>one-time replacement</strong>&nbsp;of the same item (including the same size and color).<br />All we ask is that you cover <strong>shipping cost.</strong></p>
                                        <p>If the original item is no longer available, you may choose a replacement of&nbsp;<strong>equal or lesser value</strong>.</p>
                                        <p><strong>What’s Not Covered:</strong></p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>Lost or stolen items</li>
                                            <li>Accidental damage (e.g. crushed, bent, etc.)</li>
                                            <li>Damage caused by misuse or improper care</li>
                                            <li>Additional replacements beyond the one-time warranty</li>
                                        </ul>
                                    </div>
                                </details>

                                <details className="accordion accordion--lg group border-t border-b border-zinc-100" aria-expanded="false">
                                    <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                                        <span className="accordion__toggle h6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em]">
                                            <svg aria-hidden="true" focusable="false" fill="none" strokeWidth="1.1" width="16" className="icon icon-picto-delivery-truck" viewBox="0 0 24 24">
                                                <path d="M23.25 13.5V6a1.5 1.5 0 0 0-1.5-1.5h-12A1.5 1.5 0 0 0 8.25 6v6m0 0V6h-3a4.5 4.5 0 0 0-4.5 4.5v6a1.5 1.5 0 0 0 1.5 1.5H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M.75 12h3a1.5 1.5 0 0 0 1.5-1.5V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path clipRule="evenodd" d="M7.5 19.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm12 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M12 18h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            SHIPPING POLICY
                                        </span>
                                        <span className="relative w-3 h-3 flex items-center justify-center">
                                            <span className="absolute w-full h-0.5 bg-black rounded-full transition-transform duration-300 rotate-90 group-open:rotate-0"></span>
                                            <span className="absolute w-full h-0.5 bg-black rounded-full"></span>
                                        </span>
                                    </summary>

                                    <div className="accordion__content pb-6 prose prose-sm max-w-none text-zinc-600">
                                        <p>• Delivery time Inside Beirut: 1-3 Working Days&nbsp;</p>
                                        <p>• Delivery time Outside Beirut: 3-5 Working Days</p>
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <RelatedProducts products={relatedProducts} />
    </>
);
}
