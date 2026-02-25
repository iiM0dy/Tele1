import { getProducts } from "@/lib/public-actions";
import ProductsClient from "@/components/products/ProductsClient";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    const { q, category } = await searchParams;
    const products = await getProducts({ search: q, categoryId: category });

    return (
        <div className="flex flex-col min-h-screen bg-white pt-[90px]">
            <ProductsClient initialProducts={products as any} />
        </div>
    );
}
