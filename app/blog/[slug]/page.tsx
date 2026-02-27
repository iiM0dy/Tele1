import { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/blog-actions";
import BlogPostClient from "./BlogPostClient";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const { post } = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found | TELE1",
        };
    }

    // Determine the current language based on the slug used in the URL
    const isArabic = post.slugAr === slug;
    
    // Determine the title and description for SEO (preferring meta fields if they exist)
    const title = isArabic 
        ? (post.metaTitleAr || post.titleAr || post.title)
        : (post.metaTitle || post.title);
    
    const description = isArabic
        ? (post.metaDescriptionAr || post.excerptAr || post.contentAr?.substring(0, 160) || post.content.substring(0, 160))
        : (post.metaDescription || post.excerpt || post.content.substring(0, 160));
        
    const keywords = isArabic ? (post.keywordsAr || post.keywords || "") : (post.keywords || "");
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tele12.com';
    const currentPath = `/blog/${slug}`;
    const canonicalUrl = `${baseUrl}${currentPath}`;
    
    // Language alternates for SEO
    const languages: Record<string, string> = {};
    if (post.slug) languages['en-US'] = `/blog/${post.slug}`;
    if (post.slugAr) languages['ar-EG'] = `/blog/${post.slugAr}`;

    return {
        title: `${title} | TELE1 Blog`,
        description,
        keywords,
        alternates: {
            canonical: canonicalUrl,
            languages: languages
        },
        openGraph: {
            title: `${title} | TELE1 Blog`,
            description,
            type: "article",
            publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
            images: post.image ? [{ url: post.image }] : [],
            locale: isArabic ? 'ar' : 'en_US',
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | TELE1 Blog`,
            description,
            images: post.image ? [post.image] : [],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const { post } = await getBlogPostBySlug(slug);

    if (!post || !post.isPublished) {
        notFound();
    }

    // JSON-LD Structured Data for Article
    const isArabic = post.slugAr === slug;
    const title = isArabic ? (post.titleAr || post.title) : post.title;
    const description = isArabic ? (post.excerptAr || post.contentAr?.substring(0, 160)) : (post.excerpt || post.content.substring(0, 160));
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tele12.com';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": post.image,
        "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
        "dateModified": new Date(post.updatedAt).toISOString(),
        "author": {
            "@type": "Organization",
            "name": "TELE1"
        },
        "publisher": {
            "@type": "Organization",
            "name": "TELE1",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/blog/${slug}`
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPostClient post={post as any} />
        </>
    );
}
