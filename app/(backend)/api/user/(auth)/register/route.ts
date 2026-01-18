import { NextRequest } from 'next/server';
import { registerUser } from '../controller';

export async function POST(req: NextRequest) {
  return registerUser(req);
}