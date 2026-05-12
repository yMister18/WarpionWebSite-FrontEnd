import { NextRequest, NextResponse } from 'next/server';
import { requeueOrder } from '@/lib/warpion-api';
import { hasAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authenticated = await hasAdminSession();

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const orderId = body?.orderId;

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing orderId' },
        { status: 400 }
      );
    }

    const response = await requeueOrder(orderId);

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error while requeueing order';

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}