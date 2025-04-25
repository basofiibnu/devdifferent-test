'use client';

import {
  GoogleMap,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';
import Image from 'next/image';
import { useState } from 'react';

const containerStyle = { width: '100%', height: '500px' };

export default function Map({ properties }: { properties: any[] }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
  });

  const [hovered, setHovered] = useState<number | null>(null);

  if (!isLoaded) return <div>Loading map....</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: -6.2, lng: 106.8 }} // Jakarta default center
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
        <div className="absolute top-4 right-4">
          <Image
            src={properties[hovered].image_url}
            alt="Preview"
            className="w-40 h-24 rounded shadow"
            width={160}
            height={96}
          />
        </div>
      )}
    </GoogleMap>
  );
}
