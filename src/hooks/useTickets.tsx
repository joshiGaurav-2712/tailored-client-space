
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

  const fetchAllTicketsFromStores = async (stores: Store[]) => {
    if (!user || stores.length === 0) {
      console.log('❌ No user or stores available for ticket fetching');
      return [];
    }

    console.log('🎫 Fetching tickets from', stores.length, 'stores for user:', user.username);
    
    const allTickets: Ticket[] = [];
    
    // Try to fetch all tickets first from the main endpoint
    try {
      console.log('📡 Attempting main tickets endpoint for all stores');
      const mainResponse = await makeAuthenticatedRequest('https://api.prod.troopod.io/techservices/api/tickets/');
      
      if (mainResponse?.ok) {
        const mainData = await mainResponse.json();
        const mainTickets = Array.isArray(mainData) ? mainData : (mainData.results || []);
        console.log('📋 Main endpoint returned', mainTickets.length, 'tickets');
        
        if (mainTickets.length > 0) {
          allTickets.push(...mainTickets);
          console.log('✅ Added', mainTickets.length, 'tickets from main endpoint');
        }
      } else {
        console.warn('⚠️ Main tickets endpoint failed with status:', mainResponse?.status);
      }
    } catch (error) {
      console.warn('⚠️ Main tickets endpoint error:', error);
    }

    // If main endpoint didn't return tickets for all stores, try store-specific endpoints
    const storeTicketCounts = stores.reduce((acc: any, store) => {
      const storeTickets = allTickets.filter(ticket => ticket.store?.id === store.id);
      acc[store.name] = storeTickets.length;
      return acc;
    }, {});

    console.log('🏪 Tickets by store from main endpoint:', storeTicketCounts);

    // Check if any stores are missing tickets and try store-specific endpoints
    for (const store of stores) {
      const storeTicketsFromMain = allTickets.filter(ticket => ticket.store?.id === store.id);
      
      if (storeTicketsFromMain.length === 0) {
        console.log(`🔍 No tickets found for store ${store.name} (ID: ${store.id}) from main endpoint, trying store-specific endpoint`);
        
        try {
          const storeResponse = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/?store=${store.id}`);
          
          if (storeResponse?.ok) {
            const storeData = await storeResponse.json();
            const storeTickets = Array.isArray(storeData) ? storeData : (storeData.results || []);
            
            if (storeTickets.length > 0) {
              console.log(`✅ Found ${storeTickets.length} tickets for store ${store.name} from store-specific endpoint`);
              allTickets.push(...storeTickets);
            } else {
              console.log(`ℹ️ No tickets found for store ${store.name} from store-specific endpoint`);
            }
          } else {
            console.warn(`⚠️ Store-specific endpoint failed for ${store.name}:`, storeResponse?.status);
          }
        } catch (error) {
          console.warn(`⚠️ Error fetching tickets for store ${store.name}:`, error);
        }
      }
    }

    // Remove duplicates based on ticket ID
    const uniqueTickets = allTickets.filter((ticket, index, arr) => 
      arr.findIndex(t => t.id === ticket.id) === index
    );

    console.log('🎯 Total unique tickets found:', uniqueTickets.length);
    
    // Final breakdown by store
    const finalStoreBreakdown = stores.reduce((acc: any, store) => {
      const storeTickets = uniqueTickets.filter(ticket => ticket.store?.id === store.id);
      acc[store.name] = storeTickets.length;
      return acc;
    }, {});

    console.log('📊 Final tickets breakdown by store:', finalStoreBreakdown);

    return uniqueTickets;
  };

  const fetchTickets = async () => {
    if (!user) {
      console.log('❌ No user authenticated, skipping ticket fetch');
      setTickets([]);
      return;
    }

    console.log('🎫 Starting ticket fetch process for user:', user.username);
    setIsLoading(true);
    
    try {
      // First ensure we have the latest store information
      const stores = userStores.length > 0 ? userStores : await fetchUserStores();
      
      if (stores.length === 0) {
        console.log('⚠️ No stores found for user:', user.username);
        setTickets([]);
        return;
      }

      console.log('🏪 User has access to stores:', stores.map(s => s.name));

      // Fetch tickets from all accessible stores
      const allTickets = await fetchAllTicketsFromStores(stores);

      if (allTickets.length > 0) {
        const transformedTickets = allTickets.map((ticket: any) => ({
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

        console.log('✅ Setting', transformedTickets.length, 'total tickets for user:', user.username);
        setTickets(transformedTickets);
      } else {
        console.log('ℹ️ No tickets found across all stores for user:', user.username);
        setTickets([]);
      }

    } catch (error) {
      console.error('❌ Error in fetchTickets process for user', user.username, ':', error);
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
        if (stores.length > 0) {
          fetchTickets();
        }
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
