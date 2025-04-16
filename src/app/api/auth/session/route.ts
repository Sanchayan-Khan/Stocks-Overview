import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return NextResponse.json({
      user: {
        fullName: verified.payload.fullName,
        userId: verified.payload.userId
      }
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}