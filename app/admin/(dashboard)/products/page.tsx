import { getAdminProducts, getAdminCategories, getAdminProductStats } from "../../../../lib/admin-actions";
import ProductsClient from "./ProductsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0; // Disable static caching for dynamic searchParams

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'SUPER_ADMIN' && !session.user.canManageProducts)) {
        redirect('/admin/dashboard');
    }

    const params = await searchParams;
    const page = Number(params.page) || 1;
    const search = (params.search as string) || "";
    const category = (params.category as string) || "all";
    const stockStatus = (params.stock as string) || "all";
    const showTrendingOnly = params.trending === "true";
    const showBestSellerOnly = params.bestSeller === "true";

    const [productsData, categoriesData, stats] = await Promise.all([
        getAdminProducts({ 
            page, 
            limit: 20, 
            search, 
            categoryId: category, 
            stockStatus, 
            isTrending: showTrendingOnly, 
            isBestSeller: showBestSellerOnly 
        }),
        getAdminCategories(1, 2000),
        getAdminProductStats()
    ]);

    return (
        <ProductsClient 
            products={productsData.products} 
            categories={categoriesData.categories}
            pagination={productsData.pagination}
            initialStats={stats}
        />
    );
}
