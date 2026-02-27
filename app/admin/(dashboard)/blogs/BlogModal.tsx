"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MdClose, MdSync, MdCheckCircle, MdLanguage, MdSearch, MdInfo } from "react-icons/md";
import { createBlogPost, updateBlogPost } from "@/lib/blog-actions";
import { useLanguage } from "@/app/context/LanguageContext";
import { toast } from "react-hot-toast";

import { BlogPost } from "@/types/blog";

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    post?: BlogPost | null;
}

export default function BlogModal({ isOpen, onClose, post }: BlogModalProps) {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
    const [activeLang, setActiveLang] = useState<"en" | "ar">("en");

    const [formData, setFormData] = useState({
        title: "",
        titleAr: "",
        content: "",
        contentAr: "",
        excerpt: "",
        excerptAr: "",
        image: "",
        isPublished: false,
        metaTitle: "",
        metaTitleAr: "",
        metaDescription: "",
        metaDescriptionAr: "",
        keywords: "",
        keywordsAr: "",
    });

    useEffect(() => {
        if (post && isOpen) {
            setFormData({
                title: post.title || "",
                titleAr: post.titleAr || "",
                content: post.content || "",
                contentAr: post.contentAr || "",
                excerpt: post.excerpt || "",
                excerptAr: post.excerptAr || "",
                image: post.image || "",
                isPublished: post.isPublished || false,
                metaTitle: post.metaTitle || "",
                metaTitleAr: post.metaTitleAr || "",
                metaDescription: post.metaDescription || "",
                metaDescriptionAr: post.metaDescriptionAr || "",
                keywords: post.keywords || "",
                keywordsAr: post.keywordsAr || "",
            });
        } else if (isOpen) {
            setFormData({
                title: "",
                titleAr: "",
                content: "",
                contentAr: "",
                excerpt: "",
                excerptAr: "",
                image: "",
                isPublished: false,
                metaTitle: "",
                metaTitleAr: "",
                metaDescription: "",
                metaDescriptionAr: "",
                keywords: "",
                keywordsAr: "",
            });
        }
    }, [post, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error("Title and Content are required");
            return;
        }

        setIsLoading(true);
        try {
            const result = post
                ? await updateBlogPost(post.id, formData)
                : await createBlogPost(formData);

            if (result.success) {
                toast.success(post ? "Post updated" : "Post created");
                onClose();
            } else {
                toast.error(result.error || "Failed to save post");
            }
        } catch (err) {
            console.error("Error saving blog post:", err);
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-[#202126] w-full max-w-4xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/1">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">
                            {post ? "EDIT BLOG POST" : "CREATE NEW POST"}
                        </h3>
                        <p className="text-[11px] font-semibold tracking-wider text-white/40">
                            {post ? "UPDATE YOUR ARTICLE & SEO" : "WRITE A NEW ARTICLE FOR YOUR AUDIENCE"}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white/2 p-1 rounded-2xl border border-white/5">
                            <button
                                onClick={() => setActiveLang("en")}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeLang === 'en' ? 'bg-accent text-white' : 'text-white/40 hover:text-white'}`}
                            >
                                ENGLISH
                            </button>
                            <button
                                onClick={() => setActiveLang("ar")}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeLang === 'ar' ? 'bg-accent text-white' : 'text-white/40 hover:text-white'}`}
                            >
                                ARABIC
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <MdClose className="text-[24px]" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-white/1 px-8 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab("content")}
                        className={`px-6 py-4 text-[11px] font-black tracking-[0.2em] border-b-2 transition-all ${activeTab === 'content' ? 'border-accent text-accent' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        ARTICLE CONTENT
                    </button>
                    <button
                        onClick={() => setActiveTab("seo")}
                        className={`px-6 py-4 text-[11px] font-black tracking-[0.2em] border-b-2 transition-all ${activeTab === 'seo' ? 'border-accent text-accent' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        SEO OPTIMIZATION
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                    {activeTab === 'content' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Featured Image */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">Featured Image URL</label>
                                <div className="flex gap-4">
                                    <input
                                        className="flex-1 h-14 rounded-2xl border border-white/5 bg-white/2 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-5 text-sm text-white placeholder-white/20 outline-none"
                                        placeholder="https://images.unsplash.com/..."
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                    />
                                </div>
                                {formData.image && (
                                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 max-w-md">
                                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>

                            {/* Title & Slug */}
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                                        {activeLang === 'en' ? "Title" : "Title (Arabic)"}
                                    </label>
                                    <input
                                        className="w-full h-14 rounded-2xl border border-white/5 bg-white/2 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-5 text-lg font-black text-white outline-none"
                                        placeholder={activeLang === 'en' ? "Enter article title..." : "أدخل عنوان المقال..."}
                                        name={activeLang === 'en' ? "title" : "titleAr"}
                                        value={activeLang === 'en' ? formData.title : formData.titleAr}
                                        onChange={handleChange}
                                        dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                                    {activeLang === 'en' ? "Short Excerpt" : "Short Excerpt (Arabic)"}
                                </label>
                                <textarea
                                    className="w-full h-24 rounded-2xl border border-white/5 bg-white/2 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-5 py-4 text-sm text-white outline-none resize-none"
                                    placeholder="Write a brief summary of the post..."
                                    name={activeLang === 'en' ? "excerpt" : "excerptAr"}
                                    value={activeLang === 'en' ? formData.excerpt : formData.excerptAr}
                                    onChange={handleChange}
                                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                                    {activeLang === 'en' ? "Article Content" : "Article Content (Arabic)"}
                                </label>
                                <textarea
                                    className="w-full h-96 rounded-2xl border border-white/5 bg-white/2 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-5 py-5 text-[15px] leading-relaxed text-white outline-none"
                                    placeholder="Start writing your article here..."
                                    name={activeLang === 'en' ? "content" : "contentAr"}
                                    value={activeLang === 'en' ? formData.content : formData.contentAr}
                                    onChange={handleChange}
                                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                />
                                <div className="flex items-center gap-2 text-[10px] text-white/20 mt-2 font-bold uppercase tracking-widest">
                                    <MdInfo /> Supports basic HTML tags for formatting
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="p-6 bg-accent/5 rounded-3xl border border-accent/10 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
                                    <MdSearch size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Search Engine Optimization</h4>
                                    <p className="text-[11px] text-white/40 font-bold uppercase tracking-tight mt-1 leading-relaxed">
                                        These settings control how your post appears in search results like Google. Optimizing these will help your website get more traffic.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {/* Meta Title */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                                        {activeLang === 'en' ? "SEO Meta Title" : "SEO Meta Title (Arabic)"}
                                    </label>
                                    <input
                                        className="w-full h-14 rounded-2xl border border-white/5 bg-white/2 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-5 text-sm text-white outline-none"
                                        placeholder="The title shown in search results..."
                                        name={activeLang === 'en' ? "metaTitle" : "metaTitleAr"}
                                        value={activeLang === 'en' ? formData.metaTitle : formData.metaTitleAr}
                                        onChange={handleChange}
                                        dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                    />
                                    <div className="flex justify-between px-1">
                                        <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Recommended: 50-60 characters</p>
                                        <p className={`text-[9px] font-black tracking-widest ${(activeLang === 'en' ? formData.metaTitle.length : formData.metaTitleAr.length) > 60 ? 'text-red-500' : 'text-white/20'}`}>
                                            {(activeLang === 'en' ? formData.metaTitle.length : formData.metaTitleAr.length)} CHARS
                                        </p>
                                    </div>
                                </div>

                                {/* Meta Description */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                                        {activeLang === 'en' ? "SEO Meta Description" : "SEO Meta Description (Arabic)"}
                                    </label>
                                    <textarea
                                        className="w-full h-32 rounded-2xl border border-white/5 bg-white/2 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-5 py-4 text-sm text-white outline-none resize-none"
                                        placeholder="The short snippet shown under your title in Google..."
                                        name={activeLang === 'en' ? "metaDescription" : "metaDescriptionAr"}
                                        value={activeLang === 'en' ? formData.metaDescription : formData.metaDescriptionAr}
                                        onChange={handleChange}
                                        dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                    />
                                    <div className="flex justify-between px-1">
                                        <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Recommended: 150-160 characters</p>
                                        <p className={`text-[9px] font-black tracking-widest ${(activeLang === 'en' ? formData.metaDescription.length : formData.metaDescriptionAr.length) > 160 ? 'text-red-500' : 'text-white/20'}`}>
                                            {(activeLang === 'en' ? formData.metaDescription.length : formData.metaDescriptionAr.length)} CHARS
                                        </p>
                                    </div>
                                </div>

                                {/* Keywords */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                                        {activeLang === 'en' ? "Keywords" : "Keywords (Arabic)"}
                                    </label>
                                    <input
                                        className="w-full h-14 rounded-2xl border border-white/5 bg-white/2 focus:ring-1 focus:ring-accent/20 focus:border-accent/30 transition-all px-5 text-sm text-white outline-none"
                                        placeholder="Comma separated keywords (e.g. skin care, beauty, health)..."
                                        name={activeLang === 'en' ? "keywords" : "keywordsAr"}
                                        value={activeLang === 'en' ? formData.keywords : formData.keywordsAr}
                                        onChange={handleChange}
                                        dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                                    />
                                </div>
                            </div>

                            {/* Google Preview Simulation */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">Search Result Preview</label>
                                <div className="bg-white p-6 rounded-3xl border border-white/5">
                                    <p className="text-[#1a0dab] text-xl font-normal hover:underline cursor-pointer mb-1 truncate">
                                        {(activeLang === 'en' ? formData.metaTitle : formData.metaTitleAr) || (activeLang === 'en' ? formData.title : formData.titleAr) || "Post Title"}
                                    </p>
                                    <p className="text-[#006621] text-sm mb-1">
                                        https://tele1.com/blog/{(activeLang === 'en' ? formData.title : formData.titleAr)?.toLowerCase().replace(/ /g, '-')}
                                    </p>
                                    <p className="text-[#4d5156] text-sm line-clamp-2">
                                        {(activeLang === 'en' ? formData.metaDescription : formData.metaDescriptionAr) || (activeLang === 'en' ? formData.excerpt : formData.excerptAr) || "Start writing your meta description to see how this post will appear in search results."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="px-8 py-6 bg-white/1 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/20 after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-checked:after:bg-white peer-checked:after:border-accent group-hover:bg-white/10 transition-all"></div>
                            <span className="ms-3 text-[11px] font-black uppercase tracking-widest text-white/40 peer-checked:text-accent transition-all">
                                {formData.isPublished ? "Post Published" : "Save as Draft"}
                            </span>
                        </label>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 h-12 rounded-2xl text-[11px] font-black tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white h-12 px-8 rounded-2xl font-black text-[11px] tracking-widest flex items-center gap-3 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-accent/20"
                        >
                            {isLoading ? (
                                <MdSync className="animate-spin text-[20px]" />
                            ) : (
                                <MdCheckCircle className="text-[20px]" />
                            )}
                            {isLoading ? "SAVING..." : (post ? "UPDATE POST" : "PUBLISH POST")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
