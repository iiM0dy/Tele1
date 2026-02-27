"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { BlogPost } from "@/types/blog";

export async function createBlogPost(data: any) {
    try {
        let slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        let slugAr = data.titleAr ? data.titleAr.replace(/ /g, '-').replace(/[^\u0621-\u064A0-9-]+/g, '') : null;

        // Ensure slug is unique
        let existing = await prisma.blogPost.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }

        const blogPost = await prisma.blogPost.create({
            data: {
                title: data.title,
                titleAr: data.titleAr,
                slug,
                slugAr,
                content: data.content,
                contentAr: data.contentAr,
                excerpt: data.excerpt,
                excerptAr: data.excerptAr,
                image: data.image,
                isPublished: data.isPublished,
                publishedAt: data.isPublished ? new Date() : null,
                metaTitle: data.metaTitle,
                metaTitleAr: data.metaTitleAr,
                metaDescription: data.metaDescription,
                metaDescriptionAr: data.metaDescriptionAr,
                keywords: data.keywords,
                keywordsAr: data.keywordsAr,
            },
        });

        revalidatePath("/admin/blogs");
        revalidatePath("/blog");
        return { success: true, blogPost };
    } catch (error) {
        console.error("Error creating blog post:", error);
        return { success: false, error: "Failed to create blog post" };
    }
}

export async function updateBlogPost(id: string, data: any) {
    try {
        const updateData: any = {
            title: data.title,
            titleAr: data.titleAr,
            content: data.content,
            contentAr: data.contentAr,
            excerpt: data.excerpt,
            excerptAr: data.excerptAr,
            image: data.image,
            isPublished: data.isPublished,
            metaTitle: data.metaTitle,
            metaTitleAr: data.metaTitleAr,
            metaDescription: data.metaDescription,
            metaDescriptionAr: data.metaDescriptionAr,
            keywords: data.keywords,
            keywordsAr: data.keywordsAr,
        };

        if (data.isPublished) {
            const current = await prisma.blogPost.findUnique({ where: { id } });
            if (!current?.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        const blogPost = await prisma.blogPost.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin/blogs");
        revalidatePath("/blog");
        revalidatePath(`/blog/${blogPost.slug}`);
        return { success: true, blogPost };
    } catch (error) {
        console.error("Error updating blog post:", error);
        return { success: false, error: "Failed to update blog post" };
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await prisma.blogPost.delete({
            where: { id },
        });
        revalidatePath("/admin/blogs");
        revalidatePath("/blog");
        return { success: true };
    } catch (error) {
        console.error("Error deleting blog post:", error);
        return { success: false, error: "Failed to delete blog post" };
    }
}

export async function toggleBlogPostPublish(id: string, isPublished: boolean) {
    try {
        const updateData: any = { isPublished };
        if (isPublished) {
            const current = await prisma.blogPost.findUnique({ where: { id } });
            if (!current?.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        await prisma.blogPost.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin/blogs");
        revalidatePath("/blog");
        return { success: true };
    } catch (error) {
        console.error("Error toggling blog publish status:", error);
        return { success: false, error: "Failed to toggle publish status" };
    }
}

export async function getBlogPosts(publishedOnly = false): Promise<{ success: boolean; error?: string; posts: BlogPost[] }> {
    try {
        const posts = await prisma.blogPost.findMany({
            where: publishedOnly ? { isPublished: true } : {},
            orderBy: { createdAt: "desc" },
        }) as unknown as BlogPost[];
        return { success: true, posts };
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return { success: false, error: "Failed to fetch blog posts", posts: [] };
    }
}

export async function getBlogPostBySlug(slug: string): Promise<{ success: boolean; error?: string; post?: BlogPost | null }> {
    try {
        const post = await prisma.blogPost.findFirst({
            where: {
                OR: [
                    { slug: slug },
                    { slugAr: slug }
                ]
            },
        }) as unknown as BlogPost | null;
        return { success: true, post };
    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        return { success: false, error: "Failed to fetch blog post" };
    }
}

