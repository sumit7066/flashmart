import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming src/lib/prisma.js exists

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let products;
    if (category && category !== 'all') {
      products = await prisma.product.findMany({
        where: { category }
      });
    } else {
      products = await prisma.product.findMany();
    }
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to to get products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        stock: parseInt(body.stock || 0, 10),
        category: body.category,
        image: body.image,
        description: body.description || null,
        details: body.details || null
      }
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: parseFloat(data.price),
        stock: parseInt(data.stock || 0, 10),
        category: data.category,
        image: data.image,
        description: data.description || null,
        details: data.details || null
      }
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    await prisma.product.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
