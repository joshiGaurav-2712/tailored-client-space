
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
  const { user } = useAuth();

  const fetchTickets = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://api.prod.troopod.io/techservices/api/tickets/', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
    setIsLoading(false);
  };

  const updateTicket = async (id: number, updates: Partial<Ticket>) => {
    if (!user) return false;

    try {
      const response = await fetch(`https://api.prod.troopod.io/techservices/api/tickets/update/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchTickets();
        return true;
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
    return false;
  };

  const deleteTicket = async (id: number) => {
    if (!user) return false;

    try {
      const response = await fetch(`https://api.prod.troopod.io/techservices/api/tickets/delete/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
      });

      if (response.ok) {
        await fetchTickets();
        return true;
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
    return false;
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  return {
    tickets,
    isLoading,
    fetchTickets,
    updateTicket,
    deleteTicket,
  };
};
