
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'laptops';
  console.log(`--- Debugging Category: ${slug} ---`);

  // 1. Find Category by Slug
  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { slug: slug },
        { name: { equals: slug, mode: 'insensitive' } },
        { id: slug }
      ]
    }
  });

  if (!category) {
    console.log('Category NOT FOUND for slug:', slug);
    const allCategories = await prisma.category.findMany({ select: { id: true, name: true, slug: true } });
    console.log('All available categories:', JSON.stringify(allCategories, null, 2));
    return;
  }

  console.log('Category Found:', JSON.stringify(category, null, 2));

  // 2. Count Products with this Category ID
  const productsCount = await prisma.product.count({
    where: { Category: category.id }
  });
  console.log(`Total products linked to Category ID [${category.id}]:`, productsCount);

  // 3. Fetch first few products to inspect their data
  const sampleProducts = await prisma.product.findMany({
    where: { Category: category.id },
    take: 5
  });
  
  if (sampleProducts.length > 0) {
    console.log('Sample Product Data (First Product):', JSON.stringify({
        id: sampleProducts[0].id,
        Name: sampleProducts[0].Name,
        Category: sampleProducts[0].Category,
        Status: sampleProducts[0].Status,
        Stock: sampleProducts[0].Stock
    }, null, 2));
  } else {
    console.log('NO PRODUCTS FOUND in database for this category ID.');
    
    // Debug: Check if there are ANY products at all
    const totalProducts = await prisma.product.count();
    console.log('Total products in database:', totalProducts);
    
    if (totalProducts > 0) {
        const firstProduct = await prisma.product.findFirst();
        console.log('Sample of ANY product in DB:', JSON.stringify({
            id: firstProduct?.id,
            Name: firstProduct?.Name,
            Category: firstProduct?.Category
        }, null, 2));
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
