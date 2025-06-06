
import React from 'react';
import { Calendar, MessageSquare } from 'lucide-react';

export const CommunicationCenter = () => {
  const updates = [
    {
      title: 'Weekly progress meeting scheduled for April 10, 2025 at 2:00 PM',
      time: '2 hours ago'
    },
    {
      title: 'New requirements document added to the project files',
      time: 'yesterday'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Communication Center</h2>
      
      {/* Latest Updates */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Latest Updates</h3>
        <div className="space-y-3">
          {updates.map((update, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-900">{update.title}</p>
              <p className="text-xs text-gray-500 mt-1">Posted {update.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            Schedule Meeting
          </button>
          <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
