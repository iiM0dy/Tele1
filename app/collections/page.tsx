import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from "@/lib/public-actions";

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
    const categories = await getAllCategories();

    return (
        <div className="w-full px-4 md:px-[48px] pt-16 pb-12 md:pb-20">
            <h1 
                className="text-center text-[31px] font-normal tracking-[0.2em] uppercase mb-16 leading-tight text-[rgb(18,18,18)]" 
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
                ALL COLLECTIONS
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                    <Link 
                        key={category.id} 
                        href={`/collections/${category.slug}`}
                        className="group relative w-full aspect-square bg-[#E5E5E5] overflow-hidden"
                    >
                        {category.image && (
                            <div className="absolute inset-0">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Black filter with low opacity */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-[1]" />
                            </div>
                        )}
                        <div className="absolute bottom-10 left-10 z-10">
                            <h2 
                                className="text-white text-[24px] font-normal tracking-[0.2em] uppercase"
                                style={{ fontFamily: '"Times New Roman", Times, serif' }}
                            >
                                {category.name}
                            </h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
