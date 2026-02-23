"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { useCart } from '@/app/context/CartContext';
import { getAllCategories } from '@/lib/public-actions';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

import CartDrawer from './cart/CartDrawer';
import SearchDrawer from './SearchDrawer';
import LanguageToggle from './LanguageToggle';

interface Category {
    id: string;
    name: string;
    nameAr?: string | null;
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
    const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoading(false);
            }
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

    // Desktop Nav Items
    const desktopNavItems = [
        { title: t('common.store'), href: '/products' },
        { title: t('common.collections'), href: '/collections' },
        { title: t('common.aboutUs'), href: '/about-us' }
    ];

    const isCollectionPage = pathname?.startsWith('/collections');
    const isProductPage = pathname?.startsWith('/products/');
    const isProductsListPage = pathname === '/products';
    const isCartPage = pathname === '/cart';
    const isAdminPage = pathname?.startsWith('/admin');

    // Detect 404 page via body attribute set in not-found.tsx
    const [isNotFoundPage, setIsNotFoundPage] = useState(false);

    useEffect(() => {
        const checkNotFound = () => {
            setIsNotFoundPage(document.body.hasAttribute('data-not-found'));
        };
        checkNotFound();
        // Use an observer to catch changes to body attributes
        const observer = new MutationObserver(checkNotFound);
        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, [pathname]);

    const isSolid = isScrolled || isHovered || isCollectionPage || isProductPage || isProductsListPage || isCartPage || isNotFoundPage;

    if (pathname === '/checkout' || pathname === '/order-success' || isAdminPage) return null;

    return (
        <div
            className={`${(isCartPage || isProductsListPage || isNotFoundPage) ? 'relative' : 'fixed top-0 left-0'} w-full z-50 group/header transition-all duration-700 ease-in-out ${isSolid
                    ? 'bg-primary shadow-2xl py-0'
                    : 'bg-transparent py-2'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <header
                className="w-full flex items-center h-[90px] text-white"
            >
                <div className="w-full px-4 md:px-[48px]">
                    <div className="grid grid-cols-3 items-center">
                        {/* Primary Nav - Left on Desktop, Hamburger on Mobile */}
                        <div className="flex items-center">
                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`md:hidden p-2 ${language === 'ar' ? '-mr-2' : '-ml-2'} transition-colors text-white hover:text-accent`}
                                aria-label="Open navigation menu"
                            >
                                <svg aria-hidden="true" fill="none" focusable="false" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M1 19h22M1 12h22M1 5h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                </svg>
                            </button>

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-6">
                                {desktopNavItems.map((item) => {
                                    if (item.href === '/collections') {
                                        return (
                                            <div key={item.href} className="relative group/nav">
                                                <Link
                                                    href={item.href}
                                                    className={`${language === 'ar' ? 'text-[14px]' : 'text-[10px]'} font-black uppercase tracking-[0.15em] transition-all text-white/70 hover:text-white hover:scale-105 flex items-center gap-1`}
                                                >
                                                    {item.title}
                                                    <MdKeyboardArrowDown className="text-lg group-hover/nav:rotate-180 transition-transform" />
                                                </Link>

                                                {/* Dropdown */}
                                                <div className={`absolute top-full ${language === 'ar' ? 'right-0' : 'left-0'} pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 w-56`}>
                                                    <div className="bg-white rounded-xl shadow-xl p-4 border border-zinc-100 overflow-hidden">
                                                        <ul className="space-y-3">
                                                            {categories.slice(0, 5).map((cat) => (
                                                                <li key={cat.id}>
                                                                    <Link
                                                                        href={`/collections/${cat.slug}`}
                                                                        className={`block ${language === 'ar' ? 'text-right' : 'text-left'} text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-primary transition-colors`}
                                                                    >
                                                                        {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                            <li>
                                                                <Link
                                                                    href="/collections"
                                                                    className={`block ${language === 'ar' ? 'text-right' : 'text-left'} text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors pt-3 border-t border-zinc-100 mt-2`}
                                                                >
                                                                    {t('common.viewAll')}
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`${language === 'ar' ? 'text-[14px]' : 'text-[10px]'} font-black uppercase tracking-[0.15em] transition-all text-white/70 hover:text-white hover:scale-105`}
                                        >
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Logo - Center */}
                        <div className="flex justify-center">
                            <Link href="/" className="relative block group">
                                <span className="sr-only">TELE1</span>
                                <span
                                    className="text-2xl md:text-4xl font-sans font-black tracking-tighter uppercase transition-all text-white group-hover:text-accent"
                                >
                                    TELE1<span className="text-accent">.</span>
                                </span>
                            </Link>
                        </div>

                        {/* Secondary Nav - Right */}
                        <div className="flex items-center justify-end gap-3 md:gap-6">
                            <LanguageToggle />
                            <Link
                                href="/account"
                                className="hidden sm:block transition-all text-white/70 hover:text-white hover:scale-110"
                            >
                                <span className="sr-only">Account</span>
                                <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 24 24">
                                    <path d="M16.125 8.75c-.184 2.478-2.063 4.5-4.125 4.5s-3.944-2.021-4.125-4.5c-.187-2.578 1.64-4.5 4.125-4.5 2.484 0 4.313 1.969 4.125 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M3.017 20.747C3.783 16.5 7.922 14.25 12 14.25s8.217 2.25 8.984 6.497" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                </svg>
                            </Link>

                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="transition-all text-white/70 hover:text-white hover:scale-110"
                            >
                                <span className="sr-only">{t('common.search')}</span>
                                <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 24 24">
                                    <path d="M10.364 3a7.364 7.364 0 1 0 0 14.727 7.364 7.364 0 0 0 0-14.727Z" stroke="currentColor" strokeWidth="1.5"></path>
                                    <path d="M15.857 15.858 21 21.001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                </svg>
                            </button>

                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className="relative transition-all text-white/70 hover:text-white hover:scale-110"
                            >
                                <span className="sr-only">{t('common.cart')}</span>
                                <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 24 24">
                                    <path d="M2 10h20l-4 11H6L2 10Zm14-3a4 4 0 0 0-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-lg">
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
                className={`fixed inset-0 z-100 md:hidden transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <div
                    className={`absolute inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} w-[80%] max-w-sm bg-white shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isMobileMenuOpen
                        ? 'translate-x-0'
                        : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')
                        }`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                            <span className="text-2xl font-sans font-black tracking-tighter uppercase text-primary">
                                TELE1<span className="text-accent">.</span>
                            </span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-primary hover:bg-zinc-100 rounded-full transition-colors"
                                aria-label={t('common.closeMenu')}
                            >
                                <svg aria-hidden="true" focusable="false" fill="none" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto p-6">
                            <ul className="space-y-6">
                                {/* Home */}
                                <li>
                                    <Link
                                        href="/"
                                        className={`block ${language === 'ar' ? 'text-[16px]' : 'text-[13px]'} font-sans font-black uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t('common.home')}
                                    </Link>
                                </li>

                                {/* Store */}
                                <li>
                                    <Link
                                        href="/products"
                                        className={`block ${language === 'ar' ? 'text-[16px]' : 'text-[13px]'} font-sans font-black uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t('common.store')}
                                    </Link>
                                </li>

                                {/* Collections Dropdown */}
                                <li>
                                    <button
                                        onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                                        className={`flex items-center justify-between w-full ${language === 'ar' ? 'text-[16px]' : 'text-[13px]'} font-sans font-black uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors`}
                                    >
                                        <span>{t('common.collections')}</span>
                                        {isCollectionsOpen ? (
                                            <MdKeyboardArrowUp className="text-xl" />
                                        ) : (
                                            <MdKeyboardArrowDown className="text-xl" />
                                        )}
                                    </button>

                                    <div className={`grid transition-all duration-300 ease-in-out ${isCollectionsOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <ul className={`space-y-4 ${language === 'ar' ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-zinc-100`}>
                                                {isLoading ? (
                                                    <div className="space-y-4">
                                                        {[1, 2, 3].map((i) => (
                                                            <div key={i} className="w-full h-4 bg-zinc-100 rounded animate-pulse" />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <>
                                                        {categories.slice(0, 5).map((cat) => (
                                                            <li key={cat.id}>
                                                                <Link
                                                                    href={`/collections/${cat.slug}`}
                                                                    className={`block ${language === 'ar' ? 'text-[14px]' : 'text-[11px]'} font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors`}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                >
                                                                    {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                        <li>
                                                            <Link
                                                                href="/collections"
                                                                className={`block ${language === 'ar' ? 'text-[12px]' : 'text-[10px]'} font-black uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors mt-2`}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {t('common.viewAll')}
                                                            </Link>
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </li>

                                {/* About Us */}
                                <li>
                                    <Link
                                        href="/about-us"
                                        className={`block ${language === 'ar' ? 'text-[16px]' : 'text-[13px]'} font-sans font-black uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {t('common.aboutUs')}
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                    </div>
                </div>
            </div>
        </div>
    );
}
