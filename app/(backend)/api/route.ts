import { NextRequest, NextResponse } from 'next/server';
import sendEmail from '../_lib/mailer';

export async function POST(req: NextRequest) {
    // sendEmail('moro200190@gmail.com', 'post', 'post');
  return NextResponse.json({ message: 'Hello, world!' });
}
export async function GET(req: NextRequest) {
    // sendEmail('moro200190@gmail.com', 'get', 'get');
  return NextResponse.json({ message: 'Hello, world!' });
}