"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { HiMinus, HiPlus, HiOutlineShoppingBag } from 'react-icons/hi';

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal } = useCart();
    const [orderNote, setOrderNote] = useState('');

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <HiOutlineShoppingBag className="w-20 h-20 text-zinc-200 mb-6" />
                <h1 className="text-3xl font-medium mb-4 uppercase tracking-widest">Your cart is empty</h1>
                <Link 
                    href="/collections/all" 
                    className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-zinc-800 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full px-4 md:px-[48px] pt-16 pb-12 md:pb-20 text-[rgb(18,18,18)]">
            <div className="max-w-[980px] mx-auto">
                <h1 className="text-center text-[31px] font-normal tracking-[0.2em] uppercase mb-16 leading-tight" style={{ fontFamily: '"Times New Roman", Times, serif' }}>CART</h1>

                {/* Desktop Table Header */}
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] border-b border-[#e1e1e1] pb-4 text-[13px] uppercase tracking-widest font-normal text-[rgb(18,18,18)]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                    <div>Product</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-right">Total</div>
                </div>

                {/* Cart Items */}
                <div className="space-y-0 mb-8 md:mb-12">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-row md:grid md:grid-cols-[2fr_1fr_1fr] items-start md:items-center gap-4 md:gap-6 border-b border-[#f5f5f5] py-6 md:py-0 h-auto md:h-[153px]">
                            {/* Product Info (Image + Name + Price) */}
                            <div className="flex gap-4 md:gap-6 items-start md:items-center flex-1 md:flex-none md:col-span-1 h-full">
                                <Link href={`/products/${item.id}`} className="relative w-[80px] h-[80px] md:w-[110px] md:h-[110px] bg-white border border-[#e1e1e1] rounded-sm shrink-0 hover:opacity-80 transition-opacity">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </Link>
                                <div className="flex flex-col justify-center gap-1 md:gap-2">
                                    <Link href={`/products/${item.id}`} className="hover:underline underline-offset-4">
                                        <h3 className="text-[13px] font-normal uppercase tracking-[0.2em] text-[rgb(18,18,18)]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] text-[rgb(18,18,18)] font-normal" style={{ fontFamily: 'var(--font-lato), sans-serif' }}>
                                            ${item.price.toFixed(2)}
                                        </span>
                                        {item.id === 'leather-duo-box' && (
                                            <span className="text-[13px] text-[#999] line-through md:hidden" style={{ fontFamily: 'var(--font-lato), sans-serif' }}>
                                                $12.00
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Free Gift Tag - Mobile Only */}
                                    {item.id === 'leather-duo-box' && (
                                        <div className="flex md:hidden items-center gap-1.5 bg-[#8B1D1D] text-white text-[10px] px-2 py-1.5 font-bold uppercase tracking-wider w-fit mt-1">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                                <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l9 9a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828l-9-9zM7 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                                            </svg>
                                            FREE GIFT (-$12.00)
                                        </div>
                                    )}

                                    {/* Quantity Selector - Mobile Only */}
                                    <div className="flex md:hidden items-center gap-4 mt-2">
                                        <div className="flex items-center border border-[#e1e1e1] h-9">
                                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 h-full hover:bg-zinc-50"><HiMinus className="w-3 h-3" /></button>
                                            <input type="number" value={item.quantity} readOnly className="w-8 text-center text-[13px] font-medium text-[rgb(18,18,18)]" />
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 h-full hover:bg-zinc-50"><HiPlus className="w-3 h-3" /></button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-[12px] uppercase tracking-widest font-medium underline underline-offset-4">Remove</button>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Selector - Desktop Only */}
                            <div className="hidden md:flex flex-col items-center justify-center gap-2 h-full">
                                <div className="flex items-center border border-[#e1e1e1] h-10">
                                    <button 
                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                        className="px-3 h-full hover:bg-zinc-50 transition-colors"
                                    >
                                        <HiMinus className="w-3 h-3" />
                                    </button>
                                    <input 
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                        className="w-12 text-center text-[13px] font-medium text-[rgb(18,18,18)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                                    />
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 h-full hover:bg-zinc-50 transition-colors"
                                    >
                                        <HiPlus className="w-3 h-3" />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="text-[12px] uppercase tracking-widest font-medium text-[rgb(18,18,18)] underline underline-offset-4 hover:text-[#666] transition-colors"
                                    style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                                >
                                    Remove
                                </button>
                            </div>

                            {/* Total per item - Desktop Only */}
                            <div className="hidden md:flex text-right font-medium text-[16px] text-[rgb(18,18,18)] items-center justify-end h-full" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-[#e1e1e1]">
                    {/* Order Note */}
                    <div className="space-y-4">
                        <button className="text-[14px] uppercase tracking-widest font-medium text-[rgb(18,18,18)] flex items-center gap-2" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                            <span className="text-lg leading-none mt-[-2px]">•</span> ADD ORDER NOTE
                        </button>
                        <textarea 
                            value={orderNote}
                            onChange={(e) => setOrderNote(e.target.value)}
                            placeholder="How can we help you?"
                            className="w-full h-32 border border-[#e1e1e1] rounded-md p-4 text-[0.9rem] focus:outline-none focus:ring-1 focus:ring-black transition-all text-[rgb(18,18,18)]"
                        />
                    </div>

                    {/* Summary & Checkout */}
                    <div className="flex flex-col items-end gap-6">
                        <div className="text-[16px] font-medium text-[rgb(18,18,18)]" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                            Total: ${subtotal.toFixed(2)} USD
                        </div>
                        <Link 
                            href="/checkout"
                            className="w-[148px] h-[60px] bg-[#1a1a1a] text-white flex items-center justify-center text-[13px] font-medium uppercase tracking-[0.2em] hover:bg-[#333] transition-all rounded-xl"
                            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
