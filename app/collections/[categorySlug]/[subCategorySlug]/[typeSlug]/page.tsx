import CollectionPage from "@/components/collections/CollectionPage";
import { getProductsByCategory } from "@/lib/public-actions";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function TypeCollectionPage(props: {
    params: Promise<{ categorySlug: string; subCategorySlug: string; typeSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const {
        products,
        currentSubCategory,
        currentType,
        totalPages,
        currentPage,
        categoryName,
        categoryNameAr
    } = await getProductsByCategory(
        params.categorySlug,
        page,
        24,
        params.subCategorySlug,
        params.typeSlug
    );

    if (!currentType) {
        notFound();
    }

    return (
        <CollectionPage
            products={products as any}
            collectionName={currentType.name}
            collectionNameAr={null}
            totalPages={totalPages}
            currentPage={currentPage}
            categorySlug={params.categorySlug}
            brandSlug={params.subCategorySlug}
        />
    );
}
