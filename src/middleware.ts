import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase-middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// ✅ Match only protected routes
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
