"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { MdLanguage } from "react-icons/md";

export default function LanguageToggle() {
    const { language, setLanguage, dir } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-text-sub hover:text-gold hover:bg-gold/10 rounded-lg transition-all duration-200 border border-transparent hover:border-gold/20"
            dir={dir}
            title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        >
            <MdLanguage className="text-[20px]" />
            <span className="hidden sm:inline uppercase tracking-widest text-[11px]">
                {language === "en" ? "العربية" : "English"}
            </span>
        </button>
    );
}
