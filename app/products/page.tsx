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
        <div className="flex flex-col min-h-screen bg-white pt-[110px]">
            <div className="container mx-auto px-4 md:px-6 pb-24">
                <div className="flex flex-col items-center mb-16 relative">
                    <h1 className="text-[32px] md:text-[42px] font-sans font-black tracking-tighter text-[#0F172A] mb-4 text-center uppercase">
                        {q ? `${t('common.search')}: ${q}` : t('products.allProducts')}
                    </h1>
                    <div className="w-20 h-1.5 bg-accent rounded-full" />
                </div>
                
                <ProductGrid products={products as any} title="" />
            </div>
        </div>
    );
}
