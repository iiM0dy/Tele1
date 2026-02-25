import { getCategoryById } from "@/lib/public-actions";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/home/ProductGrid";
import { getI18n } from "@/lib/i18n";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const category = await getCategoryById(id);
    const { language } = await getI18n();

    if (!category) {
        notFound();
    }

    const displayName = language === 'ar' && category.nameAr ? category.nameAr : category.name;

    return (
        <div className="w-full px-4 md:px-[48px] pt-[107px] pb-12">
            <h1 className="text-4xl font-bold mb-8">{displayName}</h1>
            <ProductGrid products={category.products as any} title="" />
        </div>
    );
}
