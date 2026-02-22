"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

interface SubCategoryInput {
    name: string;
    description?: string | null;
    image: string;
    categoryId: string;
}

export async function createSubCategory(data: SubCategoryInput) {
    try {
        let slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        // Ensure slug is unique
        let existing = await prisma.subCategory.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }

        const subCategory = await prisma.subCategory.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                image: data.image,
                categoryId: data.categoryId,
            },
        });
        revalidatePath("/admin/categories");
        revalidatePath("/products");
        return { success: true, subCategory };
    } catch (error) {
        console.error("Error creating subcategory:", error);
        return { success: false, error: "Failed to create subcategory" };
    }
}

export async function updateSubCategory(id: string, data: Partial<SubCategoryInput>) {
    try {
        const updateData: any = {
            description: data.description,
            image: data.image,
            categoryId: data.categoryId,
        };

        if (data.name) {
             let slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
             const existing = await prisma.subCategory.findFirst({
                where: {
                    slug,
                    id: { not: id }
                }
             });
             if (existing) {
                 slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
             }
             updateData.name = data.name;
             updateData.slug = slug;
        }

        const subCategory = await prisma.subCategory.update({
            where: { id },
            data: updateData,
        });
        revalidatePath("/admin/categories");
        revalidatePath("/products");
        return { success: true, subCategory };
    } catch (error) {
        console.error("Error updating subcategory:", error);
        return { success: false, error: "Failed to update subcategory" };
    }
}

export async function deleteSubCategory(id: string) {
    try {
        await prisma.subCategory.delete({
            where: { id },
        });
        revalidatePath("/admin/categories");
        revalidatePath("/products");
        return { success: true };
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        return { success: false, error: "Failed to delete subcategory" };
    }
}

export async function getSubCategories(categoryId: string) {
    try {
        const subCategories = await prisma.subCategory.findMany({
            where: { categoryId },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        return { success: true, subCategories };
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return { success: false, error: "Failed to fetch subcategories", subCategories: [] };
    }
}
