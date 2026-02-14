import { getCategoryById } from "@/lib/public-actions";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/home/ProductGrid";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const category = await getCategoryById(id);

    if (!category) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 pt-[107px] pb-12">
            <h1 className="text-4xl font-bold mb-8">{category.name}</h1>
            <ProductGrid products={category.products as any} title="" />
        </div>
    );
}
