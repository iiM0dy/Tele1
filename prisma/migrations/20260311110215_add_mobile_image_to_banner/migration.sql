-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "canDeleteBanners" BOOLEAN NOT NULL DEFAULT true,
    "canDeleteCategories" BOOLEAN NOT NULL DEFAULT true,
    "canDeleteOrders" BOOLEAN NOT NULL DEFAULT true,
    "canDeleteProducts" BOOLEAN NOT NULL DEFAULT true,
    "canDeletePromoCodes" BOOLEAN NOT NULL DEFAULT true,
    "canDeleteBlogs" BOOLEAN NOT NULL DEFAULT true,
    "canManageBanners" BOOLEAN NOT NULL DEFAULT true,
    "canManageCategories" BOOLEAN NOT NULL DEFAULT true,
    "canManageOrders" BOOLEAN NOT NULL DEFAULT true,
    "canManageProducts" BOOLEAN NOT NULL DEFAULT true,
    "canManagePromoCodes" BOOLEAN NOT NULL DEFAULT true,
    "canManageBlogs" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "slug" TEXT,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "subCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "SKU" TEXT,
    "Category" TEXT NOT NULL,
    "Price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "Status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "IsTrending" BOOLEAN NOT NULL DEFAULT false,
    "BestSeller" BOOLEAN NOT NULL DEFAULT false,
    "Images" TEXT NOT NULL,
    "badge" TEXT,
    "color" TEXT,
    "model" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "discountPrice" DECIMAL(10,2),
    "discountType" TEXT,
    "discountValue" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subCategoryId" TEXT,
    "typeId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "postalCode" TEXT,
    "email" TEXT,
    "Name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nationalId" TEXT,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "promoCodeId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "titleAr" TEXT,
    "subtitleAr" TEXT,
    "image" TEXT NOT NULL,
    "mobileImage" TEXT,
    "buttonText" TEXT DEFAULT 'Shop Now',
    "link" TEXT DEFAULT '/products',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountPercentage" INTEGER NOT NULL,
    "delegateName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "totalSales" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'site-settings',
    "categoriesCtaTitle" TEXT DEFAULT 'Need expert advice?',
    "categoriesCtaDesc" TEXT DEFAULT 'Our consultants are here to help you find the perfect products for your needs.',
    "categoriesCtaTitleAr" TEXT DEFAULT 'هل تحتاجين إلى نصيحة الخبراء؟',
    "categoriesCtaDescAr" TEXT DEFAULT 'مستشارونا هنا لمساعدتك في العثور على المنتجات المثالية لاحتياجاتك.',
    "categoriesCtaImage" TEXT DEFAULT 'https://via.placeholder.com/400x300',
    "shippingTitle" TEXT DEFAULT 'Fast & Reliable Shipping',
    "shippingDesc" TEXT DEFAULT 'We ensure your products reach you in perfect condition, wherever you are.',
    "shippingTitleAr" TEXT DEFAULT 'شحن سريع وموثوق',
    "shippingDescAr" TEXT DEFAULT 'نحن نضمن وصول منتجاتك إليك في حالة ممتازة.',
    "verificationTitle" TEXT DEFAULT 'Verification Process',
    "verificationDesc" TEXT DEFAULT 'Orders are processed within 24-48 hours. You will receive a confirmation email once your package has shipped.',
    "verificationTitleAr" TEXT DEFAULT 'عملية التحقق',
    "verificationDescAr" TEXT DEFAULT 'يتم معالجة الطلبات في غضون 24-48 ساعة. ستتلقى رسالة تأكيد بالبريد الإلكتروني بمجرد شحن طردك.',
    "standardShippingTime" TEXT DEFAULT '3-5 Business Days',
    "expressShippingTime" TEXT DEFAULT '1-2 Business Days',
    "returnsTitle" TEXT DEFAULT 'Returns & Exchanges',
    "returnsDesc" TEXT DEFAULT 'Your satisfaction is our priority. If you''re not happy with your purchase, we''re here to help.',
    "returnsTitleAr" TEXT DEFAULT 'المرتجعات والاستبدال',
    "returnsDescAr" TEXT DEFAULT 'رضاكم هو أولويتنا. إذا لم تكن راضيًا عن مشترياتك، فنحن هنا للمساعدة.',
    "finalSaleTitle" TEXT DEFAULT 'Final Sale Items',
    "finalSaleDesc" TEXT DEFAULT 'Certain items are final sale for hygiene reasons.',
    "finalSaleTitleAr" TEXT DEFAULT 'أصناف البيع النهائي',
    "finalSaleDescAr" TEXT DEFAULT 'بعض العناصر هي بيع نهائي لأسباب صحية.',
    "hygieneTitle" TEXT DEFAULT 'Hygiene & Safety Protocols',
    "hygieneDesc" TEXT DEFAULT 'For your safety, we follow strict protocols for handling all products.',
    "hygieneTitleAr" TEXT DEFAULT 'بروتوكولات النظافة والسلامة',
    "hygieneDescAr" TEXT DEFAULT 'من أجل سلامتك، نتبع بروتوكولات صارمة للتعامل مع جميع المنتجات.',
    "shippingReturnsImage" TEXT DEFAULT 'https://via.placeholder.com/800x400',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsContent" (
    "id" TEXT NOT NULL DEFAULT 'about-us',
    "titleEn" TEXT NOT NULL DEFAULT 'About Us',
    "titleAr" TEXT NOT NULL DEFAULT 'من نحن',
    "subtitleEn" TEXT NOT NULL DEFAULT 'Our mission and commitment to quality',
    "subtitleAr" TEXT NOT NULL DEFAULT 'مهمتنا والتزامنا بالجودة',
    "heroImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
    "storyTitleEn" TEXT NOT NULL DEFAULT 'Our Story',
    "storyTitleAr" TEXT NOT NULL DEFAULT 'قصتنا',
    "storyText1En" TEXT NOT NULL DEFAULT 'Founded with a passion for excellence...',
    "storyText1Ar" TEXT NOT NULL DEFAULT 'تأسست بشغف للتميز...',
    "storyText2En" TEXT NOT NULL DEFAULT 'Today, we continue to innovate...',
    "storyText2Ar" TEXT NOT NULL DEFAULT 'اليوم، نواصل الابتكار...',
    "storyImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1000&auto=format&fit=crop',
    "valuesTitleEn" TEXT NOT NULL DEFAULT 'Our Values',
    "valuesTitleAr" TEXT NOT NULL DEFAULT 'قيمنا',
    "qualityTitleEn" TEXT NOT NULL DEFAULT 'Quality',
    "qualityTitleAr" TEXT NOT NULL DEFAULT 'الجودة',
    "qualityDescEn" TEXT NOT NULL DEFAULT 'We never compromise on quality.',
    "qualityDescAr" TEXT NOT NULL DEFAULT 'نحن لا نساوم أبداً على الجودة.',
    "innovationTitleEn" TEXT NOT NULL DEFAULT 'Innovation',
    "innovationTitleAr" TEXT NOT NULL DEFAULT 'الابتكار',
    "innovationDescEn" TEXT NOT NULL DEFAULT 'Leading the way with new technology.',
    "innovationDescAr" TEXT NOT NULL DEFAULT 'نحن نقود الطريق بالتكنولوجيا الجديدة.',
    "customerTitleEn" TEXT NOT NULL DEFAULT 'Customer Focus',
    "customerTitleAr" TEXT NOT NULL DEFAULT 'تركيزنا على العميل',
    "customerDescEn" TEXT NOT NULL DEFAULT 'Your satisfaction is our top priority.',
    "customerDescAr" TEXT NOT NULL DEFAULT 'رضاكم هو أولويتنا القصوى.',
    "ctaTitleEn" TEXT NOT NULL DEFAULT 'Innovation First',
    "ctaTitleAr" TEXT NOT NULL DEFAULT 'الابتكار أولاً',
    "ctaDescEn" TEXT NOT NULL DEFAULT 'Empowering your digital lifestyle with cutting-edge technology...',
    "ctaDescAr" TEXT NOT NULL DEFAULT 'تمكين نمط حياتك الرقمي بأحدث التقنيات...',
    "ctaImage" TEXT DEFAULT 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutUsContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "slug" TEXT NOT NULL,
    "slugAr" TEXT,
    "content" TEXT NOT NULL,
    "contentAr" TEXT,
    "excerpt" TEXT,
    "excerptAr" TEXT,
    "image" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "metaTitle" TEXT,
    "metaTitleAr" TEXT,
    "metaDescription" TEXT,
    "metaDescriptionAr" TEXT,
    "keywords" TEXT,
    "keywordsAr" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_slug_key" ON "SubCategory"("slug");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_idx" ON "SubCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Type_slug_key" ON "Type"("slug");

-- CreateIndex
CREATE INDEX "Type_subCategoryId_idx" ON "Type"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_Category_idx" ON "Product"("Category");

-- CreateIndex
CREATE INDEX "Product_subCategoryId_idx" ON "Product"("subCategoryId");

-- CreateIndex
CREATE INDEX "Product_typeId_idx" ON "Product"("typeId");

-- CreateIndex
CREATE INDEX "Product_Name_idx" ON "Product"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slugAr_key" ON "BlogPost"("slugAr");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Type" ADD CONSTRAINT "Type_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_Category_fkey" FOREIGN KEY ("Category") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
