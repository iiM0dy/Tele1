import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface CollectionListProps {
  categories: Category[];
}

const CollectionList = ({ categories }: CollectionListProps) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="w-full px-4 md:px-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {categories.map((category, index) => {
            // Check if this is the last item
            const isLast = index === categories.length - 1;
            
            return (
              <Link 
                key={category.id} 
                href={`/collections/${category.slug}`}
                className={`group relative overflow-hidden h-[400px] ${
                  isLast ? 'md:col-span-2' : 'md:col-span-1'
                }`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 z-10" />
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <button className="px-8 py-3 bg-white text-black text-sm font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300">
                    {category.name}
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
