import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET() {
  try {
    // Test if admin SDK is initialized properly
    const listUsersResult = await adminAuth.listUsers(1);
    return NextResponse.json({
      status: 'ok',
      message: 'Firebase Admin SDK is working',
      userCount: listUsersResult.users.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'error',
        message: 'Firebase Admin SDK error',
        error: message,
      },
      { status: 500 }
    );
  }
}