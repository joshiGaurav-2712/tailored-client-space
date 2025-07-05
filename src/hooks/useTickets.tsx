
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

    console.log('🔐 Making authenticated request to:', url, 'for user:', user.username);
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

    console.log('🏪 Fetching user stores for:', user.username);
    try {
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/store/');
      
      if (response?.ok) {
        const stores = await response.json();
        console.log('✅ User stores fetched for', user.username, ':', stores.length, 'stores -', stores.map(s => s.name));
        setUserStores(stores);
        return stores;
      } else {
        console.error('❌ Failed to fetch user stores for', user.username, ':', response?.status);
        setUserStores([]);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching user stores for', user.username, ':', error);
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
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/techservices/api/tickets/');

      console.log('📡 Fetch tickets response status for', user.username, ':', response?.status);
      
      if (response?.ok) {
        const responseData = await response.json();
        console.log('📊 Raw tickets received for', user.username, ':', responseData);
        
        // Check if response is an array or has a results property
        const ticketsArray = Array.isArray(responseData) ? responseData : (responseData.results || []);
        
        // Transform tickets to ensure consistent format
        const transformedTickets = ticketsArray.map((ticket: any) => ({
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

        console.log('✅ Setting tickets state for', user.username, 'with', transformedTickets.length, 'transformed tickets');
        console.log('🏪 Tickets by store for', user.username, ':', transformedTickets.map(t => ({ id: t.id, task: t.task, store: t.store?.name })));
        setTickets(transformedTickets);
        
      } else {
        console.error('❌ Failed to fetch tickets for', user.username, ':', response?.status, response?.statusText);
        if (response?.status === 404) {
          console.log('🔍 No tickets found for user:', user.username);
          setTickets([]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching tickets for', user.username, ':', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketById = async (id: number) => {
    if (!user) return null;

    console.log('🎫 Fetching ticket by ID:', id, 'for user:', user.username);
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/${id}/`);
      
      if (response?.ok) {
        const ticket = await response.json();
        console.log('✅ Ticket fetched by ID for', user.username, ':', ticket);
        return ticket;
      } else {
        console.error('❌ Failed to fetch ticket by ID for', user.username, ':', response?.status);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching ticket by ID for', user.username, ':', error);
      return null;
    }
  };

  const updateTicket = async (id: number, updates: Partial<Ticket>) => {
    if (!user) return false;

    console.log('🔄 Updating ticket:', id, 'for user:', user.username, 'with updates:', updates);
    try {
      // Transform the updates to match API expectations
      const apiUpdates = {
        ...updates,
        // Change store_id to store if it's in the updates
        ...(updates.store && { store: updates.store.id }),
      };

      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/update/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(apiUpdates),
      });

      console.log('📡 Update ticket response status for', user.username, ':', response?.status);
      
      if (response?.ok) {
        console.log('✅ Ticket updated successfully for', user.username, ', refreshing ticket data...');
        await fetchTickets();
        return true;
      } else {
        const errorData = await response?.text();
        console.error('❌ Failed to update ticket for', user.username, ':', response?.status, errorData);
      }
    } catch (error) {
      console.error('❌ Error updating ticket for', user.username, ':', error);
    }
    return false;
  };

  const deleteTicket = async (id: number) => {
    if (!user) return false;

    console.log('🗑️ Deleting ticket:', id, 'for user:', user.username);
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/delete/${id}/`, {
        method: 'DELETE',
      });

      console.log('📡 Delete ticket response status for', user.username, ':', response?.status);
      
      if (response?.ok) {
        console.log('✅ Ticket deleted successfully for', user.username, ', refreshing ticket data...');
        await fetchTickets();
        return true;
      } else {
        console.error('❌ Failed to delete ticket for', user.username, ':', response?.status);
      }
    } catch (error) {
      console.error('❌ Error deleting ticket for', user.username, ':', error);
    }
    return false;
  };

  // Effect to fetch stores and tickets when user changes
  useEffect(() => {
    console.log('🎣 useTickets effect triggered, user:', user ? user.username : 'none');
    if (user) {
      console.log('🔄 User changed to:', user.username, '- fetching stores and tickets');
      fetchUserStores().then(() => {
        fetchTickets();
      });
    } else {
      // Clear data when user logs out
      console.log('🧹 Clearing data for logged out user');
      setTickets([]);
      setUserStores([]);
    }
  }, [user]);

  // Log whenever tickets state changes
  useEffect(() => {
    console.log('📊 Tickets state updated for', user?.username, '- now have', tickets.length, 'tickets');
    if (tickets.length > 0) {
      console.log('🏪 Current tickets breakdown by store:', tickets.reduce((acc, ticket) => {
        const storeName = ticket.store?.name || 'Unknown Store';
        acc[storeName] = (acc[storeName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
    }
  }, [tickets, user]);

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
