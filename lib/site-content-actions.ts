"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function getAboutUsContent() {
    try {
        let content = await prisma.aboutUsContent.findUnique({
            where: { id: "about-us" }
        });

        if (!content) {
            // Create default content if it doesn't exist
            content = await prisma.aboutUsContent.create({
                data: {
                    id: "about-us",
                    titleEn: "About Us",
                    titleAr: "من نحن",
                    subtitleEn: "Our mission and commitment to quality",
                    subtitleAr: "مهمتنا والتزامنا بالجودة",
                    heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
                    storyTitleEn: "Our Story",
                    storyTitleAr: "قصتنا",
                    storyText1En: "Founded with a passion for excellence, Tele1 has grown from a local boutique to a leading electronics provider.",
                    storyText1Ar: "تأسست تيلي 1 بشغف للتميز، وقد نمت من متجر محلي إلى مزود رائد للإلكترونيات.",
                    storyText2En: "Today, we continue to innovate and bring the best technology to our customers across the region.",
                    storyText2Ar: "اليوم، نواصل الابتكار وتقديم أفضل التقنيات لعملائنا في جميع أنحاء المنطقة.",
                    storyImage: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1000&auto=format&fit=crop",
                    valuesTitleEn: "Our Values",
                    valuesTitleAr: "قيمنا",
                    qualityTitleEn: "Quality",
                    qualityTitleAr: "الجودة",
                    qualityDescEn: "We never compromise on the quality of our products.",
                    qualityDescAr: "نحن لا نساوم أبداً على جودة منتجاتنا.",
                    innovationTitleEn: "Innovation",
                    innovationTitleAr: "الابتكار",
                    innovationDescEn: "Staying ahead with the latest technology trends.",
                    innovationDescAr: "البقاء في المقدمة مع أحدث اتجاهات التكنولوجيا.",
                    customerTitleEn: "Customer Focus",
                    customerTitleAr: "تركيزنا على العميل",
                    customerDescEn: "Putting our customers at the heart of everything we do.",
                    customerDescAr: "وضع عملائنا في قلب كل ما نقوم به.",
                    ctaTitleEn: "Innovation First",
                    ctaTitleAr: "الابتكار أولاً",
                    ctaDescEn: "Empowering your digital lifestyle with cutting-edge technology, premium electronics, and accessories designed for peak performance and style.",
                    ctaDescAr: "تمكين نمط حياتك الرقمي بأحدث التقنيات والإلكترونيات المتميزة والإكسسوارات المصممة للأداء العالي والأناقة.",
                    ctaImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
                }
            });
        }

        return { success: true, content };
    } catch (error) {
        console.error("Error fetching About Us content:", error);
        return { success: false, error: "Failed to fetch content" };
    }
}

export async function updateAboutUsContent(data: any) {
    try {
        const content = await prisma.aboutUsContent.upsert({
            where: { id: "about-us" },
            update: data,
            create: { ...data, id: "about-us" }
        });

        revalidatePath("/about-us");
        revalidatePath("/admin/site-content");

        return { success: true, content };
    } catch (error) {
        console.error("Error updating About Us content:", error);
        return { success: false, error: "Failed to update content" };
    }
}
