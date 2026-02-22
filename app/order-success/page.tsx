"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiOutlineCheckCircle, HiOutlineShoppingBag, HiOutlineArrowLeft } from "react-icons/hi";
import { Suspense } from "react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    return (
        <div className="bg-white min-h-screen">
            {/* Minimal Header with Solid Color and No Effects */}
            <header className="w-full flex items-center h-[107px] border-b border-zinc-800 bg-black">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-3 items-center">
                        <div className="flex items-center">
                            <button className="md:hidden p-2 -ml-2 transition-colors text-primary" aria-label="Open navigation menu">
                                <svg aria-hidden="true" fill="none" focusable="false" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M1 19h22M1 12h22M1 5h22" stroke="currentColor" strokeWidth="1.1" strokeLinecap="square"></path>
                                </svg>
                            </button>
                            <nav className="hidden md:flex items-center gap-6">
                                <Link className="text-[11px] font-bold uppercase tracking-[0.1em] transition-colors text-white/70 hover:text-primary" href="/collections/phones">Phones</Link>
                                <Link className="text-[11px] font-bold uppercase tracking-[0.1em] transition-colors text-white/70 hover:text-primary" href="/collections/airpods">AirPods</Link>
                                <Link className="text-[11px] font-bold uppercase tracking-[0.1em] transition-colors text-white/70 hover:text-primary" href="/collections/covers">Covers</Link>
                                <Link className="text-[11px] font-bold uppercase tracking-[0.1em] transition-colors text-white/70 hover:text-primary" href="/collections/screens">Screens</Link>
                            </nav>
                        </div>
                        <div className="flex justify-center">
                            <Link className="relative block" href="/">
                                <span className="sr-only">TELE1</span>
                                <span className="text-2xl md:text-3xl font-sans font-bold tracking-[0.3em] uppercase transition-colors text-primary">TELE1</span>
                            </Link>
                        </div>
                        <div className="flex items-center justify-end gap-3 md:gap-5">
                            <Link className="hidden sm:block transition-colors text-white/70 hover:text-primary" href="/account">
                                <span className="sr-only">Account</span>
                                <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 24 24">
                                    <path d="M16.125 8.75c-.184 2.478-2.063 4.5-4.125 4.5s-3.944-2.021-4.125-4.5c-.187-2.578 1.64-4.5 4.125-4.5 2.484 0 4.313 1.969 4.125 4.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M3.017 20.747C3.783 16.5 7.922 14.25 12 14.25s8.217 2.25 8.984 6.497" stroke="currentColor" strokeWidth="1.1" strokeMiterlimit="10"></path>
                                </svg>
                            </Link>
                            <button className="transition-colors text-white/70 hover:text-primary">
                                <span className="sr-only">Search</span>
                                <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 24 24">
                                    <path d="M10.364 3a7.364 7.364 0 1 0 0 14.727 7.364 7.364 0 0 0 0-14.727Z" stroke="currentColor" strokeWidth="1.1" strokeMiterlimit="10"></path>
                                    <path d="M15.857 15.858 21 21.001" stroke="currentColor" strokeWidth="1.1" strokeMiterlimit="10" strokeLinecap="round"></path>
                                </svg>
                            </button>
                            <Link href="/cart" className="relative transition-colors text-white/70 hover:text-primary">
                                <span className="sr-only">Cart</span>
                                <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 24 24">
                                    <path d="M2 10h20l-4 11H6L2 10Zm14-3a4 4 0 0 0-8 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-col items-center justify-center px-4 py-12 md:py-24">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                            <HiOutlineCheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Thank you for your order!
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8">
                        Your order has been placed successfully. 
                        {orderId && (
                            <span className="block mt-2 font-medium text-gray-900">
                                Order ID: {orderId}
                            </span>
                        )}
                    </p>

                    <div className="space-y-4">
                        <Link 
                            href="/products"
                            className="w-full bg-black text-white py-4 px-8 rounded-md font-bold text-[0.95rem] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                            <HiOutlineShoppingBag className="w-5 h-5" />
                            Continue Shopping
                        </Link>
                        
                        <Link 
                            href="/"
                            className="w-full bg-white text-gray-600 py-4 px-8 rounded-md font-medium text-[0.95rem] hover:bg-gray-50 border border-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <HiOutlineArrowLeft className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            If you have any questions, please contact our support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
