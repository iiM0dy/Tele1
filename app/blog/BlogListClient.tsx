"use client";

import { BlogPost } from "@/types/blog";
import { useLanguage } from "@/app/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { MdDateRange, MdArrowForward } from "react-icons/md";

interface BlogListClientProps {
    posts: BlogPost[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
    const { t, dir } = useLanguage();

    return (
        <section className="pt-32 pb-20 bg-background overflow-hidden" dir={dir}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight uppercase">
                        {t('common.blog')}
                    </h2>
                    <div className="w-20 h-1.5 bg-accent mx-auto rounded-full" />
                    <p className="text-muted-foreground text-lg font-medium opacity-80">
                        {dir === 'rtl' ? 'اكتشف آخر المقالات والنصائح في عالم التكنولوجيا' : 'Discover the latest articles and tips in the tech world'}
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-[40px] border border-border border-dashed">
                        <p className="text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                            {dir === 'rtl' ? 'لا توجد مقالات حالياً' : 'No articles published yet'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {posts.map((post, index) => (
                            <Link
                                key={post.id}
                                href={`/blog/${dir === 'rtl' && post.slugAr ? post.slugAr : post.slug}`}
                                className="group flex flex-col h-full bg-card rounded-[40px] border border-border overflow-hidden hover:border-accent/40 shadow-sm hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 transform hover:-translate-y-2"
                            >
                                {/* Image Wrapper */}
                                <div className="relative aspect-16/10 overflow-hidden bg-muted">
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={dir === 'rtl' && post.titleAr ? post.titleAr : post.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-accent/5">
                                            <span className="text-4xl">📚</span>
                                        </div>
                                    )}
                                    {/* Date Badge */}
                                    <div className={`absolute bottom-6 ${dir === 'rtl' ? 'right-6' : 'left-6'} bg-background/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-border/50 flex items-center gap-2 shadow-lg`}>
                                        <MdDateRange className="text-accent" />
                                        <span className="text-[11px] font-black tracking-widest uppercase text-foreground">
                                            {new Date(post.createdAt).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-8 flex flex-col">
                                    <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight mb-4 group-hover:text-accent transition-colors duration-300">
                                        {dir === 'rtl' && post.titleAr ? post.titleAr : post.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3 opacity-80">
                                        {dir === 'rtl' && post.excerptAr ? post.excerptAr : post.excerpt || (dir === 'rtl' ? 'اقرأ المزيد عن هذا المقال...' : 'Read more about this article...')}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                                        <span className="text-[11px] font-black tracking-[0.2em] text-accent uppercase flex items-center gap-2 group/btn">
                                            {dir === 'rtl' ? 'اقرأ المقال' : 'READ ARTICLE'}
                                            <MdArrowForward className={`text-[16px] transition-transform duration-300 ${dir === 'rtl' ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
