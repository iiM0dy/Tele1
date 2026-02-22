"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { HiOutlineArrowRight, HiOutlineHome } from "react-icons/hi";
import { useLanguage } from "@/app/context/LanguageContext";

export default function NotFound() {
    const { t, language } = useLanguage();
    const isRTL = language === "ar";

    // Signal to the Header that this is a 404 page
    // This allows the Header to be solid and push content down (relative) only on this page
    useEffect(() => {
        document.body.setAttribute('data-not-found', 'true');
        return () => document.body.removeAttribute('data-not-found');
    }, []);

    return (
        <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 pt-20 pb-12 overflow-hidden bg-white dark:bg-black">
            {/* Background Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.05]">
                <span className="text-[18rem] md:text-[35rem] font-sans font-black text-black dark:text-white leading-none">
                    404
                </span>
            </div>

            <div className="relative z-10 text-center max-w-2xl">
                {/* Heading */}
                <h1 className="text-6xl md:text-9xl font-sans font-black text-black dark:text-white mb-8 leading-[0.9] tracking-tighter">
                    {t("notFound.heading")}
                </h1>

                {/* Description */}
                <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-lg mx-auto leading-relaxed font-medium">
                    {t("notFound.description")}
                </p>

                {/* Action Buttons */}
                <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                    <Link
                        href="/"
                        className="group flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.25em] hover:scale-105 transition-all rounded-full shadow-2xl active:scale-95"
                    >
                        <HiOutlineHome className="w-5 h-5" />
                        <span>{t("notFound.homeCta")}</span>
                    </Link>

                    <Link
                        href="/products"
                        className="group flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 bg-accent text-white text-[10px] font-black uppercase tracking-[0.25em] hover:scale-105 hover:brightness-110 transition-all rounded-full shadow-2xl shadow-accent/20 active:scale-95"
                    >
                        <span>{t("notFound.shopCta")}</span>
                        <HiOutlineArrowRight className={`w-5 h-5 transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-2" : "group-hover:translate-x-2"}`} />
                    </Link>
                </div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-[10%] right-[10%] w-80 h-80 bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-[10%] left-[10%] w-160 h-160 bg-accent/5 rounded-full blur-[150px] -z-10 hover:bg-accent/10 transition-colors duration-1000" />
        </div>
    );
}
