
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const slug = 'satin-tunic-timeless-1-fq4';
    console.log(`\n--- DATABASE CHECK FOR SLUG: ${slug} ---`);

    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            select: {
                id: true,
                Name: true,
                slug: true,
                Images: true
            }
        });

        if (!product) {
            console.log(`Product with slug "${slug}" not found.`);
            return;
        }

        console.log('Database Record:');
        console.log(JSON.stringify(product, null, 2));

    } catch (error) {
        console.error('Error fetching product:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
