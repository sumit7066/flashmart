import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;
    if (!token) return NextResponse.json([], { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload?.id) return NextResponse.json([], { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
    
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
