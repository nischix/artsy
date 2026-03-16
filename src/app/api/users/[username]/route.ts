import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { profileUpdateSchema } from '@/schemas/userSchema';

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        aesthetic: true,
        followersCount: true,
        followingCount: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { username: string } }) {
  try {
    const body = await req.json();
    const validatedData = profileUpdateSchema.parse(body);

    const user = await prisma.user.update({
      where: { username: params.username },
      data: validatedData,
      select: {
         id: true,
         username: true,
         bio: true,
         avatarUrl: true,
         aesthetic: true
      }
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
  }
}