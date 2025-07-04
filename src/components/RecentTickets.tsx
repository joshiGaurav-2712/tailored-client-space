import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Search, Eye, Trash2, RefreshCw } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ViewTicketModal } from './ViewTicketModal';

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

export interface RecentTicketsRef {
  refreshTickets: () => void;
}

export const RecentTickets = forwardRef<RecentTicketsRef>((props, ref) => {
  const { tickets, isLoading, deleteTicket, fetchTickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [viewTicket, setViewTicket] = useState<Ticket | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useImperativeHandle(ref, () => ({
    refreshTickets: fetchTickets,
  }));

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchTickets();
    setIsRefreshing(false);
    toast({
      title: "Refreshed!",
      description: "Tickets list has been updated.",
    });
  };

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

  const handleDelete = async (ticketId: number) => {
    const success = await deleteTicket(ticketId);
    if (success) {
      toast({
        title: "Success!",
        description: "Ticket deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleView = (ticket: Ticket) => {
    setViewTicket(ticket);
  };

  const filteredTickets = tickets
    .filter(ticket => {
      const matchesSearch = ticket.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const statusPriority = { 'pending': 1, 'in_progress': 2, 'completed': 3 };
      return statusPriority[a.status] - statusPriority[b.status];
    });

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">TITLE</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">CATEGORY</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">STATUS</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">DUE DATE</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900">#{ticket.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate">{ticket.task}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(ticket.category)}`}>
                      {ticket.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {formatStatus(ticket.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {ticket.expected_due_date ? new Date(ticket.expected_due_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleView(ticket)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this ticket? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(ticket.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {tickets.length === 0 ? 'No tickets found. Create your first ticket!' : 'No tickets match your search criteria.'}
            </div>
          )}
        </div>
      </div>

      <ViewTicketModal
        isOpen={!!viewTicket}
        onClose={() => setViewTicket(null)}
        ticket={viewTicket}
      />
    </>
  );
});

RecentTickets.displayName = 'RecentTickets';
