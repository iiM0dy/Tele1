import React from 'react';
import { getAllProducts } from "@/lib/public-actions";
import CollectionPage from "@/components/collections/CollectionPage";

export const dynamic = 'force-dynamic';

export default async function AllCollectionsPage(props: {
    searchParams: Promise<{ page?: string }>
}) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;
    const { products, totalPages, currentPage } = await getAllProducts(page, 24);

    return (
        <CollectionPage 
            products={products as any} 
            collectionName="All Products"
            totalPages={totalPages}
            currentPage={currentPage}
        />
    );
}