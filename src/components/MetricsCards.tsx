
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {metrics.map((metric, index) => (
        <div 
          key={`${metric.title}-${metric.value}`}
          className="bg-card/80 backdrop-blur-sm rounded-lg border p-4 sm:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => handleMetricClick(metric.title)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
            <div className="p-2 sm:p-3 rounded-lg bg-primary/10 w-fit">
              <metric.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="sm:ml-3 lg:ml-4">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{metric.title}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
