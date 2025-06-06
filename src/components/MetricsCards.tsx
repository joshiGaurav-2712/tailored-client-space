
import React from 'react';
import { FolderOpen, Ticket, Clock } from 'lucide-react';

export const MetricsCards = () => {
  const metrics = [
    {
      title: 'Active Projects',
      value: '3',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Tickets',
      value: '12',
      icon: Ticket,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Hours Invested',
      value: '156.5',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
