
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateTicketModal } from './CreateTicketModal';
import { useTickets } from '@/hooks/useTickets';

export const DashboardHeader = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const { fetchTickets } = useTickets();

  const handleTicketCreated = () => {
    fetchTickets();
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-purple-400">Troopod</span>
                {user && (
                  <span className="ml-3 text-sm text-gray-600">
                    Welcome, {user.username}
                  </span>
                )}
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-blue-600 font-medium">Dashboard</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Projects</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Tickets</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Reports</a>
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Ticket
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={logout}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTicketCreated={handleTicketCreated}
      />
    </>
  );
};
