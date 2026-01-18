import { NextRequest } from 'next/server';
import { resetPassword } from '../../controller';

export async function POST(req: NextRequest) {
  return resetPassword(req);
}