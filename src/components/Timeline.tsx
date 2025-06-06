
import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

export const Timeline = () => {
  const milestones = [
    {
      title: 'Website Prototype Approval',
      status: 'Completed',
      description: 'All mockups and prototypes have been approved by the client',
      date: 'April 8, 2025',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    {
      title: 'Frontend Development Completion',
      status: 'In Progress',
      description: 'Development of all frontend components based on approved designs',
      date: 'April 15, 2025',
      icon: Circle,
      iconColor: 'text-yellow-500'
    },
    {
      title: 'Backend Integration',
      status: 'Upcoming',
      description: 'Connect frontend components with backend APIs',
      date: 'April 25, 2025',
      icon: Clock,
      iconColor: 'text-gray-400'
    },
    {
      title: 'QA Testing Phase',
      status: 'Upcoming',
      description: 'Comprehensive testing of all features and functionality',
      date: '',
      icon: Clock,
      iconColor: 'text-gray-400'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Timeline & Milestones</h2>
        <div className="flex space-x-4 mt-4">
          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">30 Days</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">60 Days</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">90 Days</button>
        </div>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex">
            <div className="flex-shrink-0 mr-4">
              <milestone.icon className={`h-6 w-6 ${milestone.iconColor}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  milestone.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  milestone.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {milestone.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
              {milestone.date && (
                <p className="text-xs text-gray-500 mt-2">{milestone.date}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
