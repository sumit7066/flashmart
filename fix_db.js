const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.updateMany({
    where: { name: { contains: 't-shirt' } },
    data: { image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80', description: 'Experience the perfect blend of style and comfort with our premium T-Shirt.' }
  });

  await prisma.product.updateMany({
    where: { name: { contains: 'hotwheels' } },
    data: { name: 'Hot Wheels Die-Cast Car', image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80' }
  });

  await prisma.product.updateMany({
    where: { name: { contains: 'Tester' } },
    data: { name: 'Smart Tester Kit', image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=600&q=80', description: 'Professional grade testing equipment.' }
  });

  // Create additional products so the site isn't so empty
  await prisma.product.create({
    data: {
      name: 'Wireless Noise-Canceling Headphones',
      price: 199.99,
      stock: 30,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      description: 'Immerse yourself in pure sound with our active noise-canceling headphones.',
    }
  });
  
  await prisma.product.create({
    data: {
      name: 'Minimalist Wristwatch',
      price: 149.50,
      stock: 15,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      description: 'Elegant and simple, this minimalist watch goes with almost any outfit.',
    }
  });

  await prisma.product.create({
    data: {
      name: 'Organic Cotton Tote Bag',
      price: 15.00,
      stock: 100,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640df1?auto=format&fit=crop&w=600&q=80',
      description: 'A spacious tote bag made from 100% organic cotton, perfect for grocery shopping.',
    }
  });

  console.log("Updated products in DB.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
