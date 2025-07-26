
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { Progress } from '@/components/ui/progress';

export const ProjectHealth = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const { tickets } = useTickets();

  console.log('🏥 ProjectHealth rendering with', tickets.length, 'tickets');

  const getTicketProgress = (status: string) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'in_progress':
        return 60;
      case 'pending':
        return 0;
      default:
        return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { status: 'Completed', color: 'text-green-600', bgColor: 'bg-green-500' };
      case 'in_progress':
        return { status: 'In Progress', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
      case 'pending':
        return { status: 'Pending', color: 'text-blue-600', bgColor: 'bg-blue-500' };
      default:
        return { status: 'Unknown', color: 'text-gray-600', bgColor: 'bg-gray-500' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const toggleProject = (ticketId: string) => {
    setExpandedProject(expandedProject === ticketId ? null : ticketId);
  };

  const handleTicketClick = (ticketId: number) => {
    console.log(`Navigate to ticket: ${ticketId}`);
  };

  const formatDueDate = (dateString: string) => {
    if (!dateString) return 'No due date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  // Sort tickets by status priority (pending first, then in_progress, then completed)
  const sortedTickets = [...tickets].sort((a, b) => {
    const statusPriority = { 'pending': 1, 'in_progress': 2, 'completed': 3 };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  if (tickets.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Project Health</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No tickets found. Create your first ticket to see project health metrics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Project Health</h2>
        <button 
          onClick={() => console.log('View all tickets')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 hover:scale-105 transform"
        >
          View All
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedTickets.map((ticket, index) => {
          const progress = getTicketProgress(ticket.status);
          const statusInfo = getStatusColor(ticket.status);
          const ticketId = `ticket-${ticket.id}`;
          
          return (
            <div 
              key={`${ticket.id}-${ticket.updated_at}`}
              className="border border-gray-200/50 rounded-lg p-3 sm:p-4 hover:border-gray-300 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <h3 
                      className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200 truncate text-sm sm:text-base"
                      onClick={() => handleTicketClick(ticket.id)}
                      title={ticket.task}
                    >
                      #{ticket.id} - {ticket.task}
                    </h3>
                    <div className="transition-transform duration-200 hover:scale-110">
                      {getStatusIcon(ticket.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    <span className={`text-xs sm:text-sm font-medium ${statusInfo.color} transition-colors duration-200`}>
                      {statusInfo.status}
                    </span>
                    <button
                      onClick={() => toggleProject(ticketId)}
                      className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 p-1"
                    >
                      {expandedProject === ticketId ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Progress 
                      value={progress} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 min-w-[3rem]">{progress}%</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <span>Due: {formatDueDate(ticket.expected_due_date)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs self-start sm:self-auto ${
                    ticket.category === 'bug' ? 'bg-red-100 text-red-800' :
                    ticket.category === 'feature' ? 'bg-purple-100 text-purple-800' :
                    ticket.category === 'enhancement' ? 'bg-blue-100 text-blue-800' :
                    ticket.category === 'issue' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.category}
                  </span>
                </div>

                {expandedProject === ticketId && (
                  <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                    <p className="text-sm text-gray-600 mb-3">{ticket.description || 'No description provided'}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Created:</p>
                        <p className="text-gray-600">{new Date(ticket.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Last Updated:</p>
                        <p className="text-gray-600">{new Date(ticket.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
