"use client";

import { BlogPost } from "@/types/blog";
import { useLanguage } from "@/app/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { MdDateRange, MdArrowBack, MdShare } from "react-icons/md";
import { toast } from "react-hot-toast";

interface BlogPostClientProps {
    post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
    const { t, dir } = useLanguage();

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: dir === 'rtl' && post.titleAr ? post.titleAr : post.title,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success(dir === 'rtl' ? 'تم نسخ الرابط' : 'Link copied to clipboard');
        }
    };

    return (
        <article className="pt-32 pb-20 bg-background" dir={dir}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Button */}
                <div className="max-w-4xl mx-auto mb-10">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-[11px] font-black tracking-widest text-muted-foreground uppercase hover:text-accent transition-colors py-2"
                    >
                        <MdArrowBack size={18} className={dir === 'rtl' ? 'rotate-180' : ''} />
                        {dir === 'rtl' ? 'العودة للمدونة' : 'BACK TO BLOG'}
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="max-w-4xl mx-auto mb-16 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[11px] font-black tracking-widest text-accent uppercase">
                            <span className="flex items-center gap-1.5">
                                <MdDateRange size={16} />
                                {new Date(post.createdAt).toLocaleDateString(dir === 'rtl' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <span>{dir === 'rtl' ? 'تكنولوجيا' : 'TECH'}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1] uppercase">
                            {dir === 'rtl' && post.titleAr ? post.titleAr : post.title}
                        </h1>
                    </div>

                    {post.image && (
                        <div className="relative aspect-21/10 rounded-[40px] overflow-hidden border border-border/50 shadow-2xl">
                            <Image
                                src={post.image}
                                alt={dir === 'rtl' && post.titleAr ? post.titleAr : post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                </div>

                {/* Article Content */}
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12">

                        {/* Sidebar / Share (Sticky) */}
                        <div className="md:w-16 shrink-0">
                            <div className="sticky top-32 flex md:flex-col gap-4">
                                <button
                                    onClick={handleShare}
                                    className="size-14 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-foreground hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                                    title="Share Article"
                                >
                                    <MdShare size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Text Body */}
                        <div className="flex-1 space-y-10">
                            {/* Excerpt if available */}
                            {(dir === 'rtl' ? post.excerptAr : post.excerpt) && (
                                <p className="text-xl md:text-2xl font-medium text-foreground/70 leading-relaxed italic border-l-4 border-accent pl-6 py-2">
                                    {dir === 'rtl' ? post.excerptAr : post.excerpt}
                                </p>
                            )}

                            {/* Main Content */}
                            <div
                                className={`prose prose-lg max-w-none text-foreground/80 leading-relaxed space-y-6 ${dir === 'rtl' ? 'prose-rtl' : ''}`}
                            >
                                {(dir === 'rtl' && post.contentAr ? post.contentAr : post.content).split('\n').map((para, i) => (
                                    para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                                ))}
                            </div>

                            {/* Keywords / Tags */}
                            {(dir === 'rtl' ? post.keywordsAr : post.keywords) && (
                                <div className="pt-12 border-t border-border/50">
                                    <div className="flex flex-wrap gap-2">
                                        {(dir === 'rtl' ? post.keywordsAr : post.keywords)?.split(',').map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-4 py-2 bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground rounded-xl border border-border"
                                            >
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA / Next Posts would go here */}
            </div>
        </article>
    );
}
