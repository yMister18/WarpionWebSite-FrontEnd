import { NextRequest, NextResponse } from 'next/server';
import { requeueCommand } from '@/lib/warpion-api';
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
    const shopCommandId = body?.shopCommandId;

    if (!shopCommandId || typeof shopCommandId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing shopCommandId' },
        { status: 400 }
      );
    }

    const response = await requeueCommand(shopCommandId);

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error while requeueing command';

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}