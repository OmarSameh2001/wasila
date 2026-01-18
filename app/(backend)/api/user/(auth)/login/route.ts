import { NextRequest } from 'next/server';
import { loginUser } from '../controller';

export async function POST(req: NextRequest) {
  return loginUser(req);
}