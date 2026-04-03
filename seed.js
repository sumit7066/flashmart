const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({}); // Delete existing to avoid duplicates if run multiple times
  
  console.log("Seeding Database...");

  const products = [
    {
      name: 'Smart Tester Kit',
      price: 40.00,
      stock: 50,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=600&q=80',
      description: 'Professional grade testing equipment.',
    },
    {
      name: 'Premium Black T-Shirt',
      price: 25.00,
      stock: 100,
      category: 'clothes',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
      description: 'Experience the perfect blend of style and comfort with our premium T-Shirt.'
    },
    {
      name: 'Hot Wheels Die-Cast Car',
      price: 15.00,
      stock: 30,
      category: 'toys',
      image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80',
      description: 'A classic die-cast hot wheels car. Collect them all!'
    },
    {
      name: 'Wireless Noise-Canceling Headphones',
      price: 199.99,
      stock: 30,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      description: 'Immerse yourself in pure sound with our active noise-canceling headphones.',
    },
    {
      name: 'Minimalist Wristwatch',
      price: 149.50,
      stock: 15,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      description: 'Elegant and simple, this minimalist watch goes with almost any outfit.',
    },
    {
      name: 'Organic Cotton Tote Bag',
      price: 15.00,
      stock: 100,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1597484661643-2f5fef640df1?auto=format&fit=crop&w=600&q=80',
      description: 'A spacious tote bag made from 100% organic cotton, perfect for grocery shopping.',
    },
    {
      name: 'Hydrating Face Serum',
      price: 35.00,
      stock: 45,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      description: 'A deeply hydrating serum enriched with hyaluronic acid for a plump and glowing complexion.',
    },
    {
      name: 'Velvet Matte Lipstick - Classic Red',
      price: 18.50,
      stock: 60,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      description: 'Long-lasting, intense color with a soft velvet matte finish that perfectly hydrates your lips.',
    },
    {
      name: 'Luminous Glow Foundation',
      price: 42.00,
      stock: 30,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80',
      description: 'A lightweight foundation that offers buildable coverage for a flawless, natural-looking glow.',
    },
    {
      name: 'Volumizing & Lengthening Mascara',
      price: 22.00,
      stock: 85,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
      description: 'Get dramatic, sweeping lashes with our clump-free, smudge-proof volumizing mascara.',
    },
    {
      name: 'Rosewater Facial Toner',
      price: 16.00,
      stock: 50,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80',
      description: 'Refresh and balance your skin with this soothing, alcohol-free pure rosewater toner.',
    },
    {
      name: 'Daily SPF 50 Mineral Sunscreen',
      price: 28.00,
      stock: 120,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80',
      description: 'Broad-spectrum protection in a non-greasy, sheer formula for everyday use.',
    },
    {
      name: 'Overnight Repair Cream',
      price: 55.00,
      stock: 25,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80',
      description: 'Restore and rejuvenate your skin while you sleep with our rich, antioxidant-packed night cream.',
    },
    {
      name: 'Gentle Foaming Cleanser',
      price: 19.99,
      stock: 75,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80',
      description: 'A mild cleanser that effectively removes dirt and makeup without stripping the skin of moisture.',
    },
    {
      name: 'Eyeshadow Palette - Earth Tones',
      price: 38.00,
      stock: 40,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1512496015851-a1c814138e1b?auto=format&fit=crop&w=600&q=80',
      description: '12 highly pigmented, blendable earthy shades perfect for both day and night looks.',
    },
    {
      name: 'Shimmering Body Oil',
      price: 32.50,
      stock: 35,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1615397323758-1f19b990f11a?auto=format&fit=crop&w=600&q=80',
      description: 'Achieve a sun-kissed, radiant sheen with our fast-absorbing, nourishing body oil.'
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log("Database seeded successfully with premium items!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
