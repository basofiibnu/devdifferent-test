'use client';

import { supabase } from '@/lib/supabase-client';
import { useState } from 'react';
import Input from '@/components/global/Input';
import Button from '@/components/global/Button';

export default function PropertyForm({
  property,
  onClose,
}: {
  property: any;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    price: property?.price ?? '',
    image_url: property?.image_url ?? '',
    latitude: property?.latitude ?? '',
    longitude: property?.longitude ?? '',
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
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching user:', userError.message);
      return;
    }

    if (!user) {
      console.error('No user found!');
      return;
    }

    const payload = {
      price: Number(form.price),
      image_url: form.image_url,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      user_id: user.id,
    };

    let error;
    if (property) {
      // Update existing property
      const { error: updateError } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', property.id);
      error = updateError;
    } else {
      // Insert new property
      const { error: insertError } = await supabase
        .from('properties')
        .insert([payload]);
      error = insertError;
    }

    if (error) {
      console.error('Error saving property:', error.message);
    } else {
      alert(
        property
          ? 'Property updated successfully'
          : 'Property added successfully!'
      );
      onClose(); // Close the modal
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {['price', 'image_url', 'latitude', 'longitude'].map(
        (field) => (
          <Input
            key={field}
            type={
              field === 'price' ||
              field === 'latitude' ||
              field === 'longitude'
                ? 'number'
                : 'text'
            }
            name={field}
            placeholder={
              field.charAt(0).toUpperCase() + field.slice(1)
            }
            value={(form as any)[field]}
            onChange={handleChange}
          />
        )
      )}
      <Button
        type="submit"
        className="bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500"
      >
        {property ? 'Update' : 'Create'} Property
      </Button>
    </form>
  );
}
