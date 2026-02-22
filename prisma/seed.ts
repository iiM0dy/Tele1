import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. Create 5 Categories matching Julivno's luxury vibe
  const categoriesData = [
    { name: 'Timeless Collection', description: 'Classic elegance that never goes out of style.', isFeatured: true, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800' },
    { name: 'Evening Radiance', description: 'Sophisticated pieces for your most memorable nights.', isFeatured: true, image: 'https://images.unsplash.com/photo-1539109132314-34a936699561?q=80&w=800' },
    { name: 'Artisanal Essentials', description: 'Handcrafted staples for the modern connoisseur.', isFeatured: true, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800' },
    { name: 'Seasonal Bloom', description: 'Lightweight fabrics and vibrant patterns for the changing seasons.', isFeatured: false, image: 'https://images.unsplash.com/photo-1485230895905-ec17bd36b5ec?q=80&w=800' },
    { name: 'Signature Accessories', description: 'The finishing touches to define your silhouette.', isFeatured: false, image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    // Check if category exists first to avoid pgbouncer/upsert issues
    let category = await prisma.category.findUnique({
      where: { name: cat.name }
    });

    if (!category) {
      category = await prisma.category.create({
        data: cat,
      });
    }
    categories.push(category);
  }

  console.log(`Created ${categories.length} categories.`);

  // 2. Create 25 Products (5 per category)
  const productAdjectives = ['Luxury', 'Elegant', 'Silk', 'Velvet', 'Gold-Trimmed', 'Satin', 'Hand-Stitched', 'Premium', 'Royal', 'Chic'];
  const productTypes = ['Gown', 'Blazer', 'Trousers', 'Scarf', 'Clutch', 'Heels', 'Necklace', 'Bracelet', 'Wrap', 'Tunic'];

  let productCount = 0;
  for (const category of categories) {
    for (let i = 1; i <= 5; i++) {
      const adj = productAdjectives[Math.floor(Math.random() * productAdjectives.length)];
      const type = productTypes[Math.floor(Math.random() * productTypes.length)];
      const name = `${adj} ${type} ${category.name.split(' ')[0]} ${i}`;
      const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + `-${Math.random().toString(36).substring(2, 5)}`;
      const price = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
      const sku = `JL-${category.id.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await prisma.product.create({
        data: {
          Name: name,
          SKU: sku,
          Category: category.id,
          Price: price,
          quantity: Math.floor(Math.random() * 50) + 5,
          Status: 'ACTIVE',
          IsTrending: Math.random() > 0.7,
          Images: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000000)}?q=80&w=800`,
          slug,
          description: `An exquisite piece from our ${category.name}. This ${name} embodies the Julivno spirit of craftsmanship and luxury.`,
          discountPrice: Math.random() > 0.8 ? price * 0.8 : null,
        },
      });
      productCount++;
    }
  }

  console.log(`Successfully seeded ${productCount} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
