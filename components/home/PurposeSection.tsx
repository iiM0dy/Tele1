import React from 'react';

export default function PurposeSection() {
  return (
    <section className="py-24 bg-white">
      <div className="w-full px-4 md:px-[48px] text-center">
        <h2 
          className="text-[35px] font-normal tracking-[0.1em] uppercase text-black mb-6"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          OUR PURPOSE
        </h2>
        <div className="max-w-3xl mx-auto">
          <p 
            className="text-[14px] font-medium text-zinc-600 leading-relaxed uppercase tracking-[0.05em]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            To provide you with premium jewelry that's created with passion, attention to detail, and the highest quality materials to last a lifetime.
          </p>
        </div>
      </div>
    </section>
  );
}
