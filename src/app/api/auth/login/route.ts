import { NextResponse } from 'next/server';
import connectDB from '@/middleware/mongodb';
import User from '@/models/user';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await new SignJWT({ 
      userId: user._id,
      fullName: user.fullName 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const response = NextResponse.json(
      { 
        message: 'Logged in successfully',
        user: {
          fullName: user.fullName,
          email: user.email
        }
      },
      { status: 200 }
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error logging in' },
      { status: 500 }
    );
  }
}