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

    console.log('🔐 Making authenticated request to:', url);
    console.log('🔑 Using access token:', user.access_token.substring(0, 20) + '...');

    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${user.access_token}`,
        'Content-Type': 'application/json',
      },
    };

    let response = await fetch(url, requestOptions);
    console.log('📡 Initial response status:', response.status);

    // If token is expired, try to refresh and retry once
    if (response.status === 401) {
      console.log('🔄 Token expired (401), attempting refresh...');
      const refreshed = await refreshToken();
      if (refreshed) {
        console.log('✅ Token refreshed successfully, retrying request...');
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Bearer ${user.access_token}`,
        };
        response = await fetch(url, requestOptions);
        console.log('📡 Retry response status:', response.status);
      } else {
        console.log('❌ Token refresh failed');
        return null;
      }
    }

    return response;
  };

  const fetchUserStores = async () => {
    if (!user) {
      console.log('❌ No user for store fetch');
      return [];
    }

    console.log('🏪 Fetching user stores for:', user.username);
    try {
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/store/');
      
      if (response?.ok) {
        const stores = await response.json();
        console.log('✅ User stores fetched:', stores.length, 'stores for user:', user.username);
        console.log('🏪 Store details:', stores.map((s: Store) => `${s.name} (ID: ${s.id})`).join(', '));
        setUserStores(stores);
        return stores;
      } else {
        console.error('❌ Failed to fetch user stores:', response?.status, response?.statusText);
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
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/techservices/api/tickets/');

      console.log('📡 Fetch tickets response status:', response?.status);
      
      if (response?.ok) {
        const responseData = await response.json();
        console.log('📊 Raw tickets received:', responseData);
        console.log('📊 Number of tickets in response:', Array.isArray(responseData) ? responseData.length : 'Not an array');
        
        // Check if response is an array or has a results property
        const ticketsArray = Array.isArray(responseData) ? responseData : (responseData.results || []);
        console.log('📊 Tickets array length:', ticketsArray.length);
        
        // Log each ticket for debugging
        ticketsArray.forEach((ticket: any, index: number) => {
          console.log(`🎫 Ticket ${index + 1}:`, {
            id: ticket.id,
            task: ticket.task,
            store: ticket.store,
            status: ticket.status,
            category: ticket.category
          });
        });

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

        console.log('✅ Setting tickets state with', transformedTickets.length, 'transformed tickets for user:', user.username);
        setTickets(transformedTickets);
        
      } else {
        console.error('❌ Failed to fetch tickets:', response?.status, response?.statusText);
        if (response?.status === 404) {
          console.log('🔍 No tickets found for user:', user.username);
          setTickets([]);
        } else if (response?.status === 403) {
          console.log('🚫 Access forbidden - user may not have permission to view tickets');
          setTickets([]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async (ticketData: {
    task: string;
    description: string;
    expected_due_date: string;
    status: 'pending' | 'in_progress' | 'completed';
    category: 'task' | 'issue' | 'bug' | 'feature' | 'enhancement';
    store_id: number;
    assigned_to?: number;
  }) => {
    if (!user) {
      console.log('❌ No user for ticket creation');
      return false;
    }

    console.log('🎫 Creating ticket with data:', ticketData);
    try {
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/techservices/api/tickets/create/', {
        method: 'POST',
        body: JSON.stringify(ticketData),
      });

      console.log('📡 Create ticket response status:', response?.status);
      
      if (response?.ok) {
        const createdTicket = await response.json();
        console.log('✅ Ticket created successfully:', createdTicket);
        
        // Immediately refresh tickets to show the new one
        console.log('🔄 Refreshing tickets after creation...');
        await fetchTickets();
        return true;
      } else {
        const errorData = await response?.text();
        console.error('❌ Failed to create ticket:', response?.status, errorData);
        return false;
      }
    } catch (error) {
      console.error('❌ Error creating ticket:', error);
      return false;
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
      const apiUpdates = {
        ...updates,
        ...(updates.store && { store: updates.store.id }),
      };

      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/update/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(apiUpdates),
      });

      console.log('📡 Update ticket response status:', response?.status);
      
      if (response?.ok) {
        console.log('✅ Ticket updated successfully, refreshing ticket data...');
        await fetchTickets();
        return true;
      } else {
        const errorData = await response?.text();
        console.error('❌ Failed to update ticket:', response?.status, errorData);
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
      console.log('👤 User authenticated, fetching stores and tickets...');
      fetchUserStores().then((stores) => {
        console.log('🏪 Stores fetched, now fetching tickets...');
        fetchTickets();
      });
    } else {
      console.log('👤 No user, clearing data...');
      setTickets([]);
      setUserStores([]);
    }
  }, [user]);

  // Log whenever tickets state changes
  useEffect(() => {
    console.log('📊 Tickets state updated - now have', tickets.length, 'tickets for user:', user?.username || 'none');
    if (tickets.length > 0) {
      console.log('🎫 Current tickets:', tickets.map(t => `#${t.id}: ${t.task} (${t.store?.name})`));
    }
  }, [tickets]);

  return {
    tickets,
    isLoading,
    fetchTickets,
    fetchTicketById,
    updateTicket,
    deleteTicket,
    createTicket,
    makeAuthenticatedRequest,
    userStores,
  };
};
