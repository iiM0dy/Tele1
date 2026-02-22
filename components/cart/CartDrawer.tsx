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
                className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ease-in-out ${
                    isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <div 
                id="CartPopup"
                className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} bottom-0 w-full sm:max-w-[420px] bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                    isDrawerOpen 
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
                        aria-label="Close cart"
                    >
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Rewards / Progress Bar */}
                <div className="p-5 md:p-6 bg-[#fafafa] border-b border-zinc-100">
                    <div className="text-center mb-4 text-sm text-[#444]">
                        {subtotal < freeShippingThreshold ? (
                            <p className="text-sm text-[#444]">{t('cart.addMoreForFreeShipping').replace('{amount}', `$${(freeShippingThreshold - subtotal).toFixed(2)}`)}</p>
                        ) : (
                            <p className="font-bold text-green-600">{t('cart.unlockedFreeShipping')}</p>
                        )}
                    </div>
                    
                    <div className="relative h-[6px] w-full bg-[#e0e0e0] rounded-full my-6">
                        <div 
                            className="h-full bg-accent rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                            style={{ width: `${progress}%` }}
                        />
                        
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-[10%] pointer-events-none">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                progress >= 50 ? 'bg-accent border-accent text-white' : 'bg-white border-[#e0e0e0] text-zinc-400'
                            }`}>
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8.798 7.992c-.343-.756-1.098-1.242-1.928-1.242-1.173 0-2.119.954-2.119 2.122 0 1.171.95 2.128 2.125 2.128h.858c-.595.51-1.256.924-1.84 1.008-.41.058-.694.438-.635.848.058.41.438.695.848.636 1.11-.158 2.128-.919 2.803-1.53.121-.11.235-.217.341-.322.106.105.22.213.34.322.676.611 1.693 1.372 2.804 1.53.41.059.79-.226.848-.636.059-.41-.226-.79-.636-.848-.583-.084-1.244-.498-1.839-1.008h.858c1.176 0 2.125-.957 2.125-2.128 0-1.168-.946-2.122-2.119-2.122-.83 0-1.585.486-1.928 1.242l-.453.996-.453-.996Zm-.962 1.508h-.96c-.343 0-.625-.28-.625-.628 0-.344.28-.622.619-.622.242 0 .462.142.563.363l.403.887Zm3.79 0h-.96l.403-.887c.1-.221.32-.363.563-.363.34 0 .619.278.619.622 0 .347-.282.628-.625.628Z" />
                                </svg>
                            </div>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                progress >= 100 ? 'bg-accent border-accent text-white' : 'bg-white border-[#e0e0e0] text-zinc-400'
                            }`}>
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.499 6.75c0-1.519 1.231-2.75 2.75-2.75h9.5c1.519 0 2.75 1.231 2.75 2.75v2.945l.002.055c0 .018 0 .037-.002.055v3.445c0 1.519-1.231 2.75-2.75 2.75h-9.5c-1.519 0-2.75-1.231-2.75-2.75v-6.5Zm13.5 2.25h-1.248c-.414 0-.75.336-.75.75s.336.75.75.75h1.248v2.75c0 .69-.56 1.25-1.25 1.25h-4.748v-1c0-.414-.336-.75-.75-.75s-.75.336-.75.75v1h-3.252c-.69 0-1.25-.56-1.25-1.25v-2.792c.292-.102.502-.38.502-.708 0-.327-.21-.606-.502-.708v-2.292c0-.69.56-1.25 1.25-1.25h3.252v.75c0 .414.336.75.75.75s.75-.336.75-.75v-.75h4.748c.69 0 1.25.56 1.25 1.25v2.25Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-grow overflow-y-auto px-6 scrollbar-hide">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4 py-12">
                            <HiOutlineShoppingBag className="w-16 h-16 opacity-20" />
                            <h3 className="text-lg font-medium text-zinc-600">{t('cart.emptyCart')}</h3>
                            <button 
                                onClick={() => setIsDrawerOpen(false)}
                                className="text-sm font-bold uppercase tracking-widest text-accent underline underline-offset-4 hover:text-accent/80"
                            >
                                {t('cart.startShopping')}
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="py-6 border-b border-[#f0f0f0] last:border-0">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 flex-shrink-0">
                                        <Link href={`/products/${item.slug}`} onClick={() => setIsDrawerOpen(false)}>
                                            <div className="relative w-full h-full rounded-lg border border-[#eee] overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Product Details Column */}
                                    <div className="flex-grow flex flex-col justify-between">
                                        {/* Title & Delete Row */}
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-[0.95rem] font-semibold leading-tight pr-2">
                                                <Link 
                                                    href={`/products/${item.slug}`} 
                                                    className="text-[#1a1a1a] hover:text-[#555] transition-colors"
                                                    onClick={() => setIsDrawerOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            </h3>
                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity p-0.5"
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
                                                    aria-label="Decrease quantity"
                                                >
                                                    <svg className="w-2.5 h-2.5 fill-[#333]" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 10c0-.414.336-.75.75-.75h8.5c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75Z"></path>
                                                    </svg>
                                                </button>
                                                <input 
                                                    className="w-[30px] border-none text-center text-[0.9rem] font-medium text-[#1a1a1a] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    type="number" 
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                                    min="0"
                                                />
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-[#f9f9f9] transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <svg className="w-2.5 h-2.5 fill-[#333]" viewBox="0 0 20 20">
                                                        <path d="M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            
                                            {/* Price */}
                                            <span className="font-semibold text-base text-[#1a1a1a]">
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
                        <p className="text-[11px] text-zinc-400 uppercase tracking-widest text-center">
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
