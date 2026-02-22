const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Database Dump ---');
        
        const categories = await prisma.category.findMany();
        console.log(`Categories (${categories.length}):`);
        console.table(categories.map(c => ({ id: c.id, name: c.name, isFeatured: c.isFeatured })));

        const products = await prisma.product.findMany({
            include: {
                category: true
            }
        });
        console.log(`Products (${products.length}):`);
        console.table(products.map(p => ({ 
            id: p.id, 
            Name: p.Name, 
            IsTrending: p.IsTrending, 
            BestSeller: p.BestSeller,
            Category: p.Category,
            categoryName: p.category?.name
        })));

        const orders = await prisma.order.count();
        console.log(`Total Orders: ${orders}`);

        const users = await prisma.user.findMany({
            select: { id: true, username: true, role: true }
        });
        console.log(`Users (${users.length}):`);
        console.table(users);

    } catch (error) {
        console.error('Error dumping database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
