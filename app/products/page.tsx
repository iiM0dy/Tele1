import { getProducts } from "@/lib/public-actions";
import ProductGrid from "@/components/home/ProductGrid";
import { getI18n } from "@/lib/i18n";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    const { q, category } = await searchParams;
    const products = await getProducts({ search: q, categoryId: category });
    const { t } = await getI18n();

    return (
        <div className="w-full px-4 md:px-[48px] pt-16 pb-12 md:pb-20 text-[rgb(18,18,18)]">
            <h1 className="text-center text-[31px] font-normal tracking-[0.2em] uppercase mb-16 leading-tight" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                {q ? `${t('common.search')}: ${q}` : t('products.allProducts')}
            </h1>
            <ProductGrid products={products as any} title="" />
        </div>
    );
}
