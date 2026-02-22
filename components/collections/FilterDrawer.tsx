"use client";

import React, { useEffect, useState } from 'react';
import { HiX, HiChevronUp, HiChevronDown } from 'react-icons/hi';

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

export default function FilterDrawer({ isOpen, onClose, onApply }: FilterDrawerProps) {
    const [mounted, setMounted] = useState(false);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ease-in-out ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div 
                className={`fixed top-0 right-0 bottom-0 w-full sm:max-w-[400px] bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-8 border-b border-zinc-100">
                    <h2 className="text-[26px] font-sans font-black uppercase tracking-tighter text-primary">
                        Filters
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-primary"
                        aria-label="Close filters"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto px-8 py-4 scrollbar-hide">
                    {/* Availability Accordion */}
                    <div className="border-b border-zinc-100 py-8">
                        <button 
                            onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
                            className="flex items-center justify-between w-full text-left group"
                        >
                            <span className="text-[12px] font-sans font-black uppercase tracking-widest text-primary group-hover:text-accent transition-colors">
                                Availability
                            </span>
                            <svg 
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${isAvailabilityOpen ? 'rotate-180' : ''} text-primary`} 
                                fill="none" 
                                viewBox="0 0 10 10" 
                                stroke="currentColor"
                            >
                                <path d="m1 3 4 4 4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        
                        {isAvailabilityOpen && (
                            <div className="mt-8 flex items-center gap-4">
                                <button 
                                    onClick={() => setInStockOnly(!inStockOnly)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${inStockOnly ? 'bg-accent' : 'bg-zinc-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${inStockOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-[14px] font-medium text-primary/70">In stock only</span>
                            </div>
                        )}
                    </div>

                    {/* Price Accordion */}
                    <div className="py-8">
                        <button 
                            onClick={() => setIsPriceOpen(!isPriceOpen)}
                            className="flex items-center justify-between w-full text-left group"
                        >
                            <span className="text-[12px] font-sans font-black uppercase tracking-widest text-primary group-hover:text-accent transition-colors">
                                Price
                            </span>
                            <svg 
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : ''} text-primary`} 
                                fill="none" 
                                viewBox="0 0 10 10" 
                                stroke="currentColor"
                            >
                                <path d="m1 3 4 4 4-4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {isPriceOpen && (
                            <div className="mt-10 space-y-8">
                                {/* Price Range Slider */}
                                <div className="relative h-[3px] w-full bg-zinc-100 rounded-full mt-12 mb-10">
                                    {/* Track highlighting between handles */}
                                    <div 
                                        className="absolute h-full bg-accent rounded-full"
                                        style={{ 
                                            left: `${(priceRange.min / 200000) * 100}%`, 
                                            right: `${100 - (priceRange.max / 200000) * 100}%` 
                                        }}
                                    />
                                    
                                    {/* Range Inputs */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="200000"
                                        value={priceRange.min}
                                        aria-label="Minimum price range"
                                        onChange={(e) => {
                                            const val = Math.min(parseInt(e.target.value), priceRange.max - 1);
                                            setPriceRange({ ...priceRange, min: val });
                                        }}
                                        className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                                        style={{ top: '50%', transform: 'translateY(-50%)' }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="200000"
                                        value={priceRange.max}
                                        aria-label="Maximum price range"
                                        onChange={(e) => {
                                            const val = Math.max(parseInt(e.target.value), priceRange.min + 1);
                                            setPriceRange({ ...priceRange, max: val });
                                        }}
                                        className="absolute w-full h-full bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg"
                                        style={{ top: '50%', transform: 'translateY(-50%)' }}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-[14px] font-bold">$</span>
                                        <input 
                                            type="number" 
                                            value={priceRange.min}
                                            aria-label="Minimum price"
                                            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                                            className="w-full border border-zinc-100 bg-zinc-50 rounded-xl py-3.5 pl-8 pr-4 text-[14px] font-bold text-primary focus:outline-none focus:border-accent focus:bg-white transition-all"
                                        />
                                    </div>
                                    <span className="text-[12px] text-zinc-500 font-black uppercase tracking-widest">to</span>
                                    <div className="flex-1 relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 text-[14px] font-bold">$</span>
                                        <input 
                                            type="number" 
                                            value={priceRange.max}
                                            aria-label="Maximum price"
                                            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                                            className="w-full border border-zinc-100 bg-zinc-50 rounded-xl py-3.5 pl-8 pr-4 text-[14px] font-bold text-primary focus:outline-none focus:border-accent focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-8 border-t border-zinc-100">
                    <button 
                        onClick={() => {
                            onApply({ inStockOnly, priceRange });
                            onClose();
                        }}
                        className="w-full bg-accent text-white py-5 text-[13px] font-sans font-black uppercase tracking-[0.2em] hover:bg-primary transition-all rounded-xl shadow-xl shadow-accent/20 hover:shadow-primary/20"
                    >
                        View Results
                    </button>
                </div>
            </div>
        </>
    );
}
