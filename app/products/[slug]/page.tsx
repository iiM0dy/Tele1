import { getProductBySlug } from "@/lib/public-actions";
import { notFound } from "next/navigation";
import ProductDetailsClient from "@/components/products/ProductDetailsClient";

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    return <ProductDetailsClient product={product} />;
}
