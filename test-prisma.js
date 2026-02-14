const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const fields = Object.keys(prisma.product.fields || {});
        console.log('Fields:', fields);
        
        const products = await prisma.product.findMany({
            where: { BestSeller: true },
            take: 5
        });
        console.log('Products found with BestSeller:', products.length);
        
        try {
            const productsCamel = await prisma.product.findMany({
                where: { bestSeller: true },
                take: 5
            });
            console.log('Products found with bestSeller:', productsCamel.length);
        } catch (e) {
            console.log('bestSeller (camelCase) failed');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
