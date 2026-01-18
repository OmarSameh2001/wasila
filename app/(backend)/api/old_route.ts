import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Welcome to wasila' });
}
export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello, world!' });
}