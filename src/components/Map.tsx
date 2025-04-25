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

const containerStyle = { width: '100%', height: '100%' }; // Full height and width

export default function Map() {
  const { properties, refreshProperties } = useProperties();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<
    any | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Memoize the map center to prevent re-renders
  const mapCenter = useMemo(() => ({ lat: -6.2, lng: 106.8 }), []);

  if (!isLoaded) return <div>Loading map....</div>;

  const handleOverlayClick = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleDelete = async (propertyId: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);
    if (error) {
      console.error('Error deleting property:', error);
    } else {
      alert('Property deleted successfully!');
    }
    refreshProperties();
    setIsConfirmOpen(false);
  };

  return (
    <div className="relative h-screen">
      {' '}
      {/* Full height for the parent container */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={11}
      >
        {properties?.length > 0 &&
          properties?.map((property, index) => (
            <Marker
              key={property?.id}
              position={{
                lat: property?.latitude || 0,
                lng: property?.longitude || 0,
              }}
              onClick={() => setHovered(index)}
              label={{
                text: `$${property?.price || ''}`,
                className:
                  'bg-white px-2 py-1 rounded shadow text-sm',
              }}
            />
          ))}

        {properties && hovered !== null && (
          <OverlayView
            position={{
              lat: properties[hovered]?.latitude || 0,
              lng: properties[hovered]?.longitude || 0,
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
      {/* Modal for PropertyForm */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Update Property
        </h2>
        <PropertyForm
          property={selectedProperty}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
      {/* Confirmation Modal for Deleting Property */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (selectedProperty) {
            handleDelete(selectedProperty.id);
          }
        }}
        message="Are you sure you want to delete this property?"
      />
    </div>
  );
}
