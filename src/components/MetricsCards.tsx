
import React from 'react';
import { FolderOpen, Ticket, Clock } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';

export const MetricsCards = () => {
  const { tickets } = useTickets();

  console.log('📊 MetricsCards rendering with', tickets.length, 'tickets');

  const completedTickets = tickets.filter(t => t.status === 'completed').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;

  console.log('📈 Metrics breakdown - Total:', tickets.length, 'Completed:', completedTickets, 'In Progress:', inProgressTickets, 'Pending:', pendingTickets);

  const metrics = [
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
    console.log(`Clicked on ${metricTitle}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div 
          key={`${metric.title}-${metric.value}`}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => handleMetricClick(metric.title)}
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-xl ${metric.bgColor} ${metric.hoverColor} transition-colors duration-300`}>
              <metric.icon className={`h-6 w-6 ${metric.color} transition-transform duration-300 hover:scale-110`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 transition-all duration-300">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
