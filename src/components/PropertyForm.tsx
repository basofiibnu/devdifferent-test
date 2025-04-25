'use client';

import { supabase } from '@/lib/supabase-client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/global/Input';
import Button from '@/components/global/Button';
import { useState } from 'react';
import { TProperty } from '../../types/property';

const propertySchema = z.object({
  price: z.number().min(1, 'Price must be greater than 0'),
  image_url: z.string().url('Must be a valid URL').optional(),
  latitude: z
    .number()
    .min(-90)
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180)
    .max(180, 'Longitude must be between -180 and 180'),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function PropertyForm({
  property,
  onClose,
}: {
  property: TProperty | null;
  onClose: () => void;
}) {
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      price: Number(property?.price ?? ''),
      image_url: property?.image_url ?? '',
      latitude: Number(property?.latitude ?? ''),
      longitude: Number(property?.longitude ?? ''),
    },
  });

  const handleFileUpload = async (file: File) => {
    setUploading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      if (session) {
        formData.append('id', session?.user.id);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setValue('image_url', data.url);
      alert('Image uploaded successfully!');
    } catch (error: unknown) {
      console.error(
        'Error uploading file:',
        (error as Error).message
      );
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: PropertyFormValues) => {
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
      ...data,
      user_id: user.id,
    };

    let error;
    if (property) {
      const { error: updateError } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', property.id);
      error = updateError;
    } else {
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
      onClose();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white dark:bg-gray-800 py-6 rounded-lg shadow-lg"
    >
      {['price', 'latitude', 'longitude'].map((field) => (
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
                ? 'tel'
                : 'text'
            }
            {...register(field as keyof PropertyFormValues, {
              valueAsNumber: true,
            })}
            placeholder={`Enter ${field}`}
            className={`w-full px-4 py-2 border ${
              errors[field as keyof PropertyFormValues]
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg focus:outline-none focus:ring-2 ${
              errors[field as keyof PropertyFormValues]
                ? 'focus:ring-red-500'
                : 'focus:ring-blue-500 dark:focus:ring-blue-400'
            }`}
          />
          {errors[field as keyof PropertyFormValues] && (
            <p className="text-sm text-red-500">
              {errors[field as keyof PropertyFormValues]?.message}
            </p>
          )}
        </div>
      ))}

      {/* Image Upload Section */}
      <div className="space-y-1">
        <div className="flex items-center justify-between w-full mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setUseFileUpload(!useFileUpload)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              {useFileUpload ? 'Use Image URL' : 'Upload File'}
            </button>
          </div>
        </div>
        {useFileUpload ? (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        ) : (
          <Input
            type="text"
            {...register('image_url')}
            placeholder="Enter image URL"
            className={`w-full px-4 py-2 border ${
              errors.image_url
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg focus:outline-none focus:ring-2 ${
              errors.image_url
                ? 'focus:ring-red-500'
                : 'focus:ring-blue-500 dark:focus:ring-blue-400'
            }`}
          />
        )}
        {errors.image_url && (
          <p className="text-sm text-red-500">
            {errors.image_url.message}
          </p>
        )}
      </div>

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
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {uploading
            ? 'Uploading...'
            : property
            ? 'Update'
            : 'Create'}
        </Button>
      </div>
    </form>
  );
}
