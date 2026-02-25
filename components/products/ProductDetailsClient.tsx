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
    badge?: string | null;
    color?: string | null;
    model?: string | null;
    category: {
        name: string;
        nameAr?: string | null;
    } | null;
}

export default function ProductDetailsClient({ product }: { product: Product }) {
    const { t, language } = useLanguage();
    const { addItem } = useCart();
    // Use pre-validated images from transformProduct
    const images = [...(product.Images || [])];
    const [quantity, setQuantity] = useState(1);
    const [previewIdx, setPreviewIdx] = useState<number | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset touch end
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            setActiveSlide((prev) => (prev + 1) % images.length);
        } else if (isRightSwipe) {
            setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    useEffect(() => {
        if (images.length <= 1 || isHovered || previewIdx !== null) return;
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length, isHovered, previewIdx]);

    useEffect(() => {
        const fetchRelated = async () => {
            if (product.Category) {
                const related = await getRelatedProducts(product.Category, product.id, 10);
                setRelatedProducts(related);
            }
        };
        fetchRelated();
    }, [product.Category, product.id]);

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
            originalPrice: discountPrice ? price : undefined,
            image: images[0],
            quantity: quantity,
            slug: product.slug
        });
        toast.success(t('products.addToCartSuccess') || 'Added to cart');
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
                                            className="object-contain pswp__img"
                                            priority
                                            sizes="(max-width: 768px) 100vw, 951px"
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
                                    className="pswp__button circle-button w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-primary hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 shadow-sm"
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
                                        className="pswp__button circle-button circle-button--xl w-16 h-16 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-primary hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 shadow-lg"
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
                                    className="pswp__button circle-button w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-primary hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 shadow-sm"
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

                <div className="w-full px-4 md:px-[48px]">
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
                                                onClick={() => setActiveSlide(idx)}
                                                className={`relative aspect-square w-20 md:w-full flex-shrink-0 border transition-all cursor-pointer rounded-lg overflow-hidden ${activeSlide === idx ? 'border-accent ring-1 ring-accent' : 'border-zinc-200 hover:border-accent'
                                                    }`}
                                                aria-label={`View image ${idx + 1}`}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`${product.Name} thumbnail ${idx + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 20vw, 100px"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Big Images Carousel/Stack */}
                                <div className="flex-1 w-full flex flex-col relative group"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    <div
                                        className="relative w-full aspect-square md:max-w-[500px] lg:max-w-[600px] mx-auto bg-zinc-50 rounded-lg overflow-hidden touch-pan-y"
                                        onTouchStart={onTouchStart}
                                        onTouchMove={onTouchMove}
                                        onTouchEnd={onTouchEnd}
                                    >
                                        {/* Slider Track */}
                                        <div
                                            className="flex h-full transition-transform duration-500 ease-out"
                                            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                                        >
                                            {images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="min-w-full h-full relative cursor-zoom-in"
                                                    onClick={() => handleImageClick(idx)}
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-label={`View full screen image ${idx + 1}`}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            handleImageClick(idx);
                                                        }
                                                    }}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${product.Name} image ${idx + 1}`}
                                                        fill
                                                        priority={idx === 0}
                                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 800px"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Navigation Arrows (Visible on hover) */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
                                                    }}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-10"
                                                    aria-label="Previous image"
                                                >
                                                    <svg className="w-5 h-5 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveSlide((prev) => (prev + 1) % images.length);
                                                    }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm z-10"
                                                    aria-label="Next image"
                                                >
                                                    <svg className="w-5 h-5 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}

                                        {/* Zoom Indicator */}
                                        <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block pointer-events-none">
                                            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Mobile Pagination Dots */}
                                    {images.length > 1 && (
                                        <div className="flex justify-center gap-2 mt-4">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveSlide(idx)}
                                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'bg-zinc-800 scale-125' : 'bg-zinc-300 hover:bg-zinc-400'
                                                        }`}
                                                    aria-label={`Go to slide ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div id="product-extra-information" className="hidden lg:block product-content-below-gallery empty:hidden scroll-margin-offset mt-12 w-full">
                                <details className="accordion accordion--lg group border-t border-zinc-100">
                                    <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                                        <span className="accordion__toggle h6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F172A]">
                                            <svg aria-hidden="true" focusable="false" fill="none" strokeWidth="1.1" width="16" className="icon icon-picto-shield text-accent" viewBox="0 0 24 24">
                                                <path d="M12 1.254V22.75M21 11H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path clipRule="evenodd" d="M3 4.285v7.274c0 4.708 2.284 8.928 6.882 10.618l1.041.382a3.13 3.13 0 0 0 2.154 0l1.041-.382C18.716 20.487 21 16.267 21 11.559V4.285a1.418 1.418 0 0 0-.868-1.301A18.248 18.248 0 0 0 12 1.254a18.248 18.248 0 0 0-8.132 1.73A1.418 1.418 0 0 0 3 4.285Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            {t('products.warranty.title')}
                                        </span>
                                        <span className="relative w-3 h-3 flex items-center justify-center">
                                            <span className="absolute w-full h-0.5 bg-accent rounded-full transition-transform duration-300 rotate-90 group-open:rotate-0"></span>
                                            <span className="absolute w-full h-0.5 bg-accent rounded-full"></span>
                                        </span>
                                    </summary>

                                    <div className="accordion__content pb-6 prose prose-sm max-w-none text-zinc-600">
                                        <p><strong>{t('products.warranty.intro')}</strong></p>
                                        <p>{t('products.warranty.coverage')}<br />{t('products.warranty.shippingCost')}</p>
                                        <p>{t('products.warranty.unavailableItem')}</p>
                                        <p><strong>{t('products.warranty.whatsNotCovered')}</strong></p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>{t('products.warranty.notCoveredItems.lost')}</li>
                                            <li>{t('products.warranty.notCoveredItems.accidental')}</li>
                                            <li>{t('products.warranty.notCoveredItems.misuse')}</li>
                                            <li>{t('products.warranty.notCoveredItems.limit')}</li>
                                        </ul>
                                    </div>
                                </details>

                                <details className="accordion accordion--lg group border-t border-b border-zinc-100">
                                    <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                                        <span className="accordion__toggle h6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F172A]">
                                            <svg aria-hidden="true" focusable="false" fill="none" strokeWidth="1.1" width="16" className="icon icon-picto-delivery-truck text-accent" viewBox="0 0 24 24">
                                                <path d="M23.25 13.5V6a1.5 1.5 0 0 0-1.5-1.5h-12A1.5 1.5 0 0 0 8.25 6v6m0 0V6h-3a4.5 4.5 0 0 0-4.5 4.5v6a1.5 1.5 0 0 0 1.5 1.5H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M.75 12h3a1.5 1.5 0 0 0 1.5-1.5V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path clipRule="evenodd" d="M7.5 19.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm12 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M12 18h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>
                                            {t('products.shipping.title')}
                                        </span>
                                        <span className="relative w-3 h-3 flex items-center justify-center">
                                            <span className="absolute w-full h-0.5 bg-accent rounded-full transition-transform duration-300 rotate-90 group-open:rotate-0"></span>
                                            <span className="absolute w-full h-0.5 bg-accent rounded-full"></span>
                                        </span>
                                    </summary>

                                    <div className="accordion__content pb-6 prose prose-sm max-w-none text-zinc-600">
                                        <p>{t('products.shipping.insideBeirut')}</p>
                                        <p>{t('products.shipping.outsideBeirut')}</p>
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
                                        <div className="inline-block bg-accent px-4 py-2 mb-4 rounded-lg shadow-sm shadow-accent/20">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                                                {product.badge}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Title & Subtitle Block - 0px spacing between name and subtitle */}
                                <div className="product-info__block-item space-y-1" data-block-type="title">
                                    <h1 className="text-3xl md:text-4xl font-sans font-extrabold text-[#0F172A] uppercase tracking-tight leading-tight">
                                        {product.Name}
                                    </h1>
                                    <div className="product-subtitle">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent font-sans">
                                            {language === 'ar' && product.category?.nameAr ? product.category.nameAr : (product.category?.name || 'Tech Accessories')}
                                        </span>
                                    </div>
                                </div>

                                {/* 3. Price Block - 8px spacing from category name */}
                                <div className="product-info__block-item mt-6" data-block-type="price">
                                    <div className="flex flex-col gap-1">
                                        {discountPrice ? (
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-3xl font-extrabold text-accent">
                                                    ${discountPrice.toFixed(2)}
                                                </span>
                                                <span className="text-lg text-zinc-400 line-through font-medium">
                                                    ${price.toFixed(2)}
                                                </span>
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
                                                    Save {Math.round(((price - discountPrice) / price) * 100)}%
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-3xl font-extrabold text-[#0F172A]">
                                                ${price.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 4. Reviews Placeholder - 17px spacing from price */}
                                <div className="product-info__block-item mt-4" data-block-type="reviews">
                                    <div className="flex items-center gap-1 text-accent">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                {/* 5. Description Block - 30px spacing from rating, no border line */}
                                {product.description && (
                                    <div className="product-info__block-item mt-8" data-block-type="description">
                                        <div className="prose prose-sm text-zinc-600 leading-relaxed max-w-none">
                                            <p className="font-medium text-zinc-800 mb-2">{t('products.productOverview')}</p>
                                            <p>{product.description}</p>
                                        </div>
                                    </div>
                                )}

                                {/* 6. Model & Color Section */}
                                {(product.model || product.color) && (
                                    <div className="product-info__block-item mt-8 grid grid-cols-2 gap-4" data-block-type="specs">
                                        {product.model && (
                                            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 transition-all">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                        {t('products.model')}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-[#0F172A]">
                                                    {product.model}
                                                </span>
                                            </div>
                                        )}
                                        {product.color && (
                                            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 transition-all">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                        {t('products.color')}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                                                    {product.color}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 7. Customization Section (GPO Style) */}
                                <div className="product-info__block-item space-y-6 pt-6 border-t border-zinc-100 mt-8" data-block-type="variant-picker">
                                    {/* Quantity Selector */}
                                    <div className="space-y-3 pt-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A]">
                                            {t('products.quantity')}
                                        </span>
                                        <div className="flex items-center w-36 border-2 border-zinc-100 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="flex-1 h-12 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                                            >
                                                <HiMinus className="w-4 h-4" />
                                            </button>
                                            <span className="flex-1 h-12 flex items-center justify-center text-sm font-bold bg-white text-[#0F172A]">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="flex-1 h-12 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                                            >
                                                <HiPlus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 8. Action Buttons Block */}
                                <div className="product-info__block-item pt-6" data-block-type="buy-buttons">
                                    <button
                                        type="submit"
                                        onClick={handleAddToCart}
                                        className="w-full h-[56px] bg-accent text-white rounded-xl flex items-center justify-center text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 active:scale-[0.98] group"
                                    >
                                        <span className="mr-2 group-hover:scale-110 transition-transform">{t('products.addToCart')}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* 9. Trust Badges/Info */}
                                <div className="product-info__block-item grid grid-cols-1 gap-4 pt-8 border-t border-zinc-100">
                                    <div className="flex items-center gap-3 group">
                                        <div className="flex items-center justify-center w-6 h-6 bg-accent/10 text-accent rounded-full group-hover:bg-accent group-hover:text-white transition-all">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A]">
                                            {t('products.features.freeExpressShipping')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="flex items-center justify-center w-6 h-6 bg-accent/10 text-accent rounded-full group-hover:bg-accent group-hover:text-white transition-all">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{t('products.features.techGuarantee')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="flex items-center justify-center w-6 h-6 bg-accent/10 text-accent rounded-full group-hover:bg-accent group-hover:text-white transition-all">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{t('products.features.compatibility')}</span>
                                    </div>
                                </div>

                                {/* Extra Information Accordion Section - Mobile Only placement */}
                                <div id="product-extra-information-mobile" className="lg:hidden product-content-below-gallery empty:hidden scroll-margin-offset mt-12 w-full">
                                    <details className="accordion accordion--lg group border-t border-zinc-100" aria-expanded="false">
                                        <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                                            <span className="accordion__toggle h6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F172A]">
                                                <svg aria-hidden="true" focusable="false" fill="none" strokeWidth="1.1" width="16" className="icon icon-picto-shield text-accent" viewBox="0 0 24 24">
                                                    <path d="M12 1.254V22.75M21 11H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    <path clipRule="evenodd" d="M3 4.285v7.274c0 4.708 2.284 8.928 6.882 10.618l1.041.382a3.13 3.13 0 0 0 2.154 0l1.041-.382C18.716 20.487 21 16.267 21 11.559V4.285a1.418 1.418 0 0 0-.868-1.301A18.248 18.248 0 0 0 12 1.254a18.248 18.248 0 0 0-8.132 1.73A1.418 1.418 0 0 0 3 4.285Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                                {t('products.warranty.title')}
                                            </span>
                                            <span className="relative w-3 h-3 flex items-center justify-center">
                                                <span className="absolute w-full h-0.5 bg-accent rounded-full transition-transform duration-300 rotate-90 group-open:rotate-0"></span>
                                                <span className="absolute w-full h-0.5 bg-accent rounded-full"></span>
                                            </span>
                                        </summary>

                                        <div className="accordion__content pb-6 prose prose-sm max-w-none text-zinc-600">
                                            <p><strong>{t('products.warranty.intro')}</strong></p>
                                            <p>{t('products.warranty.coverage')}<br />{t('products.warranty.shippingCost')}</p>
                                            <p>{t('products.warranty.unavailableItem')}</p>
                                            <p><strong>{t('products.warranty.whatsNotCovered')}</strong></p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>{t('products.warranty.notCoveredItems.lost')}</li>
                                                <li>{t('products.warranty.notCoveredItems.accidental')}</li>
                                                <li>{t('products.warranty.notCoveredItems.misuse')}</li>
                                                <li>{t('products.warranty.notCoveredItems.limit')}</li>
                                            </ul>
                                        </div>
                                    </details>

                                    <details className="accordion accordion--lg group border-t border-b border-zinc-100" aria-expanded="false">
                                        <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                                            <span className="accordion__toggle h6 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0F172A]">
                                                <svg aria-hidden="true" focusable="false" fill="none" strokeWidth="1.1" width="16" className="icon icon-picto-delivery-truck text-accent" viewBox="0 0 24 24">
                                                    <path d="M23.25 13.5V6a1.5 1.5 0 0 0-1.5-1.5h-12A1.5 1.5 0 0 0 8.25 6v6m0 0V6h-3a4.5 4.5 0 0 0-4.5 4.5v6a1.5 1.5 0 0 0 1.5 1.5H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    <path d="M.75 12h3a1.5 1.5 0 0 0 1.5-1.5V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    <path clipRule="evenodd" d="M7.5 19.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm12 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    <path d="M12 18h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                                {t('products.shipping.title')}
                                            </span>
                                            <span className="relative w-3 h-3 flex items-center justify-center">
                                                <span className="absolute w-full h-0.5 bg-accent rounded-full transition-transform duration-300 rotate-90 group-open:rotate-0"></span>
                                                <span className="absolute w-full h-0.5 bg-accent rounded-full"></span>
                                            </span>
                                        </summary>

                                        <div className="accordion__content pb-6 prose prose-sm max-w-none text-zinc-600">
                                            <p>{t('products.shipping.insideBeirut')}</p>
                                            <p>{t('products.shipping.outsideBeirut')}</p>
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
