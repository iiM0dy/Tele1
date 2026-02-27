export interface BlogPost {
    id: string;
    title: string;
    titleAr?: string | null;
    slug: string;
    slugAr?: string | null;
    image?: string | null;
    isPublished: boolean;
    publishedAt?: Date | string | null;
    createdAt: Date | string;
    excerpt?: string | null;
    excerptAr?: string | null;
    content: string;
    contentAr?: string | null;
    metaTitle?: string | null;
    metaTitleAr?: string | null;
    metaDescription?: string | null;
    metaDescriptionAr?: string | null;
    keywords?: string | null;
    keywordsAr?: string | null;
    updatedAt: Date | string;
}
