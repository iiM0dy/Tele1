"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    MdAdd,
    MdSearch,
    MdDelete,
    MdEdit,
    MdLibraryBooks,
    MdVisibility,
    MdVisibilityOff,
    MdDateRange,
    MdKeyboardArrowRight
} from 'react-icons/md';
import { useLanguage } from "@/app/context/LanguageContext";
import { deleteBlogPost, toggleBlogPostPublish } from "@/lib/blog-actions";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";

import { BlogPost } from "@/types/blog";

const BlogModal = dynamic<any>(() => import("./BlogModal"), {
    ssr: false,
    loading: () => null
});

// Redundant interface removed, using import instead

export default function BlogsClient({ initialPosts = [] }: { initialPosts: BlogPost[] }) {
    const { t, dir } = useLanguage();
    const router = useRouter();

    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const filteredPosts = useMemo(() => {
        return initialPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.titleAr?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.slug.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [initialPosts, searchQuery]);

    const handleEdit = (post: BlogPost) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(t('admin.confirmDeleteBlog')?.replace('{title}', title) || `Are you sure you want to delete "${title}"?`)) {
            try {
                const result = await deleteBlogPost(id);
                if (result.success) {
                    toast.success(t('admin.blogDeleted') || "Blog post deleted");
                    router.refresh();
                } else {
                    toast.error(result.error || "Failed to delete blog post");
                }
            } catch (error) {
                console.error("Error deleting blog post:", error);
                toast.error("Error deleting blog post");
            }
        }
    };

    const handleTogglePublish = async (post: BlogPost) => {
        setLoadingMap(prev => ({ ...prev, [post.id]: true }));
        try {
            const result = await toggleBlogPostPublish(post.id, !post.isPublished);
            if (result.success) {
                toast.success(post.isPublished ? "Post unpublished" : "Post published");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Error toggling publish status:", error);
            toast.error("Error updating status");
        } finally {
            setLoadingMap(prev => ({ ...prev, [post.id]: false }));
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#202126]">
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8 pb-10">

                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase">{t('admin.blogs')}</h2>
                            <p className="text-white/60 text-[11px] font-semibold tracking-wider">MANAGE ARTICLE & SEO CONTENT</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedPost(null);
                                setIsModalOpen(true);
                            }}
                            className="bg-accent hover:bg-accent/90 text-white h-12 px-6 rounded-2xl font-black text-[11px] tracking-wider flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <MdAdd className="text-[20px]" />
                            {t('admin.addNewBlog') || "ADD NEW POST"}
                        </button>
                    </div>

                    {/* Blog List container */}
                    <div className="bg-white/2 border border-white/5 rounded-3xl shadow-sm overflow-hidden">
                        {/* Search Toolbar */}
                        <div className="p-6 border-b border-white/5">
                            <div className="relative w-full md:w-80">
                                <span className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                                    <MdSearch className="text-accent text-[20px]" />
                                </span>
                                <input
                                    className={`block w-full ${dir === 'rtl' ? 'pr-12 pl-3' : 'pl-12 pr-3'} py-3 border border-white/5 rounded-2xl bg-white/2 text-[13px] font-medium text-white placeholder-white/20 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all outline-none`}
                                    placeholder={t('admin.searchPlaceholder')}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* List/Grid */}
                        <div className="p-6">
                            {filteredPosts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-white/20">
                                    <MdLibraryBooks className="text-6xl mb-4" />
                                    <p className="font-bold tracking-widest uppercase">{t('admin.noBlogsFound') || "No blog posts found"}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPosts.map((post) => (
                                        <div key={post.id} className="group relative bg-white/2 border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 transition-all">
                                            {/* Post Image */}
                                            <div className="relative aspect-video bg-white/2 overflow-hidden border-b border-white/5">
                                                {post.image ? (
                                                    <Image
                                                        src={post.image}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <MdLibraryBooks className="text-white/10 text-4xl" />
                                                    </div>
                                                )}

                                                {/* Status Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase border ${post.isPublished
                                                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                                                        : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                                                        }`}>
                                                        {post.isPublished ? "PUBLISHED" : "DRAFT"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex flex-col gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                                        <MdDateRange className="text-accent" />
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <h3 className="text-lg font-black text-white leading-tight line-clamp-2 uppercase">
                                                        {dir === 'rtl' && post.titleAr ? post.titleAr : post.title}
                                                    </h3>
                                                </div>

                                                <p className="text-white/40 text-[11px] leading-relaxed line-clamp-2">
                                                    {dir === 'rtl' && post.excerptAr ? post.excerptAr : post.excerpt || "No excerpt provided..."}
                                                </p>

                                                {/* Actions */}
                                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(post)}
                                                            className="p-3 bg-white/2 hover:bg-accent hover:text-white text-white/60 rounded-xl transition-all border border-white/5"
                                                            title="Edit Post"
                                                        >
                                                            <MdEdit className="text-[18px]" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleTogglePublish(post)}
                                                            disabled={loadingMap[post.id]}
                                                            className={`p-3 rounded-xl transition-all border border-white/5 ${post.isPublished
                                                                ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white"
                                                                : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white"
                                                                }`}
                                                            title={post.isPublished ? "Unpublish" : "Publish"}
                                                        >
                                                            {post.isPublished ? <MdVisibilityOff className="text-[18px]" /> : <MdVisibility className="text-[18px]" />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(post.id, post.title)}
                                                            className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/10"
                                                            title="Delete Post"
                                                        >
                                                            <MdDelete className="text-[18px]" />
                                                        </button>
                                                    </div>

                                                    <a
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        className="size-10 bg-accent/10 hover:bg-accent text-accent hover:text-white flex items-center justify-center rounded-xl transition-all"
                                                    >
                                                        <MdKeyboardArrowRight className="text-2xl" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BlogModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPost(null);
                }}
                post={selectedPost as any}
            />
        </div>
    );
}
