
import React from 'react';

export const ProjectHealth = () => {
  const projects = [
    {
      name: 'Website Redesign',
      progress: 75,
      status: 'On Track',
      statusColor: 'text-green-600',
      progressColor: 'bg-green-500',
      dueDate: 'Apr 25, 2025'
    },
    {
      name: 'Mobile App Development',
      progress: 45,
      status: 'At Risk',
      statusColor: 'text-yellow-600',
      progressColor: 'bg-yellow-500',
      dueDate: 'May 15, 2025'
    },
    {
      name: 'API Integration',
      progress: 20,
      status: 'Delayed',
      statusColor: 'text-red-600',
      progressColor: 'bg-red-500',
      dueDate: 'Apr 30, 2025'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Project Health</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">{project.name}</h3>
              <span className={`text-sm font-medium ${project.statusColor}`}>
                {project.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${project.progressColor}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
            </div>
            
            <div className="text-sm text-gray-500">
              Due: {project.dueDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
