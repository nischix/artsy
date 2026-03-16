import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createOrderSchema } from '@/schemas/orderSchema';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createOrderSchema.parse(body);

    // Calculate total price based on item prices in DB
    let total = 0;
    for (const item of validatedData.items) {
      const dbItem = await prisma.item.findUnique({ where: { id: item.itemId } });
      if (!dbItem) throw new Error(`Item ${item.itemId} not found`);
      total += dbItem.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        userId: validatedData.userId,
        total,
        status: 'PENDING',
        items: {
          create: validatedData.items.map(item => ({
            itemId: item.itemId,
            price: 0, // Should map from DB
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
  }
}