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

  const { language } = await getI18n();
  const isAr = language === 'ar';

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="w-full px-4 md:px-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {categories.map((category, index) => {
            // Check if this is the last item
            const isLast = index === categories.length - 1;
            const displayName = isAr && category.nameAr ? category.nameAr : category.name;
            
            return (
              <Link 
                key={category.id} 
                href={`/collections/${category.slug}`}
                className={`group relative overflow-hidden h-[400px] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 ${
                  isLast ? 'md:col-span-2' : 'md:col-span-1'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                {category.image && (
                  <Image
                    src={category.image}
                    alt={displayName}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <button className="px-10 py-4 bg-accent text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl transform translate-y-0 md:translate-y-4 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl shadow-accent/20">
                    {displayName}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionList;
