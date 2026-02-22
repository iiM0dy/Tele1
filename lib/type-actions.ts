"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

interface TypeInput {
    name: string;
    description?: string | null;
    image?: string | null;
    subCategoryId: string;
}

export async function createType(data: TypeInput) {
    try {
        let slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        // Ensure slug is unique
        let existing = await prisma.type.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }

        const type = await prisma.type.create({
            data: {
                name: data.name,
                slug,
                subCategoryId: data.subCategoryId,
            },
        });
        revalidatePath("/admin/categories");
        revalidatePath("/products");
        return { success: true, type };
    } catch (error) {
        console.error("Error creating type:", error);
        return { success: false, error: "Failed to create type" };
    }
}

export async function updateType(id: string, data: Partial<TypeInput>) {
    try {
        const updateData: any = {
            subCategoryId: data.subCategoryId,
        };

        if (data.name) {
            let slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const existing = await prisma.type.findFirst({
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

        const type = await prisma.type.update({
            where: { id },
            data: updateData,
        });
        revalidatePath("/admin/categories");
        revalidatePath("/products");
        return { success: true, type };
    } catch (error) {
        console.error("Error updating type:", error);
        return { success: false, error: "Failed to update type" };
    }
}

export async function deleteType(id: string) {
    try {
        await prisma.type.delete({
            where: { id },
        });
        revalidatePath("/admin/categories");
        revalidatePath("/products");
        return { success: true };
    } catch (error) {
        console.error("Error deleting type:", error);
        return { success: false, error: "Failed to delete type" };
    }
}

export async function getTypes(subCategoryId: string) {
    try {
        const types = await prisma.type.findMany({
            where: { subCategoryId },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        return { success: true, types };
    } catch (error) {
        console.error("Error fetching types:", error);
        return { success: false, error: "Failed to fetch types", types: [] };
    }
}
