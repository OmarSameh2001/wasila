import { NextRequest } from 'next/server';
import { forgotPassword } from '../controller';

export async function POST(req: NextRequest) {
  return forgotPassword(req);
}