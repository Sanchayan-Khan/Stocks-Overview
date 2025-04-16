import { NextResponse } from 'next/server';
import connectDB from '@/middleware/mongodb';
import User from '@/models/user';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { fullName, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
    });

    // Create JWT token
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const response = NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}