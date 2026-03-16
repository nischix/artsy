import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateItemSchema } from '@/schemas/itemSchema';

export async function GET(req: Request, { params }: { params: { itemId: string } }) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: params.itemId },
      include: {
        seller: {
          select: { username: true, avatarUrl: true, aesthetic: true }
        }
      }
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { itemId: string } }) {
  try {
    const body = await req.json();
    const validatedData = updateItemSchema.parse(body);

    const item = await prisma.item.update({
      where: { id: params.itemId },
      data: validatedData,
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { itemId: string } }) {
  try {
    await prisma.item.delete({
      where: { id: params.itemId },
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}