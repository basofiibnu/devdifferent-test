import Map from '@/components/Map';
import PropertyForm from '@/components/PropertyForm';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="p-4">Unauthorized. Please login First.</div>
    );
  }

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', session.user.id);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <Map properties={properties || []} />
      <PropertyForm property={properties} />
      <form action="/auth/signout" method="post">
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Logout
        </button>
      </form>
    </div>
  );
}
