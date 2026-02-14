import { getAdminCategories } from "../../../../lib/admin-actions";
import CategoriesClient from "./CategoriesClient";

export const revalidate = 60; // Revalidate every minute for admin

export default async function AdminCategoriesPage() {
    const data = await getAdminCategories();

    return <CategoriesClient categories={data.categories} />;
}
