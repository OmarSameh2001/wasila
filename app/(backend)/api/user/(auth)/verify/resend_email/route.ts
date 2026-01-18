import { NextRequest } from 'next/server';
import { resendVerification } from '../../controller';

export async function POST(req: NextRequest) {
  return resendVerification(req);
}