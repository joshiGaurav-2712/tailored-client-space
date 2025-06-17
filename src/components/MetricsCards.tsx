
import React, { useState, useEffect } from 'react';
import { FolderOpen, Ticket, Clock } from 'lucide-react';

export const MetricsCards = () => {
  const [metrics, setMetrics] = useState([
    {
      title: 'Active Projects',
      value: '0',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      title: 'Total Tickets',
      value: '0',
      icon: Ticket,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      title: 'Hours Invested',
      value: '0',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    }
  ]);

  // Simulate loading data with animation
  useEffect(() => {
    const loadMetrics = () => {
      setTimeout(() => {
        setMetrics([
          {
            title: 'Active Projects',
            value: '3',
            icon: FolderOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-100'
          },
          {
            title: 'Total Tickets',
            value: '12',
            icon: Ticket,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverColor: 'hover:bg-green-100'
          },
          {
            title: 'Hours Invested',
            value: '156.5',
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverColor: 'hover:bg-purple-100'
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
