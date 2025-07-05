
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useTickets } from '@/hooks/useTickets';

interface Ticket {
  id: number;
  task: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'task' | 'issue' | 'bug' | 'feature' | 'enhancement';
  expected_due_date: string;
  created_at: string;
  updated_at: string;
  store?: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  total_time_spent?: number;
}

interface ViewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export const ViewTicketModal = ({ isOpen, onClose, ticket }: ViewTicketModalProps) => {
  const [detailedTicket, setDetailedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchTicketById } = useTickets();

  useEffect(() => {
    if (ticket && isOpen) {
      console.log('ViewTicketModal opened with ticket:', ticket.id);
      setIsLoading(true);
      setDetailedTicket(ticket); // Set the ticket data immediately
      
      // Try to fetch more detailed information, but don't block on it
      fetchTicketById(ticket.id).then((detailed) => {
        if (detailed) {
          console.log('Fetched detailed ticket data:', detailed);
          setDetailedTicket(detailed);
        } else {
          console.log('Using original ticket data as detailed fetch failed');
        }
        setIsLoading(false);
      }).catch((error) => {
        console.error('Error fetching detailed ticket:', error);
        setIsLoading(false);
      });
    } else if (!isOpen) {
      // Reset state when modal closes
      setDetailedTicket(null);
      setIsLoading(false);
    }
  }, [ticket, isOpen, fetchTicketById]);

  if (!ticket) {
    console.log('No ticket provided to ViewTicketModal');
    return null;
  }

  const displayTicket = detailedTicket || ticket;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'feature':
        return 'bg-purple-100 text-purple-800';
      case 'enhancement':
        return 'bg-blue-100 text-blue-800';
      case 'issue':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading && !detailedTicket) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Loading Ticket Details...</DialogTitle>
          </DialogHeader>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  console.log('Rendering ViewTicketModal with ticket:', displayTicket.id, displayTicket.task);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ticket Details - #{displayTicket.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{displayTicket.task}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <Badge className={`${getStatusColor(displayTicket.status)} border-0`}>
                {formatStatus(displayTicket.status)}
              </Badge>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
              <Badge className={`${getCategoryColor(displayTicket.category)} border-0`}>
                {displayTicket.category}
              </Badge>
            </div>
          </div>

          {displayTicket.store && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Store</label>
              <p className="text-gray-900">{displayTicket.store.name}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
            <div className="bg-gray-50 rounded-md p-4 min-h-[100px]">
              <p className="text-gray-900">{displayTicket.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Due Date</label>
              <p className="text-gray-900">
                {displayTicket.expected_due_date ? new Date(displayTicket.expected_due_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
              <p className="text-gray-900">
                {new Date(displayTicket.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {displayTicket.updated_at !== displayTicket.created_at && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-900">
                {new Date(displayTicket.updated_at).toLocaleDateString()}
              </p>
            </div>
          )}

          {displayTicket.total_time_spent !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Time Spent</label>
              <p className="text-gray-900">{displayTicket.total_time_spent} hours</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
