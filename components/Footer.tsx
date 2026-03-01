"use client";

import React from 'react';
import LanguageToggle from './LanguageToggle';
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
        <footer className="bg-primary text-white overflow-hidden relative">
            <div className="absolute right-4 top-4 z-20">
                {/* Language Switcher for Footer */}
                <LanguageToggle />
            </div>
            {/* Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full px-4 md:px-[48px] py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-10 gap-16 md:gap-8">
                    {/* Brand & Description */}
                    <div className="md:col-span-4 space-y-8">
                        <Link href="/" className="inline-block group">
                            <h3
                                dir="ltr"
                                className="text-3xl font-logo font-black tracking-tighter uppercase group-hover:text-accent transition-colors"
                            >
                                TELE1<span className="text-accent">.</span>
                            </h3>
                        </Link>
                        <p className="text-xs leading-relaxed text-white/60 max-w-xs font-medium">
                            {t('footer.brandDescription')}
                        </p>
                        <div className="flex gap-6 pt-4">
                            <Link href="https://www.facebook.com/share/18EecMHwyx/?mibextid=wwXIfr" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-1 transition-all duration-300" aria-label={t('footer.social.facebook')}>
                                <Facebook size={18} />
                            </Link>
                            <Link href="https://www.instagram.com/tele1.lb" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-1 transition-all duration-300" aria-label={t('footer.social.instagram')}>
                                <Instagram size={18} />
                            </Link>
                            <Link href="https://wa.me/963954551777" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-accent hover:border-accent hover:text-white hover:-translate-y-1 transition-all duration-300" aria-label={t('footer.social.whatsapp')}>
                                <MessageCircle size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{t('footer.shop')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/products" className="text-xs font-bold text-white/60 hover:text-white transition-colors">{t('common.viewAll')}</Link></li>
                            <li><Link href="/collections" className="text-xs font-bold text-white/60 hover:text-white transition-colors">{t('common.collections')}</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{t('footer.support')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/shipping-returns" className="text-xs font-bold text-white/60 hover:text-white transition-colors">{t('footer.shippingReturns')}</Link></li>
                            <li><Link href="https://wa.me/963954551777" className="text-xs font-bold text-white/60 hover:text-white transition-colors">{t('footer.contactUs')}</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                        {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
