"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { HiX, HiMinus, HiPlus, HiOutlineShoppingBag } from 'react-icons/hi';

export default function CartDrawer() {
    const { items, removeItem, updateQuantity, subtotal, cartCount, isDrawerOpen, setIsDrawerOpen } = useCart();
    const { t, language } = useLanguage();
    const [mounted, setMounted] = useState(false);

    const isRTL = language === 'ar';

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    if (!mounted) return null;

    const freeShippingThreshold = 1000; // Example threshold
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-100 transition-opacity duration-300 ease-in-out ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <div
                id="CartPopup"
                className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} bottom-0 w-full sm:max-w-[420px] bg-white z-101 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isDrawerOpen
                    ? 'translate-x-0'
                    : (isRTL ? '-translate-x-full' : 'translate-x-full')
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-zinc-100">
                    <h2 className="text-xl font-semibold text-[#1a1a1a]">
                        {t('cart.yourCart')} • {cartCount}
                    </h2>
                    <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500"
                        aria-label={t('cart.closeCart')}
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>



                {/* Cart Items */}
                <div className="grow overflow-y-auto px-6 scrollbar-hide">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 py-12">
                            <HiOutlineShoppingBag className="w-16 h-16 opacity-20" />
                            <h3 className="text-lg font-medium text-zinc-600">{t('cart.emptyCart')}</h3>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="text-sm font-bold uppercase tracking-widest text-accent/90 bg-accent/10 px-4 py-2 rounded-xl hover:text-accent hover:bg-accent/20 transition-colors"
                            >
                                {t('cart.startShopping')}
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="py-6 border-b border-[#f0f0f0] last:border-0">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 shrink-0">
                                        <Link href={`/products/${item.slug}`} onClick={() => setIsDrawerOpen(false)}>
                                            <div className="relative w-full h-full rounded-lg border border-[#eee] overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-1"
                                                    sizes="80px"
                                                />
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Product Details Column */}
                                    <div className="grow flex flex-col justify-between">
                                        {/* Title & Delete Row */}
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-[0.95rem] font-semibold leading-tight pr-2">
                                                <Link
                                                    href={`/products/${item.slug}`}
                                                    dir="ltr"
                                                    className="text-[#1a1a1a] hover:text-[#555] transition-colors block"
                                                    onClick={() => setIsDrawerOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            </h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity p-0.5"
                                                aria-label={t('cart.remove')}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.28125 3.28125L3.86719 12.6562C3.89502 13.1979 4.28906 13.5938 4.80469 13.5938H10.1953C10.713 13.5938 11.0997 13.1979 11.1328 12.6562L11.7188 3.28125" stroke="#8F8F8F" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    <path d="M2.34375 3.28125H12.6562H2.34375Z" fill="#8F8F8F"></path>
                                                    <path d="M2.34375 3.28125H12.6562" stroke="#8F8F8F" strokeWidth="0.9375" strokeMiterlimit="10" strokeLinecap="round"></path>
                                                    <path d="M9.60938 5.15625L9.375 11.7188M5.625 3.28125V2.10938C5.62473 2.01697 5.64273 1.92541 5.67797 1.83998C5.71321 1.75455 5.76499 1.67693 5.83034 1.61159C5.89568 1.54624 5.9733 1.49446 6.05873 1.45922C6.14416 1.42398 6.23571 1.40598 6.32812 1.40625H8.67188C8.76429 1.40598 8.85584 1.42398 8.94127 1.45922C9.0267 1.49446 9.10432 1.54624 9.16966 1.61159C9.23501 1.67693 9.28679 1.75455 9.32203 1.83998C9.35727 1.92541 9.37527 2.01697 9.375 2.10938V3.28125H5.625ZM7.5 5.15625V11.7188V5.15625ZM5.39062 5.15625L5.625 11.7188L5.39062 5.15625Z" stroke="#8F8F8F" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Quantity & Price Row */}
                                        <div className="flex items-center justify-between mt-auto">
                                            {/* Quantity Stepper */}
                                            <div className="flex items-center border border-[#dcdcdc] rounded-md h-8 w-fit bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-[#f9f9f9] transition-colors"
                                                    aria-label={t('cart.decreaseQuantity')}
                                                >
                                                    <svg className="w-2.5 h-2.5 fill-[#333]" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 10c0-.414.336-.75.75-.75h8.5c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75Z"></path>
                                                    </svg>
                                                </button>
                                                <input
                                                    className="w-[30px] border-none text-center text-[0.9rem] font-medium text-[#1a1a1a] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    type="number"
                                                    aria-label={t('cart.quantity')}
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                                    min="0"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-[#f9f9f9] transition-colors"
                                                    aria-label={t('cart.increaseQuantity')}
                                                >
                                                    <svg className="w-2.5 h-2.5 fill-[#333]" viewBox="0 0 20 20">
                                                        <path d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z"></path>
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <span className="font-semibold text-base text-[#1a1a1a]" dir="ltr">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-zinc-100 bg-white space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span className="uppercase tracking-widest text-sm text-zinc-500">{t('cart.subtotal')}</span>
                            <span className="text-[#1a1a1a]">${subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 uppercase tracking-widest text-center">
                            {t('cart.shippingCalculated')}
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/checkout"
                                onClick={() => setIsDrawerOpen(false)}
                                className="flex items-center justify-center w-full py-4 bg-accent text-white text-sm font-bold uppercase tracking-[0.15em] transition-all hover:bg-accent/90 active:scale-[0.98] rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
                            >
                                {t('cart.proceedToCheckout')} ${subtotal.toFixed(2)}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
