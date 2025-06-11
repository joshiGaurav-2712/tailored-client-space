
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Delayed';
  statusColor: string;
  progressColor: string;
  dueDate: string;
  description: string;
  team: string[];
}

export const ProjectHealth = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const projects: Project[] = [
    {
      id: 'proj-1',
      name: 'Website Redesign',
      progress: 75,
      status: 'On Track',
      statusColor: 'text-green-600',
      progressColor: 'bg-green-500',
      dueDate: 'Apr 25, 2025',
      description: 'Complete overhaul of the company website with modern design and improved UX',
      team: ['Michael Chen', 'Sarah Wilson', 'David Kim']
    },
    {
      id: 'proj-2',
      name: 'Mobile App Development',
      progress: 45,
      status: 'At Risk',
      statusColor: 'text-yellow-600',
      progressColor: 'bg-yellow-500',
      dueDate: 'May 15, 2025',
      description: 'Native mobile application for iOS and Android platforms',
      team: ['James Rodriguez', 'Emily Johnson']
    },
    {
      id: 'proj-3',
      name: 'API Integration',
      progress: 20,
      status: 'Delayed',
      statusColor: 'text-red-600',
      progressColor: 'bg-red-500',
      dueDate: 'Apr 30, 2025',
      description: 'Integration with third-party payment and notification APIs',
      team: ['David Thompson', 'Lisa Park']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Track':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'At Risk':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Delayed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleProjectClick = (projectId: string) => {
    console.log(`Navigate to project: ${projectId}`);
    // Add navigation logic here
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Project Health</h2>
        <button 
          onClick={() => console.log('View all projects')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 hover:scale-105 transform"
        >
          View All
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className="border border-gray-200/50 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h3 
                    className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    {project.name}
                  </h3>
                  <div className="transition-transform duration-200 hover:scale-110">
                    {getStatusIcon(project.status)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${project.statusColor} transition-colors duration-200`}>
                    {project.status}
                  </span>
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                  >
                    {expandedProject === project.id ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${project.progressColor} transition-all duration-500 ease-out`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
              </div>
              
              <div className="text-sm text-gray-500">
                Due: {project.dueDate}
              </div>

              {expandedProject === project.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Team Members:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.team.map((member, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full transition-all duration-200 hover:bg-blue-200 hover:scale-105"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
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
