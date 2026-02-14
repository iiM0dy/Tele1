"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { getAllCategories } from '@/lib/public-actions';
import CartDrawer from './cart/CartDrawer';
import SearchDrawer from './SearchDrawer';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function Header() {
    const { t, language, setLanguage } = useLanguage();
    const { cartCount, setIsDrawerOpen } = useCart();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = categories.length > 0 
        ? categories.map(cat => ({
            title: cat.name,
            href: `/collections/${cat.slug}`
          }))
        : [
            { title: 'DISCOUNTS', href: '/collections/black-friday-sale' },
            { title: 'NEW RELEASES', href: '/collections/new-releases' },
            { title: 'PENDANTS', href: '/collections/pendants' },
            { title: 'CHAINS', href: '/collections/mens-premium-chains' },
            { title: 'BRACELETS', href: '/collections/premium-mens-bracelets' },
            { title: 'RINGS', href: '/collections/rings' },
            { title: 'WATCHES', href: '/collections/watches' },
            { title: 'BEST SELLERS', href: '/collections/best-selling-mens-jewelry' },
            { title: 'BUNDLES', href: '/collections/bundles' },
        ];

    const isCollectionPage = pathname?.startsWith('/collections');
    const isProductPage = pathname?.startsWith('/products/');
    const isProductsListPage = pathname === '/products';
    const isCartPage = pathname === '/cart';
    const isAdminPage = pathname?.startsWith('/admin');
    const isSolid = isScrolled || isHovered || isCollectionPage || isProductPage || isProductsListPage || isCartPage;

    if (pathname === '/checkout' || pathname === '/order-success' || isAdminPage) return null;

    return (
        <div 
            className={`${(isCartPage || isProductsListPage) ? 'relative' : 'fixed top-0 left-0'} w-full z-50 group/header`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <header 
                className={`w-full ${(isCartPage || isProductsListPage) ? '' : 'transition-all duration-500 ease-in-out'} flex items-center h-[107px] ${
                    isSolid 
                        ? 'bg-[#1B1B1B] shadow-lg' 
                        : 'bg-transparent'
                }`}
                style={{ color: 'rgb(250, 220, 145)' }}
            >
                <div className="w-full px-4 md:px-[48px]">
                    <div className="grid grid-cols-3 items-center">
                        {/* Primary Nav - Left on Desktop, Hamburger on Mobile */}
                        <div className="flex items-center">
                            {/* Mobile Hamburger */}
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 -ml-2 transition-colors"
                                style={{ color: 'rgb(250, 220, 145)' }}
                                aria-label="Open navigation menu"
                            >
                                <svg aria-hidden="true" fill="none" focusable="false" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M1 19h22M1 12h22M1 5h22" stroke="currentColor" strokeWidth="1.1" strokeLinecap="square"></path>
                                </svg>
                            </button>

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-6">
                                {navItems.map((item) => (
                                    <Link 
                                        key={item.title}
                                        href={item.href}
                                        className="text-[11px] font-bold uppercase tracking-[0.1em] transition-colors hover:text-white"
                                        style={{ color: 'rgb(250, 220, 145)' }}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Logo - Center */}
                        <div className="flex justify-center">
                            <Link href="/" className="relative block">
                                <span className="sr-only">TELE1</span>
                                <span 
                                    className="text-2xl md:text-3xl font-serif font-bold tracking-[0.3em] uppercase transition-colors"
                                    style={{ color: 'rgb(250, 220, 145)' }}
                                >
                                    TELE1
                                </span>
                            </Link>
                        </div>

                        {/* Secondary Nav - Right */}
                        <div className="flex items-center justify-end gap-3 md:gap-5">
                            {/* Desktop extended nav (removed) */}
                            {/* ... */}

                            <Link 
                                href="/account" 
                                className="hidden sm:block transition-colors hover:text-white"
                                style={{ color: 'rgb(250, 220, 145)' }}
                            >
                                <span className="sr-only">Account</span>
                                <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 24 24">
                                    <path d="M16.125 8.75c-.184 2.478-2.063 4.5-4.125 4.5s-3.944-2.021-4.125-4.5c-.187-2.578 1.64-4.5 4.125-4.5 2.484 0 4.313 1.969 4.125 4.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M3.017 20.747C3.783 16.5 7.922 14.25 12 14.25s8.217 2.25 8.984 6.497" stroke="currentColor" strokeWidth="1.1" strokeMiterlimit="10"></path>
                                </svg>
                            </Link>

                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className="transition-colors hover:text-white"
                                style={{ color: 'rgb(250, 220, 145)' }}
                            >
                                <span className="sr-only">Search</span>
                                <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 24 24">
                                    <path d="M10.364 3a7.364 7.364 0 1 0 0 14.727 7.364 7.364 0 0 0 0-14.727Z" stroke="currentColor" strokeWidth="1.1" strokeMiterlimit="10"></path>
                                    <path d="M15.857 15.858 21 21.001" stroke="currentColor" strokeWidth="1.1" strokeMiterlimit="10" strokeLinecap="round"></path>
                                </svg>
                            </button>

                            <button 
                                onClick={() => setIsDrawerOpen(true)}
                                className="relative transition-colors hover:text-white"
                                style={{ color: 'rgb(250, 220, 145)' }}
                            >
                                <span className="sr-only">Cart</span>
                                <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 24 24">
                                    <path d="M2 10h20l-4 11H6L2 10Zm14-3a4 4 0 0 0-8 0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                {cartCount >= 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <CartDrawer />
            <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile Menu Sidebar */}
            <div 
                className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div 
                    className="absolute inset-0 bg-black/40" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <div 
                    className={`absolute inset-y-0 left-0 w-[80%] max-w-sm bg-white shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                            <span className="text-xl font-serif font-bold tracking-[0.2em] uppercase text-black">
                                JULIVNO
                            </span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-black">
                                <svg aria-hidden="true" focusable="false" fill="none" width="20" height="20" viewBox="0 0 16 16">
                                    <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" strokeWidth="1.1"></path>
                                </svg>
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-4">
                            <ul className="space-y-4">
                                {navItems.map((item) => (
                                    <li key={item.title}>
                                        <Link 
                                            href={item.href}
                                            className="block py-2 text-sm font-bold uppercase tracking-widest text-black hover:text-gold"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="p-4 border-t border-zinc-100">
                            <button
                                onClick={() => {
                                    setLanguage(language === 'en' ? 'ar' : 'en');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest"
                            >
                                {language === 'en' ? 'Switch to Arabic' : 'تبديل إلى الإنجليزية'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
