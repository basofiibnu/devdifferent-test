'use client';

import { supabase } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PropertyForm({
  property,
}: {
  property: any;
}) {
  console.log(property, 'propery');
  const router = useRouter();
  const [form, setForm] = useState({
    price: property?.price,
    image_url: property?.image_url,
    latitude: property?.latitude,
    longitude: property?.longitude,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No user found!');
      return;
    }

    const payload = {
      ...form,
      user_id: user.id,
    };

    console.log(payload, 'payload');

    const { data, error } =
      property.length > 0
        ? await supabase
            .from('properties')
            .update(form)
            .eq('id', property.id)
        : await supabase.from('properties').insert([payload]);

    if (error) {
      console.log(error);
    } else {
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      {['price', 'image_url', 'latitude', 'longitude'].map(
        (field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={(form as any)[field]}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        )
      )}
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {property ? 'Update' : 'Create'} Property
      </button>
    </form>
  );
}
