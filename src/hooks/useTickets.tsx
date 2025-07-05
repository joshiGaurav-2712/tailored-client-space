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
        console.log('✅ User stores fetched:', stores.length, 'stores for user:', user.username);
        console.log('🏪 Store details:', stores.map(s => ({ id: s.id, name: s.name })));
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

    console.log('🎫 Fetching tickets for user:', user.username, 'across all accessible stores');
    
    setIsLoading(true);
    
    try {
      // First, try the main tickets endpoint
      console.log('📡 Attempting main tickets endpoint for user:', user.username);
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/techservices/api/tickets/');

      console.log('📡 Main tickets API response status for user', user.username, ':', response?.status);
      
      if (response?.ok) {
        const responseData = await response.json();
        console.log('📋 Raw main tickets API response for user', user.username, ':', responseData);
        
        // Handle both array response and paginated response with results
        const ticketsArray = Array.isArray(responseData) ? responseData : (responseData.results || []);
        
        console.log('🎯 Found', ticketsArray.length, 'tickets from main endpoint for user:', user.username);
        
        // Group tickets by store for debugging
        const ticketsByStore = ticketsArray.reduce((acc: any, ticket: any) => {
          const storeName = ticket.store?.name || 'Unknown Store';
          if (!acc[storeName]) acc[storeName] = [];
          acc[storeName].push(ticket);
          return acc;
        }, {});
        
        console.log('🏪 Main endpoint tickets grouped by store for user', user.username, ':', ticketsByStore);
        
        // Check if we have tickets from all user stores
        const userStoreNames = userStores.map(s => s.name);
        const ticketStoreNames = Object.keys(ticketsByStore);
        const missingStores = userStoreNames.filter(storeName => !ticketStoreNames.includes(storeName));
        
        console.log('🔍 User accessible stores:', userStoreNames);
        console.log('🔍 Stores with tickets from main endpoint:', ticketStoreNames);
        console.log('🔍 Stores missing from main endpoint:', missingStores);
        
        if (ticketsArray.length > 0) {
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

          console.log('✅ Setting', transformedTickets.length, 'tickets for user:', user.username);
          console.log('📊 Ticket breakdown by store:', Object.keys(ticketsByStore).map(store => 
            `${store}: ${ticketsByStore[store].length} tickets`
          ).join(', '));
          
          setTickets(transformedTickets);
        } else {
          console.log('ℹ️ No tickets found from main endpoint for user:', user.username);
          setTickets([]);
        }
        
      } else {
        console.error('❌ Failed to fetch tickets from main endpoint for user', user.username, ':', response?.status);
        if (response?.status === 404) {
          console.log('🔍 No tickets found from main endpoint for user:', user.username);
          setTickets([]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching tickets from main endpoint for user', user.username, ':', error);
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

    console.log('🔄 Updating ticket:', id, 'with updates:', updates);
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/update/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (response?.ok) {
        console.log('✅ Ticket updated successfully, refreshing data');
        await fetchTickets();
        return true;
      } else {
        console.error('❌ Failed to update ticket:', response?.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error updating ticket:', error);
      return false;
    }
  };

  const deleteTicket = async (id: number) => {
    if (!user) return false;

    console.log('🗑️ Deleting ticket:', id);
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/delete/${id}/`, {
        method: 'DELETE',
      });

      if (response?.ok) {
        console.log('✅ Ticket deleted successfully, refreshing data');
        await fetchTickets();
        return true;
      } else {
        console.error('❌ Failed to delete ticket:', response?.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting ticket:', error);
      return false;
    }
  };

  // Effect to fetch stores and tickets when user changes
  useEffect(() => {
    if (user) {
      console.log('🔄 User authenticated, fetching stores and tickets for:', user.username);
      fetchUserStores().then((stores) => {
        console.log('🎯 User has access to', stores.length, 'stores, now fetching tickets');
        fetchTickets();
      });
    } else {
      console.log('🧹 Clearing data for logged out user');
      setTickets([]);
      setUserStores([]);
    }
  }, [user]);

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
