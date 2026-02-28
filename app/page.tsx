import { getTrendingProducts, getBestSellers, getFeaturedCategories, getReviews, getBanners } from "@/lib/public-actions";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import BestSellerSection from "@/components/home/BestSellerSection";
import NewReleasesSection from "@/components/home/NewReleasesSection";
import CollectionList from "@/components/home/CollectionList";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import PurposeSection from "@/components/home/PurposeSection";
import { getI18n } from "@/lib/i18n";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [trendingProducts, bestSellers, featuredCategories, reviews, banners, { t }] = await Promise.all([
    getTrendingProducts(8),
    getBestSellers(8),
    getFeaturedCategories(5),
    getReviews(10),
    getBanners(),
    getI18n()
  ]);

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
