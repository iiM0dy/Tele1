"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Language = 'en' | 'ar';

// Recursive type for nested translation objects
type TranslationValue = string | string[] | { [key: string]: TranslationValue };
type TranslationObject = { [key: string]: TranslationValue };

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any;
    dir: 'ltr' | 'rtl';
    isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [translations, setTranslations] = useState<TranslationObject | null>(null);
    const [mounted, setMounted] = useState(false);

    // Load language preference from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
            setLanguageState(savedLang);
        }
        setMounted(true);
    }, []);

    // Load translations dynamically
    useEffect(() => {
        const loadTranslations = async () => {
            try {
                let data;
                if (language === 'ar') {
                    data = await import('@/app/locales/ar.json');
                } else {
                    data = await import('@/app/locales/en.json');
                }
                setTranslations(data.default);
            } catch (error) {
                console.error('Failed to load translations:', error);
            }
        };
        loadTranslations();
    }, [language]);

    // Save language preference and update document direction
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('language', language);
            document.cookie = `language=${language}; path=/; max-age=31536000`; // 1 year
            document.documentElement.lang = language;
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        }
    }, [language, mounted]);

    const setLanguage = useCallback((lang: Language) => {
        try {
            localStorage.setItem('language', lang);
            document.cookie = `language=${lang}; path=/; max-age=31536000`;
        } catch (e) {
            console.warn('Could not persist language immediately', e);
        }

        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }, []);

    // Translation function with fallback
    const t = useCallback((key: string): any => {
        if (!translations) return key;

        const keys = key.split('.');
        let result: TranslationValue = translations;

        for (const k of keys) {
            if (typeof result === 'object' && result !== null && !Array.isArray(result) && k in result) {
                result = result[k];
            } else {
                return key;
            }
        }

        return result;
    }, [translations]);

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir, isLoaded: !!translations }}>
            <div key={language} dir={dir}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
