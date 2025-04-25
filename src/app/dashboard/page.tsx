import Header from '@/components/Header';
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

  console.log(properties, 'properties');

  return (
    <div className="p-4">
      <Header />
      <Map properties={properties || []} />
      <PropertyForm property={properties} />
    </div>
  );
}
