import { getAdminCategories } from "../../../../lib/admin-actions";
import CategoriesClient from "./CategoriesClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 60; // Revalidate every minute for admin

export default async function AdminCategoriesPage() {
    // const session = await getServerSession(authOptions);
    //
    // if (!session || (session.user.role !== 'SUPER_ADMIN' && !session.user.canManageCategories)) {
    //     redirect('/admin/dashboard');
    // }

    const data = await getAdminCategories();

    return <CategoriesClient categories={data.categories} />;
}
