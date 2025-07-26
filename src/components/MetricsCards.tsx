
import React from 'react';
import { FolderOpen, Ticket, Clock, Building } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';

export const MetricsCards = () => {
  const { tickets, userStores } = useTickets();

  console.log('📊 MetricsCards rendering with', tickets.length, 'tickets for', userStores.length, 'stores');

  const completedTickets = tickets.filter(t => t.status === 'completed').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;

  console.log('📈 Store-specific metrics - Total:', tickets.length, 'Completed:', completedTickets, 'In Progress:', inProgressTickets, 'Pending:', pendingTickets);

  const metrics = [
    {
      title: 'My Stores',
      value: userStores.length.toString(),
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      title: 'Total Tickets',
      value: tickets.length.toString(),
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      title: 'Completed',
      value: completedTickets.toString(),
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      title: 'In Progress',
      value: inProgressTickets.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      hoverColor: 'hover:bg-yellow-100'
    }
  ];

  const handleMetricClick = (metricTitle: string) => {
    console.log(`Clicked on ${metricTitle} for authenticated user`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric, index) => (
        <div 
          key={`${metric.title}-${metric.value}`}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => handleMetricClick(metric.title)}
        >
          <div className="flex items-center">
            <div className={`p-2 sm:p-3 rounded-xl ${metric.bgColor} ${metric.hoverColor} transition-colors duration-300`}>
              <metric.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${metric.color} transition-transform duration-300 hover:scale-110`} />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{metric.title}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 transition-all duration-300">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
