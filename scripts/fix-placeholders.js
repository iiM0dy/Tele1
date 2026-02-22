const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const oldId = '1596462502278-27bfdc403348';
    const newId = '1523275335684-37898b6baf30';

    console.log('Updating Categories...');
    const categories = await prisma.category.findMany({
        where: {
            image: { contains: oldId }
        }
    });

    for (const cat of categories) {
        if (!cat.image) continue;
        const newUrl = cat.image.replace(oldId, newId);
        await prisma.category.update({
            where: { id: cat.id },
            data: { image: newUrl }
        });
        console.log(`Updated Category: ${cat.name}`);
    }

    console.log('Updating SubCategories...');
    const subCategories = await prisma.subCategory.findMany({
        where: {
            image: { contains: oldId }
        }
    });

    for (const sub of subCategories) {
        if (!sub.image) continue;
        const newUrl = sub.image.replace(oldId, newId);
        await prisma.subCategory.update({
            where: { id: sub.id },
            data: { image: newUrl }
        });
        console.log(`Updated SubCategory: ${sub.name}`);
    }

    console.log('Updating Products...');
    const products = await prisma.product.findMany({
        where: {
            Images: { contains: oldId }
        }
    });

    for (const prod of products) {
        if (!prod.Images) continue;
        const newImages = prod.Images.split(',').map(img => img.includes(oldId) ? img.replace(oldId, newId) : img).join(',');
        await prisma.product.update({
            where: { id: prod.id },
            data: { Images: newImages }
        });
        console.log(`Updated Product: ${prod.Name}`);
    }

    // Also update null images to the placeholder
    console.log('Setting defaults for null images...');
    await prisma.category.updateMany({
        where: { OR: [{ image: null }, { image: '' }] },
        data: { image: `https://images.unsplash.com/photo-${newId}?w=1200` }
    });

    await prisma.subCategory.updateMany({
        where: { OR: [{ image: null }, { image: '' }] },
        data: { image: `https://images.unsplash.com/photo-${newId}?w=800` }
    });

    console.log('Done!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
