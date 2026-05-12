import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession, isValidAdminPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing password' },
        { status: 400 }
      );
    }

    if (!isValidAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await createAdminSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown login error';

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}