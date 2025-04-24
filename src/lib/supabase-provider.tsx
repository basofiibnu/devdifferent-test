'use client';

import {
  SessionContextProvider,
  Session,
} from '@supabase/auth-helpers-react';
import { supabase } from './supabase-browser';

export function SupabaseProvider({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={session}
    >
      {children}
    </SessionContextProvider>
  );
}
