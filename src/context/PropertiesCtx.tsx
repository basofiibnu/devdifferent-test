'use client';

import { createContext, useContext, ReactNode } from 'react';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';
import { TProperty } from '../../types/property';

interface PropertiesContextType {
  properties: TProperty[] | undefined;
  loading: boolean;
  error: string | null;
  refreshProperties: () => void;
}

const PropertiesContext = createContext<
  PropertiesContextType | undefined
>(undefined);

const fetchProperties = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error('Failed to fetch user session.');
  }

  if (!user) {
    throw new Error('User not authenticated.');
  }

  const { data, error: propertiesError } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', user.id);

  if (propertiesError) {
    throw new Error(propertiesError.message);
  }

  return data || [];
};

export const PropertiesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    'properties',
    fetchProperties
  );

  return (
    <PropertiesContext.Provider
      value={{
        properties: data,
        loading: isLoading,
        error: error ? error.message : null,
        refreshProperties: mutate,
      }}
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
