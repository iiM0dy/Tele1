import { getAdminProducts, getAdminCategories } from "../../../../lib/admin-actions";
import ProductsClient from "./ProductsClient";

export const revalidate = 60; // Revalidate every minute for admin

export default async function AdminProductsPage() {
    const [productsData, categoriesData] = await Promise.all([
        getAdminProducts(1, 2000),
        getAdminCategories(1, 2000)
    ]);

    return <ProductsClient products={productsData.products} categories={categoriesData.categories} />;
}
