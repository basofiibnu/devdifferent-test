'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '@/lib/supabase-client';

interface Property {
  id: string;
  price: number;
  image_url: string;
  latitude: number;
  longitude: number;
  user_id: string;
}

interface PropertiesContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refreshProperties: () => Promise<void>;
}

const PropertiesContext = createContext<
  PropertiesContextType | undefined
>(undefined);

export const PropertiesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setError('Failed to fetch user session.');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    const { data, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id);

    if (propertiesError) {
      setError(propertiesError.message);
    } else {
      setProperties(data || []);
    }

    setLoading(false);
  };

  const refreshProperties = async () => {
    await fetchProperties();
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <PropertiesContext.Provider
      value={{ properties, loading, error, refreshProperties }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error(
      'useProperties must be used within a PropertiesProvider'
    );
  }
  return context;
};
