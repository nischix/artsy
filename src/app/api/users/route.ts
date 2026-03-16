import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/schemas/userSchema';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    let users;
    if (query) {
      users = await prisma.user.findMany({
        where: {
          username: { contains: query, mode: 'insensitive' }
        },
        select: { id: true, username: true, avatarUrl: true, aesthetic: true }
      });
    } else {
      users = await prisma.user.findMany({
        take: 20,
        select: { id: true, username: true, avatarUrl: true, aesthetic: true }
      });
    }
    
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    
    // TODO: In real app, hash the password here with bcrypt
    // const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: validatedData.password, // Replace with hashedPassword
        aesthetic: 'noir' // default aesthetic
      },
      select: {
        id: true,
        username: true,
        email: true,
        aesthetic: true
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
  }
}