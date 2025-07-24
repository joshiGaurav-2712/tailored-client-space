
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
    <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Timeline & Milestones</h2>
          <button
            onClick={addMilestone}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Add Milestone
          </button>
        </div>
        <div className="flex space-x-4">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeFilter === option.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex">
            <div className="flex-shrink-0 mr-4">
              <button
                onClick={() => handleMilestoneClick(milestone.id)}
                className="hover:scale-110 transition-transform"
              >
                <milestone.icon className={`h-6 w-6 ${milestone.iconColor}`} />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 
                  className="font-medium text-foreground cursor-pointer hover:text-primary"
                  onClick={() => handleMilestoneClick(milestone.id)}
                >
                  {milestone.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(milestone.status)}`}>
                  {milestone.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
              {milestone.date && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {milestone.date}
                </p>
              )}
              
              {selectedMilestone === milestone.id && (
                <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-primary">
                    Additional details and actions for this milestone would appear here.
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Edit
                    </button>
                    <button className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
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
