import CollectionPage from "@/components/collections/CollectionPage";
import { getProductsByCategory } from "@/lib/public-actions";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CategoryCollectionPage(props: {
    params: Promise<{ categorySlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    
    const page = Number(searchParams.page) || 1;
    const { products, totalPages, currentPage, categoryName } = await getProductsByCategory(params.categorySlug, page, 50);

    if (products.length === 0 && page === 1 && categoryName === '') {
        notFound();
    }

    return (
        <CollectionPage 
            products={products as any} 
            collectionName={categoryName}
            totalPages={totalPages}
            currentPage={currentPage}
            categorySlug={params.categorySlug}
        />
    );
}