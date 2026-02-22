const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing database connection...');
        const userCount = await prisma.user.count();
        console.log('Connection successful!');
        console.log('Total users in DB:', userCount);
        
        const products = await prisma.product.findMany({ take: 1 });
        console.log('Products found:', products.length);
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
