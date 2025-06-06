
import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  priorityColor: string;
  status: 'Open' | 'In Progress' | 'Completed';
  statusColor: string;
  assignedTo: string;
  createdDate: string;
}

export const RecentTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const tickets: Ticket[] = [
    {
      id: '#T-001',
      title: 'Homepage Redesign',
      priority: 'High',
      priorityColor: 'bg-red-100 text-red-800',
      status: 'In Progress',
      statusColor: 'bg-yellow-100 text-yellow-800',
      assignedTo: 'Michael Chen',
      createdDate: '2025-04-05'
    },
    {
      id: '#T-002',
      title: 'Payment Gateway Error',
      priority: 'High',
      priorityColor: 'bg-red-100 text-red-800',
      status: 'Open',
      statusColor: 'bg-blue-100 text-blue-800',
      assignedTo: 'Sophia Wilson',
      createdDate: '2025-04-06'
    },
    {
      id: '#T-003',
      title: 'Mobile Menu Navigation',
      priority: 'Medium',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      status: 'In Progress',
      statusColor: 'bg-yellow-100 text-yellow-800',
      assignedTo: 'James Rodriguez',
      createdDate: '2025-04-04'
    },
    {
      id: '#T-004',
      title: 'Product Page Optimization',
      priority: 'Low',
      priorityColor: 'bg-blue-100 text-blue-800',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800',
      assignedTo: 'Emily Johnson',
      createdDate: '2025-04-01'
    },
    {
      id: '#T-005',
      title: 'Database Performance Issue',
      priority: 'Medium',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      status: 'In Progress',
      statusColor: 'bg-yellow-100 text-yellow-800',
      assignedTo: 'David Thompson',
      createdDate: '2025-04-03'
    },
    {
      id: '#T-006',
      title: 'User Authentication Bug',
      priority: 'High',
      priorityColor: 'bg-red-100 text-red-800',
      status: 'Open',
      statusColor: 'bg-blue-100 text-blue-800',
      assignedTo: 'Sarah Lee',
      createdDate: '2025-04-07'
    }
  ];

  // Sort tickets by status priority: Open → In Progress → Completed
  const sortedAndFilteredTickets = useMemo(() => {
    const statusPriority = { 'Open': 1, 'In Progress': 2, 'Completed': 3 };
    
    return tickets
      .filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority;
        return matchesSearch && matchesPriority;
      })
      .sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
  }, [searchTerm, filterPriority]);

  const handleViewTicket = (ticketId: string) => {
    console.log(`Viewing ticket: ${ticketId}`);
    // Add navigation to ticket detail page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriorityFilter = (priority: string) => {
    setFilterPriority(priority);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => handlePriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button 
            onClick={() => console.log('View all tickets')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">TITLE</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">PRIORITY</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">STATUS</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ASSIGNED TO</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredTickets.map((ticket, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{ticket.id}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{ticket.title}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ticket.priorityColor}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ticket.statusColor}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{ticket.assignedTo}</td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleViewTicket(ticket.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedAndFilteredTickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tickets found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
