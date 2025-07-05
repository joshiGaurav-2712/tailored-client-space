
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTickets } from '@/hooks/useTickets';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
}

export const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [category, setCategory] = useState('task');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { makeAuthenticatedRequest, userStores, fetchTickets } = useTickets();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedStoreId) {
      toast({
        title: "Error",
        description: "Please select a store before creating the ticket.",
        variant: "destructive",
      });
      return;
    }

    // Use the exact format from the API documentation
    const ticketData = {
      task,
      description,
      expected_due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
      status: 'pending',
      category,
      store_id: parseInt(selectedStoreId),
    };

    console.log('🎫 Creating ticket for user:', user.username, 'with data:', ticketData);

    setIsLoading(true);
    try {
      // Use the exact API endpoint from documentation
      const response = await makeAuthenticatedRequest('https://api.prod.troopod.io/techservices/api/tickets/create/', {
        method: 'POST',
        body: JSON.stringify(ticketData),
      });

      console.log('📡 Create ticket response status for', user.username, ':', response?.status);
      
      if (response?.ok) {
        const responseData = await response.json();
        console.log('✅ Ticket created successfully for', user.username, ':', responseData);
        
        toast({
          title: "Success!",
          description: "Ticket created successfully.",
        });
        
        // Force refresh tickets data to ensure new ticket appears
        console.log('🔄 Force refreshing tickets after creation for', user.username);
        await fetchTickets();
        
        // Trigger additional refresh and close modal
        onTicketCreated();
        onClose();
        resetForm();
      } else {
        let errorMessage = 'Please try again.';
        try {
          const errorData = await response?.json();
          console.error('❌ Failed to create ticket for', user.username, ':', response?.status, errorData);
          errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
        } catch {
          const errorText = await response?.text();
          console.error('❌ Failed to create ticket for', user.username, ':', response?.status, errorText);
          errorMessage = errorText || 'Unknown error occurred.';
        }
        
        toast({
          title: "Error",
          description: `Failed to create ticket: ${errorMessage}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error creating ticket for', user.username, ':', error);
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setTask('');
    setDescription('');
    setDueDate(undefined);
    setCategory('task');
    setSelectedStoreId('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name *
            </label>
            <Input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              required
              className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store *
            </label>
            <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                {userStores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="issue">Issue</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="enhancement">Enhancement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !selectedStoreId}>
              {isLoading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
