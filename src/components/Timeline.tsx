
import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Calendar } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  description: string;
  date: string;
  icon: any;
  iconColor: string;
  projectId?: string;
}

export const Timeline = () => {
  const [activeFilter, setActiveFilter] = useState('30');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const milestones: Milestone[] = [
    {
      id: 'ms-1',
      title: 'Website Prototype Approval',
      status: 'Completed',
      description: 'All mockups and prototypes have been approved by the client',
      date: 'April 8, 2025',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      projectId: 'proj-1'
    },
    {
      id: 'ms-2',
      title: 'Frontend Development Completion',
      status: 'In Progress',
      description: 'Development of all frontend components based on approved designs',
      date: 'April 15, 2025',
      icon: Circle,
      iconColor: 'text-yellow-500',
      projectId: 'proj-1'
    },
    {
      id: 'ms-3',
      title: 'Backend Integration',
      status: 'Upcoming',
      description: 'Connect frontend components with backend APIs',
      date: 'April 25, 2025',
      icon: Clock,
      iconColor: 'text-gray-400',
      projectId: 'proj-1'
    },
    {
      id: 'ms-4',
      title: 'Mobile App MVP Release',
      status: 'Upcoming',
      description: 'First version of mobile application for testing',
      date: 'May 10, 2025',
      icon: Clock,
      iconColor: 'text-gray-400',
      projectId: 'proj-2'
    },
    {
      id: 'ms-5',
      title: 'QA Testing Phase',
      status: 'Upcoming',
      description: 'Comprehensive testing of all features and functionality',
      date: 'May 20, 2025',
      icon: Clock,
      iconColor: 'text-gray-400'
    }
  ];

  const filterOptions = [
    { value: '30', label: '30 Days' },
    { value: '60', label: '60 Days' },
    { value: '90', label: '90 Days' }
  ];

  const handleFilterChange = (days: string) => {
    setActiveFilter(days);
    console.log(`Filtering timeline for ${days} days`);
    // Add filtering logic based on date range
  };

  const handleMilestoneClick = (milestoneId: string) => {
    setSelectedMilestone(selectedMilestone === milestoneId ? null : milestoneId);
    console.log(`Selected milestone: ${milestoneId}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Upcoming':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const addMilestone = () => {
    console.log('Add new milestone');
    // Add modal or navigation to create milestone
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Timeline & Milestones</h2>
          <button
            onClick={addMilestone}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center sm:justify-start py-2 sm:py-0"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Add Milestone
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors flex-1 sm:flex-initial ${
                activeFilter === option.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex">
            <div className="flex-shrink-0 mr-3 sm:mr-4 pt-1">
              <button
                onClick={() => handleMilestoneClick(milestone.id)}
                className="hover:scale-110 transition-transform p-1"
              >
                <milestone.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${milestone.iconColor}`} />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 
                  className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 text-sm sm:text-base truncate"
                  onClick={() => handleMilestoneClick(milestone.id)}
                >
                  {milestone.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full self-start sm:self-auto ${getStatusBadgeClass(milestone.status)}`}>
                  {milestone.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{milestone.description}</p>
              {milestone.date && (
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {milestone.date}
                </p>
              )}
              
              {selectedMilestone === milestone.id && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Additional details and actions for this milestone would appear here.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                    <button className="text-xs bg-gray-600 text-white px-2 py-1 rounded">
                      Mark Complete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
