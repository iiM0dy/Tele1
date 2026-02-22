const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Checking if user "${username}" exists...`);
  
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (user) {
    console.log(`User "${username}" found. Updating password...`);
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        role: 'ADMIN',
        canManageProducts: true,
        canDeleteProducts: true,
        canManageCategories: true,
        canDeleteCategories: true,
        canManageBanners: true,
        canDeleteBanners: true,
        canManageOrders: true,
        canDeleteOrders: true,
        canManagePromoCodes: true,
        canDeletePromoCodes: true,
      }
    });
    console.log('Password updated successfully.');
  } else {
    console.log(`User "${username}" not found. Creating new user...`);
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'ADMIN',
        canManageProducts: true,
        canDeleteProducts: true,
        canManageCategories: true,
        canDeleteCategories: true,
        canManageBanners: true,
        canDeleteBanners: true,
        canManageOrders: true,
        canDeleteOrders: true,
        canManagePromoCodes: true,
        canDeletePromoCodes: true,
      }
    });
    console.log('User created successfully.');
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
