
import React, { useState, useEffect } from 'react';
import { FolderOpen, Ticket, Clock } from 'lucide-react';

export const MetricsCards = () => {
  const [metrics, setMetrics] = useState([
    {
      title: 'Active Projects',
      value: '0',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Tickets',
      value: '0',
      icon: Ticket,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Hours Invested',
      value: '0',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]);

  // Simulate loading data
  useEffect(() => {
    const loadMetrics = () => {
      // Simulate API call
      setTimeout(() => {
        setMetrics([
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
        ]);
      }, 1000);
    };

    loadMetrics();
  }, []);

  const handleMetricClick = (metricTitle: string) => {
    console.log(`Clicked on ${metricTitle}`);
    // Add navigation or modal logic here
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleMetricClick(metric.title)}
        >
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
