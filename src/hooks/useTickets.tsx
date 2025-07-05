import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Store {
  id: number;
  name: string;
}

interface AssignedTo {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Ticket {
  id: number;
  task: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'task' | 'issue' | 'bug' | 'feature' | 'enhancement';
  store: Store;
  assigned_to: AssignedTo | null;
  expected_due_date: string | null;
  created_at: string;
  updated_at: string;
  total_time_spent: number;
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userStores, setUserStores] = useState<Store[]>([]);
  const { user, refreshToken } = useAuth();

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    if (!user) {
      console.log('❌ No user found for authenticated request');
      return null;
    }

    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${user.access_token}`,
        'Content-Type': 'application/json',
      },
    };

    console.log('🔐 Making authenticated request to:', url);
    let response = await fetch(url, requestOptions);

    // If token is expired, try to refresh and retry once
    if (response.status === 401) {
      console.log('🔄 Token expired, attempting refresh...');
      const refreshed = await refreshToken();
      if (refreshed) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Bearer ${user.access_token}`,
        };
        response = await fetch(url, requestOptions);
      } else {
        console.log('❌ Token refresh failed');
        return null;
      }
    }

    return response;
  };

  const fetchUserStores = async () => {
    if (!user) return [];

    console.log('🏪 Fetching user stores...');
    try {
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/store/');
      
      if (response?.ok) {
        const stores = await response.json();
        console.log('✅ User stores fetched:', stores.length, 'stores');
        setUserStores(stores);
        return stores;
      } else {
        console.error('❌ Failed to fetch user stores:', response?.status);
        setUserStores([]);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching user stores:', error);
      setUserStores([]);
      return [];
    }
  };

  const fetchTickets = async () => {
    if (!user) {
      console.log('❌ No user authenticated, skipping ticket fetch');
      setTickets([]);
      return;
    }

    console.log('🎫 Fetching tickets for authenticated user:', user.username);
    setIsLoading(true);
    
    try {
      // Use the Django API endpoint that returns user-relevant tickets
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/techservices/api/tickets/');

      console.log('📡 Fetch tickets response status:', response?.status);
      
      if (response?.ok) {
        const responseData = await response.json();
        console.log('📊 Raw tickets received:', responseData.length);
        
        // Transform tickets to ensure consistent format
        const transformedTickets = responseData.map((ticket: any) => ({
          id: ticket.id,
          task: ticket.task,
          description: ticket.description,
          status: ticket.status,
          category: ticket.category,
          expected_due_date: ticket.expected_due_date,
          created_at: ticket.created_at,
          updated_at: ticket.updated_at,
          store: ticket.store,
          assigned_to: ticket.assigned_to,
          total_time_spent: ticket.total_time_spent || 0,
        }));

        console.log('✅ Setting tickets state with', transformedTickets.length, 'transformed tickets');
        setTickets(transformedTickets);
        
      } else {
        console.error('❌ Failed to fetch tickets:', response?.status, response?.statusText);
        setTickets([]);
      }
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketById = async (id: number) => {
    if (!user) return null;

    console.log('🎫 Fetching ticket by ID:', id);
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/${id}/`);
      
      if (response?.ok) {
        const ticket = await response.json();
        console.log('✅ Ticket fetched by ID:', ticket);
        return ticket;
      } else {
        console.error('❌ Failed to fetch ticket by ID:', response?.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching ticket by ID:', error);
      return null;
    }
  };

  const updateTicket = async (id: number, updates: Partial<Ticket>) => {
    if (!user) return false;

    console.log('🔄 Updating ticket:', id, updates);
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/update/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });

      console.log('📡 Update ticket response status:', response?.status);
      
      if (response?.ok) {
        console.log('✅ Ticket updated successfully, refreshing ticket data...');
        await fetchTickets();
        return true;
      } else {
        console.error('❌ Failed to update ticket:', response?.status);
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
        console.log('✅ Ticket deleted successfully, refreshing ticket data...');
        await fetchTickets();
        return true;
      } else {
        console.error('❌ Failed to delete ticket:', response?.status);
      }
    } catch (error) {
      console.error('❌ Error deleting ticket:', error);
    }
    return false;
  };

  // Effect to fetch stores and tickets when user changes
  useEffect(() => {
    console.log('🎣 useTickets effect triggered, user:', user ? user.username : 'none');
    if (user) {
      fetchUserStores().then(() => {
        fetchTickets();
      });
    } else {
      // Clear data when user logs out
      setTickets([]);
      setUserStores([]);
    }
  }, [user]);

  // Log whenever tickets state changes
  useEffect(() => {
    console.log('📊 Tickets state updated - now have', tickets.length, 'tickets for authenticated user');
  }, [tickets]);

  return {
    tickets,
    isLoading,
    fetchTickets,
    fetchTicketById,
    updateTicket,
    deleteTicket,
    makeAuthenticatedRequest,
    userStores,
  };
};
