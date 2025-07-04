
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Ticket {
  id: number;
  task: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'task' | 'issue' | 'bug' | 'feature' | 'enhancement';
  expected_due_date: string;
  created_at: string;
  updated_at: string;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, refreshToken } = useAuth();

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    if (!user) return null;

    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${user.access_token}`,
      },
    };

    let response = await fetch(url, requestOptions);

    // If token is expired, try to refresh and retry once
    if (response.status === 401) {
      console.log('Token expired, attempting refresh...');
      const refreshed = await refreshToken();
      if (refreshed) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Bearer ${user.access_token}`,
        };
        response = await fetch(url, requestOptions);
      }
    }

    return response;
  };

  const fetchTickets = async () => {
    if (!user) return;

    console.log('🔄 Starting ticket fetch with token:', user.access_token);
    setIsLoading(true);
    try {
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/techservices/api/tickets/');

      console.log('📡 Fetch tickets response status:', response?.status);
      
      if (response?.ok) {
        const data = await response.json();
        console.log('✅ Tickets fetched successfully:', data.length, 'tickets');
        console.log('🔄 Updating tickets state from', tickets.length, 'to', data.length, 'tickets');
        
        // Force a new array reference to ensure React re-renders
        setTickets([...data]);
        
        console.log('✅ Tickets state updated successfully');
      } else {
        console.error('❌ Failed to fetch tickets:', response?.status);
      }
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
    }
    setIsLoading(false);
  };

  const updateTicket = async (id: number, updates: Partial<Ticket>) => {
    if (!user) return false;

    console.log('🔄 Updating ticket:', id, updates);
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/update/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      console.log('📡 Update ticket response status:', response?.status);
      
      if (response?.ok) {
        console.log('✅ Ticket updated successfully, refreshing all ticket data...');
        await fetchTickets();
        return true;
      }
    } catch (error) {
      console.error('❌ Error updating ticket:', error);
    }
    return false;
  };

  const deleteTicket = async (id: number) => {
    if (!user) return false;

    console.log('🗑️ Deleting ticket:', id);
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/delete/${id}/`, {
        method: 'DELETE',
      });

      console.log('📡 Delete ticket response status:', response?.status);
      
      if (response?.ok) {
        console.log('✅ Ticket deleted successfully, refreshing all ticket data...');
        await fetchTickets();
        console.log('🔄 All components should now re-render with updated data');
        return true;
      }
    } catch (error) {
      console.error('❌ Error deleting ticket:', error);
    }
    return false;
  };

  useEffect(() => {
    console.log('🎣 useTickets hook effect triggered, user:', !!user);
    fetchTickets();
  }, [user]);

  // Log whenever tickets state changes
  useEffect(() => {
    console.log('📊 Tickets state changed - now have', tickets.length, 'tickets');
  }, [tickets]);

  return {
    tickets,
    isLoading,
    fetchTickets,
    updateTicket,
    deleteTicket,
    makeAuthenticatedRequest,
  };
};
