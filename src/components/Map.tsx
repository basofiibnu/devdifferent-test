'use client';

import {
  GoogleMap,
  Marker,
  useLoadScript,
  OverlayView,
} from '@react-google-maps/api';
import { useState, useMemo } from 'react';

const containerStyle = { width: '100%', height: '500px' };

export default function Map({ properties }: { properties: any[] }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [hovered, setHovered] = useState<number | null>(null);

  // Memoize the map center to prevent re-renders
  const mapCenter = useMemo(() => ({ lat: -6.2, lng: 106.8 }), []);

  if (!isLoaded) return <div>Loading map....</div>;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter} // Use memoized center
        zoom={11}
      >
        {properties.map((property, index) => (
          <Marker
            key={index}
            position={{
              lat: property.latitude,
              lng: property.longitude,
            }}
            onMouseOver={() => setHovered(index)}
            onMouseOut={() => setHovered(null)}
            label={{
              text: `$${property.price}`,
              className: 'bg-white px-2 py-1 rounded shadow text-sm',
            }}
          />
        ))}

        {hovered !== null && (
          <OverlayView
            position={{
              lat: properties[hovered].latitude,
              lng: properties[hovered].longitude,
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="bg-white p-1 rounded shadow">
              <img
                src={properties[hovered].image_url}
                alt="Preview"
                className="w-40 h-24 rounded"
              />
            </div>
          </OverlayView>
        )}
      </GoogleMap>
    </div>
  );
}
