'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  const supabase = createServerActionClient({ cookies });
  await supabase.from('properties').delete().eq('id', id);

  return new Response(null, { status: 204 });
}
