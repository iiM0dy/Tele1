"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export async function createUser(data: any) {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await prisma.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
                role: data.role || 'ADMIN',
                canManageProducts: data.canManageProducts,
                canDeleteProducts: data.canDeleteProducts,
                canManageCategories: data.canManageCategories,
                canDeleteCategories: data.canDeleteCategories,
                canManageBanners: data.canManageBanners,
                canDeleteBanners: data.canDeleteBanners,
                canManageOrders: data.canManageOrders,
                canDeleteOrders: data.canDeleteOrders,
                canManagePromoCodes: data.canManagePromoCodes,
                canDeletePromoCodes: data.canDeletePromoCodes,
            }
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create user:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Username already exists" };
        }
        return { success: false, error: "Failed to create user" };
    }
}

export async function updateUser(id: string, data: any) {
    try {
        const updateData: any = {
            username: data.username,
            role: data.role,
            canManageProducts: data.canManageProducts,
            canDeleteProducts: data.canDeleteProducts,
            canManageCategories: data.canManageCategories,
            canDeleteCategories: data.canDeleteCategories,
            canManageBanners: data.canManageBanners,
            canDeleteBanners: data.canDeleteBanners,
            canManageOrders: data.canManageOrders,
            canDeleteOrders: data.canDeleteOrders,
            canManagePromoCodes: data.canManagePromoCodes,
            canDeletePromoCodes: data.canDeletePromoCodes,
        };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        await prisma.user.update({
            where: { id },
            data: updateData
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Failed to update user:", error);
        return { success: false, error: "Failed to update user" };
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id }
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}
