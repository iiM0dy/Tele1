import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getI18n } from '@/lib/i18n';

interface Category {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  image: string | null;
}

interface CollectionListProps {
  categories: Category[];
}

const CollectionList = async ({ categories }: CollectionListProps) => {
  if (!categories || categories.length === 0) return null;

  const { language, t } = await getI18n();
  const isAr = language === 'ar';

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="w-full px-4 md:px-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {categories.map((category, index) => {
            // Check if this is the last item
            const isLast = index === categories.length - 1;
            const displayName = isAr && category.nameAr ? category.nameAr : category.name;
            const sizes = isLast
              ? "(max-width: 768px) 100vw, 100vw"
              : "(max-width: 768px) 100vw, 50vw";

            return (
              <Link
                key={category.id}
                href={`/collections/${category.slug}`}
                className={`group relative overflow-hidden h-[400px] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 ${isLast ? 'md:col-span-2' : 'md:col-span-1'
                  }`}
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
                <Image
                  src={category.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80"}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes={sizes}
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="px-10 py-4 bg-accent text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl transform translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl shadow-accent/20">
                    {displayName}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <Link
            href="/collections"
            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl overflow-hidden hover:bg-accent transition-all duration-500 shadow-2xl shadow-black/10"
          >
            <span className="relative z-10 group-hover:text-black transition-colors duration-500">
              {t('common.viewAllCategories')}
            </span>
            <svg
              className={`w-4 h-4 relative z-10 group-hover:text-black transition-all duration-500 transform group-hover:translate-x-1 ${isAr ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionList;
