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
    console.log('🔑 Request headers:', {
      'Authorization': `Bearer ${user.access_token.substring(0, 20)}...`,
      'Content-Type': 'application/json'
    });
    
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

    console.log('🏪 Fetching user stores for:', user.username, 'using API: GET https://api.prod.troopod.io/store/');
    try {
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/store/');
      
      if (response?.ok) {
        const stores = await response.json();
        console.log('✅ User stores fetched for', user.username, ':', stores.length, 'stores -', stores.map((s: Store) => s.name));
        setUserStores(stores);
        return stores;
      } else {
        console.error('❌ Failed to fetch user stores for', user.username, ':', response?.status, response?.statusText);
        setUserStores([]);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching user stores for', user.username, ':', error);
      setUserStores([]);
      return [];
    }
  };

  const fetchTicketsByStore = async (storeId: number) => {
    if (!user) return [];

    console.log('🏪 Fetching tickets by store ID:', storeId, 'for user:', user.username, 'using API: GET https://api.prod.troopod.io/techservices/api/tickets/?store_id=' + storeId);
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/?store_id=${storeId}`);
      
      if (response?.ok) {
        const responseData = await response.json();
        const ticketsArray = Array.isArray(responseData) ? responseData : (responseData.results || []);
        console.log('✅ Store tickets fetched for', user.username, ':', ticketsArray.length, 'tickets from store', storeId);
        return ticketsArray;
      } else {
        console.error('❌ Failed to fetch store tickets for', user.username, ':', response?.status, response?.statusText);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching store tickets for', user.username, ':', error);
      return [];
    }
  };

  const fetchAllStoreTickets = async (stores: Store[]) => {
    if (!user || stores.length === 0) return [];

    console.log('🏪 Fetching tickets for all user stores:', stores.map(s => s.name));
    try {
      const allTickets = [];
      
      for (const store of stores) {
        const storeTickets = await fetchTicketsByStore(store.id);
        allTickets.push(...storeTickets);
      }
      
      console.log('✅ All store tickets fetched for', user.username, ':', allTickets.length, 'total tickets');
      return allTickets;
    } catch (error) {
      console.error('❌ Error fetching all store tickets for', user.username, ':', error);
      return [];
    }
  };

  const fetchTickets = async () => {
    if (!user) {
      console.log('❌ No user authenticated, skipping ticket fetch');
      setTickets([]);
      return;
    }

    console.log('🎫 === DEBUGGING TICKET FETCH FOR USER:', user.username, '===');
    console.log('🔍 User details:', {
      username: user.username,
      hasAccessToken: !!user.access_token,
      tokenPreview: user.access_token ? user.access_token.substring(0, 20) + '...' : 'none'
    });
    
    setIsLoading(true);
    
    try {
      // First try: Fetch all tickets (might be filtered by assigned_to)
      console.log('📡 PRIMARY: Making GET request to: https://api.prod.troopod.io/techservices/api/tickets/');
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/techservices/api/tickets/');

      console.log('📊 === PRIMARY RESPONSE ANALYSIS FOR', user.username, '===');
      console.log('📡 Response status:', response?.status);
      console.log('📡 Response ok:', response?.ok);
      
      if (response?.ok) {
        const responseData = await response.json();
        console.log('📋 Primary API response data:', JSON.stringify(responseData, null, 2));
        
        // Handle both array response and paginated response with results
        const ticketsArray = Array.isArray(responseData) ? responseData : (responseData.results || []);
        
        console.log('🎯 Primary tickets array length:', ticketsArray.length);
        
        if (ticketsArray.length > 0) {
          // We got tickets from primary endpoint
          console.log('✅ PRIMARY SUCCESS: Found', ticketsArray.length, 'tickets from main endpoint');
          
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

          console.log('✅ Setting tickets from PRIMARY endpoint for', user.username, ':', transformedTickets.length);
          setTickets(transformedTickets);
          
        } else {
          // Primary endpoint returned empty - try alternative approaches
          console.log('⚠️ PRIMARY EMPTY: Main endpoint returned no tickets, trying store-based fetch...');
          
          // Try fetching by user's accessible stores
          const stores = userStores.length > 0 ? userStores : await fetchUserStores();
          
          if (stores.length > 0) {
            console.log('🏪 SECONDARY: Attempting to fetch tickets by stores:', stores.map(s => s.name));
            const storeTickets = await fetchAllStoreTickets(stores);
            
            if (storeTickets.length > 0) {
              const transformedTickets = storeTickets.map((ticket: any) => ({
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

              console.log('✅ SECONDARY SUCCESS: Found', transformedTickets.length, 'tickets from store-based fetch');
              setTickets(transformedTickets);
            } else {
              console.log('❌ SECONDARY FAILED: No tickets found even with store-based fetch');
              setTickets([]);
            }
          } else {
            console.log('❌ No accessible stores found for user:', user.username);
            setTickets([]);
          }
        }
        
      } else {
        console.error('❌ === API ERROR DETAILS FOR', user.username, '===');
        console.error('❌ Status:', response?.status);
        console.error('❌ Status text:', response?.statusText);
        
        if (response?.status === 404) {
          console.log('🔍 404 - No tickets endpoint found or no tickets for user:', user.username);
          setTickets([]);
        } else {
          try {
            const errorData = await response?.text();
            console.error('❌ API Error response body:', errorData);
          } catch (e) {
            console.error('❌ Could not parse error response');
          }
        }
      }
    } catch (error) {
      console.error('❌ === NETWORK ERROR FOR', user.username, '===');
      console.error('❌ Error details:', error);
      console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketById = async (id: number) => {
    if (!user) return null;

    console.log('🎫 Fetching ticket by ID:', id, 'for user:', user.username, 'using API: GET https://api.prod.troopod.io/techservices/api/tickets/' + id + '/');
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/${id}/`);
      
      if (response?.ok) {
        const ticket = await response.json();
        console.log('✅ Ticket fetched by ID for', user.username, ':', ticket);
        return ticket;
      } else {
        console.error('❌ Failed to fetch ticket by ID for', user.username, ':', response?.status, response?.statusText);
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching ticket by ID for', user.username, ':', error);
      return null;
    }
  };

  const updateTicket = async (id: number, updates: Partial<Ticket>) => {
    if (!user) return false;

    console.log('🔄 Updating ticket:', id, 'for user:', user.username, 'with updates:', updates, 'using API: PUT https://api.prod.troopod.io/techservices/api/tickets/update/' + id + '/');
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/update/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      console.log('📡 Update ticket response status for', user.username, ':', response?.status);
      
      if (response?.ok) {
        console.log('✅ Ticket updated successfully for', user.username, ', refreshing ticket data from API...');
        await fetchTickets();
        return true;
      } else {
        try {
          const errorData = await response?.text();
          console.error('❌ Failed to update ticket for', user.username, ':', response?.status, errorData);
        } catch (e) {
          console.error('❌ Failed to update ticket for', user.username, ':', response?.status, 'Could not parse error');
        }
      }
    } catch (error) {
      console.error('❌ Error updating ticket for', user.username, ':', error);
    }
    return false;
  };

  const deleteTicket = async (id: number) => {
    if (!user) return false;

    console.log('🗑️ Deleting ticket:', id, 'for user:', user.username, 'using API: DELETE https://api.prod.troopod.io/techservices/api/tickets/delete/' + id + '/');
    try {
      const response = await makeAuthenticatedRequest(`https://api.prod.troopod.io/techservices/api/tickets/delete/${id}/`, {
        method: 'DELETE',
      });

      console.log('📡 Delete ticket response status for', user.username, ':', response?.status);
      
      if (response?.ok) {
        console.log('✅ Ticket deleted successfully for', user.username, ', refreshing ticket data from API...');
        await fetchTickets();
        return true;
      } else {
        console.error('❌ Failed to delete ticket for', user.username, ':', response?.status, response?.statusText);
      }
    } catch (error) {
      console.error('❌ Error deleting ticket for', user.username, ':', error);
    }
    return false;
  };

  // Effect to fetch stores and tickets when user changes
  useEffect(() => {
    console.log('🎣 === useTickets EFFECT TRIGGERED ===');
    console.log('🎣 User state:', user ? {
      username: user.username,
      hasToken: !!user.access_token
    } : 'No user');
    
    if (user) {
      console.log('🔄 User authenticated as:', user.username, '- fetching stores and tickets from APIs');
      fetchUserStores().then((stores) => {
        console.log('🏪 Stores fetched, now fetching tickets for user:', user.username);
        console.log('🏪 User has access to stores:', stores.map(s => s.name));
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
    console.log('📊 === TICKETS STATE CHANGE ===');
    console.log('📊 User:', user?.username || 'No user');
    console.log('📊 Tickets count:', tickets.length);
    
    if (tickets.length > 0) {
      console.log('🏪 Current tickets breakdown by store:', tickets.reduce((acc, ticket) => {
        const storeName = ticket.store?.name || 'Unknown Store';
        acc[storeName] = (acc[storeName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
      
      console.log('📋 All ticket IDs:', tickets.map(t => t.id));
      console.log('📋 All ticket statuses:', tickets.map(t => ({ id: t.id, status: t.status })));
    } else {
      console.log('📊 No tickets in state');
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
