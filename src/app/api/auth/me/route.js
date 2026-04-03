import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_token')?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload = await verifyJWT(token);
    if (!payload?.id) return NextResponse.json({ user: null });

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true }
    });
    
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('customer_token');
  return NextResponse.json({ success: true });
}
