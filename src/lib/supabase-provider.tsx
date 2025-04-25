'use client';

import {
  SessionContextProvider,
  Session,
} from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function SupabaseProvider({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  const [supabase] = useState(() => createClientComponentClient());
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={session}
    >
      {children}
    </SessionContextProvider>
  );
}
