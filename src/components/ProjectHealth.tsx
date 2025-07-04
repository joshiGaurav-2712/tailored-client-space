
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';

export const ProjectHealth = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const { tickets } = useTickets();

  // Calculate dynamic project data based on tickets
  const totalTickets = tickets.length;
  const completedTickets = tickets.filter(t => t.status === 'completed').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;

  // Calculate overall progress
  const overallProgress = totalTickets > 0 ? Math.round((completedTickets / totalTickets) * 100) : 0;

  // Determine overall status based on progress and pending tickets
  const getOverallStatus = () => {
    if (overallProgress >= 80) return { status: 'On Track', color: 'text-green-600', bgColor: 'bg-green-500' };
    if (overallProgress >= 50) return { status: 'At Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    return { status: 'Needs Attention', color: 'text-red-600', bgColor: 'bg-red-500' };
  };

  const overallStatusInfo = getOverallStatus();

  // Create dynamic projects based on ticket data
  const projects = [
    {
      id: 'proj-1',
      name: 'Overall Progress',
      progress: overallProgress,
      status: overallStatusInfo.status,
      statusColor: overallStatusInfo.color,
      progressColor: overallStatusInfo.bgColor,
      dueDate: 'Ongoing',
      description: `Tracking progress across all ${totalTickets} tickets. ${completedTickets} completed, ${inProgressTickets} in progress, ${pendingTickets} pending.`,
      team: ['Client Dashboard']
    }
  ];

  // Add individual ticket categories as projects if there are tickets
  if (tickets.length > 0) {
    const categories = ['task', 'issue', 'bug', 'feature', 'enhancement'];
    
    categories.forEach(category => {
      const categoryTickets = tickets.filter(t => t.category === category);
      if (categoryTickets.length > 0) {
        const categoryCompleted = categoryTickets.filter(t => t.status === 'completed').length;
        const categoryProgress = Math.round((categoryCompleted / categoryTickets.length) * 100);
        
        const getCategoryStatus = () => {
          if (categoryProgress >= 80) return { status: 'On Track', color: 'text-green-600', bgColor: 'bg-green-500' };
          if (categoryProgress >= 50) return { status: 'At Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
          return { status: 'Behind', color: 'text-red-600', bgColor: 'bg-red-500' };
        };

        const categoryStatusInfo = getCategoryStatus();

        projects.push({
          id: `proj-${category}`,
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Items`,
          progress: categoryProgress,
          status: categoryStatusInfo.status,
          statusColor: categoryStatusInfo.color,
          progressColor: categoryStatusInfo.bgColor,
          dueDate: 'Ongoing',
          description: `${categoryTickets.length} ${category} items: ${categoryCompleted} completed, ${categoryTickets.filter(t => t.status === 'in_progress').length} in progress`,
          team: ['Development Team']
        });
      }
    });
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Track':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'At Risk':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Behind':
      case 'Needs Attention':
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
  };

  if (tickets.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Project Health</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No tickets found. Create your first ticket to see project health metrics!</p>
        </div>
      </div>
    );
  }

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
                Status: {project.dueDate}
              </div>

              {expandedProject === project.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Managed by:</p>
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
