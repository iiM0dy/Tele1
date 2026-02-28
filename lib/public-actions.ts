"use server";

import { prisma } from "./prisma";

export async function getBanners() {
    try {
        const banners = await prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        return banners.map(banner => ({
            ...banner,
            image: formatImagePath(banner.image) || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800',
            createdAt: banner.createdAt.toISOString(),
            updatedAt: banner.updatedAt.toISOString()
        }));
    } catch (error) {
        console.error("Failed to fetch banners:", error);
        return [];
    }
}

export async function getAllCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });

        return categories.map(cat => {
            const slug = cat.slug || cat.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            return {
                ...cat,
                slug,
                image: formatImagePath(cat.image),
                createdAt: cat.createdAt.toISOString(),
                updatedAt: cat.updatedAt.toISOString(),
                nameAr: cat.nameAr
            };
        });
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export async function getFeaturedCategories(limit?: number) {
    try {
        const categories = await prisma.category.findMany({
            where: { isFeatured: true },
            take: limit,
            orderBy: { name: 'asc' }
        });

        return categories.map(cat => {
            const slug = cat.slug || cat.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            return {
                ...cat,
                slug,
                image: formatImagePath(cat.image),
                createdAt: cat.createdAt.toISOString(),
                updatedAt: cat.updatedAt.toISOString(),
                nameAr: cat.nameAr
            };
        });
    } catch (error) {
        console.error("Failed to fetch featured categories:", error);
        return [];
    }
}

function formatImagePath(path: string | null | undefined): string | null {
    if (!path || typeof path !== 'string') return null;
    let trimmed = path.trim();
    if (trimmed === '') return null;

    // If it's already a valid absolute URL, data URI, or relative path with leading slash
    if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
        // If it starts with /public/, remove it as Next.js serves from public root
        if (trimmed.startsWith('/public/')) {
            return trimmed.replace('/public/', '/');
        }
        return trimmed;
    }

    // Handle cases where path might start with 'public/'
    if (trimmed.startsWith('public/')) {
        return '/' + trimmed.replace('public/', '');
    }

    // For any other string, assume it's a relative path from the public directory
    // and ensure it has a leading slash as required by Next.js Image component
    return '/' + trimmed;
}

function transformProduct(product: any) {
    let images: string[] = [];
    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800';

    const rawImages = product.Images || product.images;

    try {
        if (typeof rawImages === 'string') {
            if (rawImages.startsWith('[') || rawImages.startsWith('{')) {
                images = JSON.parse(rawImages);
            } else if (rawImages && rawImages.trim() !== '') {
                // Split by comma, handling optional spaces around commas
                // This supports "url1,url2" and "url1, url2" formats
                // We assume URLs do not contain commas themselves, which is standard for web resources
                images = rawImages.split(',').map(img => img.trim()).filter(img => img !== '');
            }
        } else if (Array.isArray(rawImages)) {
            images = rawImages;
        }
    } catch (e) {
        images = [];
    }

    // Server-side logging for debugging
    if (process.env.NODE_ENV === 'development') {
        console.log(`--- DEBUG: transformProduct for [${product.slug || product.Name}] ---`);
        console.log(`Original Images:`, product.Images);
    }

    // Create temporary images array to track uniqueness after formatting
    let processedImages = images
        .map(img => formatImagePath(img))
        .filter((img): img is string => img !== null);

    // Final filter for valid formats and deduplicate
    images = [...new Set(processedImages.filter(img => {
        return img.startsWith('http') ||
            img.startsWith('/') ||
            img.startsWith('data:');
    }))];

    if (images.length === 0) {
        images = [FALLBACK_IMAGE];
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(`Final Images array:`, images);
        console.log(`--- END DEBUG ---`);
    }

    return {
        ...product,
        Images: images,
        Price: Number(product.Price),
        Stock: Number(product.quantity || 0),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        discountValue: product.discountValue ? Number(product.discountValue) : null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        category: product.category ? {
            ...product.category,
            createdAt: product.category.createdAt.toISOString(),
            updatedAt: product.category.updatedAt.toISOString(),
        } : null,
        subCategory: product.subCategory ? {
            ...product.subCategory,
            createdAt: product.subCategory.createdAt.toISOString(),
            updatedAt: product.subCategory.updatedAt.toISOString(),
        } : null,
        type: product.type ? {
            ...product.type,
            createdAt: product.type.createdAt.toISOString(),
            updatedAt: product.type.updatedAt.toISOString(),
        } : null
    };
}

export async function getTrendingProducts(limit?: number) {
    try {
        const products = await prisma.product.findMany({
            where: { IsTrending: true },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true
            }
        });

        return products.map(transformProduct);
    } catch (error) {
        console.error("Failed to fetch trending products:", error);
        return [];
    }
}

export async function getBestSellers(limit?: number) {
    try {
        const products = await prisma.product.findMany({
            where: { BestSeller: true },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true
            }
        });

        console.log('getBestSellers found:', products.length);

        return products.map(transformProduct);
    } catch (error) {
        console.error("Failed to fetch best seller products:", error);
        return [];
    }
}

export async function getAllProducts(page: number = 1, limit: number = 50) {
    try {
        const skip = (page - 1) * limit;

        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                include: {
                    category: true
                },
                orderBy: { createdAt: 'desc' },
                skip: skip,
                take: limit
            }),
            prisma.product.count()
        ]);

        return {
            products: products.map(transformProduct),
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        };
    } catch (error) {
        console.error("Failed to fetch all products:", error);
        return {
            products: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page
        };
    }
}

export async function getProductsByCategory(categorySlug: string, page: number = 1, limit: number = 50, subCategorySlug?: string, typeSlug?: string) {
    try {
        const skip = (page - 1) * limit;

        const category = await prisma.category.findFirst({
            where: {
                OR: [
                    { slug: categorySlug },
                    { name: { equals: categorySlug, mode: 'insensitive' } },
                    { name: { equals: categorySlug.replace(/-/g, ' '), mode: 'insensitive' } },
                    { id: categorySlug }
                ]
            }
        });

        if (!category) {
            return {
                products: [],
                subCategories: [],
                types: [],
                totalCount: 0,
                totalPages: 0,
                currentPage: page,
                categoryName: '',
                categoryNameAr: ''
            };
        }

        // Fetch brands (subcategories) safely
        let rawBrands: any[] = [];
        try {
            rawBrands = await prisma.subCategory.findMany({
                where: { categoryId: category.id },
                include: {
                    _count: {
                        select: { products: true, types: true }
                    }
                }
            });
        } catch (e) {
            console.error("Error fetching brands:", e);
        }

        const brands = rawBrands.map(brand => ({
            ...brand,
            image: formatImagePath(brand.image) || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800'
        }));

        let whereClause: any = { Category: category.id };
        let currentSubCategory = null;
        let currentType = null;
        let types: any[] = [];

        // If subCategorySlug (Brand) is provided
        if (subCategorySlug) {
            currentSubCategory = brands.find(b => b.slug === subCategorySlug || b.id === subCategorySlug);

            if (currentSubCategory) {
                whereClause.subCategoryId = currentSubCategory.id;

                // Fetch types for this brand
                try {
                    types = await prisma.type.findMany({
                        where: { subCategoryId: currentSubCategory.id },
                        include: {
                            _count: {
                                select: { products: true }
                            }
                        }
                    });
                } catch (e) {
                    console.error("Error fetching types:", e);
                }

                // If typeSlug is provided, filter by it
                if (typeSlug) {
                    currentType = types.find(t => t.slug === typeSlug || t.id === typeSlug);
                    if (currentType) {
                        whereClause.typeId = currentType.id;
                    }
                } else if (types.length > 0) {
                    // If we have types and no type is selected, return types and NO products
                    return {
                        products: [],
                        subCategories: brands,
                        types,
                        currentSubCategory,
                        totalCount: 0,
                        totalPages: 0,
                        currentPage: page,
                        categoryName: category.name,
                        categoryNameAr: category.nameAr
                    };
                }
            }
        } else if (brands.length > 0) {
            // If no brand is selected, return brands and NO products
            return {
                products: [],
                subCategories: brands,
                types: [],
                totalCount: 0,
                totalPages: 0,
                currentPage: page,
                categoryName: category.name,
                categoryNameAr: category.nameAr
            };
        }

        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where: whereClause,
                include: {
                    category: true,
                    subCategory: true,
                    type: true
                },
                orderBy: { createdAt: 'desc' },
                skip: skip,
                take: limit
            }),
            prisma.product.count({
                where: whereClause
            })
        ]);

        return {
            products: products.map(transformProduct),
            subCategories: brands,
            types,
            currentSubCategory,
            currentType,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            categoryName: category.name,
            categoryNameAr: category.nameAr
        };
    } catch (error) {
        console.error("Failed to fetch products by category:", error);
        return {
            products: [],
            subCategories: [],
            types: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page,
            categoryName: '',
            categoryNameAr: ''
        };
    }
}

export async function getRelatedProducts(categoryId: string, currentProductId: string, limit: number = 10) {
    try {
        const products = await prisma.product.findMany({
            where: {
                Category: categoryId,
                NOT: { id: currentProductId }
            },
            take: limit,
            include: {
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return products.map(transformProduct);
    } catch (error) {
        console.error("Failed to fetch related products:", error);
        return [];
    }
}

export async function getReviews(limit?: number) {
    try {
        // @ts-ignore - Handle case where prisma client hasn't been regenerated yet
        if (!prisma.review) {
            console.error("Prisma client not regenerated. 'review' model missing.");
            return [];
        }
        // @ts-ignore
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return reviews.map((review: any) => ({
            ...review,
            createdAt: review.createdAt instanceof Date ? review.createdAt.toISOString() : review.createdAt,
            updatedAt: review.updatedAt instanceof Date ? review.updatedAt.toISOString() : review.updatedAt,
        }));
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return [];
    }
}

export async function getProducts(options?: { categoryId?: string, search?: string, limit?: number }) {
    try {
        const where: any = {};
        if (options?.categoryId) {
            where.Category = options.categoryId;
        }
        if (options?.search) {
            where.OR = [
                { Name: { contains: options.search, mode: 'insensitive' } },
                { description: { contains: options.search, mode: 'insensitive' } },
                { SKU: { contains: options.search, mode: 'insensitive' } }
            ];
        }
        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take: options?.limit
        });

        return products.map(transformProduct);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export async function searchCollections(query: string) {
    try {
        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { nameAr: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 5
        });

        return categories.map(cat => ({
            ...cat,
            slug: cat.slug || cat.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            createdAt: cat.createdAt.toISOString(),
            updatedAt: cat.updatedAt.toISOString(),
            nameAr: cat.nameAr
        }));
    } catch (error) {
        console.error("Failed to search collections:", error);
        return [];
    }
}

export async function getProductBySlug(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: { category: true }
        });

        if (!product) return null;

        return transformProduct(product);
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return null;
    }
}

export async function createOrder(data: {
    name: string;
    email: string;
    phone: string;
    nationalId?: string;
    streetAddress: string;
    city: string;
    postalCode?: string;
    totalAmount: number;
    discount?: number;
    promoCodeId?: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
}) {
    try {
        const order = await prisma.order.create({
            data: {
                Name: data.name,
                email: data.email,
                phone: data.phone,
                nationalId: data.nationalId,
                streetAddress: data.streetAddress,
                city: data.city,
                postalCode: data.postalCode,
                totalAmount: data.totalAmount,
                discount: data.discount || 0,
                promoCodeId: data.promoCodeId,
                items: {
                    create: data.items.map(item => ({
                        product: {
                            connect: { id: item.productId }
                        },
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return { success: true, orderId: order.id };
    } catch (error: any) {
        console.error("Order creation details:", {
            error,
            errorMessage: error?.message || String(error),
            inputData: data
        });
        return {
            success: false,
            error: error?.message || "Internal server error during order creation"
        };
    }
}

export async function validatePromoCode(code: string) {
    try {
        const promo = await prisma.promoCode.findUnique({
            where: {
                code: code,
                isActive: true
            }
        });

        if (!promo) {
            return { success: false, error: "Invalid or inactive promo code" };
        }

        return {
            success: true,
            promoId: promo.id,
            discountPercentage: promo.discountPercentage
        };
    } catch (error) {
        console.error("Failed to validate promo code:", error);
        return { success: false, error: "Error validating promo code" };
    }
}

export async function getCategoryById(id: string) {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: { products: true }
        });

        if (!category) return null;

        return {
            ...category,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
            nameAr: category.nameAr,
            products: category.products.map(transformProduct)
        };
    } catch (error) {
        console.error("Failed to fetch category:", error);
        return null;
    }
}
