import { getTrendingProducts, getBestSellers, getAllCategories, getReviews, getBanners } from "@/lib/public-actions";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import ProductGrid from "@/components/home/ProductGrid";
import BestSellerSection from "@/components/home/BestSellerSection";
import NewReleasesSection from "@/components/home/NewReleasesSection";
import CollectionList from "@/components/home/CollectionList";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import PurposeSection from "@/components/home/PurposeSection";
import { getI18n } from "@/lib/i18n";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [trendingProducts, bestSellers, categories, reviews, banners, { t }] = await Promise.all([
    getTrendingProducts(),
    getBestSellers(),
    getAllCategories(),
    getReviews(),
    getBanners(),
    getI18n()
  ]);

  const featuredCategories = categories.filter((c: any) => c.isFeatured).slice(0, 5);

  console.log('Home Page - Best Sellers count:', bestSellers?.length);

  return (
    <div className="flex flex-col gap-0">
      <HeroSlideshow banners={banners} />

      <BestSellerSection products={bestSellers} />
      
      <CollectionList categories={featuredCategories as any} />
      
      <NewReleasesSection products={trendingProducts} />
      
      <ReviewsCarousel reviews={reviews} />
      
      <PurposeSection />
    </div>
  );
}
