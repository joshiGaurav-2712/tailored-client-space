
import { useState, useEffect } from 'react';
import { useTickets } from './useTickets';

interface Store {
  id: number;
  name: string;
  address?: string;
}

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { makeAuthenticatedRequest } = useTickets();

  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/store/');
      
      if (response?.ok) {
        const data = await response.json();
        console.log('Stores fetched successfully:', data);
        setStores(data);
      } else {
        console.error('Failed to fetch stores:', response?.status);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    isLoading,
    fetchStores,
  };
};
