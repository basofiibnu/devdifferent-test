'use client';

import {
  GoogleMap,
  Marker,
  useLoadScript,
  OverlayView,
} from '@react-google-maps/api';
import { useState, useMemo } from 'react';
import Modal from './global/Modal';
import PropertyForm from './PropertyForm';
import { supabase } from '@/lib/supabase-client';
import PropertyOverlay from './PropertyOverlay';
import ConfirmationModal from './PropertyConfirmation';
import { useProperties } from '@/context/PropertiesCtx';
import { TProperty } from '../../types/property';

const containerStyle = { width: '100%', height: '100%' };

export default function MapComponent() {
  const { properties, refreshProperties } = useProperties();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] =
    useState<TProperty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const mapCenter = useMemo(() => ({ lat: -6.2, lng: 106.8 }), []);

  if (!isLoaded) return <div>Loading map....</div>;

  const handleOverlayClick = (property: TProperty) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = async (propertyId: string) => {
    setDeleting(true);
    try {
      const { data: property, error: fetchError } = await supabase
        .from('properties')
        .select('user_id, image_url')
        .eq('id', propertyId)
        .single();

      if (fetchError) {
        console.error('Error fetching property:', fetchError);
        alert('Failed to fetch property details.');
        setDeleting(false);
        return;
      }

      if (property?.image_url) {
        const folderName = property.image_url.indexOf(
          property.user_id
        );
        const imagePath = property.image_url.substring(folderName);
        console.log(imagePath);
        const { error: storageError } = await supabase.storage
          .from('property-images')
          .remove([imagePath]);

        if (storageError) {
          console.error('Error deleting image:', storageError);
          alert('Failed to delete property image.');
          setDeleting(false);
          return;
        }
      }

      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (deleteError) {
        console.error('Error deleting property:', deleteError);
        alert('Failed to delete property.');
        setDeleting(false);
        return;
      }

      alert('Property and associated image deleted successfully!');
      refreshProperties();
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative h-screen">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={11}
      >
        {properties &&
          properties?.length > 0 &&
          properties?.map((property, index) => (
            <Marker
              key={property?.id}
              position={{
                lat: Number(property?.latitude || 0),
                lng: Number(property?.longitude || 0),
              }}
              onMouseOver={() => setHovered(index)}
              label={{
                text: `IDR ${
                  property?.price.toLocaleString('ID') || ''
                }`,
                className:
                  'bg-white px-2 py-1 rounded shadow text-lg',
              }}
            />
          ))}

        {properties && hovered !== null && (
          <OverlayView
            position={{
              lat: Number(properties[hovered]?.latitude || 0),
              lng: Number(properties[hovered]?.longitude || 0),
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <PropertyOverlay
              property={properties[hovered]}
              onClose={() => setHovered(null)}
              onUpdate={() => handleOverlayClick(properties[hovered])}
              onDelete={() => {
                setSelectedProperty(properties[hovered]);
                setIsConfirmOpen(true);
              }}
            />
          </OverlayView>
        )}
      </GoogleMap>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Update Property
        </h2>
        <PropertyForm
          property={selectedProperty}
          onClose={() => {
            refreshProperties();
            setIsModalOpen(false);
            setIsConfirmOpen(false);
          }}
        />
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (selectedProperty) {
            handleDelete(selectedProperty.id);
          }
        }}
        message={
          deleting
            ? 'Deleting property, please wait...'
            : 'Are you sure you want to delete this property?'
        }
        disableActions={deleting} // Disable buttons while deleting
      />
    </div>
  );
}
