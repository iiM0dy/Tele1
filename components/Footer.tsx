"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    if (pathname === '/checkout' || isAdminPage) return null;

    return (
        <footer className="bg-[#1B1B1B]" style={{ color: 'rgb(250, 220, 145)' }}>
            <div className="container mx-auto px-4 py-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
                    {/* Brand & Description */}
                    <div className="md:col-span-4 space-y-8">
                        <h3 className="text-2xl font-serif tracking-widest uppercase">{t('header.brandName')}</h3>
                        <p className="text-[11px] leading-relaxed uppercase tracking-widest max-w-xs opacity-80">
                            {t('footer.brandDescription')}
                        </p>
                        <div className="flex gap-6 pt-4">
                            <Link href="#" className="opacity-60 hover:opacity-100 transition-opacity">
                                <Facebook size={18} strokeWidth={1.5} />
                            </Link>
                            <Link href="#" className="opacity-60 hover:opacity-100 transition-opacity">
                                <Instagram size={18} strokeWidth={1.5} />
                            </Link>
                            <Link href="#" className="opacity-60 hover:opacity-100 transition-opacity">
                                <MessageCircle size={18} strokeWidth={1.5} />
                            </Link>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">{t('footer.shop')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/products" className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">{t('common.viewAll')}</Link></li>
                            <li><Link href="/collections" className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">{t('common.collections')}</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">{t('footer.support')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/help" className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">{t('footer.helpCenter')}</Link></li>
                            <li><Link href="/shipping" className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">{t('footer.shippingReturns')}</Link></li>
                            <li><Link href="/contact" className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">{t('footer.contactUs')}</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="md:col-span-4 space-y-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Join the circle</h4>
                        <p className="text-[11px] uppercase tracking-widest opacity-80">
                            Sign up for exclusive updates and seasonal offers.
                        </p>
                        <form className="flex gap-2 pt-2">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="bg-transparent border-b flex-grow py-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-white transition-colors placeholder:opacity-50"
                                style={{ borderColor: 'rgba(250, 220, 145, 0.2)', color: 'rgb(250, 220, 145)' }}
                            />
                            <button className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8" style={{ borderColor: 'rgba(250, 220, 145, 0.1)' }}>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
                        {t('footer.copyright')}
                    </p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60 hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
