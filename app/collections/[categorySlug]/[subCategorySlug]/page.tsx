import CollectionPage from "@/components/collections/CollectionPage";
import { getProductsByCategory } from "@/lib/public-actions";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function SubCategoryCollectionPage(props: {
    params: Promise<{ categorySlug: string; subCategorySlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    
    const page = Number(searchParams.page) || 1;
    const { products, currentSubCategory, totalPages, currentPage, categoryName, categoryNameAr } = await getProductsByCategory(params.categorySlug, page, 50, params.subCategorySlug);

    if (!currentSubCategory) {
        notFound();
    }

    return (
        <CollectionPage 
            products={products as any} 
            collectionName={currentSubCategory.name}
            collectionNameAr={null}
            totalPages={totalPages}
            currentPage={currentPage}
            categorySlug={params.categorySlug}
        />
    );
}