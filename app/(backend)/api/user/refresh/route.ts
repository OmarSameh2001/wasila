import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '../controller';

export async function POST(req: NextRequest, res: NextResponse) {

  try {
    const token = await refreshAccessToken(req);
    return token;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
