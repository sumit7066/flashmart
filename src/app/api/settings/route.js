import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const settings = await prisma.setting.findMany();
  // Transform list to key-value object
  const settingsObj = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  return NextResponse.json(settingsObj);
}

export async function POST(request) {
  const body = await request.json();
  const { key, value } = body;

  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  return NextResponse.json(setting);
}
