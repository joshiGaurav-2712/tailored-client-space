
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">BSC</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-blue-600 font-medium">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Projects</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Tickets</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Reports</a>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Ticket
            </Button>
            
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
