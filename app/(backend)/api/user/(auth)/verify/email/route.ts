import { NextRequest } from 'next/server';
import { verifyEmail } from '../../controller';

export async function POST(req: NextRequest) {
  return verifyEmail(req);
}