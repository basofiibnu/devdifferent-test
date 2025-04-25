import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseProvider } from '@/lib/supabase-provider';
import { PropertiesProvider } from '@/context/PropertiesCtx';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Devdifferent - Map Task',
  description:
    'A simple map portfolio to complete technical assignment',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased bg-[#ffffff] text-[#171717] dark:bg-[#0a0a0a] dark:text-[#ededed]`}
      >
        <SupabaseProvider session={session}>
          <PropertiesProvider>{children}</PropertiesProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
