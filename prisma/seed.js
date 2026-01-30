const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test.user@example.com' },
    update: {},
    create: {
      email: 'test.user@example.com',
      name: 'Test User',
      emailVerified: new Date(),
    },
  });

  console.log('Test user created:', testUser);

  // Create products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
    {
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with health tracking',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    },
    {
      name: 'Laptop Stand',
      description: 'Ergonomic aluminum laptop stand',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with Cherry MX switches',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500',
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with multiple ports',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with precision tracking',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    },
    {
      name: 'Monitor',
      description: '27-inch 4K UHD monitor with HDR support',
      price: 449.99,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    },
    {
      name: 'Webcam',
      description: '1080p HD webcam with auto-focus',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1589739900243-c1e4f7f01921?w=500',
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness',
      price: 39.99,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    },
    {
      name: 'Phone Holder',
      description: 'Adjustable phone holder for desk',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    },
    {
      name: 'Cable Organizer',
      description: 'Cable management system for clean desk',
      price: 19.99,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    },
    {
      name: 'Portable SSD',
      description: '1TB portable SSD with fast transfer speeds',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: product,
    });
  }

  console.log(`Created ${products.length} products`);

  // Create cart for test user
  await prisma.cart.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
    },
  });

  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });