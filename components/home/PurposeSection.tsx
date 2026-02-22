"use client";

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

export default function PurposeSection() {
  const { t } = useLanguage();
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="w-full px-4 md:px-[48px] text-center">
        <h2 
          className="text-[35px] font-sans font-black tracking-tighter uppercase text-[#0F172A] mb-6"
        >
          {t('home.innovationFirst')}
        </h2>
        <div className="max-w-3xl mx-auto">
          <p 
            className="text-[14px] font-sans font-medium text-[#1F2937]/70 leading-relaxed uppercase tracking-wider"
          >
            {t('home.innovationDesc')}
          </p>
        </div>
      </div>
    </section>
  );
}
