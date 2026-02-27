import { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog-actions";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
    title: "Blog & Tech Updates | TELE1",
    description: "Stay updated with the latest tech news, product reviews, and tips from TELE1. Expert insights on smartphones, accessories, and electronics.",
    openGraph: {
        title: "TELE1 Blog - Latest in Tech & Innovation",
        description: "Explore our blog for the newest updates in the world of premium electronics and accessories.",
        type: "website",
    },
};

export default async function BlogPage() {
    const { posts = [] } = await getBlogPosts(true); // Only published posts
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tele12.com';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "TELE1 Blog",
        "description": "Stay updated with the latest tech news, product reviews, and tips from TELE1.",
        "url": `${baseUrl}/blog`,
        "publisher": {
            "@type": "Organization",
            "name": "TELE1",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
            }
        },
        "blogPost": posts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt || post.content.substring(0, 160),
            "image": post.image,
            "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
            "url": `${baseUrl}/blog/${post.slug}`
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogListClient posts={posts} />
        </>
    );
}
