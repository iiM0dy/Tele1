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
    const { products, subCategories, totalPages, currentPage, categoryName, categoryNameAr } = await getProductsByCategory(params.categorySlug, page, 24);

    if (products.length === 0 && (!subCategories || subCategories.length === 0) && page === 1 && categoryName === '') {
        notFound();
    }

    return (
        <CollectionPage 
            products={products as any} 
            subCategories={subCategories}
            collectionName={categoryName}
            collectionNameAr={categoryNameAr}
            totalPages={totalPages}
            currentPage={currentPage}
            categorySlug={params.categorySlug}
        />
    );
}