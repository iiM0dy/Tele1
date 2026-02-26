"use client";

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { HiX } from 'react-icons/hi';

export default function CartSuccessPopup() {
    const { showSuccess, setShowSuccess, lastAddedItem, setIsDrawerOpen } = useCart();
    const { t, language } = useLanguage();

    if (!lastAddedItem) return null;

    return (
        <div
            className={`fixed top-4 md:top-24 ${language === 'ar' ? 'left-4 md:left-8' : 'right-4 md:right-8'} z-100 w-[calc(100%-32px)] md:w-[320px] transition-all duration-500 ease-out ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'
                }`}
        >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-100 p-3 pr-4 flex items-center gap-4">
                {/* Product Image */}
                <div className="relative w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-zinc-100 p-1">
                    <Image
                        src={lastAddedItem.image}
                        alt={lastAddedItem.name}
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">
                        {t('products.addToCartSuccess') || 'Added to Cart'}
                    </p>
                    <h4 className="text-[12px] font-bold text-primary truncate">
                        {lastAddedItem.name}
                    </h4>
                </div>

                {/* View Cart Button */}
                <button
                    onClick={() => {
                        setShowSuccess(false);
                        setIsDrawerOpen(true);
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] hover:text-accent transition-colors decoration-2 underline-offset-4"
                >
                    {t('common.view') || 'View'}
                </button>

                {/* Close Button */}
                <button
                    onClick={() => setShowSuccess(false)}
                    className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
                >
                    <HiX className="w-3.5 h-3.5 text-zinc-400" />
                </button>
            </div>
        </div>
    );
}
