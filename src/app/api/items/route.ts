import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createItemSchema } from '@/schemas/itemSchema';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    // const cursor = searchParams.get('cursor'); // Optional cursor pagination
    
    const items = await prisma.item.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: { username: true, avatarUrl: true, aesthetic: true }
        }
      }
    });
    
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createItemSchema.parse(body);
    
    // Hardcode sellerId for Phase 2, this would come from Auth session
    const sellerId = body.sellerId || "default-uuid"; 

    const item = await prisma.item.create({
      data: {
        ...validatedData,
        sellerId
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 400 });
  }
}