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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 py-6"
    >
      {['price', 'image_url', 'latitude', 'longitude'].map(
        (field) => (
          <div key={field} className="space-y-1">
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <Input
              id={field}
              type={
                field === 'price' ||
                field === 'latitude' ||
                field === 'longitude'
                  ? 'number'
                  : 'text'
              }
              name={field}
              placeholder={`Enter ${field}`}
              value={(form as any)[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        )
      )}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {property ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
